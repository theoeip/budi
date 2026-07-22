# RLS Strategy — BUDI Finance Module

> Row Level Security policy architecture, templates, and implementation strategy.

---

## 📋 Table of Contents

1. [RLS Principles](#rls-principles)
2. [Helper Functions](#helper-functions)
3. [Tenant Isolation Policies](#tenant-isolation-policies)
4. [Role-Based Policies](#role-based-policies)
5. [Policy Templates](#policy-templates)
6. [Policy Matrix](#policy-matrix)
7. [Implementation Order](#implementation-order)
8. [Testing Strategy](#testing-strategy)

---

## RLS Principles

1. **Enable RLS on every business table** — No exceptions
2. **Default deny** — If no policy matches, access is denied
3. **School isolation** — Every policy checks `school_id`
4. **Role awareness** — Policies differentiate by user role
5. **Least privilege** — Minimum access required for each operation
6. **Append-only for audit** — `audit_logs` is immutable

---

## Helper Functions

These are database functions used by RLS policies to determine the current user's context.

### `auth.current_school_id()`

Returns the school_id of the currently authenticated user.

```sql
CREATE OR REPLACE FUNCTION auth.current_school_id()
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
```

### `auth.current_role_code()`

Returns the role code of the currently authenticated user for their current school.

```sql
CREATE OR REPLACE FUNCTION auth.current_role_code()
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
```

### `auth.is_super_admin()`

Returns true if the current user is a super admin.

```sql
CREATE OR REPLACE FUNCTION auth.is_super_admin()
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
```

---

## Tenant Isolation Policies

### Pattern: School Scoping

Every business table follows this pattern:

```sql
-- SELECT: Users can only see their school's data (or all schools if super admin)
CREATE POLICY "tenant_isolation_select" ON {table_name}
    FOR SELECT
    USING (
        school_id = auth.current_school_id()
        OR auth.is_super_admin()
    );

-- INSERT: Users can only insert data for their school
CREATE POLICY "tenant_isolation_insert" ON {table_name}
    FOR INSERT
    WITH CHECK (
        school_id = auth.current_school_id()
        OR auth.is_super_admin()
    );

-- UPDATE: Users can only update their school's data
CREATE POLICY "tenant_isolation_update" ON {table_name}
    FOR UPDATE
    USING (school_id = auth.current_school_id() OR auth.is_super_admin())
    WITH CHECK (school_id = auth.current_school_id() OR auth.is_super_admin());

-- DELETE: Only admins can delete (soft delete)
CREATE POLICY "tenant_isolation_delete" ON {table_name}
    FOR DELETE
    USING (
        (school_id = auth.current_school_id() AND auth.current_role_code() IN ('super_admin', 'school_admin'))
        OR auth.is_super_admin()
    );
```

### Tables with Tenant Isolation

All tables with `school_id`:

1. `accounts`
2. `transaction_categories`
3. `transactions`
4. `transaction_items` (inherits via transaction)
5. `attachments`
6. `cash_registers`
7. `daily_cash`
8. `monthly_reports`
9. `semester_reports`
10. `yearly_reports`
11. `school_users`
12. `system_settings`

---

## Role-Based Policies

### Role Definitions

| Role           | Level | Description                            |
| -------------- | ----- | -------------------------------------- |
| `super_admin`  | 100   | Full access across all schools         |
| `school_admin` | 80    | Full access within their school        |
| `treasurer`    | 60    | Finance operations within their school |
| `viewer`       | 20    | Read-only access within their school   |

### Role Permissions Matrix

| Operation           | super_admin | school_admin | treasurer | viewer |
| ------------------- | ----------- | ------------ | --------- | ------ |
| SELECT (any school) | ✅          | ❌           | ❌        | ❌     |
| SELECT (own school) | ✅          | ✅           | ✅        | ✅     |
| INSERT              | ✅          | ✅           | ✅        | ❌     |
| UPDATE              | ✅          | ✅           | ✅        | ❌     |
| DELETE (hard)       | ✅          | ❌           | ❌        | ❌     |
| DELETE (soft)       | ✅          | ✅           | ✅        | ❌     |
| Export data         | ✅          | ✅           | ✅        | ✅     |
| Manage accounts     | ✅          | ✅           | ❌        | ❌     |
| Manage categories   | ✅          | ✅           | ❌        | ❌     |
| Reconcile           | ✅          | ✅           | ✅        | ❌     |
| View reports        | ✅          | ✅           | ✅        | ✅     |
| Generate reports    | ✅          | ✅           | ✅        | ❌     |

---

## Policy Templates

### Template 1: Finance Transaction Policy

```sql
-- transactions table

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 1. Super admin can do everything
CREATE POLICY "super_admin_all_access" ON transactions
    FOR ALL
    USING (auth.is_super_admin())
    WITH CHECK (auth.is_super_admin());

-- 2. School-scoped select
CREATE POLICY "school_scoped_select" ON transactions
    FOR SELECT
    USING (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.school_users su
            WHERE su.user_id = auth.uid()
            AND su.school_id = school_id
            AND su.deleted_at IS NULL
        )
    );

-- 3. School-scoped insert
CREATE POLICY "school_scoped_insert" ON transactions
    FOR INSERT
    WITH CHECK (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.school_users su
            JOIN public.roles r ON r.id = su.role_id
            WHERE su.user_id = auth.uid()
            AND su.school_id = school_id
            AND r.code IN ('super_admin', 'school_admin', 'treasurer')
            AND su.deleted_at IS NULL
        )
    );

-- 4. School-scoped update (no status changes for cancelled/voided)
CREATE POLICY "school_scoped_update" ON transactions
    FOR UPDATE
    USING (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.school_users su
            WHERE su.user_id = auth.uid()
            AND su.school_id = school_id
            AND su.deleted_at IS NULL
        )
    )
    WITH CHECK (
        school_id = auth.current_school_id()
    );

-- 5. Soft delete (only school_admin and above)
CREATE POLICY "school_scoped_soft_delete" ON transactions
    FOR UPDATE
    USING (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.school_users su
            JOIN public.roles r ON r.id = su.role_id
            WHERE su.user_id = auth.uid()
            AND su.school_id = school_id
            AND r.code IN ('super_admin', 'school_admin')
            AND su.deleted_at IS NULL
        )
    )
    WITH CHECK (
        deleted_at IS NOT NULL
    );
```

### Template 2: Read-Only for Viewer Role

```sql
-- Viewer role can only SELECT, never INSERT/UPDATE/DELETE
-- This is achieved by NOT creating INSERT/UPDATE/DELETE policies for viewers
-- Since RLS defaults to deny, they will be blocked.
```

### Template 3: Audit Logs (Append-Only)

```sql
-- audit_logs table — immutable, append-only

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Insert — any authenticated user can create audit logs
CREATE POLICY "audit_logs_insert" ON audit_logs
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Select — users can see audit logs for their school
CREATE POLICY "audit_logs_select" ON audit_logs
    FOR SELECT
    USING (
        school_id = auth.current_school_id()
        OR auth.is_super_admin()
    );

-- 3. No UPDATE or DELETE policies — audit logs are immutable
```

### Template 4: System Settings

```sql
-- system_settings table

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Super admin can manage global settings (school_id IS NULL)
CREATE POLICY "super_admin_global_settings" ON system_settings
    FOR ALL
    USING (auth.is_super_admin())
    WITH CHECK (auth.is_super_admin());

-- School-scoped settings
CREATE POLICY "school_settings_select" ON system_settings
    FOR SELECT
    USING (
        school_id = auth.current_school_id()
        OR school_id IS NULL
        OR auth.is_super_admin()
    );

CREATE POLICY "school_settings_manage" ON system_settings
    FOR INSERT
    WITH CHECK (
        school_id = auth.current_school_id()
        AND EXISTS (
            SELECT 1 FROM public.school_users su
            WHERE su.user_id = auth.uid()
            AND su.school_id = school_id
            AND su.deleted_at IS NULL
        )
    );
```

---

## Policy Matrix (Complete)

| Table                  | SELECT             | INSERT             | UPDATE             | DELETE             | Special                        |
| ---------------------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------------------ |
| schools                | All auth ✅        | Super admin only   | Super admin only   | ❌ (disable)       | —                              |
| profiles               | Own + school users | Auth trigger       | Own profile        | ❌                 | Auto-create on signup          |
| roles                  | All auth ✅        | System only        | System only        | ❌                 | Seeded, not managed            |
| user_roles             | School-scoped      | Super/school admin | Super/school admin | Super/school admin | —                              |
| school_users           | School-scoped      | Super/school admin | Super/school admin | Soft: admin        | —                              |
| accounts               | School-scoped      | School admin+      | School admin+      | Soft: school admin | —                              |
| transaction_categories | School-scoped      | School admin+      | School admin+      | Soft: school admin | —                              |
| transactions           | School-scoped      | Treasurer+         | Treasurer+         | Soft: school admin | No status change if reconciled |
| transaction_items      | Via transaction    | Via transaction    | Via transaction    | Via transaction    | Inherits from transaction      |
| attachments            | School-scoped      | Treasurer+         | Owner              | Soft: school admin | —                              |
| payment_methods        | All auth ✅        | System only        | System only        | ❌                 | Seeded                         |
| account_types          | All auth ✅        | System only        | System only        | ❌                 | Seeded                         |
| cash_registers         | School-scoped      | Treasurer+         | Treasurer+         | Soft: school admin | —                              |
| daily_cash             | School-scoped      | System only        | System only        | ❌                 | Auto-generated                 |
| monthly_reports        | School-scoped      | System only        | System only        | ❌                 | Auto-generated                 |
| semester_reports       | School-scoped      | System only        | System only        | ❌                 | Auto-generated                 |
| yearly_reports         | School-scoped      | System only        | System only        | ❌                 | Auto-generated                 |
| audit_logs             | School-scoped      | Any auth           | ❌                 | ❌                 | Append-only                    |
| system_settings        | School-scoped      | School admin+      | School admin+      | ❌                 | Global + per-school            |

---

## Implementation Order

When implementing RLS policies, follow this order:

1. **Create helper functions** — `auth.current_school_id()`, `auth.current_role_code()`,
   `auth.is_super_admin()`
2. **Enable RLS on all tables** — One transaction per table
3. **Core tables** — `schools`, `profiles`, `roles`, `user_roles`, `school_users`
4. **Lookup tables** — `account_types`, `payment_methods`
5. **Finance foundation** — `accounts`, `transaction_categories`
6. **Transaction tables** — `transactions`, `transaction_items`, `attachments`
7. **Cash management** — `cash_registers`, `daily_cash`
8. **Report tables** — `monthly_reports`, `semester_reports`, `yearly_reports`
9. **System tables** — `audit_logs`, `system_settings`
10. **Test** — Verify each policy with different roles

---

## Testing Strategy

```sql
-- Test: Super admin can see all schools
SELECT auth.login_as('super_admin@test.com');
SELECT * FROM transactions; -- Should see all schools

-- Test: School admin can only see their school
SELECT auth.login_as('admin@sman1-jkt.sch.id');
SELECT * FROM transactions; -- Should only see school_id = 'sman1-jkt'

-- Test: Viewer cannot insert
SELECT auth.login_as('viewer@test.com');
INSERT INTO transactions (...) VALUES (...); -- Should fail

-- Test: Treasurer can insert but not delete
SELECT auth.login_as('treasurer@test.com');
INSERT INTO transactions (...) VALUES (...); -- Should succeed
DELETE FROM transactions WHERE id = '...'; -- Should fail
```

---

## Related Documents

- [Finance Schema](finance-schema.md)
- [Database Overview](database-overview.md)
- [Relationship Diagram](relationship-diagram.md)
- [Security](../../docs/security.md)
