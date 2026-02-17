// ============================================================
// POST /providers/me/availability — Go online/offline/busy
// POST /providers/me/location — Ping current position (every 10-20s)
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  optionsResponse, jsonResponse, errorResponse,
  getServiceClient, getAuthUser,
} from "../_shared/utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse();

  try {
    const user = await getAuthUser(req);
    if (!user) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { action } = body;

    if (!action || !["set_status", "ping_location", "en_route"].includes(action)) {
      return errorResponse("action required: set_status | ping_location | en_route");
    }

    const db = getServiceClient();
    const now = new Date().toISOString();

    // Verify provider is active
    const { data: provider } = await db
      .from("provider_profiles")
      .select("provider_id, onboard_status, is_active")
      .eq("provider_id", user.id)
      .single();

    if (!provider) return errorResponse("Provider profile not found. Complete onboarding first.", 404);

    switch (action) {
      // ════════════════════════════════════════
      // SET STATUS — online / offline / busy
      // ════════════════════════════════════════
      case "set_status": {
        const { status } = body; // "online" | "offline" | "busy"
        if (!status || !["online", "offline", "busy"].includes(status)) {
          return errorResponse("status must be: online | offline | busy");
        }

        // Can only go online if approved + active
        if (status === "online") {
          if (provider.onboard_status !== "active" || !provider.is_active) {
            return errorResponse("Cannot go online. Provider must be approved and active.");
          }

          // Verify docs are still valid
          const { data: ver } = await db
            .from("provider_verifications")
            .select("license_status, insurance_status, background_check_status")
            .eq("provider_id", user.id)
            .single();

          if (!ver ||
            ver.license_status !== "approved" ||
            ver.insurance_status !== "approved" ||
            ver.background_check_status !== "approved"
          ) {
            return errorResponse("Cannot go online. Verification documents not fully approved.");
          }
        }

        // Get current location from body or existing
        const lat = body.lat || null;
        const lng = body.lng || null;

        await db.from("provider_availability").upsert({
          provider_id: user.id,
          status,
          current_lat: lat,
          current_lng: lng,
          last_ping_at: now,
          updated_at: now,
        }, { onConflict: "provider_id" });

        return jsonResponse({
          success: true,
          status,
          message: status === "online"
            ? "You're online. Rescue requests will start coming in."
            : status === "offline"
              ? "You're offline. No new requests."
              : "You're busy. Current job in progress.",
        });
      }

      // ════════════════════════════════════════
      // PING LOCATION — Update lat/lng (every 10-20s)
      // ════════════════════════════════════════
      case "ping_location": {
        const { lat, lng, heading, speed, job_id } = body;

        if (!lat || !lng) return errorResponse("lat and lng required");

        // Update availability table
        await db.from("provider_availability").update({
          current_lat: lat,
          current_lng: lng,
          last_ping_at: now,
          updated_at: now,
        }).eq("provider_id", user.id);

        // Store in location history (for audit/replay)
        await db.from("provider_locations").insert({
          provider_id: user.id,
          job_id: job_id || null,
          lat,
          lng,
          heading: heading || null,
          speed: speed || null,
          recorded_at: now,
        });

        // If assigned to a job, log as GPS ping event
        if (job_id) {
          await db.from("job_events").insert({
            job_id,
            event_type: "provider_location_update",
            actor_id: user.id,
            actor_role: "provider",
            payload_json: { lat, lng, heading, speed },
          });
        }

        return jsonResponse({ success: true, recorded: true });
      }

      // ════════════════════════════════════════
      // EN ROUTE — Provider heading to pickup
      // ════════════════════════════════════════
      case "en_route": {
        const { job_id } = body;
        if (!job_id) return errorResponse("job_id required");

        // Verify assignment
        const { data: assignment } = await db
          .from("job_assignments")
          .select("*")
          .eq("job_id", job_id)
          .eq("provider_id", user.id)
          .single();

        if (!assignment) return errorResponse("Not assigned to this job", 403);

        // Update job status
        const { data: job } = await db.from("jobs").select("status, customer_id").eq("id", job_id).single();
        if (!job) return errorResponse("Job not found", 404);
        if (job.status !== "assigned") {
          return errorResponse(`Cannot set en_route from status: ${job.status}`);
        }

        await db.from("jobs").update({ status: "en_route" }).eq("id", job_id);

        // Update availability to busy
        await db.from("provider_availability").update({ status: "busy" }).eq("provider_id", user.id);

        // Log event
        await db.from("job_events").insert({
          job_id,
          event_type: "status_change",
          actor_id: user.id,
          actor_role: "provider",
          payload_json: { from: "assigned", to: "en_route" },
        });

        // Notify customer
        const { data: providerName } = await db
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        await db.from("notifications").insert({
          recipient_id: job.customer_id,
          job_id,
          channel: "push",
          template: "en_route",
          title: "Superhero En Route",
          body: `${providerName?.full_name || "Your Superhero"} is heading your way!`,
          sent_at: now,
        });

        return jsonResponse({
          success: true,
          status: "en_route",
          message: "Status updated. Navigate to pickup location.",
        });
      }
    }
  } catch (err: any) {
    console.error("provider-availability error:", err);
    return errorResponse(err.message, 500);
  }
});
