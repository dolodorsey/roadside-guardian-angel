// ============================================================
// Scheduled Dispatcher — Cron: triggers matching for scheduled jobs
// Runs every 60 seconds via pg_cron or Supabase scheduled function
// Also handles: expire stale offers, unassign ghost providers
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse, errorResponse, getServiceClient,
} from "../_shared/utils.ts";

serve(async (req) => {
  // This function is called by cron — no user auth needed
  // Verify it's a legitimate cron call via secret header
  const cronSecret = req.headers.get("x-cron-secret");
  const expectedSecret = Deno.env.get("CRON_SECRET");
  if (expectedSecret && cronSecret !== expectedSecret) {
    return errorResponse("Unauthorized cron call", 401);
  }

  try {
    const db = getServiceClient();
    const now = new Date().toISOString();
    const results: any = {};

    // ════════════════════════════════════════
    // 1. DISPATCH SCHEDULED JOBS
    // Jobs where matching_window_start <= now AND status = 'scheduled'
    // ════════════════════════════════════════
    const { data: readyJobs } = await db
      .from("jobs")
      .select("id, customer_id, service_type")
      .eq("mode", "schedule")
      .eq("status", "scheduled")
      .lte("matching_window_start", now)
      .limit(20);

    results.scheduled_dispatched = 0;

    if (readyJobs && readyJobs.length > 0) {
      for (const job of readyJobs) {
        // Move to matching
        await db.from("jobs").update({
          status: "matching_at_window",
          match_started_at: now,
          match_timeout_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min window for scheduled
        }).eq("id", job.id);

        await db.from("job_events").insert({
          job_id: job.id,
          event_type: "status_change",
          payload_json: { from: "scheduled", to: "matching_at_window", triggered_by: "cron" },
        });

        // TODO: Call match-provider function for this job
        // For now, just mark as ready. The matching engine can be invoked separately.
        results.scheduled_dispatched++;
      }
    }

    // ════════════════════════════════════════
    // 2. EXPIRE STALE OFFERS
    // Offers where status = 'sent' AND expires_at < now
    // ════════════════════════════════════════
    const { data: staleOffers } = await db
      .from("job_offers")
      .select("id, job_id, provider_id, attempt_number")
      .eq("status", "sent")
      .lt("expires_at", now)
      .limit(50);

    results.offers_expired = 0;

    if (staleOffers && staleOffers.length > 0) {
      for (const offer of staleOffers) {
        await db.from("job_offers").update({
          status: "expired",
          responded_at: now,
        }).eq("id", offer.id);

        await db.from("job_events").insert({
          job_id: offer.job_id,
          event_type: "offer_expired",
          payload_json: {
            offer_id: offer.id,
            provider_id: offer.provider_id,
            attempt: offer.attempt_number,
            expired_by: "cron",
          },
        });

        results.offers_expired++;
      }
    }

    // ════════════════════════════════════════
    // 3. AUTO-UNASSIGN STALE PROVIDERS
    // Providers who accepted but haven't pinged location in 15 min
    // ════════════════════════════════════════
    const staleThreshold = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const { data: staleAssignments } = await db
      .from("job_assignments")
      .select("job_id, provider_id, assigned_at")
      .is("arrived_at", null) // Haven't arrived yet
      .lt("assigned_at", staleThreshold); // Assigned more than 15 min ago

    results.providers_unassigned = 0;

    if (staleAssignments && staleAssignments.length > 0) {
      for (const assignment of staleAssignments) {
        // Check if provider has pinged recently
        const { data: recentPing } = await db
          .from("provider_availability")
          .select("last_ping_at")
          .eq("provider_id", assignment.provider_id)
          .single();

        const lastPing = recentPing?.last_ping_at ? new Date(recentPing.last_ping_at) : null;
        const isStale = !lastPing || lastPing < new Date(Date.now() - 5 * 60 * 1000);

        if (isStale) {
          // Check job is still in assignable state
          const { data: job } = await db
            .from("jobs")
            .select("status")
            .eq("id", assignment.job_id)
            .single();

          if (job && ["assigned", "en_route"].includes(job.status)) {
            // Unassign
            await db.from("job_assignments").delete().eq("job_id", assignment.job_id);

            // Reset job to matching
            await db.from("jobs").update({
              status: "matching",
            }).eq("id", assignment.job_id);

            // Set provider offline
            await db.from("provider_availability").update({
              status: "offline",
            }).eq("provider_id", assignment.provider_id);

            await db.from("job_events").insert({
              job_id: assignment.job_id,
              event_type: "admin_action",
              payload_json: {
                action: "auto_unassign",
                reason: "stale_provider",
                provider_id: assignment.provider_id,
                triggered_by: "cron",
              },
            });

            results.providers_unassigned++;
          }
        }
      }
    }

    // ════════════════════════════════════════
    // 4. TIMEOUT MATCHING JOBS
    // Jobs stuck in matching past their timeout
    // ════════════════════════════════════════
    const { data: timedOutJobs } = await db
      .from("jobs")
      .select("id, customer_id")
      .in("status", ["matching", "offered", "matching_at_window"])
      .lt("match_timeout_at", now)
      .limit(20);

    results.matching_timed_out = 0;

    if (timedOutJobs && timedOutJobs.length > 0) {
      for (const job of timedOutJobs) {
        await db.from("jobs").update({ status: "no_provider_found" }).eq("id", job.id);

        // Cancel any pending offers
        await db.from("job_offers").update({
          status: "expired",
          responded_at: now,
        }).eq("job_id", job.id).eq("status", "sent");

        // Release payment hold
        const { data: payment } = await db
          .from("payments")
          .select("id")
          .eq("job_id", job.id)
          .eq("status", "authorized")
          .single();

        if (payment) {
          await db.from("payments").update({
            status: "canceled",
            refund_reason: "matching_timeout",
          }).eq("id", payment.id);
        }

        // Notify customer
        await db.from("notifications").insert({
          recipient_id: job.customer_id,
          job_id: job.id,
          channel: "push",
          template: "no_provider_found",
          title: "No Superhero Available",
          body: "We couldn't find a Superhero in time. Your payment hold has been released.",
          sent_at: now,
        });

        await db.from("job_events").insert({
          job_id: job.id,
          event_type: "status_change",
          payload_json: { to: "no_provider_found", reason: "matching_timeout", triggered_by: "cron" },
        });

        results.matching_timed_out++;
      }
    }

    return jsonResponse({
      success: true,
      timestamp: now,
      results,
    });
  } catch (err: any) {
    console.error("scheduled-dispatcher error:", err);
    return errorResponse(err.message, 500);
  }
});
