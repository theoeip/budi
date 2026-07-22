-- BUDI Finance Module — Migration 005: Reports
-- Creates pre-computed report tables for fast financial reporting.
-- Dependencies: Migration 003 (transactions)

-- ============================================================
-- 1. monthly_reports — Monthly financial summaries
-- Pre-computed for fast dashboard loading
-- ============================================================
CREATE TABLE monthly_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year            INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    month           INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_income >= 0),
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_expense >= 0),
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    category_breakdown JSONB DEFAULT '[]',
    account_breakdown   JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, year, month)
);

CREATE INDEX idx_monthly_reports_school_id ON monthly_reports(school_id);
CREATE INDEX idx_monthly_reports_period ON monthly_reports(school_id, year, month);
CREATE INDEX idx_monthly_reports_year ON monthly_reports(school_id, year);

-- ============================================================
-- 2. semester_reports — Semester financial summaries
-- ============================================================
CREATE TABLE semester_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year   VARCHAR(20) NOT NULL,
    semester        INTEGER NOT NULL CHECK (semester IN (1, 2)),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_income >= 0),
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_expense >= 0),
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    category_breakdown JSONB DEFAULT '[]',
    account_breakdown   JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, academic_year, semester)
);

CREATE INDEX idx_semester_reports_school_id ON semester_reports(school_id);
CREATE INDEX idx_semester_reports_period ON semester_reports(school_id, academic_year, semester);

-- ============================================================
-- 3. yearly_reports — Yearly financial summaries
-- ============================================================
CREATE TABLE yearly_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year            INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_income >= 0),
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_expense >= 0),
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    monthly_breakdown JSONB DEFAULT '[]',
    category_breakdown  JSONB DEFAULT '[]',
    account_breakdown    JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, year)
);

CREATE INDEX idx_yearly_reports_school_id ON yearly_reports(school_id);
CREATE INDEX idx_yearly_reports_period ON yearly_reports(school_id, year);

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE TRIGGER set_monthly_reports_updated_at
    BEFORE UPDATE ON monthly_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_semester_reports_updated_at
    BEFORE UPDATE ON semester_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_yearly_reports_updated_at
    BEFORE UPDATE ON yearly_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

