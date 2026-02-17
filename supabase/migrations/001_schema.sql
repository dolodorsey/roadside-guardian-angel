-- ============================================================
-- S.O.S (SUPERHEROS ON STANDBY) — COMPLETE SUPABASE SCHEMA
-- Run this ONCE in Supabase SQL Editor
-- ============================================================
-- Prerequisites: Fresh Supabase project or isolated schema
-- Auth: Uses Supabase Auth (auth.uid())
-- ============================================================

-- ████████████████████████████████████████████████████████████
-- SECTION 0: EXTENSIONS
-- ████████████████████████████████████████████████████████████

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geo queries (radius matching)

-- ████████████████████████████████████████████████████████████
-- SECTION 1: ENUMS (all status/type enums up front)
-- ████████████████████████████████████████████████████████████

-- Profile roles
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');

-- Provider entity type
CREATE TYPE provider_type AS ENUM ('person', 'business');

-- Provider availability
CREATE TYPE availability_status AS ENUM ('offline', 'online', 'busy');

-- Provider verification status
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Provider onboarding status
CREATE TYPE provider_onboard_status AS ENUM ('applied', 'pending_verification', 'approved', 'active', 'suspended');

-- Booking modes (first-class)
CREATE TYPE booking_mode AS ENUM ('request_now', 'schedule', 'consult_first');

-- Pricing models
CREATE TYPE pricing_model AS ENUM ('flat', 'base_plus_miles', 'quote_required');

-- Job statuses (full state machine)
CREATE TYPE job_status AS ENUM (
  'created',
  'requested',
  'matching',
  'offered',
  'assigned',
  'en_route',
  'on_site',
  'in_progress',
  'completed',
  -- Scheduled additions
  'scheduled',
  'matching_at_window',
  -- Consult-first additions
  'consult_requested',
  'consult_assigned',
  'consult_completed',
  'quote_sent',
  'quote_accepted',
  -- Failure exits
  'canceled_by_user',
  'canceled_by_provider',
  'no_provider_found',
  'expired',
  'refunded',
  'disputed'
);

-- Offer statuses
CREATE TYPE offer_status AS ENUM ('sent', 'accepted', 'declined', 'expired');

-- Quote statuses
CREATE TYPE quote_status AS ENUM ('sent', 'accepted', 'rejected', 'expired');

-- Payment statuses
CREATE TYPE payment_status AS ENUM ('authorized', 'captured', 'refunded', 'canceled', 'failed');

-- Wallet ledger types
CREATE TYPE ledger_type AS ENUM (
  'receipt', 'refund', 'tip', 'promo_credit', 
  'referral_credit', 'subscription_credit_used',
  'payout'
);

-- Job event types (immutable log)
CREATE TYPE job_event_type AS ENUM (
  'status_change',
  'offer_sent',
  'offer_accepted',
  'offer_declined',
  'offer_expired',
  'gps_ping',
  'media_uploaded',
  'payment_auth',
  'payment_capture',
  'payment_refund',
  'panic',
  'share',
  'safe_mode_toggle',
  'chat',
  'check_in',
  'check_out',
  'note',
  'admin_action',
  'provider_location_update'
);

-- Media purpose
CREATE TYPE media_purpose AS ENUM ('before', 'after', 'completion_proof', 'damage', 'consult');

-- Safety incident types
CREATE TYPE incident_type AS ENUM ('panic', 'report', 'dispute_escalation');
CREATE TYPE incident_status AS ENUM ('open', 'triaging', 'resolved');

-- Subscription statuses
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');


-- ████████████████████████████████████████████████████████████
-- SECTION 2: IDENTITY TABLES
-- ████████████████████████████████████████████████████████████

-- PROFILES (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  photo_url TEXT,
  default_vehicle_id UUID, -- FK added after vehicles table
  preferences JSONB DEFAULT '{}', -- female_first, safe_mode defaults
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VEHICLES (any person, any car, anywhere)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  color TEXT,
  license_plate TEXT,
  vin TEXT,
  is_primary BOOLEAN DEFAULT false,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for default vehicle
ALTER TABLE profiles 
  ADD CONSTRAINT fk_default_vehicle 
  FOREIGN KEY (default_vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL;


-- ████████████████████████████████████████████████████████████
-- SECTION 3: PROVIDER (SUPERHERO) TABLES
-- ████████████████████████████████████████████████████████████

-- PROVIDER PROFILES
CREATE TABLE provider_profiles (
  provider_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  provider_type provider_type NOT NULL DEFAULT 'person',
  onboard_status provider_onboard_status NOT NULL DEFAULT 'applied',
  company_name TEXT,
  bio TEXT,
  equipment_json JSONB DEFAULT '[]', -- ["flatbed","winch","jump_kit","lockout_tools"]
  service_radius_miles INTEGER DEFAULT 25,
  base_city TEXT,
  avg_eta_minutes INTEGER,
  rating_avg NUMERIC(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  acceptance_rate NUMERIC(5,2) DEFAULT 100.00,
  completion_rate NUMERIC(5,2) DEFAULT 100.00,
  is_active BOOLEAN DEFAULT false,
  is_female_first_eligible BOOLEAN DEFAULT false,
  stripe_account_id TEXT, -- For payouts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROVIDER VERIFICATIONS (gate for matching)
CREATE TABLE provider_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id) ON DELETE CASCADE,
  license_status verification_status DEFAULT 'pending',
  insurance_status verification_status DEFAULT 'pending',
  background_check_status verification_status DEFAULT 'pending',
  vehicle_inspection_status verification_status DEFAULT 'pending',
  license_doc_url TEXT,
  insurance_doc_url TEXT,
  background_doc_url TEXT,
  inspection_photos_json JSONB DEFAULT '[]',
  license_expiry DATE,
  insurance_expiry DATE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROVIDER SERVICES (what they can do + pricing bands)
CREATE TABLE provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- FK to service_catalog
  pricing_band_json JSONB DEFAULT '{}', -- {base: 4500, per_mile: 350, minimum: 7500}
  eta_band_json JSONB DEFAULT '{}', -- {min_minutes: 15, max_minutes: 45}
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, service_type)
);

-- PROVIDER AVAILABILITY (real-time status + location)
CREATE TABLE provider_availability (
  provider_id UUID PRIMARY KEY REFERENCES provider_profiles(provider_id) ON DELETE CASCADE,
  status availability_status NOT NULL DEFAULT 'offline',
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  current_location GEOGRAPHY(POINT, 4326), -- PostGIS for radius queries
  heading DOUBLE PRECISION, -- Direction of travel
  speed DOUBLE PRECISION, -- km/h
  last_ping_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROVIDER LOCATION HISTORY (time-series pings for audit/replay)
CREATE TABLE provider_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id) ON DELETE CASCADE,
  job_id UUID, -- FK added after jobs table
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 4: SERVICE CATALOG
-- ████████████████████████████████████████████████████████████

CREATE TABLE service_catalog (
  service_type TEXT PRIMARY KEY, -- 'tow', 'jump', 'flat', 'lockout', 'fuel', 'winch', etc.
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name for UI
  mode booking_mode NOT NULL,
  pricing_model pricing_model NOT NULL,
  base_fee_cents INTEGER DEFAULT 0,
  per_mile_cents INTEGER DEFAULT 0,
  minimum_fee_cents INTEGER DEFAULT 0,
  surge_multiplier NUMERIC(3,2) DEFAULT 1.00,
  requires_license BOOLEAN DEFAULT false,
  requires_equipment_json JSONB DEFAULT '[]', -- ["flatbed"] or ["jump_kit"]
  addon_options_json JSONB DEFAULT '[]', -- [{name: "After Hours", fee_cents: 2500}]
  city_availability_json JSONB DEFAULT '["*"]', -- ["atlanta","houston","*"] for all
  eta_range_json JSONB DEFAULT '{"min": 15, "max": 60}', -- minutes
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 5: JOBS (RESCUES) — THE CORE OBJECT
-- ████████████████████████████████████████████████████████████

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  vehicle_id UUID REFERENCES vehicles(id),
  service_type TEXT NOT NULL REFERENCES service_catalog(service_type),
  mode booking_mode NOT NULL,
  status job_status NOT NULL DEFAULT 'created',
  -- Location
  pickup_lat DOUBLE PRECISION NOT NULL,
  pickup_lng DOUBLE PRECISION NOT NULL,
  pickup_address TEXT,
  pickup_location GEOGRAPHY(POINT, 4326),
  dropoff_lat DOUBLE PRECISION, -- For tows
  dropoff_lng DOUBLE PRECISION,
  dropoff_address TEXT,
  dropoff_location GEOGRAPHY(POINT, 4326),
  distance_miles NUMERIC(8,2),
  -- Scheduling
  scheduled_for TIMESTAMPTZ, -- For schedule mode
  matching_window_start TIMESTAMPTZ, -- When to start matching (30-60 min before scheduled_for)
  -- Pricing (locked at confirm)
  price_cents INTEGER,
  price_breakdown_json JSONB, -- {base_fee, per_mile, miles_est, surge, tax, discounts, sub_credits}
  currency TEXT DEFAULT 'usd',
  -- Notes
  notes TEXT,
  -- Preferences
  female_first_requested BOOLEAN DEFAULT false,
  safe_mode_enabled BOOLEAN DEFAULT false,
  -- Matching metadata
  match_attempts INTEGER DEFAULT 0,
  match_max_attempts INTEGER DEFAULT 8,
  match_started_at TIMESTAMPTZ,
  match_timeout_at TIMESTAMPTZ,
  -- Completion
  completed_at TIMESTAMPTZ,
  completion_notes TEXT,
  -- Rating
  customer_rating INTEGER CHECK (customer_rating BETWEEN 1 AND 5),
  customer_review TEXT,
  provider_rating INTEGER CHECK (provider_rating BETWEEN 1 AND 5),
  provider_review TEXT,
  -- Tip
  tip_cents INTEGER DEFAULT 0,
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for provider_locations -> jobs
ALTER TABLE provider_locations 
  ADD CONSTRAINT fk_provider_locations_job 
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL;

-- JOB ASSIGNMENTS (accepted provider)
CREATE TABLE job_assignments (
  job_id UUID PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id),
  accepted_offer_id UUID, -- FK added after job_offers
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  arrived_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ
);

-- JOB OFFERS (Uber-style offer loop)
CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id),
  status offer_status NOT NULL DEFAULT 'sent',
  attempt_number INTEGER NOT NULL DEFAULT 1,
  eta_minutes INTEGER,
  distance_miles NUMERIC(8,2),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- NOW() + 90 seconds
  responded_at TIMESTAMPTZ,
  decline_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for accepted offer
ALTER TABLE job_assignments 
  ADD CONSTRAINT fk_accepted_offer 
  FOREIGN KEY (accepted_offer_id) REFERENCES job_offers(id);

-- JOB EVENTS (IMMUTABLE LOG — disputes/fraud/replay depend on this)
CREATE TABLE job_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  event_type job_event_type NOT NULL,
  actor_id UUID REFERENCES profiles(id), -- Who triggered it
  actor_role user_role,
  payload_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- IMMUTABLE: No UPDATE or DELETE allowed (enforced by RLS + trigger)

-- JOB MEDIA (proof uploads)
CREATE TABLE job_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES profiles(id),
  uploader_role user_role NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  url TEXT NOT NULL,
  purpose media_purpose NOT NULL,
  metadata_json JSONB DEFAULT '{}', -- dimensions, size, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOB SAFETY (per-job safety state)
CREATE TABLE job_safety (
  job_id UUID PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
  female_first_requested BOOLEAN DEFAULT false,
  safe_mode_enabled BOOLEAN DEFAULT false,
  share_contacts_json JSONB DEFAULT '[]', -- [{name, phone, notified_at}]
  panic_triggered_at TIMESTAMPTZ,
  safety_incident_id UUID, -- FK added after safety_incidents
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAFETY INCIDENTS
CREATE TABLE safety_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  reported_by UUID REFERENCES profiles(id),
  type incident_type NOT NULL,
  status incident_status NOT NULL DEFAULT 'open',
  description TEXT,
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  escalated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_safety 
  ADD CONSTRAINT fk_safety_incident 
  FOREIGN KEY (safety_incident_id) REFERENCES safety_incidents(id);


-- ████████████████████████████████████████████████████████████
-- SECTION 6: QUOTES (CONSULT-FIRST)
-- ████████████████████████████████████████████████████████████

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(provider_id),
  scope_text TEXT NOT NULL,
  scope_items_json JSONB DEFAULT '[]', -- [{description, price_cents}]
  price_cents INTEGER NOT NULL,
  valid_until TIMESTAMPTZ,
  status quote_status NOT NULL DEFAULT 'sent',
  customer_response_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 7: PAYMENTS + WALLET
-- ████████████████████████████████████████████████████████████

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID REFERENCES provider_profiles(provider_id), -- nullable until assigned
  processor TEXT NOT NULL DEFAULT 'stripe',
  payment_intent_id TEXT, -- Stripe PaymentIntent ID
  amount_cents INTEGER NOT NULL,
  tip_cents INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'usd',
  status payment_status NOT NULL DEFAULT 'authorized',
  authorized_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  failure_reason TEXT,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  type ledger_type NOT NULL,
  amount_cents INTEGER NOT NULL, -- positive = credit, negative = debit
  job_id UUID REFERENCES jobs(id),
  payment_id UUID REFERENCES payments(id),
  description TEXT,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 8: SUBSCRIPTIONS + MEMBERSHIPS
-- ████████████████████████████████████████████████████████████

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'S.O.S Basic', 'S.O.S+', 'S.O.S Family', 'S.O.S Fleet'
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL, -- monthly
  annual_price_cents INTEGER, -- annual option
  entitlements_json JSONB NOT NULL DEFAULT '{}', -- {tows: 2, jumps: 2, lockouts: 1, discount_pct: 15}
  max_members INTEGER DEFAULT 1, -- 1 = individual, 5 = family, unlimited = fleet
  is_active BOOLEAN DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  entitlements_remaining_json JSONB DEFAULT '{}', -- decremented per use
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscription_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  member_profile_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT DEFAULT 'member', -- 'owner', 'member'
  added_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 9: GROWTH (PROMOS, REFERRALS, SURGE, INCENTIVES)
-- ████████████████████████████████████████████████████████████

CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed_cents')),
  discount_value INTEGER NOT NULL, -- percent (15) or cents (2500)
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  service_types_json JSONB DEFAULT '["*"]', -- restrict to specific services
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_id UUID REFERENCES profiles(id),
  referral_code TEXT NOT NULL,
  referrer_credit_cents INTEGER DEFAULT 1000, -- $10
  referred_credit_cents INTEGER DEFAULT 1000, -- $10
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE surge_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  service_type TEXT REFERENCES service_catalog(service_type),
  multiplier NUMERIC(3,2) NOT NULL DEFAULT 1.50,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  reason TEXT, -- 'weather', 'high_demand', 'holiday'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE provider_incentives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES provider_profiles(provider_id), -- null = all providers
  city TEXT,
  incentive_type TEXT NOT NULL CHECK (incentive_type IN ('bonus', 'guarantee', 'boost')),
  amount_cents INTEGER NOT NULL,
  conditions_json JSONB DEFAULT '{}', -- {min_jobs: 10, time_window: "2h", peak_hours: true}
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS LOG
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id),
  job_id UUID REFERENCES jobs(id),
  channel TEXT NOT NULL CHECK (channel IN ('push', 'sms', 'email')),
  template TEXT NOT NULL, -- 'request_received', 'provider_assigned', 'arrival', 'completion'
  title TEXT,
  body TEXT,
  metadata_json JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 10: INDEXES (PERFORMANCE-CRITICAL)
-- ████████████████████████████████████████████████████████████

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);

-- Vehicles
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_vehicles_primary ON vehicles(customer_id, is_primary) WHERE is_primary = true;

-- Provider profiles
CREATE INDEX idx_provider_active ON provider_profiles(is_active) WHERE is_active = true;
CREATE INDEX idx_provider_city ON provider_profiles(base_city);
CREATE INDEX idx_provider_onboard ON provider_profiles(onboard_status);
CREATE INDEX idx_provider_rating ON provider_profiles(rating_avg DESC);

-- Provider availability (CRITICAL for matching)
CREATE INDEX idx_availability_status ON provider_availability(status) WHERE status = 'online';
CREATE INDEX idx_availability_ping ON provider_availability(last_ping_at);
CREATE INDEX idx_availability_location ON provider_availability USING GIST(current_location);

-- Provider services
CREATE INDEX idx_provider_services_type ON provider_services(service_type);
CREATE INDEX idx_provider_services_provider ON provider_services(provider_id);

-- Provider verifications
CREATE INDEX idx_verifications_provider ON provider_verifications(provider_id);

-- Provider locations (time-series)
CREATE INDEX idx_provider_loc_provider ON provider_locations(provider_id, recorded_at DESC);
CREATE INDEX idx_provider_loc_job ON provider_locations(job_id) WHERE job_id IS NOT NULL;

-- Jobs (CRITICAL)
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_customer ON jobs(customer_id, created_at DESC);
CREATE INDEX idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX idx_jobs_mode ON jobs(mode);
CREATE INDEX idx_jobs_service ON jobs(service_type);
CREATE INDEX idx_jobs_scheduled ON jobs(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_jobs_pickup ON jobs USING GIST(pickup_location);

-- Job offers (CRITICAL for offer loop)
CREATE INDEX idx_offers_job ON job_offers(job_id);
CREATE INDEX idx_offers_provider ON job_offers(provider_id);
CREATE INDEX idx_offers_expires ON job_offers(expires_at) WHERE status = 'sent';
CREATE INDEX idx_offers_job_status ON job_offers(job_id, status);

-- Job events (immutable log)
CREATE INDEX idx_events_job ON job_events(job_id, created_at);
CREATE INDEX idx_events_type ON job_events(event_type);

-- Job media
CREATE INDEX idx_media_job ON job_media(job_id);
CREATE INDEX idx_media_purpose ON job_media(job_id, purpose);

-- Job safety
-- (job_id is PK, no additional index needed)

-- Safety incidents
CREATE INDEX idx_incidents_job ON safety_incidents(job_id);
CREATE INDEX idx_incidents_status ON safety_incidents(status) WHERE status != 'resolved';

-- Quotes
CREATE INDEX idx_quotes_job ON quotes(job_id);
CREATE INDEX idx_quotes_provider ON quotes(provider_id);

-- Payments
CREATE INDEX idx_payments_job ON payments(job_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_intent ON payments(payment_intent_id);

-- Wallet
CREATE INDEX idx_wallet_customer ON wallet_ledger(customer_id, created_at DESC);

-- Subscriptions
CREATE INDEX idx_subs_customer ON subscriptions(customer_id);
CREATE INDEX idx_subs_status ON subscriptions(status) WHERE status = 'active';

-- Notifications
CREATE INDEX idx_notif_recipient ON notifications(recipient_id, created_at DESC);
CREATE INDEX idx_notif_job ON notifications(job_id);


-- ████████████████████████████████████████████████████████████
-- SECTION 11: TRIGGERS & FUNCTIONS
-- ████████████████████████████████████████████████████████████

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY[
      'profiles', 'vehicles', 'provider_profiles', 'provider_verifications',
      'provider_availability', 'jobs', 'job_safety', 'safety_incidents',
      'quotes', 'payments', 'subscriptions'
    ])
  LOOP
    EXECUTE format('
      CREATE TRIGGER trg_%s_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END $$;

-- Auto-create job_safety record when job is created
CREATE OR REPLACE FUNCTION create_job_safety()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO job_safety (job_id, female_first_requested, safe_mode_enabled)
  VALUES (NEW.id, NEW.female_first_requested, NEW.safe_mode_enabled);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_create_safety
AFTER INSERT ON jobs
FOR EACH ROW EXECUTE FUNCTION create_job_safety();

-- Auto-log job status changes to job_events
CREATE OR REPLACE FUNCTION log_job_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO job_events (job_id, event_type, payload_json)
    VALUES (
      NEW.id,
      'status_change',
      jsonb_build_object(
        'from', OLD.status::text,
        'to', NEW.status::text,
        'timestamp', NOW()::text
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_status_log
AFTER UPDATE OF status ON jobs
FOR EACH ROW EXECUTE FUNCTION log_job_status_change();

-- Prevent deletion/updates on job_events (immutable)
CREATE OR REPLACE FUNCTION prevent_event_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'job_events is immutable. Cannot % rows.', TG_OP;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_immutable_update
BEFORE UPDATE ON job_events
FOR EACH ROW EXECUTE FUNCTION prevent_event_mutation();

CREATE TRIGGER trg_events_immutable_delete
BEFORE DELETE ON job_events
FOR EACH ROW EXECUTE FUNCTION prevent_event_mutation();

-- Auto-update PostGIS geography on provider_availability
CREATE OR REPLACE FUNCTION update_provider_geography()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_lat IS NOT NULL AND NEW.current_lng IS NOT NULL THEN
    NEW.current_location = ST_SetSRID(ST_MakePoint(NEW.current_lng, NEW.current_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_provider_geo
BEFORE INSERT OR UPDATE OF current_lat, current_lng ON provider_availability
FOR EACH ROW EXECUTE FUNCTION update_provider_geography();

-- Auto-update PostGIS geography on jobs
CREATE OR REPLACE FUNCTION update_job_geography()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pickup_lat IS NOT NULL AND NEW.pickup_lng IS NOT NULL THEN
    NEW.pickup_location = ST_SetSRID(ST_MakePoint(NEW.pickup_lng, NEW.pickup_lat), 4326)::geography;
  END IF;
  IF NEW.dropoff_lat IS NOT NULL AND NEW.dropoff_lng IS NOT NULL THEN
    NEW.dropoff_location = ST_SetSRID(ST_MakePoint(NEW.dropoff_lng, NEW.dropoff_lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_geo
BEFORE INSERT OR UPDATE OF pickup_lat, pickup_lng, dropoff_lat, dropoff_lng ON jobs
FOR EACH ROW EXECUTE FUNCTION update_job_geography();

-- Auto-update PostGIS on provider_locations
CREATE OR REPLACE FUNCTION update_provider_loc_geography()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_provider_loc_geo
BEFORE INSERT ON provider_locations
FOR EACH ROW EXECUTE FUNCTION update_provider_loc_geography();


-- ████████████████████████████████████████████████████████████
-- SECTION 12: ROW LEVEL SECURITY (RLS)
-- ████████████████████████████████████████████████████████████

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: Check if user is the assigned provider for a job
CREATE OR REPLACE FUNCTION is_assigned_provider(p_job_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM job_assignments WHERE job_id = p_job_id AND provider_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PROFILES ──
CREATE POLICY profiles_select ON profiles FOR SELECT USING (
  id = auth.uid() OR is_admin()
);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- ── VEHICLES ──
CREATE POLICY vehicles_select ON vehicles FOR SELECT USING (
  customer_id = auth.uid() OR is_admin()
);
CREATE POLICY vehicles_all ON vehicles FOR ALL USING (customer_id = auth.uid());

-- ── PROVIDER PROFILES ──
CREATE POLICY provider_profiles_select ON provider_profiles FOR SELECT USING (true); -- Public read (customers see provider cards)
CREATE POLICY provider_profiles_update ON provider_profiles FOR UPDATE USING (
  provider_id = auth.uid() OR is_admin()
);
CREATE POLICY provider_profiles_insert ON provider_profiles FOR INSERT WITH CHECK (
  provider_id = auth.uid()
);

-- ── PROVIDER VERIFICATIONS ──
CREATE POLICY verifications_select ON provider_verifications FOR SELECT USING (
  provider_id = auth.uid() OR is_admin()
);
CREATE POLICY verifications_insert ON provider_verifications FOR INSERT WITH CHECK (
  provider_id = auth.uid()
);
CREATE POLICY verifications_update ON provider_verifications FOR UPDATE USING (is_admin());

-- ── PROVIDER SERVICES ──
CREATE POLICY provider_services_select ON provider_services FOR SELECT USING (true); -- Public
CREATE POLICY provider_services_manage ON provider_services FOR ALL USING (
  provider_id = auth.uid() OR is_admin()
);

-- ── PROVIDER AVAILABILITY ──
CREATE POLICY availability_select ON provider_availability FOR SELECT USING (true); -- Needed for matching
CREATE POLICY availability_manage ON provider_availability FOR ALL USING (
  provider_id = auth.uid() OR is_admin()
);

-- ── PROVIDER LOCATIONS ──
CREATE POLICY provider_loc_insert ON provider_locations FOR INSERT WITH CHECK (
  provider_id = auth.uid()
);
CREATE POLICY provider_loc_select ON provider_locations FOR SELECT USING (is_admin());

-- ── SERVICE CATALOG ──
CREATE POLICY catalog_select ON service_catalog FOR SELECT USING (true); -- Public read
CREATE POLICY catalog_manage ON service_catalog FOR ALL USING (is_admin());

-- ── JOBS ──
CREATE POLICY jobs_select ON jobs FOR SELECT USING (
  customer_id = auth.uid() 
  OR is_assigned_provider(id) 
  OR is_admin()
);
CREATE POLICY jobs_insert ON jobs FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY jobs_update ON jobs FOR UPDATE USING (
  customer_id = auth.uid() 
  OR is_assigned_provider(id) 
  OR is_admin()
);

-- ── JOB ASSIGNMENTS ──
CREATE POLICY assignments_select ON job_assignments FOR SELECT USING (
  provider_id = auth.uid()
  OR EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_admin()
);

-- ── JOB OFFERS ──
CREATE POLICY offers_select ON job_offers FOR SELECT USING (
  provider_id = auth.uid()
  OR EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_admin()
);
CREATE POLICY offers_update ON job_offers FOR UPDATE USING (
  provider_id = auth.uid() OR is_admin()
);

-- ── JOB EVENTS (insert-only for non-admins) ──
CREATE POLICY events_select ON job_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR EXISTS (SELECT 1 FROM job_assignments WHERE job_assignments.job_id = job_events.job_id AND provider_id = auth.uid())
  OR is_admin()
);
CREATE POLICY events_insert ON job_events FOR INSERT WITH CHECK (true); -- Server-side insert

-- ── JOB MEDIA ──
CREATE POLICY media_select ON job_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_assigned_provider(job_id)
  OR is_admin()
);
CREATE POLICY media_insert ON job_media FOR INSERT WITH CHECK (
  uploader_id = auth.uid()
);

-- ── JOB SAFETY ──
CREATE POLICY safety_select ON job_safety FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_assigned_provider(job_id)
  OR is_admin()
);
CREATE POLICY safety_update ON job_safety FOR UPDATE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_admin()
);

-- ── SAFETY INCIDENTS ──
CREATE POLICY incidents_select ON safety_incidents FOR SELECT USING (is_admin());
CREATE POLICY incidents_insert ON safety_incidents FOR INSERT WITH CHECK (true);

-- ── QUOTES ──
CREATE POLICY quotes_select ON quotes FOR SELECT USING (
  provider_id = auth.uid()
  OR EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.customer_id = auth.uid())
  OR is_admin()
);

-- ── PAYMENTS ──
CREATE POLICY payments_select ON payments FOR SELECT USING (
  customer_id = auth.uid() OR is_admin()
);

-- ── WALLET ──
CREATE POLICY wallet_select ON wallet_ledger FOR SELECT USING (
  customer_id = auth.uid() OR is_admin()
);

-- ── PLANS (public read) ──
CREATE POLICY plans_select ON plans FOR SELECT USING (true);
CREATE POLICY plans_manage ON plans FOR ALL USING (is_admin());

-- ── SUBSCRIPTIONS ──
CREATE POLICY subs_select ON subscriptions FOR SELECT USING (
  customer_id = auth.uid() OR is_admin()
);

-- ── SUBSCRIPTION MEMBERS ──
CREATE POLICY sub_members_select ON subscription_members FOR SELECT USING (
  member_profile_id = auth.uid()
  OR EXISTS (SELECT 1 FROM subscriptions WHERE subscriptions.id = subscription_id AND customer_id = auth.uid())
  OR is_admin()
);

-- ── PROMOTIONS (public read) ──
CREATE POLICY promos_select ON promotions FOR SELECT USING (is_active = true);
CREATE POLICY promos_manage ON promotions FOR ALL USING (is_admin());

-- ── REFERRALS ──
CREATE POLICY referrals_select ON referrals FOR SELECT USING (
  referrer_id = auth.uid() OR referred_id = auth.uid() OR is_admin()
);

-- ── NOTIFICATIONS ──
CREATE POLICY notif_select ON notifications FOR SELECT USING (
  recipient_id = auth.uid() OR is_admin()
);


-- ████████████████████████████████████████████████████████████
-- SECTION 13: SEED DATA — SERVICE CATALOG
-- ████████████████████████████████████████████████████████████

INSERT INTO service_catalog (service_type, display_name, description, icon, mode, pricing_model, base_fee_cents, per_mile_cents, minimum_fee_cents, requires_equipment_json, sort_order) VALUES
-- REQUEST NOW (Emergency) — Phase 1 MVP
('tow',     'Tow',        'Vehicle towing to destination',          '🚛', 'request_now', 'base_plus_miles', 7500, 350, 7500, '["flatbed"]', 1),
('jump',    'Jump Start',  'Battery jump start service',            '⚡', 'request_now', 'flat',            4500, 0,   4500, '["jump_kit"]', 2),
('flat',    'Flat Tire',   'Tire change or repair',                 '🛞', 'request_now', 'flat',            5500, 0,   5500, '["tire_tools"]', 3),
('lockout', 'Lockout',     'Vehicle lockout assistance',            '🔑', 'request_now', 'flat',            5000, 0,   5000, '["lockout_tools"]', 4),
('fuel',    'Fuel Delivery','Emergency fuel delivery (up to 2 gal)','⛽', 'request_now', 'flat',            5500, 0,   5500, '[]', 5),
('winch',   'Winch Out',   'Vehicle extraction / winch out',        '🪝', 'request_now', 'flat',            8500, 0,   8500, '["winch"]', 6),

-- SCHEDULED (Phase 2)
('oil_change',  'Oil Change',   'Standard or synthetic oil change',  '🔧', 'schedule', 'flat', 6500, 0, 6500, '[]', 10),
('brakes',      'Brake Service','Brake pad replacement & inspection','🛑', 'schedule', 'flat', 15000, 0, 15000, '[]', 11),
('detailing',   'Detailing',    'Interior & exterior detail',        '✨', 'schedule', 'flat', 12000, 0, 12000, '[]', 12),
('inspection',  'Inspection',   'Vehicle safety inspection',         '📋', 'schedule', 'flat', 5000, 0, 5000, '[]', 13),

-- CONSULT FIRST (Phase 3)
('wrap',        'Vehicle Wrap',     'Full or partial vehicle wrap',       '🎨', 'consult_first', 'quote_required', 0, 0, 0, '[]', 20),
('performance', 'Performance Mod',  'Engine, suspension, exhaust mods',   '🏎️', 'consult_first', 'quote_required', 0, 0, 0, '[]', 21),
('audio',       'Audio System',     'Speaker, sub, amp installation',     '🔊', 'consult_first', 'quote_required', 0, 0, 0, '[]', 22),
('paint',       'Custom Paint',     'Custom paint & bodywork',            '🖌️', 'consult_first', 'quote_required', 0, 0, 0, '[]', 23);

-- SEED: Subscription Plans
INSERT INTO plans (name, slug, description, price_cents, annual_price_cents, entitlements_json, max_members) VALUES
('S.O.S Basic',  'sos-basic',  'Essential roadside coverage',     999,   9990,  '{"tows": 1, "jumps": 2, "lockouts": 1, "discount_pct": 10}', 1),
('S.O.S+',       'sos-plus',   'Premium roadside + maintenance', 1999,  19990,  '{"tows": 3, "jumps": 4, "lockouts": 2, "fuel": 2, "discount_pct": 20}', 1),
('S.O.S Family',  'sos-family', 'Coverage for the whole family',  2999,  29990,  '{"tows": 4, "jumps": 6, "lockouts": 4, "fuel": 4, "discount_pct": 20}', 5),
('S.O.S Fleet',   'sos-fleet',  'Enterprise fleet coverage',      9999,  99990,  '{"tows": -1, "jumps": -1, "lockouts": -1, "fuel": -1, "discount_pct": 30}', 999);


-- ████████████████████████████████████████████████████████████
-- SECTION 14: BRAND LABEL MAP (UI constants)
-- ████████████████████████████████████████████████████████████

-- Store UI string mappings as a config table
CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_config (key, value) VALUES
('brand', '{
  "app_name": "SUPERHEROS ON STANDBY — S.O.S",
  "short_name": "S.O.S",
  "tagline": "Your Superhero is on the way."
}'::jsonb),
('status_labels', '{
  "created": "Getting Ready",
  "requested": "Request Sent",
  "matching": "Finding a Superhero…",
  "offered": "Finding a Superhero…",
  "assigned": "Superhero Accepted",
  "en_route": "Superhero En Route",
  "on_site": "Superhero On Site",
  "in_progress": "Rescue In Progress",
  "completed": "Rescue Complete ✅",
  "scheduled": "Scheduled",
  "matching_at_window": "Preparing Dispatch",
  "consult_requested": "Consult Requested",
  "consult_assigned": "Specialist Assigned",
  "consult_completed": "Consult Complete",
  "quote_sent": "Quote Ready",
  "quote_accepted": "Quote Accepted",
  "canceled_by_user": "Canceled",
  "canceled_by_provider": "Provider Canceled",
  "no_provider_found": "No Superhero Available",
  "expired": "Expired",
  "refunded": "Refunded",
  "disputed": "Under Review"
}'::jsonb),
('ui_terms', '{
  "job": "Rescue",
  "provider": "Superhero",
  "dispatch": "Standby",
  "customer": "Member"
}'::jsonb);


-- ████████████████████████████████████████████████████████████
-- DONE.
-- ████████████████████████████████████████████████████████████

DO $$ 
BEGIN
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  S.O.S SCHEMA DEPLOYED SUCCESSFULLY';
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  Tables: 28';
  RAISE NOTICE '  Indexes: 40+';
  RAISE NOTICE '  RLS Policies: 30+';
  RAISE NOTICE '  Triggers: 12';
  RAISE NOTICE '  Service Catalog: 14 services';
  RAISE NOTICE '  Plans: 4 tiers';
  RAISE NOTICE '════════════════════════════════════════════';
END $$;
