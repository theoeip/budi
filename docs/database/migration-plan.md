# Migration Plan — BUDI Finance Module

> Strategy and execution plan for database migrations.

---

## 📋 Table of Contents

1. [Migration Strategy](#migration-strategy)
2. [Migration Groups](#migration-groups)
3. [Execution Plan](#execution-plan)
4. [Rollback Strategy](#rollback-strategy)
5. [Naming Convention](#naming-convention)

---

## Migration Strategy

BUDI uses **Supabase migrations** managed via the Supabase CLI.

### Workflow

```bash
# 1. Create a new migration
supabase migration new add_finance_tables

# 2. Edit the generated SQL file
# File: supabase/migrations/YYYYMMDDHHMMSS_add_finance_tables.sql

# 3. Apply to local database
supabase db push

# 4. Generate TypeScript types
supabase gen types typescript --local > packages/types/src/supabase.ts
```

### Rules

1. **Never modify an existing migration** — Create a new one
2. **One logical change per migration** — Keeps things traceable
3. **All migrations are idempotent** — Use `IF NOT EXISTS` / `IF EXISTS`
4. **Test locally first** — Always run `supabase db push` locally
5. **Version control** — All migrations committed to git

---

## Migration Groups

The Finance schema is split into **6 migration files** based on logical grouping.

| #   | Migration Name           | Tables                                                              | Dependencies              |
| --- | ------------------------ | ------------------------------------------------------------------- | ------------------------- |
| 1   | `001_core_tables`        | schools, profiles, roles, user_roles, school_users, system_settings | None (auth schema exists) |
| 2   | `002_finance_foundation` | account_types, payment_methods, accounts, transaction_categories    | Migration 001             |
| 3   | `003_transactions`       | transactions, transaction_items, attachments                        | Migration 002             |
| 4   | `004_cash_management`    | cash_registers, daily_cash                                          | Migration 003             |
| 5   | `005_reports`            | monthly_reports, semester_reports, yearly_reports                   | Migration 003             |
| 6   | `006_audit_and_seed`     | audit_logs + seed data                                              | Migration 001             |

---

## Execution Plan

### Migration 001: Core Tables

```bash
supabase migration new 001_core_tables
```

**Contents:**

- `CREATE TABLE schools`
- `CREATE TABLE profiles` (references `auth.users`)
- `CREATE TABLE roles`
- `CREATE TABLE user_roles`
- `CREATE TABLE school_users`
- `CREATE TABLE system_settings`
- All indexes, constraints, triggers

**Dependencies:** Supabase `auth` schema must exist **Reverse:** `DROP TABLE IF EXISTS` in reverse
order

### Migration 002: Finance Foundation

```bash
supabase migration new 002_finance_foundation
```

**Contents:**

- `CREATE TABLE account_types`
- `CREATE TABLE payment_methods`
- `CREATE TABLE accounts` (references schools, account_types)
- `CREATE TABLE transaction_categories` (self-referencing parent_id)
- All indexes, constraints, triggers

**Dependencies:** Migration 001 **Reverse:** `DROP TABLE IF EXISTS` in reverse order

### Migration 003: Transactions

```bash
supabase migration new 003_transactions
```

**Contents:**

- `CREATE TABLE transactions` (core table — most complex)
- `CREATE TABLE transaction_items`
- `CREATE TABLE attachments`
- All indexes (including GIN for full-text search)
- All CHECK constraints

**Dependencies:** Migration 002 **Reverse:** `DROP TABLE IF EXISTS` in reverse order

### Migration 004: Cash Management

```bash
supabase migration new 004_cash_management
```

**Contents:**

- `CREATE TABLE cash_registers`
- `CREATE TABLE daily_cash`
- All indexes, unique constraints

**Dependencies:** Migration 003 **Reverse:** `DROP TABLE IF EXISTS` in reverse order

### Migration 005: Reports

```bash
supabase migration new 005_reports
```

**Contents:**

- `CREATE TABLE monthly_reports`
- `CREATE TABLE semester_reports`
- `CREATE TABLE yearly_reports`
- All indexes, unique constraints
- Trigger functions for auto-generation

**Dependencies:** Migration 003 **Reverse:** `DROP TABLE IF EXISTS` in reverse order

### Migration 006: Audit & Seed Data

```bash
supabase migration new 006_audit_and_seed
```

**Contents:**

- `CREATE TABLE audit_logs` (append-only)
- RLS helper functions: `auth.current_school_id()`, `auth.current_role_code()`,
  `auth.is_super_admin()`
- Enable RLS on all tables
- Seed data for:
  - `roles` (super_admin, school_admin, treasurer, viewer)
  - `account_types` (bank, cash, petty_cash)
  - `payment_methods` (cash, bank_transfer, credit_card, debit_card, check, other)
- Sample school and admin user for development

**Dependencies:** Migration 001 **Reverse:** `DROP FUNCTION IF EXISTS`, `DELETE FROM` seed tables

---

## Rollback Strategy

Each migration is designed to be reversible:

```sql
-- Rollback template
BEGIN;
    DROP TABLE IF EXISTS {table_name} CASCADE;
    -- Remove indexes
    -- Remove triggers
COMMIT;
```

### Rollback Order

To fully rollback the Finance module:

```bash
# 1. Rollback in reverse order
supabase migration repair --status reverted 006_audit_and_seed
supabase migration repair --status reverted 005_reports
supabase migration repair --status reverted 004_cash_management
supabase migration repair --status reverted 003_transactions
supabase migration repair --status reverted 002_finance_foundation
supabase migration repair --status reverted 001_core_tables
```

**NEVER rollback in production** — instead, create a new migration to fix issues.

---

## Naming Convention

```
{sequence}_{descriptive_name}.sql
```

| Sequence | Name               | Example                      |
| -------- | ------------------ | ---------------------------- |
| 001      | Core tables        | `001_core_tables.sql`        |
| 002      | Finance foundation | `002_finance_foundation.sql` |
| 003      | Transactions       | `003_transactions.sql`       |
| 004      | Cash management    | `004_cash_management.sql`    |
| 005      | Reports            | `005_reports.sql`            |
| 006      | Audit and seed     | `006_audit_and_seed.sql`     |

---

## File Location

All migrations go to:

```
supabase/
└── migrations/
    ├── 001_core_tables.sql
    ├── 002_finance_foundation.sql
    ├── 003_transactions.sql
    ├── 004_cash_management.sql
    ├── 005_reports.sql
    └── 006_audit_and_seed.sql
```

---

## Related Documents

- [Finance Schema](finance-schema.md)
- [Database Overview](database-overview.md)
- [Relationship Diagram](relationship-diagram.md)
- [RLS Strategy](rls-strategy.md)
