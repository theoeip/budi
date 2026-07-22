# Finance Schema — BUDI Database

> Detailed table schemas, columns, types, constraints, and indexes for the Finance module.

---

## 1. Core System Tables

### 1.1 `schools`

**Purpose:** Tenant/school entity for multi-tenant isolation.

```sql
CREATE TABLE schools (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    address         TEXT,
    phone           VARCHAR(50),
    email           VARCHAR(255),
    logo_url        TEXT,
    website         VARCHAR(255),
    currency        VARCHAR(10) NOT NULL DEFAULT 'IDR',
    timezone        VARCHAR(50) NOT NULL DEFAULT 'Asia/Jakarta',
    fiscal_year_start DATE,
    fiscal_year_end   DATE,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    settings        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE UNIQUE INDEX idx_schools_slug ON schools(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_schools_is_active ON schools(is_active) WHERE deleted_at IS NULL;
```

### 1.2 `profiles`

**Purpose:** Extended user profiles linked to Supabase `auth.users`.

```sql
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    phone           VARCHAR(50),
    is_active       BOOLEAN NOT NULL DEFAULT true,
    last_sign_in_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email) WHERE deleted_at IS NULL;
```

### 1.3 `roles`

**Purpose:** Role definitions for RBAC.

```sql
CREATE TABLE roles (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    level           INTEGER NOT NULL, -- Higher = more privileges
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data inserted via migration
```

### 1.4 `user_roles`

**Purpose:** Many-to-many relationship between users and roles.

```sql
CREATE TABLE user_roles (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(user_id, role_id)
);

-- Indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id) WHERE deleted_at IS NULL;
```

### 1.5 `school_users`

**Purpose:** Links users to schools (which school(s) a user belongs to).

```sql
CREATE TABLE school_users (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles(id),
    is_default      BOOLEAN NOT NULL DEFAULT false,
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, user_id)
);

-- Indexes
CREATE INDEX idx_school_users_school_id ON school_users(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_school_users_user_id ON school_users(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_school_users_role_id ON school_users(role_id) WHERE deleted_at IS NULL;
```

### 1.6 `system_settings`

**Purpose:** Global system configuration key-value store.

```sql
CREATE TABLE system_settings (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID REFERENCES schools(id), -- NULL = global setting
    key             VARCHAR(255) NOT NULL,
    value           JSONB NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, key)
);

-- Indexes
CREATE INDEX idx_system_settings_school_id ON system_settings(school_id);
CREATE INDEX idx_system_settings_key ON system_settings(key);
```

---

## 2. Finance Foundation Tables

### 2.1 `account_types`

**Purpose:** Lookup table for types of financial accounts.

```sql
CREATE TABLE account_types (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50), -- Icon identifier
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.2 `payment_methods`

**Purpose:** Lookup table for payment methods.

```sql
CREATE TABLE payment_methods (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code            VARCHAR(50) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    is_system       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2.3 `accounts`

**Purpose:** Financial accounts owned by a school (bank, cash, petty cash).

```sql
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
    opening_balance   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    current_balance   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    is_default        BOOLEAN NOT NULL DEFAULT false,
    metadata          JSONB DEFAULT '{}',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ,
    UNIQUE(school_id, code)
);

-- Indexes
CREATE INDEX idx_accounts_school_id ON accounts(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_type_id ON accounts(account_type_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_accounts_is_active ON accounts(school_id, is_active) WHERE deleted_at IS NULL;
```

### 2.4 `transaction_categories`

**Purpose:** Categories for classifying transactions (income/expense).

```sql
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
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, name, parent_id)
);

-- Indexes
CREATE INDEX idx_categories_school_id ON transaction_categories(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_parent_id ON transaction_categories(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_categories_type ON transaction_categories(school_id, type) WHERE deleted_at IS NULL;
```

---

## 3. Transaction Tables

### 3.1 `transactions`

**Purpose:** Core financial transaction records. Supports cash in, cash out, transfer, and
adjustment.

```sql
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

-- Indexes — critical for performance at scale
CREATE INDEX idx_transactions_school_id ON transactions(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_account_id ON transactions(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_category_id ON transactions(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_type ON transactions(school_id, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_status ON transactions(school_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_date ON transactions(school_id, transaction_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_date_range ON transactions(school_id, transaction_date, type) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created_by ON transactions(created_by) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_created_at ON transactions(school_id, created_at) WHERE deleted_at IS NULL;
-- Full-text search index for description and notes
CREATE INDEX idx_transactions_search ON transactions USING gin(
    to_tsvector('indonesian', coalesce(description, '') || ' ' || coalesce(notes, ''))
) WHERE deleted_at IS NULL;
```

### 3.2 `transaction_items`

**Purpose:** Line items for detailed transaction breakdown (e.g., fee components).

```sql
CREATE TABLE transaction_items (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id  UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    description     VARCHAR(255) NOT NULL,
    quantity        INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price      DECIMAL(18, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal        DECIMAL(18, 2) NOT NULL CHECK (subtotal >= 0),
    notes           TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_transaction_items_transaction_id ON transaction_items(transaction_id) WHERE deleted_at IS NULL;
```

### 3.3 `attachments`

**Purpose:** File attachments linked to transactions or other entities.

```sql
CREATE TABLE attachments (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    transaction_id  UUID REFERENCES transactions(id) ON DELETE SET NULL,
    entity_type     VARCHAR(50) NOT NULL, -- 'transaction', 'report', etc.
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

-- Indexes
CREATE INDEX idx_attachments_school_id ON attachments(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_transaction_id ON attachments(transaction_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_attachments_entity ON attachments(entity_type, entity_id) WHERE deleted_at IS NULL;
```

---

## 4. Cash Management Tables

### 4.1 `cash_registers`

**Purpose:** Cash register sessions — opening and closing balances.

```sql
CREATE TABLE cash_registers (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    opened_by       UUID NOT NULL REFERENCES profiles(id),
    closed_by       UUID REFERENCES profiles(id),
    opened_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at       TIMESTAMPTZ,
    opening_balance DECIMAL(18, 2) NOT NULL,
    closing_balance DECIMAL(18, 2),
    expected_balance DECIMAL(18, 2),
    difference      DECIMAL(18, 2),
    notes           TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open', 'closed', 'reconciled')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_cash_registers_school_id ON cash_registers(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_account_id ON cash_registers(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_status ON cash_registers(school_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_cash_registers_date ON cash_registers(school_id, opened_at) WHERE deleted_at IS NULL;
```

### 4.2 `daily_cash`

**Purpose:** Daily cash position and reconciliation for each account.

```sql
CREATE TABLE daily_cash (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    account_id      UUID NOT NULL REFERENCES accounts(id),
    cash_date       DATE NOT NULL,
    opening_balance DECIMAL(18, 2) NOT NULL,
    total_cash_in   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    total_cash_out  DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL,
    difference      DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ,
    UNIQUE(school_id, account_id, cash_date)
);

-- Indexes
CREATE INDEX idx_daily_cash_school_id ON daily_cash(school_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_account_id ON daily_cash(account_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_date ON daily_cash(school_id, cash_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_daily_cash_date_range ON daily_cash(school_id, account_id, cash_date) WHERE deleted_at IS NULL;
```

---

## 5. Report Tables

### 5.1 `monthly_reports`

**Purpose:** Pre-computed monthly financial summaries for performance.

```sql
CREATE TABLE monthly_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year            INTEGER NOT NULL CHECK (year >= 2000),
    month           INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0,
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    category_breakdown JSONB DEFAULT '[]',
    account_breakdown   JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, year, month)
);

-- Indexes
CREATE INDEX idx_monthly_reports_school_id ON monthly_reports(school_id);
CREATE INDEX idx_monthly_reports_period ON monthly_reports(school_id, year, month);
```

### 5.2 `semester_reports`

**Purpose:** Pre-computed semester financial summaries.

```sql
CREATE TABLE semester_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year   VARCHAR(20) NOT NULL, -- e.g., '2024/2025'
    semester        INTEGER NOT NULL CHECK (semester IN (1, 2)),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0,
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    category_breakdown JSONB DEFAULT '[]',
    account_breakdown   JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, academic_year, semester)
);

-- Indexes
CREATE INDEX idx_semester_reports_school_id ON semester_reports(school_id);
CREATE INDEX idx_semester_reports_period ON semester_reports(school_id, academic_year, semester);
```

### 5.3 `yearly_reports`

**Purpose:** Pre-computed yearly financial summaries.

```sql
CREATE TABLE yearly_reports (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year            INTEGER NOT NULL CHECK (year >= 2000),
    total_income    DECIMAL(18, 2) NOT NULL DEFAULT 0,
    total_expense   DECIMAL(18, 2) NOT NULL DEFAULT 0,
    net_balance     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    opening_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(18, 2) NOT NULL DEFAULT 0,
    transaction_count INTEGER NOT NULL DEFAULT 0,
    monthly_breakdown JSONB DEFAULT '[]',
    category_breakdown  JSONB DEFAULT '[]',
    account_breakdown    JSONB DEFAULT '[]',
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_id, year)
);

-- Indexes
CREATE INDEX idx_yearly_reports_school_id ON yearly_reports(school_id);
CREATE INDEX idx_yearly_reports_period ON yearly_reports(school_id, year);
```

---

## 6. Audit Tables

### 6.1 `audit_logs`

**Purpose:** Immutable audit trail for sensitive operations.

```sql
CREATE TABLE audit_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID REFERENCES schools(id),
    user_id         UUID REFERENCES profiles(id),
    action          VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'reconcile', 'export'
    entity_type     VARCHAR(50) NOT NULL, -- 'transaction', 'account', 'category', etc.
    entity_id       UUID,
    changes         JSONB, -- Before/after values
    ip_address      INET,
    user_agent      TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes — audit logs are append-only, no deletes
CREATE INDEX idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(school_id, created_at);

-- Make audit_logs immutable (cannot be updated or deleted)
-- This is enforced via RLS — no UPDATE or DELETE policies
```

---

## Performance Design Decisions

| Decision                                        | Rationale                                        |
| ----------------------------------------------- | ------------------------------------------------ |
| `DECIMAL(18, 2)` for money                      | Exact precision, no floating-point errors        |
| Partial indexes with `WHERE deleted_at IS NULL` | Smaller index size, faster queries               |
| Composite indexes on `(school_id, column)`      | Optimized for multi-tenant queries               |
| GIN index for full-text search                  | Fast search on description/notes                 |
| Pre-computed report tables                      | Avoid expensive aggregation queries at read time |
| JSONB for breakdowns                            | Flexible schema for report data                  |
| `CHECK` constraints                             | Data integrity at database level                 |

---

## Related Documents

- [Database Overview](database-overview.md)
- [Relationship Diagram](relationship-diagram.md)
- [RLS Strategy](rls-strategy.md)
- [Migration Plan](migration-plan.md)
