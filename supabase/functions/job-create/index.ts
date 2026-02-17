// ============================================================
// POST /jobs — Create a new rescue/job
// Handles: request_now, schedule, consult_first
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

    const db = getServiceClient();
    const body = await req.json();

    const {
      service_type,
      pickup_lat, pickup_lng, pickup_address,
      dropoff_lat, dropoff_lng, dropoff_address,
      vehicle_id,
      notes,
      scheduled_for,
      female_first_requested = false,
      safe_mode_enabled = false,
    } = body;

    // ── Validate required fields ──
    if (!service_type) return errorResponse("service_type required");
    if (!pickup_lat || !pickup_lng) return errorResponse("pickup location required");

    // ── Get service from catalog ──
    const { data: service, error: svcErr } = await db
      .from("service_catalog")
      .select("*")
      .eq("service_type", service_type)
      .eq("is_active", true)
      .single();

    if (svcErr || !service) return errorResponse(`Service '${service_type}' not found or inactive`, 404);

    // ── Determine mode ──
    const mode = service.mode; // request_now | schedule | consult_first

    // Validate mode-specific requirements
    if (mode === "schedule" && !scheduled_for) {
      return errorResponse("scheduled_for required for schedule mode services");
    }

    // ── Compute initial status ──
    let initialStatus: string;
    switch (mode) {
      case "request_now":
        initialStatus = "created";
        break;
      case "schedule":
        initialStatus = "created"; // Will move to 'scheduled' after confirm
        break;
      case "consult_first":
        initialStatus = "consult_requested";
        break;
      default:
        initialStatus = "created";
    }

    // ── Validate vehicle if provided ──
    if (vehicle_id) {
      const { data: vehicle } = await db
        .from("vehicles")
        .select("id")
        .eq("id", vehicle_id)
        .eq("customer_id", user.id)
        .single();
      if (!vehicle) return errorResponse("Vehicle not found or not owned by you", 404);
    }

    // ── Compute price (for non-quote services) ──
    let priceCents: number | null = null;
    let priceBreakdown: any = null;
    let distanceMiles: number | null = null;

    if (service.pricing_model !== "quote_required") {
      // Calculate distance for tow (base_plus_miles)
      if (service.pricing_model === "base_plus_miles" && dropoff_lat && dropoff_lng) {
        const R = 3959;
        const dLat = (dropoff_lat - pickup_lat) * Math.PI / 180;
        const dLng = (dropoff_lng - pickup_lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(pickup_lat * Math.PI / 180) * Math.cos(dropoff_lat * Math.PI / 180) *
          Math.sin(dLng / 2) ** 2;
        distanceMiles = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distanceMiles = Math.round(distanceMiles * 100) / 100;
      }

      // Check surge
      let surgeMultiplier = 1.0;
      const { data: surges } = await db
        .from("surge_windows")
        .select("multiplier")
        .eq("is_active", true)
        .or(`service_type.eq.${service_type},service_type.is.null`)
        .lte("starts_at", new Date().toISOString())
        .gte("ends_at", new Date().toISOString())
        .order("multiplier", { ascending: false })
        .limit(1);

      if (surges && surges.length > 0) {
        surgeMultiplier = surges[0].multiplier;
      }

      // Calculate price
      const baseFee = service.base_fee_cents || 0;
      const mileageCost = service.pricing_model === "base_plus_miles" && distanceMiles
        ? Math.ceil(distanceMiles * (service.per_mile_cents || 0))
        : 0;

      priceCents = Math.max(
        Math.ceil((baseFee + mileageCost) * surgeMultiplier),
        service.minimum_fee_cents || 0
      );

      priceBreakdown = {
        base_fee: baseFee,
        per_mile: service.per_mile_cents || 0,
        miles_est: distanceMiles || 0,
        mileage_total: mileageCost,
        surge_multiplier: surgeMultiplier,
        surge_amount: Math.ceil((baseFee + mileageCost) * (surgeMultiplier - 1)),
        subtotal: priceCents,
        tax: 0,
        total: priceCents,
      };

      // Check subscription credits
      const { data: activeSub } = await db
        .from("subscriptions")
        .select("id, entitlements_remaining_json")
        .eq("customer_id", user.id)
        .eq("status", "active")
        .single();

      if (activeSub) {
        const remaining = activeSub.entitlements_remaining_json || {};
        const serviceKey = service_type + "s"; // "tows", "jumps", etc.
        if (remaining[serviceKey] && (remaining[serviceKey] > 0 || remaining[serviceKey] === -1)) {
          priceBreakdown.subscription_credit = true;
          priceBreakdown.original_total = priceCents;
          priceCents = 0;
          priceBreakdown.total = 0;
        }
      }
    }

    // ── Compute matching window for scheduled ──
    let matchingWindowStart: string | null = null;
    if (mode === "schedule" && scheduled_for) {
      const scheduledDate = new Date(scheduled_for);
      scheduledDate.setMinutes(scheduledDate.getMinutes() - 45); // 45 min before
      matchingWindowStart = scheduledDate.toISOString();
    }

    // ── Insert job ──
    const { data: job, error: jobErr } = await db
      .from("jobs")
      .insert({
        customer_id: user.id,
        vehicle_id: vehicle_id || null,
        service_type,
        mode,
        status: initialStatus,
        pickup_lat,
        pickup_lng,
        pickup_address: pickup_address || null,
        dropoff_lat: dropoff_lat || null,
        dropoff_lng: dropoff_lng || null,
        dropoff_address: dropoff_address || null,
        distance_miles: distanceMiles,
        scheduled_for: scheduled_for || null,
        matching_window_start: matchingWindowStart,
        price_cents: priceCents,
        price_breakdown_json: priceBreakdown,
        notes: notes || null,
        female_first_requested,
        safe_mode_enabled,
        match_max_attempts: 8,
      })
      .select()
      .single();

    if (jobErr) throw jobErr;

    // ── Log creation event ──
    await logJobEvent(db, job.id, "status_change", user.id, "customer", {
      to: initialStatus,
      service_type,
      mode,
    });

    return jsonResponse({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        mode: job.mode,
        service_type: job.service_type,
        price_cents: job.price_cents,
        price_breakdown: job.price_breakdown_json,
        pickup_address: job.pickup_address,
        dropoff_address: job.dropoff_address,
        scheduled_for: job.scheduled_for,
        eta_range: service.eta_range_json,
      },
    }, 201);
  } catch (err: any) {
    console.error("job-create error:", err);
    return errorResponse(err.message, 500);
  }
});
