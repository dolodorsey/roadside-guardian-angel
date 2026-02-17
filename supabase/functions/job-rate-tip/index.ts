// ============================================================
// POST /jobs/:id/rate — Rate provider + add tip
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

    const { job_id, rating, review, tip_cents } = await req.json();
    if (!job_id) return errorResponse("job_id required");

    const db = getServiceClient();
    const now = new Date().toISOString();

    // Fetch job
    const { data: job } = await db.from("jobs").select("*").eq("id", job_id).single();
    if (!job) return errorResponse("Job not found", 404);
    if (job.customer_id !== user.id) return errorResponse("Not your job", 403);
    if (job.status !== "completed") return errorResponse("Can only rate completed jobs");

    const updates: any = {};

    // ── Rating ──
    if (rating) {
      if (rating < 1 || rating > 5) return errorResponse("Rating must be 1-5");
      updates.customer_rating = rating;
      if (review) updates.customer_review = review;

      // Update provider's average rating
      const { data: assignment } = await db
        .from("job_assignments")
        .select("provider_id")
        .eq("job_id", job_id)
        .single();

      if (assignment) {
        // Get all ratings for this provider
        const { data: allRatings } = await db
          .from("jobs")
          .select("customer_rating")
          .not("customer_rating", "is", null)
          .in("id", (
            await db.from("job_assignments")
              .select("job_id")
              .eq("provider_id", assignment.provider_id)
          ).data?.map((j: any) => j.job_id) || []);

        if (allRatings && allRatings.length > 0) {
          const ratings = [...allRatings.map((r: any) => r.customer_rating), rating];
          const avgRating = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;

          await db.from("provider_profiles").update({
            rating_avg: Math.round(avgRating * 100) / 100,
            rating_count: ratings.length,
          }).eq("provider_id", assignment.provider_id);
        }
      }

      await logJobEvent(db, job_id, "note", user.id, "customer", {
        type: "rating",
        rating,
        review: review || null,
      });
    }

    // ── Tip ──
    if (tip_cents && tip_cents > 0) {
      updates.tip_cents = tip_cents;

      // Process tip via Stripe
      const { data: payment } = await db
        .from("payments")
        .select("payment_intent_id, customer_id")
        .eq("job_id", job_id)
        .eq("status", "captured")
        .single();

      if (payment) {
        try {
          const Stripe = (await import("https://esm.sh/stripe@13.0.0?target=deno")).default;
          const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" });

          // Create a separate charge for the tip
          const customers = await stripe.customers.list({ limit: 1 });
          // For MVP, just record in ledger. Full tip charging requires saved payment method.

          // Wallet ledger entry for tip
          await db.from("wallet_ledger").insert({
            customer_id: user.id,
            type: "tip",
            amount_cents: -tip_cents,
            job_id,
            description: `Tip for rescue: ${job.service_type}`,
          });
        } catch (e: any) {
          console.error("Tip processing:", e.message);
        }
      }

      await logJobEvent(db, job_id, "note", user.id, "customer", {
        type: "tip",
        tip_cents,
      });
    }

    if (Object.keys(updates).length > 0) {
      await db.from("jobs").update(updates).eq("id", job_id);
    }

    return jsonResponse({
      success: true,
      rating: rating || null,
      tip_cents: tip_cents || 0,
      message: rating ? `Thank you for rating your Superhero ${rating}/5!` : "Tip recorded. Thank you!",
    });
  } catch (err: any) {
    console.error("job-rate-tip error:", err);
    return errorResponse(err.message, 500);
  }
});
