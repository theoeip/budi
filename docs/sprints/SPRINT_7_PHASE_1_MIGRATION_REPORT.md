# Sprint 7 Phase 1 — Database Foundation Report

## 1. Migration SQL
The SQL script has been successfully generated and placed at:
[`supabase/migrations/010_school_foundation.sql`](file:///C:/Users/tekaj/Downloads/KULIAH/BUDI/supabase/migrations/010_school_foundation.sql)

## 2. Validation Report
The migration was strictly validated against a clean local database:
- **Command Executed:** `npx supabase db reset`
- **Result:** **SUCCESS**
- **Details:** 
  - All 10 migrations (001 through 010) applied sequentially without errors.
  - The development seed data (`seed.sql`) executed seamlessly on top of the new structure.
  - Syntax verification passed for all 5 new tables (`academic_years`, `semesters`, `departments`, `classes`, `subjects`).
  - Row Level Security (RLS) policies compiled successfully against existing helper functions.
  - Custom PL/pgSQL triggers compiled perfectly.

## 3. Explanation of Design Decisions

### Structural & Tenant Integrity
- **Foreign Key Strategy:** All `school_id` and parent structural relationships (e.g., `academic_year_id`) enforce `ON DELETE RESTRICT`. This explicitly prevents the database from performing cascading hard deletes, ensuring full compliance with our soft-delete architectural standard.
- **Audit Compliance:** Every table implements the standard `id`, `created_at`, `updated_at`, and `deleted_at` footprint. The existing `set_updated_at()` trigger function was reused cleanly for all tables.
- **Soft Delete Enforcement:** All `UNIQUE` constraints are implemented as partial indexes (e.g., `WHERE deleted_at IS NULL`). This allows historical (soft-deleted) names or codes to exist without blocking new active entries from reusing those codes.

### Business Rules Enforcement
- **"Only one active academic year / semester":** Rather than relying on application-level checks which are vulnerable to race conditions, this is enforced at the database level using partial unique indexes:
  ```sql
  CREATE UNIQUE INDEX idx_academic_years_one_active ON academic_years(school_id) WHERE is_active = true AND deleted_at IS NULL;
  ```
- **"Semester dates must stay inside AcademicYear":** Postgres `CHECK` constraints cannot easily cross-reference parent tables. To enforce this, a secure `PL/pgSQL` trigger function (`check_semester_dates()`) runs `BEFORE INSERT OR UPDATE` on `semesters`, raising a fatal exception if dates exceed the parent year's bounds.

### RLS Implementation (RBAC Matrix)
- **Tenant Isolation:** All reads (`SELECT`) enforce `school_id = public.current_school_id()`.
- **Authorization:** Writes (`INSERT`, `UPDATE`) explicitly demand `public.current_role_code() = 'school_admin'`.
- **Super Admin Override:** Every policy safely includes an `OR public.is_super_admin()` clause.
- **Hard Delete Prevention:** No `FOR DELETE` policies were created for any table. It is mathematically impossible for any authenticated user to hard-delete these records via the PostgREST API, forcing the application to use soft-deleting `UPDATE` statements.
