-- BUDI Finance Module — Migration 004: Cash Management
-- Creates cash register and daily cash tracking tables.
-- Dependencies: Migration 003 (transactions, accounts)

-- ============================================================
-- 1. cash_registers — Cash register sessions
-- Tracks opening and closing of cash registers with balances
-- ============================================================
CREATE TABLE cash_registers (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    opened_by       UUID NOT NULL REFERENCES profiles(id),
    closed_by       UUID REFERENCES profiles(id),
    opened_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at       TIMESTAMPTZ,
    opening_balance DECIMAL(18, 2) NOT NULL CHECK (opening_balance >= 0),
    closing_balance DECIMAL(18, 2) CHECK (closing_balance >= 0),
    expected_balance DECIMAL(18, 2),
    difference      DECIMAL(18, 2),
    notes           TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'closed', 'reconciled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_cash_registers_school_id ON cash_registers(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_account_id ON cash_registers(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_status ON cash_registers(school_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_date ON cash_registers(school_id, opened_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_opened_by ON cash_registers(opened_by) WHERE deleted_at IS NULL;

-- ============================================================
-- 2. daily_cash — Daily cash position snapshots
-- Pre-computed daily summaries for each account
-- ============================================================
CREATE TABLE daily_cash (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    cash_date       DATE NOT NULL,
    opening_balance DECIMAL(18, 2) NOT NULL,
    total_cash_in   DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_cash_in >= 0),
    total_cash_out  DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (total_cash_out >= 0),
    closing_balance DECIMAL(18, 2) NOT NULL,
    difference      DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0 CHECK (transaction_count >= 0),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, account_id, cash_date)
);

CREATE INDEX idx_daily_cash_school_id ON daily_cash(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_account_id ON daily_cash(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_date ON daily_cash(school_id, cash_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_date_range ON daily_cash(school_id, account_id, cash_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_summary ON daily_cash(school_id, cash_date, closing_balance) WHERE deleted_at IS NULL;

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE TRIGGER set_cash_registers_updated_at
    BEFORE UPDATE ON cash_registers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_daily_cash_updated_at
    BEFORE UPDATE ON daily_cash
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

