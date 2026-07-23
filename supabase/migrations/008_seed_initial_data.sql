-- BUDI — Migration 008: Seed Initial Master Data
-- Idempotent seed of default roles and default school.

-- ============================================================
-- 1. Seed default roles (idempotent)
-- ============================================================
INSERT INTO roles (code, name, description, level, is_system)
SELECT * FROM (VALUES
    ('super_admin',   'Super Admin',   'Platform-wide super administrator with full access',      100, true),
    ('school_admin',  'School Admin',  'School-level administrator with management permissions',  90,  true),
    ('teacher',       'Teacher',       'Teaching staff managing classes and academic content',    80,  true),
    ('staff',         'Staff',         'Administrative and operational staff',                    70,  true),
    ('student',       'Student',       'Enrolled student with learning access',                   60,  true),
    ('parent',        'Parent',        'Parent or guardian of a student',                         50,  true),
    ('viewer',        'Viewer',        'Read-only access to reports and dashboards',              10,  true)
) AS v(code, name, description, level, is_system)
WHERE NOT EXISTS (
    SELECT 1 FROM roles r WHERE r.code = v.code
);

-- ============================================================
-- 2. Seed default school (idempotent)
-- ============================================================
INSERT INTO schools (name, slug, school_code, education_level, is_active)
SELECT 'SMP Budi Bakti Utama', 'smp-budi-bakti-utama', 'BBU001', 'smp', true
WHERE NOT EXISTS (
    SELECT 1 FROM schools s WHERE s.slug = 'smp-budi-bakti-utama'
);

