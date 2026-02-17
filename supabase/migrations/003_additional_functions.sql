-- ============================================================
-- S.O.S ADDITIONAL DB FUNCTIONS
-- Run AFTER 01_SCHEMA.sql
-- These support the edge functions
-- ============================================================

-- Decrement provider acceptance rate (called when offer is declined)
CREATE OR REPLACE FUNCTION decrement_acceptance_rate(p_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total INTEGER;
  v_accepted INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM job_offers WHERE provider_id = p_id;

  SELECT COUNT(*) INTO v_accepted
  FROM job_offers WHERE provider_id = p_id AND status = 'accepted';

  IF v_total > 0 THEN
    UPDATE provider_profiles
    SET acceptance_rate = ROUND((v_accepted::NUMERIC / v_total) * 100, 2),
        updated_at = NOW()
    WHERE provider_id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update provider completion rate
CREATE OR REPLACE FUNCTION update_completion_rate(p_id UUID)
RETURNS VOID AS $$
DECLARE
  v_assigned INTEGER;
  v_completed INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_assigned
  FROM job_assignments WHERE provider_id = p_id;

  SELECT COUNT(*) INTO v_completed
  FROM job_assignments ja
  JOIN jobs j ON j.id = ja.job_id
  WHERE ja.provider_id = p_id AND j.status = 'completed';

  IF v_assigned > 0 THEN
    UPDATE provider_profiles
    SET completion_rate = ROUND((v_completed::NUMERIC / v_assigned) * 100, 2),
        updated_at = NOW()
    WHERE provider_id = p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin: Approve provider verification
CREATE OR REPLACE FUNCTION admin_approve_provider(
  p_admin_id UUID,
  p_provider_id UUID,
  p_doc_type TEXT DEFAULT 'all'
)
RETURNS JSONB AS $$
DECLARE
  v_updates JSONB := '{}';
BEGIN
  -- Verify caller is admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can approve providers';
  END IF;

  IF p_doc_type = 'all' OR p_doc_type = 'license' THEN
    UPDATE provider_verifications SET license_status = 'approved', approved_by = p_admin_id, approved_at = NOW() WHERE provider_id = p_provider_id;
    v_updates := v_updates || '{"license": "approved"}'::jsonb;
  END IF;

  IF p_doc_type = 'all' OR p_doc_type = 'insurance' THEN
    UPDATE provider_verifications SET insurance_status = 'approved', approved_by = p_admin_id, approved_at = NOW() WHERE provider_id = p_provider_id;
    v_updates := v_updates || '{"insurance": "approved"}'::jsonb;
  END IF;

  IF p_doc_type = 'all' OR p_doc_type = 'background' THEN
    UPDATE provider_verifications SET background_check_status = 'approved', approved_by = p_admin_id, approved_at = NOW() WHERE provider_id = p_provider_id;
    v_updates := v_updates || '{"background": "approved"}'::jsonb;
  END IF;

  IF p_doc_type = 'all' OR p_doc_type = 'inspection' THEN
    UPDATE provider_verifications SET vehicle_inspection_status = 'approved', approved_by = p_admin_id, approved_at = NOW() WHERE provider_id = p_provider_id;
    v_updates := v_updates || '{"inspection": "approved"}'::jsonb;
  END IF;

  -- Check if all 4 are now approved
  IF EXISTS (
    SELECT 1 FROM provider_verifications
    WHERE provider_id = p_provider_id
      AND license_status = 'approved'
      AND insurance_status = 'approved'
      AND background_check_status = 'approved'
      AND vehicle_inspection_status = 'approved'
  ) THEN
    -- Fully verified — activate
    UPDATE provider_profiles
    SET onboard_status = 'active', is_active = true, updated_at = NOW()
    WHERE provider_id = p_provider_id;

    v_updates := v_updates || '{"onboard_status": "active", "is_active": true}'::jsonb;
  ELSE
    -- Partially verified
    UPDATE provider_profiles
    SET onboard_status = 'pending_verification', updated_at = NOW()
    WHERE provider_id = p_provider_id;
  END IF;

  RETURN v_updates;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin: Force assign provider to job
CREATE OR REPLACE FUNCTION admin_force_assign(
  p_admin_id UUID,
  p_job_id UUID,
  p_provider_id UUID
)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Only admins can force assign';
  END IF;

  -- Clear existing assignment if any
  DELETE FROM job_assignments WHERE job_id = p_job_id;

  -- Cancel pending offers
  UPDATE job_offers SET status = 'expired', responded_at = NOW()
  WHERE job_id = p_job_id AND status = 'sent';

  -- Create assignment
  INSERT INTO job_assignments (job_id, provider_id, assigned_at)
  VALUES (p_job_id, p_provider_id, NOW());

  -- Update job
  UPDATE jobs SET status = 'assigned' WHERE id = p_job_id;

  -- Set provider busy
  UPDATE provider_availability SET status = 'busy' WHERE provider_id = p_provider_id;

  -- Log
  INSERT INTO job_events (job_id, event_type, actor_id, actor_role, payload_json)
  VALUES (p_job_id, 'admin_action', p_admin_id, 'admin',
    jsonb_build_object('action', 'force_assign', 'provider_id', p_provider_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get job with full details (for API responses)
CREATE OR REPLACE FUNCTION get_job_details(p_job_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'job', row_to_json(j),
    'assignment', (SELECT row_to_json(ja) FROM job_assignments ja WHERE ja.job_id = j.id),
    'provider', (
      SELECT jsonb_build_object(
        'id', pp.provider_id,
        'name', p.full_name,
        'photo', p.photo_url,
        'rating', pp.rating_avg,
        'jobs_completed', pp.jobs_completed,
        'equipment', pp.equipment_json,
        'is_female_first_eligible', pp.is_female_first_eligible
      )
      FROM job_assignments ja2
      JOIN provider_profiles pp ON pp.provider_id = ja2.provider_id
      JOIN profiles p ON p.id = ja2.provider_id
      WHERE ja2.job_id = j.id
    ),
    'safety', (SELECT row_to_json(js) FROM job_safety js WHERE js.job_id = j.id),
    'payment', (SELECT row_to_json(pay) FROM payments pay WHERE pay.job_id = j.id ORDER BY pay.created_at DESC LIMIT 1),
    'media', (SELECT COALESCE(json_agg(jm), '[]') FROM job_media jm WHERE jm.job_id = j.id),
    'events_count', (SELECT COUNT(*) FROM job_events je WHERE je.job_id = j.id),
    'service', (SELECT row_to_json(sc) FROM service_catalog sc WHERE sc.service_type = j.service_type)
  ) INTO v_result
  FROM jobs j
  WHERE j.id = p_job_id;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dashboard stats for provider
CREATE OR REPLACE FUNCTION get_provider_stats(p_provider_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_today_jobs INTEGER;
  v_today_earnings INTEGER;
  v_week_jobs INTEGER;
  v_week_earnings INTEGER;
  v_month_jobs INTEGER;
  v_month_earnings INTEGER;
BEGIN
  -- Today
  SELECT COUNT(*), COALESCE(SUM(j.price_cents), 0) INTO v_today_jobs, v_today_earnings
  FROM job_assignments ja
  JOIN jobs j ON j.id = ja.job_id
  WHERE ja.provider_id = p_provider_id
    AND j.status = 'completed'
    AND j.completed_at >= CURRENT_DATE;

  -- This week
  SELECT COUNT(*), COALESCE(SUM(j.price_cents), 0) INTO v_week_jobs, v_week_earnings
  FROM job_assignments ja
  JOIN jobs j ON j.id = ja.job_id
  WHERE ja.provider_id = p_provider_id
    AND j.status = 'completed'
    AND j.completed_at >= date_trunc('week', CURRENT_DATE);

  -- This month
  SELECT COUNT(*), COALESCE(SUM(j.price_cents), 0) INTO v_month_jobs, v_month_earnings
  FROM job_assignments ja
  JOIN jobs j ON j.id = ja.job_id
  WHERE ja.provider_id = p_provider_id
    AND j.status = 'completed'
    AND j.completed_at >= date_trunc('month', CURRENT_DATE);

  RETURN jsonb_build_object(
    'today', jsonb_build_object('jobs', v_today_jobs, 'earnings_cents', v_today_earnings),
    'week', jsonb_build_object('jobs', v_week_jobs, 'earnings_cents', v_week_earnings),
    'month', jsonb_build_object('jobs', v_month_jobs, 'earnings_cents', v_month_earnings)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


DO $$
BEGIN
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  ADDITIONAL DB FUNCTIONS DEPLOYED';
  RAISE NOTICE '════════════════════════════════════════════';
  RAISE NOTICE '  decrement_acceptance_rate';
  RAISE NOTICE '  update_completion_rate';
  RAISE NOTICE '  admin_approve_provider';
  RAISE NOTICE '  admin_force_assign';
  RAISE NOTICE '  get_job_details';
  RAISE NOTICE '  get_provider_stats';
  RAISE NOTICE '════════════════════════════════════════════';
END $$;
