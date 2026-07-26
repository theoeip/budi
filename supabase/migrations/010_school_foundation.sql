-- BUDI — Migration 010: School Management Foundation
-- Creates academic years, semesters, departments, classes, and subjects.
-- Adheres strictly to Sprint 7 Engineering Standards and Architecture.

-- ============================================================
-- 1. academic_years — Temporal boundary for a school year
-- ============================================================
CREATE TABLE academic_years (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT chk_academic_year_dates CHECK (end_date > start_date)
);

CREATE UNIQUE INDEX idx_academic_years_name ON academic_years(school_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_academic_years_one_active ON academic_years(school_id) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_academic_years_deleted_at ON academic_years(deleted_at);

CREATE TRIGGER set_academic_years_updated_at 
    BEFORE UPDATE ON academic_years 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. semesters — Sub-temporal boundaries
-- ============================================================
CREATE TABLE semesters (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id        UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    name             VARCHAR(100) NOT NULL,
    term_type        VARCHAR(50) NOT NULL,
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    is_active        BOOLEAN NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at       TIMESTAMPTZ,
    CONSTRAINT chk_semester_dates CHECK (end_date > start_date)
);

CREATE UNIQUE INDEX idx_semesters_name ON semesters(academic_year_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_semesters_one_active ON semesters(academic_year_id) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX idx_semesters_school_id ON semesters(school_id);
CREATE INDEX idx_semesters_academic_year_id ON semesters(academic_year_id);
CREATE INDEX idx_semesters_deleted_at ON semesters(deleted_at);

CREATE TRIGGER set_semesters_updated_at 
    BEFORE UPDATE ON semesters 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger to validate semester dates against academic year dates
CREATE OR REPLACE FUNCTION public.check_semester_dates()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    ay_start DATE;
    ay_end DATE;
BEGIN
    SELECT start_date, end_date INTO ay_start, ay_end
    FROM public.academic_years
    WHERE id = NEW.academic_year_id;
    
    IF NEW.start_date < ay_start OR NEW.end_date > ay_end THEN
        RAISE EXCEPTION 'Semester dates must fall strictly within the academic year dates';
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_semester_dates
BEFORE INSERT OR UPDATE ON semesters
FOR EACH ROW EXECUTE FUNCTION public.check_semester_dates();

-- ============================================================
-- 3. departments — Structural units
-- ============================================================
CREATE TABLE departments (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(50) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_departments_code ON departments(school_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_school_id ON departments(school_id);
CREATE INDEX idx_departments_deleted_at ON departments(deleted_at);

CREATE TRIGGER set_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. classes — Operational units mapping students to curriculum
-- ============================================================
CREATE TABLE classes (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    department_id       UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    academic_year_id    UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    name                VARCHAR(100) NOT NULL,
    code                VARCHAR(50) NOT NULL,
    grade_level         INTEGER,
    capacity            INTEGER,
    status              VARCHAR(50) NOT NULL DEFAULT 'Active',
    description         TEXT,
    sort_order          INTEGER DEFAULT 0,
    homeroom_teacher_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_classes_code ON classes(school_id, academic_year_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_department_id ON classes(department_id);
CREATE INDEX idx_classes_academic_year_id ON classes(academic_year_id);
CREATE INDEX idx_classes_teacher_id ON classes(homeroom_teacher_id);
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);

CREATE TRIGGER set_classes_updated_at 
    BEFORE UPDATE ON classes 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. subjects — Curriculum catalog
-- ============================================================
CREATE TABLE subjects (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    department_id   UUID REFERENCES departments(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(50) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_subjects_code ON subjects(school_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_subjects_school_id ON subjects(school_id);
CREATE INDEX idx_subjects_department_id ON subjects(department_id);
CREATE INDEX idx_subjects_deleted_at ON subjects(deleted_at);

CREATE TRIGGER set_subjects_updated_at 
    BEFORE UPDATE ON subjects 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. Row Level Security Policies
-- ============================================================

-- Apply RLS to all tables
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- 6a. academic_years policies
CREATE POLICY "academic_years_select_auth" ON academic_years FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "academic_years_insert_auth" ON academic_years FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);
CREATE POLICY "academic_years_update_auth" ON academic_years FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);

-- 6b. semesters policies
CREATE POLICY "semesters_select_auth" ON semesters FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "semesters_insert_auth" ON semesters FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);
CREATE POLICY "semesters_update_auth" ON semesters FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);

-- 6c. departments policies
CREATE POLICY "departments_select_auth" ON departments FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "departments_insert_auth" ON departments FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);
CREATE POLICY "departments_update_auth" ON departments FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);

-- 6d. classes policies
CREATE POLICY "classes_select_auth" ON classes FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "classes_insert_auth" ON classes FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);
CREATE POLICY "classes_update_auth" ON classes FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);

-- 6e. subjects policies
CREATE POLICY "subjects_select_auth" ON subjects FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "subjects_insert_auth" ON subjects FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);
CREATE POLICY "subjects_update_auth" ON subjects FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() = 'school_admin') OR public.is_super_admin()
);

-- No FOR DELETE policies are created to enforce the strict soft-delete architecture.
