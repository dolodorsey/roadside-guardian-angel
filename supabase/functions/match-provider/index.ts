// ============================================================
// POST /jobs/:id/match/start — Uber Offer Loop Engine
// Filters → Ranks → Sends offers with 90s timer → Cascades
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  optionsResponse, jsonResponse, errorResponse,
  getServiceClient, getAuthUser, logJobEvent,
  haversineDistance, estimateETA,
} from "../_shared/utils.ts";

const OFFER_TIMEOUT_SECONDS = 90;
const MAX_ATTEMPTS = 8;
const MAX_TOTAL_MINUTES = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { job_id, manual_provider_id } = await req.json();
    if (!job_id) return errorResponse("job_id required");

    const db = getServiceClient();

    // ── Fetch job ──
    const { data: job } = await db
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (!job) return errorResponse("Job not found", 404);
    if (job.customer_id !== user.id) return errorResponse("Not your job", 403);
    if (!["requested", "matching"].includes(job.status)) {
      return errorResponse(`Cannot match job in status: ${job.status}`);
    }

    // ── Update to matching ──
    const now = new Date();
    const timeoutAt = new Date(now.getTime() + MAX_TOTAL_MINUTES * 60 * 1000);

    await db.from("jobs").update({
      status: "matching",
      match_started_at: now.toISOString(),
      match_timeout_at: timeoutAt.toISOString(),
      match_attempts: 0,
    }).eq("id", job_id);

    await logJobEvent(db, job_id, "status_change", user.id, "customer", {
      from: job.status, to: "matching",
    });

    // ── Manual provider selection ──
    if (manual_provider_id) {
      const result = await sendOffer(db, job, manual_provider_id, 1);
      return jsonResponse(result);
    }

    // ── FILTER: Get eligible providers ──
    const eligible = await getEligibleProviders(db, job);

    if (eligible.length === 0) {
      await handleNoProvider(db, job_id, user.id);
      return jsonResponse({
        success: false,
        status: "no_provider_found",
        message: "No Superhero available in your area right now.",
      });
    }

    // ── Send first offer ──
    const firstProvider = eligible[0];
    const result = await sendOffer(db, job, firstProvider.provider_id, 1);

    return jsonResponse({
      success: true,
      status: "offered",
      provider_count: eligible.length,
      current_offer: result,
      message: "Finding a Superhero…",
    });
  } catch (err: any) {
    console.error("match-provider error:", err);
    return errorResponse(err.message, 500);
  }
});

// ═══════════════════════════════════════════════════════════
// FILTER + RANK eligible providers
// ═══════════════════════════════════════════════════════════

async function getEligibleProviders(db: any, job: any) {
  // 1. Get all online providers with the required service
  const { data: onlineProviders } = await db
    .from("provider_availability")
    .select(`
      provider_id,
      status,
      current_lat,
      current_lng,
      last_ping_at
    `)
    .eq("status", "online")
    .gte("last_ping_at", new Date(Date.now() - 10 * 60 * 1000).toISOString()); // Active in last 10 min

  if (!onlineProviders || onlineProviders.length === 0) return [];

  const providerIds = onlineProviders.map((p: any) => p.provider_id);

  // 2. Filter: has required service_type enabled
  const { data: capableProviders } = await db
    .from("provider_services")
    .select("provider_id")
    .in("provider_id", providerIds)
    .eq("service_type", job.service_type)
    .eq("is_enabled", true);

  if (!capableProviders || capableProviders.length === 0) return [];
  const capableIds = capableProviders.map((p: any) => p.provider_id);

  // 3. Filter: approved + active providers
  const { data: activeProviders } = await db
    .from("provider_profiles")
    .select("provider_id, rating_avg, acceptance_rate, completion_rate, is_female_first_eligible, service_radius_miles")
    .in("provider_id", capableIds)
    .eq("onboard_status", "active")
    .eq("is_active", true);

  if (!activeProviders || activeProviders.length === 0) return [];

  // 4. Filter: verification gates
  const activeIds = activeProviders.map((p: any) => p.provider_id);
  const { data: verified } = await db
    .from("provider_verifications")
    .select("provider_id")
    .in("provider_id", activeIds)
    .eq("license_status", "approved")
    .eq("insurance_status", "approved")
    .eq("background_check_status", "approved");

  if (!verified || verified.length === 0) return [];
  const verifiedIds = new Set(verified.map((v: any) => v.provider_id));

  // 5. Filter: already declined this job
  const { data: existingOffers } = await db
    .from("job_offers")
    .select("provider_id")
    .eq("job_id", job.id)
    .in("status", ["declined", "expired"]);

  const declinedIds = new Set((existingOffers || []).map((o: any) => o.provider_id));

  // 6. Build candidate list with distance + ETA
  const candidates: any[] = [];

  for (const provider of activeProviders) {
    // Must be verified
    if (!verifiedIds.has(provider.provider_id)) continue;
    // Must not have already declined
    if (declinedIds.has(provider.provider_id)) continue;

    // Female-first filter
    if (job.female_first_requested && !provider.is_female_first_eligible) continue;

    // Get location
    const loc = onlineProviders.find((p: any) => p.provider_id === provider.provider_id);
    if (!loc || !loc.current_lat || !loc.current_lng) continue;

    // Distance check
    const distance = haversineDistance(
      job.pickup_lat, job.pickup_lng,
      loc.current_lat, loc.current_lng
    );

    // Must be within service radius
    if (distance > (provider.service_radius_miles || 25)) continue;

    const eta = estimateETA(distance);

    candidates.push({
      provider_id: provider.provider_id,
      distance_miles: Math.round(distance * 100) / 100,
      eta_minutes: eta,
      rating_avg: provider.rating_avg || 0,
      acceptance_rate: provider.acceptance_rate || 100,
      completion_rate: provider.completion_rate || 100,
    });
  }

  // 7. RANK: ETA → distance → rating → acceptance → completion
  candidates.sort((a: any, b: any) => {
    // Primary: shortest ETA
    if (a.eta_minutes !== b.eta_minutes) return a.eta_minutes - b.eta_minutes;
    // Secondary: closest
    if (a.distance_miles !== b.distance_miles) return a.distance_miles - b.distance_miles;
    // Tertiary: highest rating
    if (a.rating_avg !== b.rating_avg) return b.rating_avg - a.rating_avg;
    // Quaternary: highest acceptance rate
    if (a.acceptance_rate !== b.acceptance_rate) return b.acceptance_rate - a.acceptance_rate;
    // Final: highest completion rate
    return b.completion_rate - a.completion_rate;
  });

  return candidates;
}

// ═══════════════════════════════════════════════════════════
// SEND OFFER to a specific provider
// ═══════════════════════════════════════════════════════════

async function sendOffer(db: any, job: any, providerId: string, attemptNumber: number) {
  const expiresAt = new Date(Date.now() + OFFER_TIMEOUT_SECONDS * 1000).toISOString();

  // Get provider distance/ETA
  const { data: loc } = await db
    .from("provider_availability")
    .select("current_lat, current_lng")
    .eq("provider_id", providerId)
    .single();

  let distance = 0;
  let eta = 0;
  if (loc?.current_lat && loc?.current_lng) {
    distance = haversineDistance(job.pickup_lat, job.pickup_lng, loc.current_lat, loc.current_lng);
    eta = estimateETA(distance);
  }

  // Create offer
  const { data: offer, error: offerErr } = await db
    .from("job_offers")
    .insert({
      job_id: job.id,
      provider_id: providerId,
      status: "sent",
      attempt_number: attemptNumber,
      eta_minutes: eta,
      distance_miles: Math.round(distance * 100) / 100,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (offerErr) throw offerErr;

  // Update job status
  await db.from("jobs").update({
    status: "offered",
    match_attempts: attemptNumber,
  }).eq("id", job.id);

  // Log event
  await logJobEvent(db, job.id, "offer_sent", null, null, {
    provider_id: providerId,
    offer_id: offer.id,
    attempt: attemptNumber,
    expires_at: expiresAt,
    eta_minutes: eta,
    distance_miles: Math.round(distance * 100) / 100,
  });

  return {
    offer_id: offer.id,
    provider_id: providerId,
    eta_minutes: eta,
    distance_miles: Math.round(distance * 100) / 100,
    expires_at: expiresAt,
    attempt: attemptNumber,
  };
}

// ═══════════════════════════════════════════════════════════
// NO PROVIDER FOUND — release hold + notify
// ═══════════════════════════════════════════════════════════

async function handleNoProvider(db: any, jobId: string, userId: string) {
  await db.from("jobs").update({ status: "no_provider_found" }).eq("id", jobId);

  await logJobEvent(db, jobId, "status_change", userId, "customer", {
    to: "no_provider_found",
    reason: "No eligible providers available",
  });

  // Trigger refund (cancel the hold)
  const { data: payment } = await db
    .from("payments")
    .select("id, payment_intent_id, status")
    .eq("job_id", jobId)
    .eq("status", "authorized")
    .single();

  if (payment) {
    // Mark for refund — the payments-refund function or webhook will handle Stripe
    await db.from("payments").update({
      status: "canceled",
      refund_reason: "no_provider_found",
    }).eq("id", payment.id);

    await logJobEvent(db, jobId, "payment_refund", null, null, {
      reason: "no_provider_found",
      payment_id: payment.id,
    });
  }

  // Create notification for customer
  await db.from("notifications").insert({
    recipient_id: userId,
    job_id: jobId,
    channel: "push",
    template: "no_provider_found",
    title: "No Superhero Available",
    body: "We couldn't find a Superhero in your area right now. Your payment hold has been released. Please try again shortly.",
    sent_at: new Date().toISOString(),
  });
}
