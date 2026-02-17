// ============================================================
// Provider Job Progression Endpoints
// POST /jobs/:id/arrived  → on_site
// POST /jobs/:id/start    → in_progress  
// POST /jobs/:id/complete → completed (proof-gated → triggers capture)
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  optionsResponse, jsonResponse, errorResponse,
  getServiceClient, getAuthUser, logJobEvent,
} from "../_shared/utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { job_id, action, completion_notes, media_urls } = body;

    if (!job_id) return errorResponse("job_id required");
    if (!action || !["arrived", "start", "complete"].includes(action)) {
      return errorResponse("action must be 'arrived', 'start', or 'complete'");
    }

    const db = getServiceClient();
    const now = new Date().toISOString();

    // ── Verify assignment ──
    const { data: assignment } = await db
      .from("job_assignments")
      .select("*")
      .eq("job_id", job_id)
      .eq("provider_id", user.id)
      .single();

    if (!assignment) return errorResponse("You are not assigned to this job", 403);

    // ── Get job ──
    const { data: job } = await db.from("jobs").select("*").eq("id", job_id).single();
    if (!job) return errorResponse("Job not found", 404);

    // ════════════════════════════════════════
    // ACTION: ARRIVED
    // ════════════════════════════════════════
    if (action === "arrived") {
      if (job.status !== "en_route" && job.status !== "assigned") {
        return errorResponse(`Cannot mark arrived from status: ${job.status}. Must be 'en_route' or 'assigned'.`);
      }

      await db.from("jobs").update({ status: "on_site" }).eq("id", job_id);
      await db.from("job_assignments").update({
        arrived_at: now,
        check_in_at: now,
      }).eq("job_id", job_id);

      await logJobEvent(db, job_id, "status_change", user.id, "provider", {
        from: job.status, to: "on_site",
      });
      await logJobEvent(db, job_id, "check_in", user.id, "provider", {
        timestamp: now,
      });

      // Notify customer
      await db.from("notifications").insert({
        recipient_id: job.customer_id,
        job_id,
        channel: "push",
        template: "arrival",
        title: "Superhero On Site",
        body: "Your Superhero has arrived!",
        sent_at: now,
      });

      return jsonResponse({
        success: true,
        status: "on_site",
        message: "Marked as arrived. Ready to start service.",
      });
    }

    // ════════════════════════════════════════
    // ACTION: START
    // ════════════════════════════════════════
    if (action === "start") {
      if (job.status !== "on_site") {
        return errorResponse(`Cannot start from status: ${job.status}. Must be 'on_site'.`);
      }

      await db.from("jobs").update({ status: "in_progress" }).eq("id", job_id);
      await db.from("job_assignments").update({
        started_at: now,
      }).eq("job_id", job_id);

      await logJobEvent(db, job_id, "status_change", user.id, "provider", {
        from: "on_site", to: "in_progress",
      });

      return jsonResponse({
        success: true,
        status: "in_progress",
        message: "Service started. Upload proof when complete.",
      });
    }

    // ════════════════════════════════════════
    // ACTION: COMPLETE (proof-gated)
    // ════════════════════════════════════════
    if (action === "complete") {
      if (job.status !== "in_progress") {
        return errorResponse(`Cannot complete from status: ${job.status}. Must be 'in_progress'.`);
      }

      // ── HARD GATE 1: Check-in must exist ──
      if (!assignment.check_in_at) {
        return errorResponse("PROOF GATE: Check-in timestamp missing. Mark arrived first.", 400);
      }

      // ── HARD GATE 2: Upload completion proof media ──
      // Accept media_urls in this request, or check existing
      if (media_urls && media_urls.length > 0) {
        // Insert media records
        const mediaInserts = media_urls.map((url: string, i: number) => ({
          job_id,
          uploader_id: user.id,
          uploader_role: "provider",
          media_type: url.match(/\.(mp4|mov|webm)$/i) ? "video" : "photo",
          url,
          purpose: "completion_proof",
        }));
        await db.from("job_media").insert(mediaInserts);
      }

      // Verify proof exists
      const { data: proofMedia } = await db
        .from("job_media")
        .select("id")
        .eq("job_id", job_id)
        .eq("purpose", "completion_proof");

      if (!proofMedia || proofMedia.length === 0) {
        return errorResponse("PROOF GATE: At least 1 completion proof photo required.", 400);
      }

      // ── HARD GATE 3: Completion notes ──
      if (!completion_notes) {
        return errorResponse("PROOF GATE: Completion notes required.", 400);
      }

      // ═══ ALL GATES PASSED ═══

      // Update job
      await db.from("jobs").update({
        status: "completed",
        completed_at: now,
        completion_notes,
      }).eq("id", job_id);

      // Update assignment
      await db.from("job_assignments").update({
        completed_at: now,
        check_out_at: now,
      }).eq("job_id", job_id);

      // Log events
      await logJobEvent(db, job_id, "status_change", user.id, "provider", {
        from: "in_progress", to: "completed",
        proof_count: proofMedia.length,
      });
      await logJobEvent(db, job_id, "check_out", user.id, "provider", {
        timestamp: now,
      });

      // ── TRIGGER PAYMENT CAPTURE ──
      const { data: payment } = await db
        .from("payments")
        .select("*")
        .eq("job_id", job_id)
        .eq("status", "authorized")
        .single();

      if (payment) {
        // Import Stripe and capture
        const Stripe = (await import("https://esm.sh/stripe@13.0.0?target=deno")).default;
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });

        try {
          await stripe.paymentIntents.capture(payment.payment_intent_id);

          await db.from("payments").update({
            status: "captured",
            captured_at: now,
            provider_id: user.id,
          }).eq("id", payment.id);

          await logJobEvent(db, job_id, "payment_capture", user.id, "provider", {
            payment_intent_id: payment.payment_intent_id,
            amount_cents: payment.amount_cents,
          });

          // Wallet ledger
          await db.from("wallet_ledger").insert({
            customer_id: job.customer_id,
            type: "receipt",
            amount_cents: -payment.amount_cents,
            job_id,
            payment_id: payment.id,
            description: `Rescue: ${job.service_type}`,
          });
        } catch (stripeErr: any) {
          console.error("Stripe capture failed:", stripeErr.message);
          // Job is still completed — capture will retry via webhook or admin
          await logJobEvent(db, job_id, "payment_capture", null, null, {
            status: "failed",
            error: stripeErr.message,
          });
        }
      }

      // Update provider: set back to online + increment stats
      await db.from("provider_availability").update({
        status: "online",
      }).eq("provider_id", user.id);

      await db.rpc("increment_provider_jobs", { p_id: user.id }).catch(() => {
        // Fallback manual increment
        db.from("provider_profiles").update({
          jobs_completed: (job.jobs_completed || 0) + 1,
        }).eq("provider_id", user.id);
      });

      // Notify customer
      await db.from("notifications").insert({
        recipient_id: job.customer_id,
        job_id,
        channel: "push",
        template: "completion",
        title: "Rescue Complete ✅",
        body: "Your rescue is complete! View your receipt and rate your Superhero.",
        sent_at: now,
        metadata_json: {
          amount_cents: payment?.amount_cents,
          service_type: job.service_type,
        },
      });

      return jsonResponse({
        success: true,
        status: "completed",
        captured: !!payment,
        amount_cents: payment?.amount_cents || 0,
        message: "Job complete. Payment captured. Great work, Superhero.",
      });
    }
  } catch (err: any) {
    console.error("provider-job-progress error:", err);
    return errorResponse(err.message, 500);
  }
});
