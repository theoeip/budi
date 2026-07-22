-- BUDI — Migration 007: Schools Table Enhancement
-- Adds additional columns to the schools table for School Management Module.
-- Also adds RLS policies for the schools table.

-- ============================================================
-- 1. Add new columns to schools table
-- ============================================================
ALTER TABLE schools
  ADD COLUMN IF NOT EXISTS school_code     VARCHAR(50),
  ADD COLUMN IF NOT EXISTS education_level VARCHAR(20)
    CHECK (education_level IN ('sd', 'smp', 'sma', 'smk', 'mi', 'mts', 'ma', 'pkbm', 'other')),
  ADD COLUMN IF NOT EXISTS city            VARCHAR(100),
  ADD COLUMN IF NOT EXISTS province        VARCHAR(100),
  ADD COLUMN IF NOT EXISTS postal_code     VARCHAR(20),
  ADD COLUMN IF NOT EXISTS principal_name  VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_school_code
  ON schools(school_code) WHERE school_code IS NOT NULL AND deleted_at IS NULL;

-- ============================================================
-- 2. Enable RLS on schools table
-- ============================================================
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. RLS Helper Functions
-- ============================================================
CREATE OR REPLACE FUNCTION auth.current_school_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
  SELECT su.school_id
  FROM public.school_users su
  WHERE su.user_id = auth.uid()
    AND su.deleted_at IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth.current_role_code()
RETURNS VARCHAR(50)
LANGUAGE SQL
STABLE
AS $$
  SELECT r.code
  FROM public.school_users su
  JOIN public.roles r ON r.id = su.role_id
  WHERE su.user_id = auth.uid()
    AND su.deleted_at IS NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.code = 'super_admin'
      AND ur.deleted_at IS NULL
  );
$$;

-- ============================================================
-- 4. RLS Policies for schools table
-- ============================================================

-- Super admin: full access
CREATE POLICY "super_admin_all_access_schools" ON schools
  FOR ALL
  USING (auth.is_super_admin())
  WITH CHECK (auth.is_super_admin());

-- All authenticated users: can read active schools (for their context)
CREATE POLICY "authenticated_select_schools" ON schools
  FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      is_active = true
      OR auth.is_super_admin()
    )
  );

-- School admin: can update their own school
CREATE POLICY "school_admin_update_school" ON schools
  FOR UPDATE
  USING (
    id = auth.current_school_id()
    AND EXISTS (
      SELECT 1 FROM public.school_users su
      JOIN public.roles r ON r.id = su.role_id
      WHERE su.user_id = auth.uid()
        AND su.school_id = id
        AND r.code IN ('super_admin', 'school_admin')
        AND su.deleted_at IS NULL
    )
  )
  WITH CHECK (id = auth.current_school_id());

-- ============================================================
-- 5. Auto-create default settings for new schools
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_school()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Set default slug if not provided
  IF NEW.slug IS NULL THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;

  -- Set default settings
  NEW.settings = jsonb_build_object(
    'timezone', COALESCE(NEW.timezone, 'Asia/Jakarta'),
    'locale', 'id_ID',
    'currency', COALESCE(NEW.currency, 'IDR'),
    'academic_year_start', '2025-07-01',
    'academic_year_end', '2026-06-30'
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_school_created
  BEFORE INSERT ON schools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_school();


