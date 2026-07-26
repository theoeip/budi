-- BUDI — Migration 009: Comprehensive RLS Policies
-- Implements tenant isolation and role-based access control for Finance module.

-- ============================================================
-- 1. Helper Functions (Redefined for Safety)
-- ============================================================

-- Recreate as PL/pgSQL SECURITY DEFINER without dropping (to preserve dependencies)

CREATE OR REPLACE FUNCTION public.current_school_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_school_id UUID;
BEGIN
  SELECT su.school_id INTO v_school_id
  FROM public.school_users su
  WHERE su.user_id = auth.uid()
    AND su.deleted_at IS NULL
  LIMIT 1;
  RETURN v_school_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_role_code()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_role_code VARCHAR(50);
BEGIN
  SELECT r.code INTO v_role_code
  FROM public.school_users su
  JOIN public.roles r ON r.id = su.role_id
  WHERE su.user_id = auth.uid()
    AND su.deleted_at IS NULL
  LIMIT 1;
  RETURN v_role_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
DECLARE
  v_is_super BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND r.code = 'super_admin'
      AND ur.deleted_at IS NULL
  ) INTO v_is_super;
  RETURN COALESCE(v_is_super, false);
END;
$$;

-- ============================================================
-- 2. Treasurer Role Normalization
-- ============================================================
INSERT INTO public.roles (code, name, description, level, is_system)
VALUES ('treasurer', 'Treasurer', 'Finance module access within their school', 65, true)
ON CONFLICT (code) DO UPDATE 
SET level = 65, is_system = true;

-- ============================================================
-- 3. Auth Bootstrap Policies
-- ============================================================

-- profiles
CREATE POLICY "profiles_select_own_or_super" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR public.is_super_admin()
  );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- user_roles
CREATE POLICY "user_roles_select_own_or_super" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_super_admin()
  );

-- school_users
CREATE POLICY "school_users_select_own_or_super_or_admin" ON public.school_users
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_super_admin()
    OR (
        school_id = public.current_school_id() 
        AND public.current_role_code() = 'school_admin'
    )
  );

-- roles (Global Lookup)
CREATE POLICY "roles_select_all_authenticated" ON public.roles
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- 4. Tenant Core Policies
-- ============================================================

-- system_settings
CREATE POLICY "system_settings_select_school" ON public.system_settings
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    OR public.is_super_admin()
  );

CREATE POLICY "system_settings_update_admin" ON public.system_settings
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin')
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin')
    OR public.is_super_admin()
  );

-- ============================================================
-- 5. Global Lookup Policies
-- ============================================================

-- account_types
CREATE POLICY "account_types_select_all" ON public.account_types
  FOR SELECT TO authenticated
  USING (true);

-- payment_methods
CREATE POLICY "payment_methods_select_all" ON public.payment_methods
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================
-- 6. Finance RLS (Soft Deletes via UPDATE)
-- ============================================================

-- accounts
CREATE POLICY "accounts_select_auth" ON public.accounts
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "accounts_insert_auth" ON public.accounts
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "accounts_update_auth" ON public.accounts
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- transaction_categories
CREATE POLICY "transaction_categories_select_auth" ON public.transaction_categories
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "transaction_categories_insert_auth" ON public.transaction_categories
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "transaction_categories_update_auth" ON public.transaction_categories
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- transactions
CREATE POLICY "transactions_select_auth" ON public.transactions
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "transactions_insert_auth" ON public.transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "transactions_update_auth" ON public.transactions
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- transaction_items (Indirect Ownership)
CREATE POLICY "transaction_items_select_auth" ON public.transaction_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
        SELECT 1 FROM public.transactions t 
        WHERE t.id = transaction_id 
        AND t.school_id = public.current_school_id() 
        AND public.current_role_code() IN ('school_admin', 'treasurer')
    )
    OR public.is_super_admin()
  );

CREATE POLICY "transaction_items_insert_auth" ON public.transaction_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.transactions t 
        WHERE t.id = transaction_id 
        AND t.school_id = public.current_school_id() 
        AND public.current_role_code() IN ('school_admin', 'treasurer')
    )
    OR public.is_super_admin()
  );

CREATE POLICY "transaction_items_update_auth" ON public.transaction_items
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
        SELECT 1 FROM public.transactions t 
        WHERE t.id = transaction_id 
        AND t.school_id = public.current_school_id() 
        AND public.current_role_code() IN ('school_admin', 'treasurer')
    )
    OR public.is_super_admin()
  )
  WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.transactions t 
        WHERE t.id = transaction_id 
        AND t.school_id = public.current_school_id() 
        AND public.current_role_code() IN ('school_admin', 'treasurer')
    )
    OR public.is_super_admin()
  );

-- attachments
CREATE POLICY "attachments_select_auth" ON public.attachments
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "attachments_insert_auth" ON public.attachments
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "attachments_update_auth" ON public.attachments
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- cash_registers
CREATE POLICY "cash_registers_select_auth" ON public.cash_registers
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "cash_registers_insert_auth" ON public.cash_registers
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "cash_registers_update_auth" ON public.cash_registers
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- daily_cash
CREATE POLICY "daily_cash_select_auth" ON public.daily_cash
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "daily_cash_insert_auth" ON public.daily_cash
  FOR INSERT TO authenticated
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

CREATE POLICY "daily_cash_update_auth" ON public.daily_cash
  FOR UPDATE TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  )
  WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- monthly_reports (Append-only or generated, no user DELETE, strict UPDATE if any)
CREATE POLICY "monthly_reports_select_auth" ON public.monthly_reports
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- semester_reports
CREATE POLICY "semester_reports_select_auth" ON public.semester_reports
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- yearly_reports
CREATE POLICY "yearly_reports_select_auth" ON public.yearly_reports
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );

-- audit_logs (Append-only, SELECT restricted to admins/finance)
CREATE POLICY "audit_logs_select_auth" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'treasurer'))
    OR public.is_super_admin()
  );
