# Database Overview — BUDI Finance Module

> High-level overview of the BUDI database architecture for the Finance module.

---

## 📋 Document Index

| Document                                        | Description                                  |
| ----------------------------------------------- | -------------------------------------------- |
| [Finance Schema](finance-schema.md)             | Detailed table schemas, columns, constraints |
| [Relationship Diagram](relationship-diagram.md) | Entity-relationship diagram (Mermaid)        |
| [RLS Strategy](rls-strategy.md)                 | Row Level Security policies and templates    |
| [Migration Plan](migration-plan.md)             | Migration strategy and execution plan        |

---

## Principles

1. **Multi-tenant isolation** — Every business table includes `school_id`
2. **UUID primary keys** — Globally unique, distributed-friendly
3. **Snake case naming** — PostgreSQL convention
4. **Audit fields** — `created_at`, `updated_at`, `deleted_at` on every table
5. **Soft deletes** — Data is never permanently deleted, only marked
6. **Indexed foreign keys** — Performance for school-scoped queries
7. **RLS enforced** — Row Level Security on every business table

---

## Table Groups

### 1. Core System Tables (Authentication & Multi-Tenant)

| Table             | Purpose                                         |
| ----------------- | ----------------------------------------------- |
| `schools`         | Tenant/school entity                            |
| `profiles`        | Extended user profiles (linked to `auth.users`) |
| `roles`           | Role definitions                                |
| `user_roles`      | User-to-role assignments                        |
| `school_users`    | User membership in a school                     |
| `system_settings` | Global system configuration                     |

### 2. Finance Foundation Tables

| Table                    | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `account_types`          | Lookup: type of financial account (bank, cash, petty cash) |
| `payment_methods`        | Lookup: payment methods (cash, transfer, card, etc.)       |
| `accounts`               | Financial accounts owned by a school                       |
| `transaction_categories` | Categories for classifying transactions                    |

### 3. Transaction Tables

| Table               | Purpose                                 |
| ------------------- | --------------------------------------- |
| `transactions`      | Core financial transaction records      |
| `transaction_items` | Line items within a transaction         |
| `attachments`       | File attachments linked to transactions |

### 4. Cash Management Tables

| Table            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `cash_registers` | Cash register sessions (opening/closing) |
| `daily_cash`     | Daily cash position and reconciliation   |

### 5. Report Tables

| Table              | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `monthly_reports`  | Pre-computed monthly financial summaries  |
| `semester_reports` | Pre-computed semester financial summaries |
| `yearly_reports`   | Pre-computed yearly financial summaries   |

### 6. Audit Tables

| Table        | Purpose                              |
| ------------ | ------------------------------------ |
| `audit_logs` | Audit trail for sensitive operations |

---

## Table Count: 19 Tables

| Group              | Count  | Tables                                                              |
| ------------------ | ------ | ------------------------------------------------------------------- |
| Core System        | 6      | schools, profiles, roles, user_roles, school_users, system_settings |
| Finance Foundation | 4      | account_types, payment_methods, accounts, transaction_categories    |
| Transactions       | 3      | transactions, transaction_items, attachments                        |
| Cash Management    | 2      | cash_registers, daily_cash                                          |
| Reports            | 3      | monthly_reports, semester_reports, yearly_reports                   |
| Audit              | 1      | audit_logs                                                          |
| **Total**          | **19** |                                                                     |

---

## Cross-Cutting Concerns

### Multi-Tenant Isolation

Every business table has:

```sql
school_id UUID NOT NULL REFERENCES schools(id)
```

### Common Columns

Every table includes:

```sql
id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
deleted_at  TIMESTAMPTZ
```

### Soft Delete

- `deleted_at IS NULL` = active records
- `deleted_at IS NOT NULL` = soft-deleted records
- All queries filter `WHERE deleted_at IS NULL` by default
- Create partial indexes: `CREATE INDEX ... WHERE deleted_at IS NULL`

### Naming Convention

| Entity       | Convention                     | Example                             |
| ------------ | ------------------------------ | ----------------------------------- |
| Tables       | `snake_case`, plural           | `transactions`, `transaction_items` |
| Columns      | `snake_case`                   | `school_id`, `opening_balance`      |
| Primary Keys | `id`                           | `id UUID DEFAULT gen_random_uuid()` |
| Foreign Keys | `referenced_table_singular_id` | `school_id`, `account_id`           |
| Indexes      | `idx_table_column`             | `idx_transactions_school_id`        |

---

## Related Documents

- [Finance Schema](finance-schema.md)
- [Relationship Diagram](relationship-diagram.md)
- [RLS Strategy](rls-strategy.md)
- [Architecture](../../docs/architecture.md)
