// ============================================================
// S.O.S EDGE FUNCTIONS — SHARED UTILITIES
// File: supabase/functions/_shared/utils.ts
// Import in each function: import { ... } from "../_shared/utils.ts";
// ============================================================

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}

export function optionsResponse() {
  return new Response("ok", { headers: corsHeaders });
}

/** Service-role client — full access, bypasses RLS */
export function getServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/** Get authenticated user from request Authorization header */
export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

/** Log a job event (immutable) */
export async function logJobEvent(
  db: SupabaseClient,
  jobId: string,
  eventType: string,
  actorId?: string,
  actorRole?: string,
  payload?: Record<string, any>
) {
  await db.from("job_events").insert({
    job_id: jobId,
    event_type: eventType,
    actor_id: actorId || null,
    actor_role: actorRole || null,
    payload_json: payload || {},
  });
}

/** Check if user is admin */
export async function isAdmin(db: SupabaseClient, userId: string) {
  const { data } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return data?.role === "admin";
}

/** Check if user is the assigned provider for a job */
export async function isAssignedProvider(
  db: SupabaseClient,
  jobId: string,
  userId: string
) {
  const { data } = await db
    .from("job_assignments")
    .select("provider_id")
    .eq("job_id", jobId)
    .single();
  return data?.provider_id === userId;
}

/** Haversine distance in miles between two lat/lng points */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

/** Estimated ETA in minutes from distance in miles (avg 30mph city driving) */
export function estimateETA(distanceMiles: number): number {
  return Math.ceil(distanceMiles * 2); // ~30mph avg
}
