// ============================================================
// POST /jobs/:id/cancel — Customer cancellation with fee rules
// Before assignment: free. After assignment: fee. After on_site: partial.
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  optionsResponse, jsonResponse, errorResponse,
  getServiceClient, getAuthUser, logJobEvent,
} from "../_shared/utils.ts";

const CANCEL_FEE_CENTS = 1500; // $15 after assignment
const ONSITE_FEE_PERCENT = 0.25; // 25% after provider arrives

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const { job_id, reason } = await req.json();
    if (!job_id) return errorResponse("job_id required");

    const db = getServiceClient();
    const now = new Date().toISOString();

    // Fetch job
    const { data: job } = await db.from("jobs").select("*").eq("id", job_id).single();
    if (!job) return errorResponse("Job not found", 404);
    if (job.customer_id !== user.id) return errorResponse("Not your job", 403);

    // Cannot cancel completed/already canceled jobs
    const nonCancelable = ["completed", "canceled_by_user", "canceled_by_provider", "refunded", "disputed"];
    if (nonCancelable.includes(job.status)) {
      return errorResponse(`Cannot cancel job in status: ${job.status}`);
    }

    // Check assignment
    const { data: assignment } = await db
      .from("job_assignments")
      .select("*")
      .eq("job_id", job_id)
      .single();

    // Determine fee
    let cancelFee = 0;
    let feeReason = "free_cancel";

    if (!assignment) {
      // Before assignment — free
      cancelFee = 0;
      feeReason = "before_assignment";
    } else if (["assigned", "en_route"].includes(job.status)) {
      // After assignment, before arrival
      cancelFee = CANCEL_FEE_CENTS;
      feeReason = "after_assignment";
    } else if (job.status === "on_site" || job.status === "in_progress") {
      // After arrival — partial fee
      cancelFee = Math.ceil((job.price_cents || 0) * ONSITE_FEE_PERCENT);
      feeReason = "after_arrival";
    }

    // Update job status
    await db.from("jobs").update({
      status: "canceled_by_user",
    }).eq("id", job_id);

    // Log event
    await logJobEvent(db, job_id, "status_change", user.id, "customer", {
      from: job.status,
      to: "canceled_by_user",
      reason: reason || null,
      cancel_fee_cents: cancelFee,
      fee_reason: feeReason,
    });

    // Handle payment
    const { data: payment } = await db
      .from("payments")
      .select("*")
      .eq("job_id", job_id)
      .in("status", ["authorized", "captured"])
      .single();

    if (payment) {
      const Stripe = (await import("https://esm.sh/stripe@13.0.0?target=deno")).default;
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });

      if (cancelFee > 0 && payment.status === "authorized") {
        // Capture only the cancel fee amount
        try {
          await stripe.paymentIntents.capture(payment.payment_intent_id, {
            amount_to_capture: cancelFee,
          });
          await db.from("payments").update({
            status: "captured",
            amount_cents: cancelFee,
            captured_at: now,
            refund_reason: `cancel_fee: ${feeReason}`,
          }).eq("id", payment.id);

          await db.from("wallet_ledger").insert({
            customer_id: job.customer_id,
            type: "receipt",
            amount_cents: -cancelFee,
            job_id,
            payment_id: payment.id,
            description: `Cancellation fee: ${feeReason}`,
          });
        } catch (e: any) {
          console.error("Cancel fee capture failed:", e.message);
          // Release the full hold instead
          await stripe.paymentIntents.cancel(payment.payment_intent_id);
          await db.from("payments").update({ status: "canceled" }).eq("id", payment.id);
        }
      } else if (payment.status === "authorized") {
        // No fee — release hold
        try {
          await stripe.paymentIntents.cancel(payment.payment_intent_id);
        } catch (e: any) {
          console.error("Cancel auth failed:", e.message);
        }
        await db.from("payments").update({
          status: "canceled",
          refund_reason: "canceled_by_user",
        }).eq("id", payment.id);
      } else if (payment.status === "captured") {
        // Already captured — issue refund minus fee
        const refundAmount = payment.amount_cents - cancelFee;
        if (refundAmount > 0) {
          try {
            await stripe.refunds.create({
              payment_intent: payment.payment_intent_id,
              amount: refundAmount,
            });
          } catch (e: any) {
            console.error("Refund failed:", e.message);
          }
          await db.from("payments").update({
            status: "refunded",
            refunded_at: now,
            refund_reason: `partial_refund_after_cancel: kept ${cancelFee}`,
          }).eq("id", payment.id);

          await db.from("wallet_ledger").insert({
            customer_id: job.customer_id,
            type: "refund",
            amount_cents: refundAmount,
            job_id,
            payment_id: payment.id,
            description: "Cancellation refund",
          });
        }
      }

      await logJobEvent(db, job_id, "payment_refund", user.id, "customer", {
        cancel_fee_cents: cancelFee,
        refund_amount: (payment.amount_cents || 0) - cancelFee,
        fee_reason: feeReason,
      });
    }

    // Release provider if assigned
    if (assignment) {
      await db.from("provider_availability").update({
        status: "online",
      }).eq("provider_id", assignment.provider_id);

      // Notify provider
      await db.from("notifications").insert({
        recipient_id: assignment.provider_id,
        job_id,
        channel: "push",
        template: "job_canceled",
        title: "Rescue Canceled",
        body: "The customer has canceled this rescue. You're back online.",
        sent_at: now,
      });
    }

    // Expire any pending offers
    await db.from("job_offers").update({
      status: "expired",
      responded_at: now,
    }).eq("job_id", job_id).eq("status", "sent");

    return jsonResponse({
      success: true,
      status: "canceled_by_user",
      cancel_fee_cents: cancelFee,
      fee_reason: feeReason,
      refunded: !!(payment && cancelFee === 0),
    });
  } catch (err: any) {
    console.error("job-cancel error:", err);
    return errorResponse(err.message, 500);
  }
});
