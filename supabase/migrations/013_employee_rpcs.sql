-- BUDI — Migration 013: Employee RPCs
-- Implements atomic, transaction-safe operations for Teachers & Staff Management.

-- ============================================================
-- 1. set_department_head
-- ============================================================
-- Atomically replaces the current department head with the provided employee,
-- avoiding race conditions and unique index violations.

CREATE OR REPLACE FUNCTION public.set_department_head(p_employee_id UUID, p_department_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_school_id UUID;
    v_employee_school UUID;
    v_dept_school UUID;
    v_is_super BOOLEAN;
    v_role_code VARCHAR(50);
BEGIN
    -- 1. Validate Caller and Tenant
    v_school_id := public.current_school_id();
    v_is_super := public.is_super_admin();
    v_role_code := public.current_role_code();

    IF NOT v_is_super AND (v_school_id IS NULL OR v_role_code NOT IN ('school_admin')) THEN
        RAISE EXCEPTION 'Permission denied' USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- 2. Validate Employee (Must be active)
    SELECT e.school_id INTO v_employee_school
    FROM public.employees e
    WHERE e.id = p_employee_id AND e.deleted_at IS NULL AND e.employment_status NOT IN ('Terminated', 'Archived', 'Retired', 'Suspended', 'Resigned');

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee not found or inactive' USING ERRCODE = 'P0001';
    END IF;

    -- 3. Validate Department
    SELECT d.school_id INTO v_dept_school
    FROM public.departments d
    WHERE d.id = p_department_id AND d.deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Department not found' USING ERRCODE = 'P0002';
    END IF;

    -- 4. Cross-School and Tenant Check
    IF v_employee_school != v_dept_school THEN
        RAISE EXCEPTION 'Employee and Department school mismatch' USING ERRCODE = 'P0003';
    END IF;

    IF NOT v_is_super AND v_employee_school != v_school_id THEN
        RAISE EXCEPTION 'Tenant isolation violation' USING ERRCODE = 'insufficient_privilege';
    END IF;

    -- 5. Atomic Update
    -- Ensure the employee is assigned to the department first
    IF NOT EXISTS (SELECT 1 FROM public.employee_departments WHERE employee_id = p_employee_id AND department_id = p_department_id AND deleted_at IS NULL) THEN
        INSERT INTO public.employee_departments (employee_id, department_id, is_head_of_department)
        VALUES (p_employee_id, p_department_id, false);
    END IF;

    -- Unset previous head
    UPDATE public.employee_departments
    SET is_head_of_department = false,
        updated_at = now()
    WHERE department_id = p_department_id 
      AND is_head_of_department = true 
      AND deleted_at IS NULL;

    -- Set new head
    UPDATE public.employee_departments
    SET is_head_of_department = true,
        updated_at = now()
    WHERE employee_id = p_employee_id 
      AND department_id = p_department_id 
      AND deleted_at IS NULL;

END;
$$;

-- Restrict execute
REVOKE ALL ON FUNCTION public.set_department_head(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_department_head(UUID, UUID) TO authenticated;
