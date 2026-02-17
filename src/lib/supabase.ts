import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hgribqgyzzsxgyfvooaf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Edge Function Helpers ──

export async function callEdgeFunction(functionName: string, body: any) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || supabaseAnonKey}`,
      'apikey': supabaseAnonKey,
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// ── Typed API Functions ──

// Customer
export const createJob = (data: any) => callEdgeFunction('job-create', data);
export const confirmJob = (jobId: string) => callEdgeFunction('payments-authorize', { job_id: jobId });
export const startMatching = (jobId: string, manualProviderId?: string) =>
  callEdgeFunction('match-provider', { job_id: jobId, manual_provider_id: manualProviderId });
export const cancelJob = (jobId: string, reason?: string) =>
  callEdgeFunction('job-cancel', { job_id: jobId, reason });
export const jobSafety = (jobId: string, action: string, data?: any) =>
  callEdgeFunction('job-safety', { job_id: jobId, action, ...data });
export const rateJob = (jobId: string, rating: number, review?: string, tipCents?: number) =>
  callEdgeFunction('job-rate-tip', { job_id: jobId, rating, review, tip_cents: tipCents });

// Provider
export const providerOnboard = (data: any) =>
  callEdgeFunction('provider-onboard', { action: 'onboard', ...data });
export const providerUploadDoc = (docType: string, docUrl: string, expiryDate?: string) =>
  callEdgeFunction('provider-onboard', { action: 'upload_docs', doc_type: docType, doc_url: docUrl, expiry_date: expiryDate });
export const setProviderAvailability = (status: string, lat?: number, lng?: number) =>
  callEdgeFunction('provider-availability', { action: 'set_status', status, lat, lng });
export const pingProviderLocation = (lat: number, lng: number, jobId?: string, heading?: number, speed?: number) =>
  callEdgeFunction('provider-availability', { action: 'ping_location', lat, lng, job_id: jobId, heading, speed });
export const setProviderEnRoute = (jobId: string) =>
  callEdgeFunction('provider-availability', { action: 'en_route', job_id: jobId });
export const respondToOffer = (offerId: string, action: 'accept' | 'decline', reason?: string) =>
  callEdgeFunction('offer-respond', { offer_id: offerId, action, decline_reason: reason });
export const providerJobProgress = (jobId: string, action: 'arrived' | 'start' | 'complete', data?: any) =>
  callEdgeFunction('provider-job-progress', { job_id: jobId, action, ...data });

// ── Realtime Subscriptions ──

export function subscribeToJob(jobId: string, onUpdate: (payload: any) => void) {
  return supabase
    .channel(`job-${jobId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'jobs',
      filter: `id=eq.${jobId}`,
    }, onUpdate)
    .subscribe();
}

export function subscribeToJobEvents(jobId: string, onEvent: (payload: any) => void) {
  return supabase
    .channel(`job-events-${jobId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'job_events',
      filter: `job_id=eq.${jobId}`,
    }, onEvent)
    .subscribe();
}

export function subscribeToProviderLocation(jobId: string, onLocation: (payload: any) => void) {
  return supabase
    .channel(`provider-loc-${jobId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'provider_locations',
      filter: `job_id=eq.${jobId}`,
    }, onLocation)
    .subscribe();
}

export function subscribeToOffers(providerId: string, onOffer: (payload: any) => void) {
  return supabase
    .channel(`offers-${providerId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'job_offers',
      filter: `provider_id=eq.${providerId}`,
    }, onOffer)
    .subscribe();
}

// ── Status Label Map ──
export const STATUS_LABELS: Record<string, string> = {
  created: 'Getting Ready',
  requested: 'Request Sent',
  matching: 'Finding a Superhero…',
  offered: 'Finding a Superhero…',
  assigned: 'Superhero Accepted!',
  en_route: 'Superhero En Route',
  on_site: 'Superhero On Site',
  in_progress: 'Rescue In Progress',
  completed: 'Rescue Complete ✅',
  scheduled: 'Scheduled',
  matching_at_window: 'Preparing Dispatch',
  consult_requested: 'Consult Requested',
  consult_assigned: 'Specialist Assigned',
  consult_completed: 'Consult Complete',
  quote_sent: 'Quote Ready',
  quote_accepted: 'Quote Accepted',
  canceled_by_user: 'Canceled',
  canceled_by_provider: 'Provider Canceled',
  no_provider_found: 'No Superhero Available',
  expired: 'Expired',
  refunded: 'Refunded',
  disputed: 'Under Review',
};
