// ============================================================
// POST /jobs/:id/safety — Panic, Share Trip, Safe Mode, Female-First
// Actions: panic | share | safe_mode | female_first
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

    const { job_id, action, contacts, enabled } = await req.json();
    if (!job_id) return errorResponse("job_id required");
    if (!action) return errorResponse("action required: panic | share | safe_mode | female_first");

    const db = getServiceClient();
    const now = new Date().toISOString();

    // Verify job belongs to user
    const { data: job } = await db.from("jobs").select("*").eq("id", job_id).single();
    if (!job) return errorResponse("Job not found", 404);
    if (job.customer_id !== user.id) return errorResponse("Not your job", 403);

    switch (action) {
      // ════════════════════════════════════════
      // PANIC — Emergency escalation
      // ════════════════════════════════════════
      case "panic": {
        // Create safety incident
        const { data: incident } = await db.from("safety_incidents").insert({
          job_id,
          reported_by: user.id,
          type: "panic",
          status: "open",
          description: "Customer triggered panic button during active rescue",
        }).select().single();

        // Update job_safety
        await db.from("job_safety").update({
          panic_triggered_at: now,
          safety_incident_id: incident?.id,
        }).eq("job_id", job_id);

        // Log event
        await logJobEvent(db, job_id, "panic", user.id, "customer", {
          incident_id: incident?.id,
          triggered_at: now,
        });

        // Notify ops/admin (all admins)
        const { data: admins } = await db
          .from("profiles")
          .select("id")
          .eq("role", "admin");

        if (admins) {
          const adminNotifs = admins.map((admin: any) => ({
            recipient_id: admin.id,
            job_id,
            channel: "push",
            template: "panic_alert",
            title: "🚨 PANIC ALERT",
            body: `Customer triggered panic on Job ${job_id.slice(0, 8)}. Immediate attention required.`,
            sent_at: now,
            metadata_json: {
              incident_id: incident?.id,
              customer_id: user.id,
              pickup_lat: job.pickup_lat,
              pickup_lng: job.pickup_lng,
            },
          }));
          await db.from("notifications").insert(adminNotifs);
        }

        return jsonResponse({
          success: true,
          action: "panic",
          incident_id: incident?.id,
          message: "Panic alert sent. Operations team has been notified.",
        });
      }

      // ════════════════════════════════════════
      // SHARE TRIP — Send live updates to contacts
      // ════════════════════════════════════════
      case "share": {
        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
          return errorResponse("contacts array required: [{name, phone}]");
        }

        // Validate contact format
        const validContacts = contacts.map((c: any) => ({
          name: c.name || "Contact",
          phone: c.phone,
          notified_at: now,
        }));

        // Update job_safety
        await db.from("job_safety").update({
          share_contacts_json: validContacts,
        }).eq("job_id", job_id);

        // Log event
        await logJobEvent(db, job_id, "share", user.id, "customer", {
          contacts_count: validContacts.length,
          contacts: validContacts.map((c: any) => c.name),
        });

        // TODO: Send SMS to each contact with live tracking link
        // For MVP, just log and store. SMS integration via n8n/Twilio later.

        return jsonResponse({
          success: true,
          action: "share",
          contacts_shared: validContacts.length,
          message: `Trip shared with ${validContacts.length} contact(s).`,
        });
      }

      // ════════════════════════════════════════
      // SAFE MODE — Toggle provider instructions
      // ════════════════════════════════════════
      case "safe_mode": {
        const safeEnabled = enabled !== undefined ? enabled : true;

        await db.from("job_safety").update({
          safe_mode_enabled: safeEnabled,
        }).eq("job_id", job_id);

        await db.from("jobs").update({
          safe_mode_enabled: safeEnabled,
        }).eq("id", job_id);

        await logJobEvent(db, job_id, "safe_mode_toggle", user.id, "customer", {
          enabled: safeEnabled,
        });

        // Notify assigned provider if exists
        const { data: assignment } = await db
          .from("job_assignments")
          .select("provider_id")
          .eq("job_id", job_id)
          .single();

        if (assignment) {
          await db.from("notifications").insert({
            recipient_id: assignment.provider_id,
            job_id,
            channel: "push",
            template: "safe_mode_update",
            title: safeEnabled ? "Safe Mode Enabled" : "Safe Mode Disabled",
            body: safeEnabled
              ? "Customer has enabled Safe Mode. Please confirm identity through window. Customer will remain in vehicle."
              : "Customer has disabled Safe Mode.",
            sent_at: now,
          });
        }

        return jsonResponse({
          success: true,
          action: "safe_mode",
          enabled: safeEnabled,
          message: safeEnabled ? "Safe Mode enabled." : "Safe Mode disabled.",
        });
      }

      // ════════════════════════════════════════
      // FEMALE-FIRST — Toggle dispatch preference
      // ════════════════════════════════════════
      case "female_first": {
        const ffEnabled = enabled !== undefined ? enabled : true;

        await db.from("job_safety").update({
          female_first_requested: ffEnabled,
        }).eq("job_id", job_id);

        await db.from("jobs").update({
          female_first_requested: ffEnabled,
        }).eq("id", job_id);

        await logJobEvent(db, job_id, "status_change", user.id, "customer", {
          female_first_requested: ffEnabled,
        });

        return jsonResponse({
          success: true,
          action: "female_first",
          enabled: ffEnabled,
          message: ffEnabled ? "Female-First dispatch preference enabled." : "Female-First dispatch preference disabled.",
        });
      }

      default:
        return errorResponse(`Unknown action: ${action}. Use: panic, share, safe_mode, female_first`);
    }
  } catch (err: any) {
    console.error("job-safety error:", err);
    return errorResponse(err.message, 500);
  }
});
