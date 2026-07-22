-- BUDI Finance Module — Migration 003: Transactions
-- Creates the core transaction tables for financial operations.
-- Dependencies: Migration 002 (accounts, categories, payment_methods)

-- ============================================================
-- 1. transactions — Core financial transaction records
-- Supports: cash_in, cash_out, transfer, adjustment
-- ============================================================
CREATE TABLE transactions (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id           UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_id          UUID NOT NULL REFERENCES accounts(id),
    category_id         UUID REFERENCES transaction_categories(id),
    transaction_number  VARCHAR(100) NOT NULL,
    receipt_number      VARCHAR(100),
    reference_number    VARCHAR(100),
    type                VARCHAR(20) NOT NULL CHECK (type IN ('cash_in', 'cash_out', 'transfer', 'adjustment')),
    amount              DECIMAL(18, 2) NOT NULL CHECK (amount > 0),
    description         TEXT,
    notes               TEXT,
    transaction_date    DATE NOT NULL,
    due_date            DATE,
    payment_method_id   UUID REFERENCES payment_methods(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded', 'voided')),
    is_reconciled       BOOLEAN NOT NULL DEFAULT false,
    reconciled_at       TIMESTAMPTZ,
    created_by          UUID REFERENCES profiles(id),
    updated_by          UUID REFERENCES profiles(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ,
    UNIQUE(school_id, transaction_number)
);

-- Core performance indexes
CREATE INDEX idx_transactions_school_id ON transactions(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_account_id ON transactions(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_category_id ON transactions(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_payment_method ON transactions(payment_method_id) WHERE deleted_at IS NULL;

-- Query-specific indexes
CREATE INDEX idx_transactions_type ON transactions(school_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_status ON transactions(school_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_date ON transactions(school_id, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_date_type ON transactions(school_id, transaction_date, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created_by ON transactions(created_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created_at ON transactions(school_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_reconciled ON transactions(school_id, is_reconciled) WHERE deleted_at IS NULL;

-- Full-text search index for description and notes (Indonesian language)
CREATE INDEX idx_transactions_search ON transactions USING gin(
    to_tsvector('simple',
        coalesce(description, '') || ' ' ||
        coalesce(notes, '') || ' ' ||
        coalesce(transaction_number, '') || ' ' ||
        coalesce(receipt_number, '') || ' ' ||
        coalesce(reference_number, '')
    )
) WHERE deleted_at IS NULL;

-- Partial index for active (non-deleted) transactions
CREATE INDEX idx_transactions_active ON transactions(school_id, transaction_date DESC)
    WHERE deleted_at IS NULL AND status != 'voided';

-- ============================================================
-- 2. transaction_items — Line items within a transaction
-- ============================================================
CREATE TABLE transaction_items (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    description     VARCHAR(255) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price      DECIMAL(18, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal        DECIMAL(18, 2) NOT NULL CHECK (subtotal >= 0),
    notes           TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transaction_items_sort ON transaction_items(transaction_id, sort_order) WHERE deleted_at IS NULL;

-- ============================================================
-- 3. attachments — File attachments linked to transactions
-- Supports generic entity_type/entity_id pattern
-- ============================================================
CREATE TABLE attachments (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    transaction_id  UUID REFERENCES transactions(id) ON DELETE SET NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    file_name       VARCHAR(255) NOT NULL,
    file_size       INTEGER NOT NULL CHECK (file_size > 0),
    mime_type       VARCHAR(100) NOT NULL,
    file_url        TEXT NOT NULL,
    storage_path    TEXT NOT NULL,
    uploaded_by     UUID REFERENCES profiles(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_attachments_school_id ON attachments(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_transaction_id ON attachments(transaction_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_uploaded_by ON attachments(uploaded_by) WHERE deleted_at IS NULL;

-- ============================================================
-- Updated_at triggers
-- ============================================================
CREATE TRIGGER set_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_transaction_items_updated_at
    BEFORE UPDATE ON transaction_items
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

