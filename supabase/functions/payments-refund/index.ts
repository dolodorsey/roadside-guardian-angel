import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { job_id, reason, partial_amount_cents } = await req.json();
    if (!job_id) {
      return new Response(JSON.stringify({ error: "job_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const authHeader = req.headers.get("Authorization")!;
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get payment (authorized or captured)
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("job_id", job_id)
      .in("status", ["authorized", "captured"])
      .single();

    if (!payment || !payment.payment_intent_id) {
      return new Response(JSON.stringify({ error: "No active payment found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is customer or admin
    const { data: job } = await supabase.from("jobs").select("customer_id").eq("id", job_id).single();
    if (job?.customer_id !== user.id) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        return new Response(JSON.stringify({ error: "Only job owner or admin can refund" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let refundAmount = payment.amount_cents;

    if (payment.status === "authorized") {
      // Cancel the hold — no charge at all
      await stripe.paymentIntents.cancel(payment.payment_intent_id);
      refundAmount = 0; // No money moved
    } else if (payment.status === "captured") {
      // Actual refund (full or partial)
      const refundParams: any = { payment_intent: payment.payment_intent_id };
      if (partial_amount_cents && partial_amount_cents < payment.amount_cents) {
        refundParams.amount = partial_amount_cents;
        refundAmount = partial_amount_cents;
      }
      await stripe.refunds.create(refundParams);
    }

    const now = new Date().toISOString();

    // Update payment record
    await supabase.from("payments").update({
      status: "refunded",
      refunded_at: now,
      refund_reason: reason || "canceled",
    }).eq("id", payment.id);

    // Update job status
    const newStatus = reason === "no_provider_found" ? "no_provider_found" : "refunded";
    await supabase.from("jobs").update({ status: newStatus }).eq("id", job_id);

    // Log event
    await supabase.from("job_events").insert({
      job_id,
      event_type: "payment_refund",
      actor_id: user.id,
      payload_json: {
        payment_intent_id: payment.payment_intent_id,
        original_amount: payment.amount_cents,
        refund_amount: refundAmount,
        was_captured: payment.status === "captured",
        reason: reason || "canceled",
      },
    });

    // Wallet credit (only if money was actually captured and refunded)
    if (payment.status === "captured" && refundAmount > 0) {
      await supabase.from("wallet_ledger").insert({
        customer_id: payment.customer_id,
        type: "refund",
        amount_cents: refundAmount,
        job_id,
        payment_id: payment.id,
        description: `Refund: ${reason || "canceled"}`,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        refund_amount_cents: refundAmount,
        was_captured: payment.status === "captured",
        job_status: newStatus,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("refund error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
