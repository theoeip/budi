-- BUDI — Migration 011: Student Management Foundation
-- Creates students, student_profiles, guardians, student_guardians, and class_enrollments.
-- Adheres strictly to Sprint 8 Engineering Standards and Architecture.

-- ============================================================
-- 1. students — Core tenant-bound student record
-- ============================================================
CREATE TABLE students (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    profile_id      UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    nis             VARCHAR(50) NOT NULL,
    nisn            VARCHAR(50),
    status          VARCHAR(50) NOT NULL DEFAULT 'Active',
    admission_date  DATE NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_students_nis ON students(school_id, nis) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_students_nisn ON students(school_id, nisn) WHERE nisn IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_profile_id ON students(profile_id);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);

CREATE TRIGGER set_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. student_profiles — Extended demographic data
-- ============================================================
CREATE TABLE student_profiles (
    student_id      UUID PRIMARY KEY REFERENCES students(id) ON DELETE RESTRICT,
    gender          VARCHAR(20),
    place_of_birth  VARCHAR(100),
    date_of_birth   DATE,
    address         TEXT,
    religion        VARCHAR(50),
    blood_group     VARCHAR(10),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_student_profiles_deleted_at ON student_profiles(deleted_at);

CREATE TRIGGER set_student_profiles_updated_at 
    BEFORE UPDATE ON student_profiles 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 3. guardians — Parent/Guardian contacts
-- ============================================================
CREATE TABLE guardians (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    profile_id      UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(50) NOT NULL,
    email           VARCHAR(255),
    address         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_guardians_school_id ON guardians(school_id);
CREATE INDEX idx_guardians_profile_id ON guardians(profile_id);
CREATE INDEX idx_guardians_deleted_at ON guardians(deleted_at);

CREATE TRIGGER set_guardians_updated_at 
    BEFORE UPDATE ON guardians 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. student_guardians — Many-to-Many relationship
-- ============================================================
CREATE TABLE student_guardians (
    student_id          UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    guardian_id         UUID NOT NULL REFERENCES guardians(id) ON DELETE RESTRICT,
    relationship_type   VARCHAR(50) NOT NULL,
    is_primary_contact  BOOLEAN NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ,
    PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_guardian_id ON student_guardians(guardian_id);
CREATE INDEX idx_student_guardians_deleted_at ON student_guardians(deleted_at);

CREATE TRIGGER set_student_guardians_updated_at 
    BEFORE UPDATE ON student_guardians 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 5. class_enrollments — Operational assignments
-- ============================================================
CREATE TABLE class_enrollments (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id               UUID NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
    student_id              UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
    class_id                UUID NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
    academic_year_id        UUID NOT NULL REFERENCES academic_years(id) ON DELETE RESTRICT,
    status                  VARCHAR(50) NOT NULL DEFAULT 'Active',
    enrollment_date         DATE NOT NULL,
    enrollment_reason       VARCHAR(100),
    exit_date               DATE,
    exit_reason             VARCHAR(100),
    promoted_from_class_id  UUID REFERENCES classes(id) ON DELETE RESTRICT,
    promoted_to_class_id    UUID REFERENCES classes(id) ON DELETE RESTRICT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at              TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_class_enrollments_one_active ON class_enrollments(school_id, academic_year_id, student_id) WHERE status = 'Active' AND deleted_at IS NULL;
CREATE INDEX idx_class_enrollments_school_id ON class_enrollments(school_id);
CREATE INDEX idx_class_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX idx_class_enrollments_academic_year_id ON class_enrollments(academic_year_id);
CREATE INDEX idx_class_enrollments_deleted_at ON class_enrollments(deleted_at);

CREATE TRIGGER set_class_enrollments_updated_at 
    BEFORE UPDATE ON class_enrollments 
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 6. Row Level Security Policies
-- ============================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

-- students
CREATE POLICY "students_select_auth" ON students FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "students_insert_auth" ON students FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);
CREATE POLICY "students_update_auth" ON students FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);

-- student_profiles
CREATE POLICY "student_profiles_select_auth" ON student_profiles FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_profiles.student_id AND (s.school_id = public.current_school_id() OR public.is_super_admin()))
);
CREATE POLICY "student_profiles_insert_auth" ON student_profiles FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_profiles.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
);
CREATE POLICY "student_profiles_update_auth" ON student_profiles FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_profiles.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_profiles.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
);

-- guardians
CREATE POLICY "guardians_select_auth" ON guardians FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "guardians_insert_auth" ON guardians FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);
CREATE POLICY "guardians_update_auth" ON guardians FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);

-- student_guardians
CREATE POLICY "student_guardians_select_auth" ON student_guardians FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_guardians.student_id AND (s.school_id = public.current_school_id() OR public.is_super_admin()))
);
CREATE POLICY "student_guardians_insert_auth" ON student_guardians FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_guardians.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
);
CREATE POLICY "student_guardians_update_auth" ON student_guardians FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_guardians.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
) WITH CHECK (
    EXISTS (SELECT 1 FROM students s WHERE s.id = student_guardians.student_id AND ((s.school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()))
);

-- class_enrollments
CREATE POLICY "class_enrollments_select_auth" ON class_enrollments FOR SELECT TO authenticated USING (
    school_id = public.current_school_id() OR public.is_super_admin()
);
CREATE POLICY "class_enrollments_insert_auth" ON class_enrollments FOR INSERT TO authenticated WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);
CREATE POLICY "class_enrollments_update_auth" ON class_enrollments FOR UPDATE TO authenticated USING (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
) WITH CHECK (
    (school_id = public.current_school_id() AND public.current_role_code() IN ('school_admin', 'staff')) OR public.is_super_admin()
);

-- No FOR DELETE policies are created to enforce the strict soft-delete architecture.
