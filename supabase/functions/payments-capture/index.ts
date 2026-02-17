import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { job_id, completion_notes } = body;
    if (!job_id) {
      return new Response(JSON.stringify({ error: "job_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Auth
    const authHeader = req.headers.get("Authorization")!;
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══════════════════════════════════════════════════
    // HARD GATE 1: Job must be 'in_progress'
    // ═══════════════════════════════════════════════════
    const { data: job } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();

    if (!job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (job.status !== "in_progress") {
      return new Response(
        JSON.stringify({
          error: `Cannot complete job in status: ${job.status}. Must be 'in_progress'.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ═══════════════════════════════════════════════════
    // HARD GATE 2: Provider must be assigned + authorized
    // ═══════════════════════════════════════════════════
    const { data: assignment } = await supabase
      .from("job_assignments")
      .select("*")
      .eq("job_id", job_id)
      .single();

    if (!assignment) {
      return new Response(JSON.stringify({ error: "No provider assigned" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Must be the assigned provider or admin
    if (assignment.provider_id !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin") {
        return new Response(
          JSON.stringify({ error: "Only assigned provider or admin can complete" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // ═══════════════════════════════════════════════════
    // HARD GATE 3: Check-in timestamp must exist
    // ═══════════════════════════════════════════════════
    if (!assignment.check_in_at) {
      return new Response(
        JSON.stringify({
          error: "PROOF GATE FAILED: Provider check-in missing. Call arrived endpoint first.",
          gate: "check_in",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ═══════════════════════════════════════════════════
    // HARD GATE 4: Completion proof media required
    // ═══════════════════════════════════════════════════
    const { data: proofMedia } = await supabase
      .from("job_media")
      .select("id")
      .eq("job_id", job_id)
      .eq("purpose", "completion_proof");

    if (!proofMedia || proofMedia.length === 0) {
      return new Response(
        JSON.stringify({
          error: "PROOF GATE FAILED: At least 1 completion proof photo required.",
          gate: "proof_media",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ═══════════════════════════════════════════════════
    // HARD GATE 5: Completion notes required
    // ═══════════════════════════════════════════════════
    const notes = completion_notes || job.completion_notes;
    if (!notes) {
      return new Response(
        JSON.stringify({
          error: "PROOF GATE FAILED: Completion notes required.",
          gate: "completion_notes",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ═══════════════════════════════════════════════════
    // ALL GATES PASSED — CAPTURE PAYMENT
    // ═══════════════════════════════════════════════════
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("job_id", job_id)
      .eq("status", "authorized")
      .single();

    if (!payment || !payment.payment_intent_id) {
      return new Response(
        JSON.stringify({ error: "No authorized payment found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Capture via Stripe
    await stripe.paymentIntents.capture(payment.payment_intent_id);

    const now = new Date().toISOString();

    // Update payment
    await supabase
      .from("payments")
      .update({ status: "captured", captured_at: now })
      .eq("id", payment.id);

    // Update job → completed
    await supabase
      .from("jobs")
      .update({
        status: "completed",
        completed_at: now,
        completion_notes: notes,
      })
      .eq("id", job_id);

    // Update assignment
    await supabase
      .from("job_assignments")
      .update({ completed_at: now, check_out_at: now })
      .eq("job_id", job_id);

    // Log capture event
    await supabase.from("job_events").insert({
      job_id,
      event_type: "payment_capture",
      actor_id: user.id,
      payload_json: {
        payment_intent_id: payment.payment_intent_id,
        amount_cents: payment.amount_cents,
        proof_count: proofMedia.length,
        captured_at: now,
      },
    });

    // Wallet ledger — debit customer
    await supabase.from("wallet_ledger").insert({
      customer_id: job.customer_id,
      type: "receipt",
      amount_cents: -payment.amount_cents,
      job_id,
      payment_id: payment.id,
      description: `Rescue: ${job.service_type}`,
    });

    // Increment provider stats
    await supabase.rpc("increment_provider_jobs", {
      p_id: assignment.provider_id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        captured_amount_cents: payment.amount_cents,
        payment_intent_id: payment.payment_intent_id,
        job_status: "completed",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("capture error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
