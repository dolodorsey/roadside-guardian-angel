// ============================================================
// POST /providers/onboard — Provider application + verification
// POST /providers/verify/upload — Document upload for verification
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
    const { action } = body;

    if (!action || !["onboard", "upload_docs", "update_services", "update_profile"].includes(action)) {
      return errorResponse("action required: onboard | upload_docs | update_services | update_profile");
    }

    const db = getServiceClient();
    const now = new Date().toISOString();

    switch (action) {
      // ════════════════════════════════════════
      // ONBOARD — Initial provider application
      // ════════════════════════════════════════
      case "onboard": {
        const {
          provider_type = "person",
          company_name,
          bio,
          equipment,
          service_radius_miles = 25,
          base_city,
          service_types = [],
          is_female_first_eligible = false,
        } = body;

        // Check if already a provider
        const { data: existing } = await db
          .from("provider_profiles")
          .select("provider_id, onboard_status")
          .eq("provider_id", user.id)
          .single();

        if (existing) {
          return errorResponse(`Already registered as provider. Status: ${existing.onboard_status}`);
        }

        // Update profile role
        await db.from("profiles").update({ role: "provider" }).eq("id", user.id);

        // Create provider profile
        const { data: profile, error: profErr } = await db
          .from("provider_profiles")
          .insert({
            provider_id: user.id,
            provider_type,
            onboard_status: "applied",
            company_name: company_name || null,
            bio: bio || null,
            equipment_json: equipment || [],
            service_radius_miles,
            base_city: base_city || null,
            is_female_first_eligible,
            is_active: false,
          })
          .select()
          .single();

        if (profErr) throw profErr;

        // Create verification record
        await db.from("provider_verifications").insert({
          provider_id: user.id,
          license_status: "pending",
          insurance_status: "pending",
          background_check_status: "pending",
          vehicle_inspection_status: "pending",
        });

        // Create availability record (starts offline)
        await db.from("provider_availability").insert({
          provider_id: user.id,
          status: "offline",
        });

        // Register services
        if (service_types.length > 0) {
          const serviceInserts = service_types.map((st: string) => ({
            provider_id: user.id,
            service_type: st,
            is_enabled: true,
          }));
          await db.from("provider_services").insert(serviceInserts);
        }

        // Notify admins
        const { data: admins } = await db.from("profiles").select("id").eq("role", "admin");
        if (admins) {
          const notifs = admins.map((a: any) => ({
            recipient_id: a.id,
            channel: "push",
            template: "provider_application",
            title: "New Superhero Application",
            body: `New provider application from ${user.email}. Review and approve docs.`,
            sent_at: now,
            metadata_json: { provider_id: user.id },
          }));
          await db.from("notifications").insert(notifs);
        }

        return jsonResponse({
          success: true,
          provider_id: user.id,
          status: "applied",
          message: "Application submitted! Upload your documents next.",
          next_steps: [
            "Upload driver's license",
            "Upload insurance certificate",
            "Upload vehicle inspection photos",
            "Background check will be initiated after document review",
          ],
        }, 201);
      }

      // ════════════════════════════════════════
      // UPLOAD DOCS — Verification documents
      // ════════════════════════════════════════
      case "upload_docs": {
        const { doc_type, doc_url, expiry_date } = body;

        if (!doc_type || !["license", "insurance", "background", "inspection"].includes(doc_type)) {
          return errorResponse("doc_type required: license | insurance | background | inspection");
        }
        if (!doc_url) return errorResponse("doc_url required");

        // Get verification record
        const { data: verification } = await db
          .from("provider_verifications")
          .select("*")
          .eq("provider_id", user.id)
          .single();

        if (!verification) return errorResponse("No verification record. Complete onboarding first.");

        // Update the appropriate field
        const updates: any = {};
        switch (doc_type) {
          case "license":
            updates.license_doc_url = doc_url;
            updates.license_status = "pending"; // Reset to pending for re-review
            if (expiry_date) updates.license_expiry = expiry_date;
            break;
          case "insurance":
            updates.insurance_doc_url = doc_url;
            updates.insurance_status = "pending";
            if (expiry_date) updates.insurance_expiry = expiry_date;
            break;
          case "background":
            updates.background_doc_url = doc_url;
            updates.background_check_status = "pending";
            break;
          case "inspection":
            // Inspection photos are stored as JSON array
            const existingPhotos = verification.inspection_photos_json || [];
            updates.inspection_photos_json = [...existingPhotos, doc_url];
            updates.vehicle_inspection_status = "pending";
            break;
        }

        await db.from("provider_verifications").update(updates).eq("provider_id", user.id);

        // Update onboard status if still 'applied'
        const { data: profile } = await db
          .from("provider_profiles")
          .select("onboard_status")
          .eq("provider_id", user.id)
          .single();

        if (profile?.onboard_status === "applied") {
          await db.from("provider_profiles").update({
            onboard_status: "pending_verification",
          }).eq("provider_id", user.id);
        }

        return jsonResponse({
          success: true,
          doc_type,
          status: "pending",
          message: `${doc_type} document uploaded. Pending admin review.`,
        });
      }

      // ════════════════════════════════════════
      // UPDATE SERVICES — Toggle capabilities
      // ════════════════════════════════════════
      case "update_services": {
        const { services } = body; // [{service_type, is_enabled, pricing_band_json, eta_band_json}]
        if (!services || !Array.isArray(services)) {
          return errorResponse("services array required");
        }

        for (const svc of services) {
          await db.from("provider_services").upsert({
            provider_id: user.id,
            service_type: svc.service_type,
            is_enabled: svc.is_enabled !== false,
            pricing_band_json: svc.pricing_band_json || {},
            eta_band_json: svc.eta_band_json || {},
          }, { onConflict: "provider_id,service_type" });
        }

        return jsonResponse({
          success: true,
          updated: services.length,
          message: "Services updated.",
        });
      }

      // ════════════════════════════════════════
      // UPDATE PROFILE — Edit bio, equipment, radius
      // ════════════════════════════════════════
      case "update_profile": {
        const { bio, equipment, service_radius_miles, base_city, is_female_first_eligible } = body;

        const updates: any = {};
        if (bio !== undefined) updates.bio = bio;
        if (equipment !== undefined) updates.equipment_json = equipment;
        if (service_radius_miles !== undefined) updates.service_radius_miles = service_radius_miles;
        if (base_city !== undefined) updates.base_city = base_city;
        if (is_female_first_eligible !== undefined) updates.is_female_first_eligible = is_female_first_eligible;

        if (Object.keys(updates).length === 0) {
          return errorResponse("No fields to update");
        }

        await db.from("provider_profiles").update(updates).eq("provider_id", user.id);

        return jsonResponse({
          success: true,
          updated_fields: Object.keys(updates),
          message: "Profile updated.",
        });
      }
    }
  } catch (err: any) {
    console.error("provider-onboard error:", err);
    return errorResponse(err.message, 500);
  }
});
