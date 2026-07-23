-- Creates audit logging, RLS helper functions, and seed data.
-- Dependencies: Migration 001 (core tables)

-- ============================================================
-- 1. audit_logs — Immutable audit trail
-- ============================================================
CREATE TABLE audit_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID REFERENCES schools(id),
    user_id         UUID REFERENCES profiles(id),
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID,
    changes         JSONB,
    ip_address      INET,
    user_agent      TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for audit log queries
CREATE INDEX idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(school_id, created_at DESC);

-- ============================================================
-- 2. RLS Helper Functions (public schema — compatible with Supabase Cloud)
-- ============================================================

-- Get current user's active school_id
CREATE OR REPLACE FUNCTION public.current_school_id()
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

-- Get current user's role code for their active school
CREATE OR REPLACE FUNCTION public.current_role_code()
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

-- Check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
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
-- 3. Enable Row Level Security
-- ============================================================

-- Core tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Finance foundation
ALTER TABLE account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Cash management
ALTER TABLE cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_cash ENABLE ROW LEVEL SECURITY;

-- Reports
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE semester_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearly_reports ENABLE ROW LEVEL SECURITY;

-- Audit
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Seed Data
-- ============================================================

-- 4a. Roles
INSERT INTO roles (code, name, description, level, is_system) VALUES
    ('super_admin',  'Super Admin',  'Full system access across all schools',      100, true),
    ('school_admin', 'School Admin', 'Full access within their school',             80,  true),
    ('treasurer',    'Treasurer',    'Finance module operations within their school',60,  true),
    ('viewer',       'Viewer',       'Read-only access within their school',        20,  true)
ON CONFLICT (code) DO NOTHING;

-- 4b. Account Types
INSERT INTO account_types (code, name, description, icon, sort_order, is_system) VALUES
    ('bank',        'Bank Account',  'Bank accounts for school funds',         'Landmark',   1, true),
    ('cash',        'Cash',          'Physical cash on hand',                  'Banknote',   2, true),
    ('petty_cash',  'Petty Cash',    'Small cash fund for daily expenses',     'Wallet',     3, true)
ON CONFLICT (code) DO NOTHING;

-- 4c. Payment Methods
INSERT INTO payment_methods (code, name, description, icon, sort_order, is_system) VALUES
    ('cash',          'Cash',            'Physical cash payment',                    'Banknote',       1, true),
    ('bank_transfer', 'Bank Transfer',   'Electronic bank transfer',                'ArrowLeftRight', 2, true),
    ('credit_card',   'Credit Card',     'Credit card payment',                     'CreditCard',     3, true),
    ('debit_card',    'Debit Card',      'Debit card payment',                      'CreditCard',     4, true),
    ('cheque',        'Cheque',          'Cheque payment',                          'FileText',       5, true),
    ('other',         'Other',           'Other payment methods',                   'Ellipsis',       6, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 5. Development Seed Data (conditionally inserted)
-- ============================================================

-- Only insert if this is a development environment
DO $$
BEGIN
    IF current_setting('app.environment', true) = 'development' OR current_setting('app.environment', true) IS NULL THEN

        -- Seed school
        INSERT INTO schools (id, name, slug, address, phone, email, currency, timezone)
        SELECT
            '00000000-0000-0000-0000-000000000001',
            'SMA Negeri 1 Jakarta',
            'sman1-jkt',
            'Jl. Merdeka No. 1, Jakarta Pusat',
            '021-12345678',
            'info@sman1-jkt.sch.id',
            'IDR',
            'Asia/Jakarta'
        WHERE NOT EXISTS (
            SELECT 1 FROM schools
            WHERE slug = 'sman1-jkt'
              AND deleted_at IS NULL
        );

        -- Seed roles for existing profiles (if any)
        -- This is a placeholder — actual user assignment happens via the app

    END IF;
END;
$$;

