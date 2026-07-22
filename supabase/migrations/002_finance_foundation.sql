-- BUDI Finance Module — Migration 002: Finance Foundation
-- Creates lookup tables and financial account structures.
-- Dependencies: Migration 001 (schools, profiles, roles)

-- ============================================================
-- 1. account_types — Types of financial accounts
-- ============================================================
CREATE TABLE account_types (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_account_types_code ON account_types(code);

-- ============================================================
-- 2. payment_methods — Available payment methods
-- ============================================================
CREATE TABLE payment_methods (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_payment_methods_code ON payment_methods(code);

-- ============================================================
-- 3. accounts — Financial accounts (bank, cash, petty cash)
-- ============================================================
CREATE TABLE accounts (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_type_id   UUID NOT NULL REFERENCES account_types(id),
    code              VARCHAR(50) NOT NULL,
    name              VARCHAR(255) NOT NULL,
    account_number    VARCHAR(100),
    bank_name         VARCHAR(255),
    currency          VARCHAR(10) NOT NULL DEFAULT 'IDR',
    description       TEXT,
    opening_balance   DECIMAL(18, 2) NOT NULL DEFAULT 0 CHECK (opening_balance >= 0),
    current_balance   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    is_default        BOOLEAN NOT NULL DEFAULT false,
    metadata          JSONB DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ,
    UNIQUE(school_id, code)
);

CREATE INDEX idx_accounts_school_id ON accounts(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_type_id ON accounts(account_type_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_is_active ON accounts(school_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_balance ON accounts(school_id, current_balance) WHERE deleted_at IS NULL;

-- ============================================================
-- 4. transaction_categories — Income/expense categories
-- ============================================================
CREATE TABLE transaction_categories (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    parent_id       UUID REFERENCES transaction_categories(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'adjustment')),
    color           VARCHAR(20),
    icon            VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, name, parent_id)
);

CREATE INDEX idx_categories_school_id ON transaction_categories(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_parent_id ON transaction_categories(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_type ON transaction_categories(school_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_active ON transaction_categories(school_id, is_active) WHERE deleted_at IS NULL;

-- ============================================================
-- Updated_at triggers for finance foundation tables
-- ============================================================
CREATE TRIGGER set_account_types_updated_at
    BEFORE UPDATE ON account_types
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_transaction_categories_updated_at
    BEFORE UPDATE ON transaction_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

