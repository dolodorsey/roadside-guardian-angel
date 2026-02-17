import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const jobId = intent.metadata?.sos_job_id;

  // Only process events with our job ID
  if (!jobId) {
    return new Response(JSON.stringify({ received: true, skipped: "no sos_job_id" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const now = new Date().toISOString();

  try {
    switch (event.type) {
      case "payment_intent.amount_capturable_updated": {
        // Authorization confirmed by Stripe
        await supabase
          .from("payments")
          .update({ status: "authorized", authorized_at: now })
          .eq("payment_intent_id", intent.id);

        await supabase.from("job_events").insert({
          job_id: jobId,
          event_type: "payment_auth",
          payload_json: {
            webhook_event: event.type,
            payment_intent_id: intent.id,
            amount: intent.amount,
            status: "authorized",
          },
        });
        break;
      }

      case "payment_intent.succeeded": {
        // Capture confirmed
        await supabase
          .from("payments")
          .update({ status: "captured", captured_at: now })
          .eq("payment_intent_id", intent.id);

        await supabase.from("job_events").insert({
          job_id: jobId,
          event_type: "payment_capture",
          payload_json: {
            webhook_event: event.type,
            payment_intent_id: intent.id,
            amount: intent.amount,
            status: "captured",
          },
        });
        break;
      }

      case "payment_intent.canceled": {
        await supabase
          .from("payments")
          .update({ status: "canceled" })
          .eq("payment_intent_id", intent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const failureMessage =
          intent.last_payment_error?.message || "Unknown failure";

        await supabase
          .from("payments")
          .update({ status: "failed", failure_reason: failureMessage })
          .eq("payment_intent_id", intent.id);

        await supabase.from("job_events").insert({
          job_id: jobId,
          event_type: "payment_auth",
          payload_json: {
            webhook_event: event.type,
            payment_intent_id: intent.id,
            status: "failed",
            reason: failureMessage,
          },
        });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as any;
        if (charge.payment_intent) {
          await supabase
            .from("payments")
            .update({ status: "refunded", refunded_at: now })
            .eq("payment_intent_id", charge.payment_intent);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error(`Error processing ${event.type}:`, err);
    // Return 200 anyway so Stripe doesn't retry indefinitely
  }

  return new Response(JSON.stringify({ received: true, type: event.type }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
