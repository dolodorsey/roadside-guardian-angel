// ============================================================
// POST /offers/:id/accept | POST /offers/:id/decline
// Provider responds to an offer — accept assigns, decline cascades
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  optionsResponse, jsonResponse, errorResponse,
  getServiceClient, getAuthUser, logJobEvent,
  haversineDistance, estimateETA,
} from "../_shared/utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { offer_id, action, decline_reason } = await req.json();
    if (!offer_id) return errorResponse("offer_id required");
    if (!action || !["accept", "decline"].includes(action)) {
      return errorResponse("action must be 'accept' or 'decline'");
    }

    const db = getServiceClient();

    // ── Fetch offer ──
    const { data: offer } = await db
      .from("job_offers")
      .select("*")
      .eq("id", offer_id)
      .single();

    if (!offer) return errorResponse("Offer not found", 404);
    if (offer.provider_id !== user.id) return errorResponse("Not your offer", 403);
    if (offer.status !== "sent") return errorResponse(`Offer already ${offer.status}`);

    // Check if expired
    if (new Date(offer.expires_at) < new Date()) {
      await db.from("job_offers").update({
        status: "expired",
        responded_at: new Date().toISOString(),
      }).eq("id", offer_id);
      return errorResponse("Offer has expired");
    }

    const now = new Date().toISOString();

    if (action === "accept") {
      // ════════════════════════════════════════
      // ACCEPT — Assign provider to job
      // ════════════════════════════════════════

      // Update offer
      await db.from("job_offers").update({
        status: "accepted",
        responded_at: now,
      }).eq("id", offer_id);

      // Create assignment
      await db.from("job_assignments").insert({
        job_id: offer.job_id,
        provider_id: user.id,
        accepted_offer_id: offer_id,
        assigned_at: now,
      });

      // Update job status → assigned
      await db.from("jobs").update({ status: "assigned" }).eq("id", offer.job_id);

      // Update provider availability → busy
      await db.from("provider_availability").update({
        status: "busy",
      }).eq("provider_id", user.id);

      // Expire all other pending offers for this job
      await db.from("job_offers").update({
        status: "expired",
        responded_at: now,
      }).eq("job_id", offer.job_id).eq("status", "sent").neq("id", offer_id);

      // Log events
      await logJobEvent(db, offer.job_id, "offer_accepted", user.id, "provider", {
        offer_id, provider_id: user.id,
      });
      await logJobEvent(db, offer.job_id, "status_change", user.id, "provider", {
        from: "offered", to: "assigned",
      });

      // Get provider profile for notification
      const { data: providerProfile } = await db
        .from("provider_profiles")
        .select("provider_id")
        .eq("provider_id", user.id)
        .single();

      const { data: providerName } = await db
        .from("profiles")
        .select("full_name, photo_url")
        .eq("id", user.id)
        .single();

      // Notify customer
      const { data: job } = await db.from("jobs").select("customer_id").eq("id", offer.job_id).single();
      if (job) {
        await db.from("notifications").insert({
          recipient_id: job.customer_id,
          job_id: offer.job_id,
          channel: "push",
          template: "provider_assigned",
          title: "Superhero Accepted!",
          body: `${providerName?.full_name || "Your Superhero"} is on the way! ETA: ${offer.eta_minutes || "~"} minutes.`,
          sent_at: now,
          metadata_json: {
            provider_name: providerName?.full_name,
            provider_photo: providerName?.photo_url,
            eta_minutes: offer.eta_minutes,
          },
        });
      }

      return jsonResponse({
        success: true,
        status: "assigned",
        job_id: offer.job_id,
        message: "You've accepted the rescue. Navigate to pickup now.",
      });

    } else {
      // ════════════════════════════════════════
      // DECLINE — Cascade to next provider
      // ════════════════════════════════════════

      // Update offer
      await db.from("job_offers").update({
        status: "declined",
        responded_at: now,
        decline_reason: decline_reason || null,
      }).eq("id", offer_id);

      // Update provider acceptance rate
      await db.rpc("decrement_acceptance_rate", { p_id: user.id }).catch(() => {});

      // Log event
      await logJobEvent(db, offer.job_id, "offer_declined", user.id, "provider", {
        offer_id, reason: decline_reason,
      });

      // ── CASCADE: Find and offer to next provider ──
      const { data: job } = await db.from("jobs").select("*").eq("id", offer.job_id).single();
      if (!job) return errorResponse("Job not found", 404);

      // Check if we've exceeded max attempts
      const currentAttempts = (job.match_attempts || 0) + 1;
      const maxAttempts = job.match_max_attempts || 8;

      // Check timeout
      const matchTimeout = job.match_timeout_at ? new Date(job.match_timeout_at) : null;
      const timedOut = matchTimeout && new Date() > matchTimeout;

      if (currentAttempts >= maxAttempts || timedOut) {
        // No more attempts — no provider found
        await db.from("jobs").update({
          status: "no_provider_found",
          match_attempts: currentAttempts,
        }).eq("id", offer.job_id);

        await logJobEvent(db, offer.job_id, "status_change", null, null, {
          to: "no_provider_found",
          attempts: currentAttempts,
          timed_out: timedOut,
        });

        // Cancel payment hold
        const { data: payment } = await db
          .from("payments")
          .select("id")
          .eq("job_id", offer.job_id)
          .eq("status", "authorized")
          .single();

        if (payment) {
          await db.from("payments").update({
            status: "canceled",
            refund_reason: "no_provider_found",
          }).eq("id", payment.id);
        }

        // Notify customer
        await db.from("notifications").insert({
          recipient_id: job.customer_id,
          job_id: offer.job_id,
          channel: "push",
          template: "no_provider_found",
          title: "No Superhero Available",
          body: "We couldn't find a Superhero right now. Your hold has been released.",
          sent_at: now,
        });

        return jsonResponse({
          success: true,
          status: "no_provider_found",
          attempts: currentAttempts,
        });
      }

      // ── Find next eligible provider ──
      // Get all providers who already got offers for this job
      const { data: existingOffers } = await db
        .from("job_offers")
        .select("provider_id")
        .eq("job_id", offer.job_id);

      const offeredIds = new Set((existingOffers || []).map((o: any) => o.provider_id));

      // Get online, capable, verified providers NOT already offered
      const { data: online } = await db
        .from("provider_availability")
        .select("provider_id, current_lat, current_lng")
        .eq("status", "online")
        .gte("last_ping_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

      let nextProvider: any = null;
      let bestETA = Infinity;

      for (const p of (online || [])) {
        if (offeredIds.has(p.provider_id)) continue;
        if (!p.current_lat || !p.current_lng) continue;

        // Check capability
        const { data: svc } = await db
          .from("provider_services")
          .select("provider_id")
          .eq("provider_id", p.provider_id)
          .eq("service_type", job.service_type)
          .eq("is_enabled", true)
          .single();
        if (!svc) continue;

        // Check active + verified
        const { data: profile } = await db
          .from("provider_profiles")
          .select("onboard_status, is_active, is_female_first_eligible, service_radius_miles")
          .eq("provider_id", p.provider_id)
          .single();
        if (!profile || profile.onboard_status !== "active" || !profile.is_active) continue;

        if (job.female_first_requested && !profile.is_female_first_eligible) continue;

        const { data: ver } = await db
          .from("provider_verifications")
          .select("provider_id")
          .eq("provider_id", p.provider_id)
          .eq("license_status", "approved")
          .eq("insurance_status", "approved")
          .eq("background_check_status", "approved")
          .single();
        if (!ver) continue;

        // Distance + ETA
        const dist = haversineDistance(job.pickup_lat, job.pickup_lng, p.current_lat, p.current_lng);
        if (dist > (profile.service_radius_miles || 25)) continue;

        const eta = estimateETA(dist);
        if (eta < bestETA) {
          bestETA = eta;
          nextProvider = { provider_id: p.provider_id, distance: dist, eta };
        }
      }

      if (!nextProvider) {
        // No more providers
        await db.from("jobs").update({
          status: "no_provider_found",
          match_attempts: currentAttempts,
        }).eq("id", offer.job_id);

        return jsonResponse({
          success: true,
          status: "no_provider_found",
          attempts: currentAttempts,
        });
      }

      // Send offer to next provider
      const expiresAt = new Date(Date.now() + 90 * 1000).toISOString();
      const { data: newOffer } = await db.from("job_offers").insert({
        job_id: offer.job_id,
        provider_id: nextProvider.provider_id,
        status: "sent",
        attempt_number: currentAttempts + 1,
        eta_minutes: nextProvider.eta,
        distance_miles: Math.round(nextProvider.distance * 100) / 100,
        expires_at: expiresAt,
      }).select().single();

      await db.from("jobs").update({
        match_attempts: currentAttempts + 1,
      }).eq("id", offer.job_id);

      await logJobEvent(db, offer.job_id, "offer_sent", null, null, {
        provider_id: nextProvider.provider_id,
        offer_id: newOffer?.id,
        attempt: currentAttempts + 1,
        cascade_from: offer_id,
      });

      return jsonResponse({
        success: true,
        status: "cascaded",
        next_offer_id: newOffer?.id,
        attempt: currentAttempts + 1,
        next_provider_eta: nextProvider.eta,
      });
    }
  } catch (err: any) {
    console.error("offer-respond error:", err);
    return errorResponse(err.message, 500);
  }
});
