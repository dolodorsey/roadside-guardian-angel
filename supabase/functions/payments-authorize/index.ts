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
    const { job_id } = await req.json();
    if (!job_id) {
      return new Response(JSON.stringify({ error: "job_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
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

    // Fetch job — must belong to this user and be in 'created' status
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", job_id)
      .eq("customer_id", user.id)
      .single();

    if (jobErr || !job) {
      return new Response(JSON.stringify({ error: "Job not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (job.status !== "created") {
      return new Response(
        JSON.stringify({ error: `Cannot confirm job in status: ${job.status}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!job.price_cents || job.price_cents <= 0) {
      return new Response(
        JSON.stringify({ error: "Price not computed. Call price preview first." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, phone")
      .eq("id", user.id)
      .single();

    const customers = await stripe.customers.list({
      email: profile!.email,
      limit: 1,
    });

    let stripeCustomerId: string;
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: profile!.email,
        name: profile!.full_name,
        phone: profile!.phone,
        metadata: { sos_user_id: user.id },
      });
      stripeCustomerId = newCustomer.id;
    }

    // Create PaymentIntent with MANUAL capture (escrow)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: job.price_cents,
      currency: job.currency || "usd",
      customer: stripeCustomerId,
      capture_method: "manual",
      metadata: {
        sos_job_id: job.id,
        sos_customer_id: user.id,
        service_type: job.service_type,
        mode: job.mode,
      },
      description: `S.O.S Rescue: ${job.service_type} — Job ${job.id.slice(0, 8)}`,
    });

    // Insert payment record
    await supabase.from("payments").insert({
      job_id: job.id,
      customer_id: user.id,
      processor: "stripe",
      payment_intent_id: paymentIntent.id,
      amount_cents: job.price_cents,
      status: "authorized",
      authorized_at: new Date().toISOString(),
    });

    // Update job status: created → requested (triggers matching)
    await supabase.from("jobs").update({ status: "requested" }).eq("id", job.id);

    // Log event
    await supabase.from("job_events").insert({
      job_id: job.id,
      event_type: "payment_auth",
      actor_id: user.id,
      actor_role: "customer",
      payload_json: {
        payment_intent_id: paymentIntent.id,
        amount_cents: job.price_cents,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        payment_intent_id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount_cents: job.price_cents,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("authorize error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
