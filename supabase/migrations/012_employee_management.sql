-- BUDI — Migration 012: Employee Management Foundation
-- Creates employees, profiles, hr_records, capabilities, and department mapping.

-- ============================================================
-- 1. employees — Core tenant-bound HR master record
-- ============================================================
CREATE TABLE employees (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    profile_id        UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    full_name         VARCHAR(255) NOT NULL,
    work_email        VARCHAR(255),
    phone             VARCHAR(50),
    employee_number   VARCHAR(50),
    employment_type   VARCHAR(50) NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'Active',
    join_date         DATE NOT NULL,
    exit_date         DATE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_employees_number ON employees(school_id, employee_number) WHERE employee_number IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_employees_school_id ON employees(school_id);
CREATE INDEX idx_employees_profile_id ON employees(profile_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_employees_deleted_at ON employees(deleted_at);

CREATE TRIGGER set_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. employee_profiles — Personal demographic data
-- ============================================================
CREATE TABLE employee_profiles (
    employee_id       UUID PRIMARY KEY REFERENCES employees(id) ON DELETE RESTRICT,
    gender            VARCHAR(20),
    place_of_birth    VARCHAR(100),
    date_of_birth     DATE,
    address           TEXT,
    religion          VARCHAR(50),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_employee_profiles_deleted_at ON employee_profiles(deleted_at);

CREATE TRIGGER set_employee_profiles_updated_at 
    BEFORE UPDATE ON employee_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. employee_hr_records — Strict HR-sensitive data
-- ============================================================
CREATE TABLE employee_hr_records (
    employee_id       UUID PRIMARY KEY REFERENCES employees(id) ON DELETE RESTRICT,
    nik               VARCHAR(50),
    npwp              VARCHAR(50),
    contract_details  JSONB NOT NULL DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_employee_hr_records_deleted_at ON employee_hr_records(deleted_at);

CREATE TRIGGER set_employee_hr_records_updated_at 
    BEFORE UPDATE ON employee_hr_records 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. employee_capabilities — Extensible normalized capabilities
-- ============================================================
CREATE TABLE employee_capabilities (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id       UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    capability        VARCHAR(50) NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_employee_capabilities_unique ON employee_capabilities(employee_id, capability) WHERE deleted_at IS NULL;
CREATE INDEX idx_employee_capabilities_emp_id ON employee_capabilities(employee_id);

CREATE TRIGGER set_employee_capabilities_updated_at 
    BEFORE UPDATE ON employee_capabilities 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. employee_departments — Many-to-many department mapping
-- ============================================================
CREATE TABLE employee_departments (
    id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id           UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    department_id         UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    is_head_of_department BOOLEAN NOT NULL DEFAULT false,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at            TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_employee_departments_unique ON employee_departments(employee_id, department_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_employee_departments_head ON employee_departments(department_id) WHERE is_head_of_department = true AND deleted_at IS NULL;
CREATE INDEX idx_employee_departments_emp_id ON employee_departments(employee_id);
CREATE INDEX idx_employee_departments_dept_id ON employee_departments(department_id);

CREATE TRIGGER set_employee_departments_updated_at 
    BEFORE UPDATE ON employee_departments 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 6. HOMEROOM TEACHER FK MIGRATION
-- ============================================================

-- Step A: Add new column
ALTER TABLE classes ADD COLUMN homeroom_employee_id UUID REFERENCES employees(id) ON DELETE RESTRICT;

-- Step B: Backfill Employees from existing profile IDs safely
DO $$
DECLARE
    r RECORD;
    new_employee_id UUID;
BEGIN
    FOR r IN (
        SELECT DISTINCT c.homeroom_teacher_id, c.school_id, p.full_name 
        FROM classes c 
        JOIN profiles p ON c.homeroom_teacher_id = p.id 
        WHERE c.homeroom_teacher_id IS NOT NULL
    )
    LOOP
        new_employee_id := gen_random_uuid();
        
        -- Create stub employee record
        INSERT INTO employees (id, school_id, profile_id, full_name, employment_type, employment_status, join_date)
        VALUES (new_employee_id, r.school_id, r.homeroom_teacher_id, r.full_name, 'Full-time', 'Active', CURRENT_DATE);
        
        -- Grant Homeroom capability
        INSERT INTO employee_capabilities (employee_id, capability)
        VALUES (new_employee_id, 'Homeroom');
        
        -- Point all classes for this teacher in this school to the new employee record
        UPDATE classes 
        SET homeroom_employee_id = new_employee_id 
        WHERE homeroom_teacher_id = r.homeroom_teacher_id AND school_id = r.school_id;
    END LOOP;
END $$;

-- Step C & D: Drop old column and rename new column
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_homeroom_teacher_id_fkey;
ALTER TABLE classes DROP COLUMN homeroom_teacher_id;
ALTER TABLE classes RENAME COLUMN homeroom_employee_id TO homeroom_teacher_id;
CREATE INDEX idx_classes_teacher_id ON classes(homeroom_teacher_id);


-- ============================================================
-- 7. Row Level Security Policies
-- ============================================================

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_hr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_departments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_hr_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_capabilities TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON employee_departments TO authenticated;

-- 7a. employees (Directory Tier)
CREATE POLICY "employees_select_auth" ON employees FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "employees_insert_auth" ON employees FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()
);
CREATE POLICY "employees_update_auth" ON employees FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()
);

-- 7b. employee_capabilities (Directory Tier)
CREATE POLICY "employee_capabilities_select_auth" ON employee_capabilities FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_capabilities.employee_id AND (e.school_id = public.current_school_id() OR public.is_super_admin()))
);
CREATE POLICY "employee_capabilities_insert_auth" ON employee_capabilities FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_capabilities.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);
CREATE POLICY "employee_capabilities_update_auth" ON employee_capabilities FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_capabilities.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_capabilities.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);

-- 7c. employee_departments (Directory Tier)
CREATE POLICY "employee_departments_select_auth" ON employee_departments FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_departments.employee_id AND (e.school_id = public.current_school_id() OR public.is_super_admin()))
);
CREATE POLICY "employee_departments_insert_auth" ON employee_departments FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_departments.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);
CREATE POLICY "employee_departments_update_auth" ON employee_departments FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_departments.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_departments.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);

-- 7d. employee_profiles (Personal Tier)
CREATE POLICY "employee_profiles_select_auth" ON employee_profiles FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_profiles.employee_id AND (
        (e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR 
        public.is_super_admin() OR 
        e.profile_id = auth.uid()
    ))
);
CREATE POLICY "employee_profiles_insert_auth" ON employee_profiles FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_profiles.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);
CREATE POLICY "employee_profiles_update_auth" ON employee_profiles FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_profiles.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_profiles.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);

-- 7e. employee_hr_records (Strict HR-sensitive Tier)
CREATE POLICY "employee_hr_records_select_auth" ON employee_hr_records FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_hr_records.employee_id AND (
        (e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR 
        public.is_super_admin()
    ))
);
CREATE POLICY "employee_hr_records_insert_auth" ON employee_hr_records FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_hr_records.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);
CREATE POLICY "employee_hr_records_update_auth" ON employee_hr_records FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_hr_records.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM employees e WHERE e.id = employee_hr_records.employee_id AND ((e.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'super_admin')) OR public.is_super_admin()))
);