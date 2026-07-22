# Database — BUDI

> Database design, schema conventions, and Row Level Security policies.

---

## 📋 Table of Contents

1. [Design Principles](#design-principles)
2. [Schema Convention](#schema-convention)
3. [Multi-Tenant Implementation](#multi-tenant-implementation)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Migrations](#migrations)
6. [Future Tables](#future-tables)

---

## Design Principles

1. **Every business table has `school_id`** — Tenant isolation at row level
2. **UUIDs as primary keys** — For distributed compatibility and security
3. **Timestamps on every table** — `created_at`, `updated_at`
4. **Soft deletes** — Use `deleted_at` instead of hard deletes
5. **Audit trail** — `created_by`, `updated_by` for accountability
6. **Indexes on foreign keys** — Performance for multi-tenant queries

## Schema Convention

### Naming

| Object | Convention | Example |
|--------|------------|---------|
| Tables | `snake_case`, plural | `finance_transactions` |
| Columns | `snake_case` | `school_id`, `amount` |
| Primary Key | `id` (UUID) | `id UUID DEFAULT gen_random_uuid()` |
| Foreign Key | `referenced_table_id` | `school_id`, `category_id` |
| Indexes | `idx_table_column` | `idx_transactions_school_id` |
| Functions | `snake_case` | `get_school_finance_summary()` |

### Common Columns

Every table includes:

```sql
id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
school_id   UUID NOT NULL REFERENCES schools(id),
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at  TIMESTAMPTZ,
created_by  UUID REFERENCES auth.users(id),
updated_by  UUID REFERENCES auth.users(id)
```

## Multi-Tenant Implementation

```sql
-- Every business table has school_id
CREATE TABLE finance_transactions (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id       UUID NOT NULL REFERENCES schools(id),
    category_id     UUID REFERENCES finance_categories(id),
    amount          DECIMAL(15, 2) NOT NULL,
    description     TEXT,
    transaction_date DATE NOT NULL,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by      UUID REFERENCES auth.users(id),
    updated_by      UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_transactions_school_id ON finance_transactions(school_id);
```

## Row Level Security (RLS)

### Enabling RLS

```sql
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
```

### Helper Functions

```sql
-- Function to get current user's school_id
CREATE OR REPLACE FUNCTION auth.current_school_id()
RETURNS UUID
LANGUAGE SQL
STABLE
AS $$
    SELECT school_id FROM public.user_profiles
    WHERE id = auth.uid()
$$;
```

### RLS Policies

```sql
-- Select policy: users can only see their school's data
CREATE POLICY "tenant_isolation_select" ON finance_transactions
    FOR SELECT
    USING (school_id = auth.current_school_id());

-- Insert policy: users can insert to their school
CREATE POLICY "tenant_isolation_insert" ON finance_transactions
    FOR INSERT
    WITH CHECK (school_id = auth.current_school_id());

-- Update policy: users can update their school's data
CREATE POLICY "tenant_isolation_update" ON finance_transactions
    FOR UPDATE
    USING (school_id = auth.current_school_id())
    WITH CHECK (school_id = auth.current_school_id());

-- Delete policy: only school_admin can delete
CREATE POLICY "tenant_isolation_delete" ON finance_transactions
    FOR DELETE
    USING (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'school_admin')
        )
    );
```

### Role-Based Policies

```sql
-- Super admin can see all schools
CREATE POLICY "super_admin_all_schools" ON finance_transactions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'super_admin'
        )
    );

-- Viewer can only read
CREATE POLICY "viewer_read_only" ON finance_transactions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role != 'viewer'
        )
    );
```

## Migrations

Migrations are managed via Supabase CLI.

```bash
# Create migration
supabase migration new add_finance_tables

# Apply migrations
supabase db push

# Generate types
supabase gen types typescript --local > packages/types/src/supabase.ts
```

Migration files: `supabase/migrations/YYYYMMDDHHMMSS_description.sql`

## Future Tables

### Finance Module (Active)

- `finance_transactions`
- `finance_categories`
- `finance_accounts`
- `finance_reports`
- `finance_budgets`
- `finance_invoices`
- `finance_payments`

### Other Modules (Placeholder)

- **Student:** `students`, `student_documents`, `student_fees`
- **Teacher:** `teachers`, `teacher_assignments`, `teacher_schedules`
- **Academic:** `classes`, `subjects`, `grades`, `exams`
- **Attendance:** `attendance_records`, `attendance_settings`
- **Library:** `books`, `borrowings`, `library_members`
- **Payroll:** `employees`, `salary_components`, `payroll_runs`
- **PPDB:** `applications`, `registration_fees`, `interviews`

---

## Related Documents

- [Architecture](architecture.md)
- [Security Model](security.md)
- [API Guidelines](api-guideline.md)
- [Coding Standard](coding-standard.md)

