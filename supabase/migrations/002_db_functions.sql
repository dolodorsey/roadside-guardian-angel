-- ============================================================
-- S.O.S EDGE FUNCTIONS — STRIPE ESCROW + PROOF GATES
-- ============================================================
-- Deploy as Supabase Edge Functions (Deno)
-- Requires: STRIPE_SECRET_KEY in Supabase secrets
-- ============================================================

-- ████████████████████████████████████████████████████████████
-- FILE: supabase/functions/payments-authorize/index.ts
-- Called at: POST /jobs/:id/confirm
-- ████████████████████████████████████████████████████████████

/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { job_id } = await req.json();
    if (!job_id) return new Response(JSON.stringify({ error: "job_id required" }), { status: 400 });

    // Get auth user
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // Fetch job
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .eq("customer_id", user.id)
      .single();
    
    if (jobErr || !job) return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
    if (job.status !== "created") return new Response(JSON.stringify({ error: `Cannot confirm job in status: ${job.status}` }), { status: 400 });
    if (!job.price_cents || job.price_cents <= 0) return new Response(JSON.stringify({ error: "Price not set. Call /jobs/:id/price first." }), { status: 400 });

    // Get customer's Stripe customer ID or create one
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, phone")
      .eq("id", user.id)
      .single();

    // Look for existing Stripe customer
    const customers = await stripe.customers.list({ email: profile.email, limit: 1 });
    let stripeCustomerId: string;
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name,
        phone: profile.phone,
        metadata: { sos_user_id: user.id }
      });
      stripeCustomerId = newCustomer.id;
    }

    // Create PaymentIntent with MANUAL capture (escrow hold)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: job.price_cents,
      currency: job.currency || "usd",
      customer: stripeCustomerId,
      capture_method: "manual", // ← ESCROW: hold only, capture later
      metadata: {
        sos_job_id: job.id,
        sos_customer_id: user.id,
        service_type: job.service_type,
        mode: job.mode
      },
      description: `S.O.S Rescue: ${job.service_type} - Job ${job.id.slice(0, 8)}`,
      // automatic_payment_methods: { enabled: true } // Enable if using Payment Element
    });

    // Insert payment record
    const { error: payErr } = await supabase.from("payments").insert({
      job_id: job.id,
      customer_id: user.id,
      processor: "stripe",
      payment_intent_id: paymentIntent.id,
      amount_cents: job.price_cents,
      status: "authorized",
      authorized_at: new Date().toISOString()
    });
    if (payErr) throw payErr;

    // Update job status: created → requested
    const { error: updateErr } = await supabase
      .from("jobs")
      .update({ status: "requested" })
      .eq("id", job.id);
    if (updateErr) throw updateErr;

    // Log event
    await supabase.from("job_events").insert({
      job_id: job.id,
      event_type: "payment_auth",
      actor_id: user.id,
      actor_role: "customer",
      payload_json: {
        payment_intent_id: paymentIntent.id,
        amount_cents: job.price_cents,
        client_secret: paymentIntent.client_secret
      }
    });

    return new Response(JSON.stringify({
      success: true,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret, // Send to frontend for Payment Element
      amount_cents: job.price_cents
    }), { status: 200 });

  } catch (err) {
    console.error("authorize error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
*/


-- ████████████████████████████████████████████████████████████
-- FILE: supabase/functions/payments-capture/index.ts
-- Called at: POST /jobs/:id/complete (server-side only)
-- THIS IS THE HARD GATE — proof required before capture
-- ████████████████████████████████████████████████████████████

/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { job_id } = await req.json();
    if (!job_id) return new Response(JSON.stringify({ error: "job_id required" }), { status: 400 });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get auth user (must be provider or admin)
    const authHeader = req.headers.get("Authorization")!;
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // ═══════════════════════════════════════════
    // HARD GATE: ALL PROOF CHECKS MUST PASS
    // ═══════════════════════════════════════════

    // 1. Job must be in 'in_progress' status
    const { data: job } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .single();
    
    if (!job) return new Response(JSON.stringify({ error: "Job not found" }), { status: 404 });
    if (job.status !== "in_progress") {
      return new Response(JSON.stringify({ 
        error: `Cannot complete job in status: ${job.status}. Must be 'in_progress'.` 
      }), { status: 400 });
    }

    // 2. Provider must be assigned
    const { data: assignment } = await supabase
      .from("job_assignments")
      .select("*")
      .eq("job_id", job_id)
      .single();
    
    if (!assignment) return new Response(JSON.stringify({ error: "No provider assigned" }), { status: 400 });
    if (assignment.provider_id !== user.id) {
      // Check if admin
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        return new Response(JSON.stringify({ error: "Only assigned provider or admin can complete" }), { status: 403 });
      }
    }

    // 3. Check-in timestamp must exist
    if (!assignment.check_in_at) {
      return new Response(JSON.stringify({ 
        error: "PROOF GATE FAILED: Provider check-in timestamp missing. Call /jobs/:id/arrived first." 
      }), { status: 400 });
    }

    // 4. Completion proof media must exist
    const { data: proofMedia, error: mediaErr } = await supabase
      .from("job_media")
      .select("id")
      .eq("job_id", job_id)
      .eq("purpose", "completion_proof");
    
    if (mediaErr || !proofMedia || proofMedia.length === 0) {
      return new Response(JSON.stringify({ 
        error: "PROOF GATE FAILED: At least 1 completion proof photo/video required before capture." 
      }), { status: 400 });
    }

    // 5. Completion notes required
    const { completion_notes } = await req.json().catch(() => ({}));
    // Check if notes were provided in this request or already on the job
    if (!job.completion_notes && !completion_notes) {
      return new Response(JSON.stringify({ 
        error: "PROOF GATE FAILED: Completion notes required." 
      }), { status: 400 });
    }

    // ═══════════════════════════════════════════
    // ALL GATES PASSED — CAPTURE PAYMENT
    // ═══════════════════════════════════════════

    // Get payment record
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("job_id", job_id)
      .eq("status", "authorized")
      .single();

    if (!payment || !payment.payment_intent_id) {
      return new Response(JSON.stringify({ error: "No authorized payment found for this job" }), { status: 400 });
    }

    // Capture via Stripe
    const capturedIntent = await stripe.paymentIntents.capture(payment.payment_intent_id);

    // Update payment record
    await supabase.from("payments").update({
      status: "captured",
      captured_at: new Date().toISOString()
    }).eq("id", payment.id);

    // Update job: in_progress → completed
    const now = new Date().toISOString();
    await supabase.from("jobs").update({
      status: "completed",
      completed_at: now,
      completion_notes: completion_notes || job.completion_notes
    }).eq("id", job_id);

    // Update assignment: check-out
    await supabase.from("job_assignments").update({
      completed_at: now,
      check_out_at: now
    }).eq("job_id", job_id);

    // Log capture event
    await supabase.from("job_events").insert({
      job_id,
      event_type: "payment_capture",
      actor_id: user.id,
      payload_json: {
        payment_intent_id: payment.payment_intent_id,
        amount_cents: payment.amount_cents,
        proof_media_count: proofMedia.length,
        captured_at: now
      }
    });

    // Create wallet ledger entry
    await supabase.from("wallet_ledger").insert({
      customer_id: job.customer_id,
      type: "receipt",
      amount_cents: -payment.amount_cents, // Debit
      job_id,
      payment_id: payment.id,
      description: `Rescue: ${job.service_type}`
    });

    // Update provider stats
    await supabase.rpc("increment_provider_jobs", { p_id: assignment.provider_id });

    return new Response(JSON.stringify({
      success: true,
      captured_amount_cents: payment.amount_cents,
      payment_intent_id: payment.payment_intent_id,
      job_status: "completed"
    }), { status: 200 });

  } catch (err) {
    console.error("capture error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
*/


-- ████████████████████████████████████████████████████████████
-- FILE: supabase/functions/payments-refund/index.ts
-- Called at: Cancel / no_provider_found / dispute
-- ████████████████████████████████████████████████████████████

/*
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { job_id, reason, partial_amount_cents } = await req.json();
    if (!job_id) return new Response(JSON.stringify({ error: "job_id required" }), { status: 400 });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auth check
    const authHeader = req.headers.get("Authorization")!;
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    // Get payment
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("job_id", job_id)
      .in("status", ["authorized", "captured"])
      .single();

    if (!payment || !payment.payment_intent_id) {
      return new Response(JSON.stringify({ error: "No payment found" }), { status: 404 });
    }

    let result;
    if (payment.status === "authorized") {
      // Cancel the authorization (no charge)
      result = await stripe.paymentIntents.cancel(payment.payment_intent_id);
    } else if (payment.status === "captured") {
      // Refund (full or partial)
      const refundParams: any = { payment_intent: payment.payment_intent_id };
      if (partial_amount_cents && partial_amount_cents < payment.amount_cents) {
        refundParams.amount = partial_amount_cents;
      }
      result = await stripe.refunds.create(refundParams);
    }

    // Update payment record
    await supabase.from("payments").update({
      status: "refunded",
      refunded_at: new Date().toISOString(),
      refund_reason: reason || "canceled"
    }).eq("id", payment.id);

    // Update job status
    const { data: job } = await supabase.from("jobs").select("status").eq("id", job_id).single();
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
        refund_amount: partial_amount_cents || payment.amount_cents,
        reason
      }
    });

    // Wallet credit
    await supabase.from("wallet_ledger").insert({
      customer_id: payment.customer_id,
      type: "refund",
      amount_cents: partial_amount_cents || payment.amount_cents, // Credit (positive)
      job_id,
      payment_id: payment.id,
      description: `Refund: ${reason || "canceled"}`
    });

    return new Response(JSON.stringify({
      success: true,
      refund_amount_cents: partial_amount_cents || payment.amount_cents,
      job_status: newStatus
    }), { status: 200 });

  } catch (err) {
    console.error("refund error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
*/


-- ████████████████████████████████████████████████████████████
-- FILE: supabase/functions/stripe-webhook/index.ts
-- Endpoint: POST /webhooks/stripe
-- ████████████████████████████████████████████████████████████

/*
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
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const jobId = intent.metadata?.sos_job_id;
  if (!jobId) return new Response("OK - no job_id", { status: 200 });

  switch (event.type) {
    case "payment_intent.amount_capturable_updated":
      // Authorization confirmed
      await supabase.from("payments").update({
        status: "authorized",
        authorized_at: new Date().toISOString()
      }).eq("payment_intent_id", intent.id);
      break;

    case "payment_intent.succeeded":
      // Capture confirmed
      await supabase.from("payments").update({
        status: "captured",
        captured_at: new Date().toISOString()
      }).eq("payment_intent_id", intent.id);
      break;

    case "payment_intent.canceled":
      await supabase.from("payments").update({
        status: "canceled"
      }).eq("payment_intent_id", intent.id);
      break;

    case "payment_intent.payment_failed":
      await supabase.from("payments").update({
        status: "failed",
        failure_reason: intent.last_payment_error?.message || "unknown"
      }).eq("payment_intent_id", intent.id);
      
      // Log failure event
      await supabase.from("job_events").insert({
        job_id: jobId,
        event_type: "payment_auth",
        payload_json: {
          status: "failed",
          reason: intent.last_payment_error?.message,
          payment_intent_id: intent.id
        }
      });
      break;

    case "charge.refunded":
      const charge = event.data.object as any;
      await supabase.from("payments").update({
        status: "refunded",
        refunded_at: new Date().toISOString()
      }).eq("payment_intent_id", charge.payment_intent);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
*/


-- ████████████████████████████████████████████████████████████
-- SUPPORTING DATABASE FUNCTIONS
-- (called by edge functions)
-- ████████████████████████████████████████████████████████████

-- Increment provider job count
CREATE OR REPLACE FUNCTION increment_provider_jobs(p_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE provider_profiles
  SET jobs_completed = jobs_completed + 1,
      updated_at = NOW()
  WHERE provider_id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Compute price for a job
CREATE OR REPLACE FUNCTION compute_job_price(
  p_job_id UUID,
  p_distance_miles NUMERIC DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_job RECORD;
  v_service RECORD;
  v_surge NUMERIC := 1.00;
  v_base INTEGER;
  v_mileage INTEGER := 0;
  v_total INTEGER;
  v_breakdown JSONB;
BEGIN
  -- Get job
  SELECT * INTO v_job FROM jobs WHERE id = p_job_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Job not found'; END IF;

  -- Get service catalog entry
  SELECT * INTO v_service FROM service_catalog WHERE service_type = v_job.service_type;
  IF NOT FOUND THEN RAISE EXCEPTION 'Service type not found'; END IF;

  -- Check for active surge
  SELECT COALESCE(MAX(multiplier), 1.00) INTO v_surge
  FROM surge_windows
  WHERE (city = '*' OR city = v_job.pickup_address)
    AND (service_type IS NULL OR service_type = v_job.service_type)
    AND NOW() BETWEEN starts_at AND ends_at
    AND is_active = true;

  -- Calculate
  v_base := v_service.base_fee_cents;
  
  IF v_service.pricing_model = 'base_plus_miles' AND p_distance_miles IS NOT NULL THEN
    v_mileage := CEIL(p_distance_miles * v_service.per_mile_cents);
  END IF;

  v_total := GREATEST(
    CEIL((v_base + v_mileage) * v_surge),
    v_service.minimum_fee_cents
  );

  v_breakdown := jsonb_build_object(
    'base_fee', v_base,
    'per_mile', v_service.per_mile_cents,
    'miles_est', COALESCE(p_distance_miles, 0),
    'mileage_total', v_mileage,
    'surge_multiplier', v_surge,
    'surge_amount', CEIL((v_base + v_mileage) * (v_surge - 1)),
    'subtotal', v_total,
    'tax', 0, -- TODO: tax calculation
    'total', v_total
  );

  -- Update job with price
  UPDATE jobs
  SET price_cents = v_total,
      price_breakdown_json = v_breakdown,
      distance_miles = p_distance_miles
  WHERE id = p_job_id;

  RETURN v_breakdown;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cancellation fee logic
CREATE OR REPLACE FUNCTION process_cancellation(
  p_job_id UUID,
  p_canceled_by UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_job RECORD;
  v_assignment RECORD;
  v_payment RECORD;
  v_fee INTEGER := 0;
  v_result TEXT;
BEGIN
  SELECT * INTO v_job FROM jobs WHERE id = p_job_id;
  SELECT * INTO v_assignment FROM job_assignments WHERE job_id = p_job_id;
  SELECT * INTO v_payment FROM payments WHERE job_id = p_job_id AND status = 'authorized';

  -- Determine cancellation rules
  IF v_assignment IS NULL THEN
    -- Before assignment: free cancel, release hold
    v_fee := 0;
    v_result := 'free_cancel';
  ELSIF v_job.status IN ('assigned', 'en_route') THEN
    -- After assignment, before on_site: optional fee
    v_fee := 1500; -- $15 cancel fee (configurable)
    v_result := 'cancel_fee_applied';
  ELSIF v_job.status = 'on_site' THEN
    -- After arrival: partial fee
    v_fee := CEIL(v_job.price_cents * 0.25); -- 25% of job price
    v_result := 'partial_fee_applied';
  ELSE
    v_fee := 0;
    v_result := 'free_cancel';
  END IF;

  -- Update job status
  UPDATE jobs SET status = 'canceled_by_user' WHERE id = p_job_id;

  -- Log event
  INSERT INTO job_events (job_id, event_type, actor_id, actor_role, payload_json)
  VALUES (p_job_id, 'status_change', p_canceled_by, 'customer', 
    jsonb_build_object('cancel_fee', v_fee, 'reason', p_reason, 'result', v_result));

  RETURN jsonb_build_object(
    'cancel_fee_cents', v_fee,
    'result', v_result,
    'refund_amount_cents', COALESCE(v_payment.amount_cents, 0) - v_fee
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-expire stale offers (run on cron)
CREATE OR REPLACE FUNCTION expire_stale_offers()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE job_offers
  SET status = 'expired', responded_at = NOW()
  WHERE status = 'sent' AND expires_at < NOW();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-unassign providers who don't move (run on cron)
CREATE OR REPLACE FUNCTION auto_unassign_stale_providers(p_stale_minutes INTEGER DEFAULT 15)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_job RECORD;
BEGIN
  FOR v_job IN
    SELECT j.id, ja.provider_id
    FROM jobs j
    JOIN job_assignments ja ON ja.job_id = j.id
    WHERE j.status = 'assigned'
      AND ja.assigned_at < NOW() - (p_stale_minutes || ' minutes')::interval
      AND NOT EXISTS (
        SELECT 1 FROM provider_locations pl
        WHERE pl.provider_id = ja.provider_id
          AND pl.recorded_at > NOW() - interval '5 minutes'
      )
  LOOP
    -- Unassign
    DELETE FROM job_assignments WHERE job_id = v_job.id;
    -- Reset to matching
    UPDATE jobs SET status = 'matching' WHERE id = v_job.id;
    -- Log
    INSERT INTO job_events (job_id, event_type, payload_json)
    VALUES (v_job.id, 'admin_action', 
      jsonb_build_object('action', 'auto_unassign', 'reason', 'stale_provider', 'provider_id', v_job.provider_id));
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ████████████████████████████████████████████████████████████
-- DONE — EDGE FUNCTIONS + SUPPORTING DB FUNCTIONS
-- ████████████████████████████████████████████████████████████

DO $$ 
BEGIN
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  S.O.S ESCROW + PROOF GATES READY';
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  Edge Functions: 4 (authorize, capture, refund, webhook)';
  RAISE NOTICE '  DB Functions: 5 (price, cancel, expire, unassign, increment)';
  RAISE NOTICE '  Hard Gates: proof media + check-in + notes';
  RAISE NOTICE '════════════════════════════════════════════';
END $$;
