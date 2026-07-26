# Sprint 9 Phase 1 Report: Employee Database Foundation

## 1. Database Pre-Flight Findings

Before creating Migration 012, a thorough pre-flight analysis of the local Supabase environment was conducted.

- **Classes with `homeroom_teacher_id IS NOT NULL`**: `0`
- **Distinct referenced `profile_id`s**: None.
- **Dependencies detected**: Only the generated TypeScript types (`packages/types/src/supabase.ts`) depended on the FK. No views, functions, or frontend code relied on `classes.homeroom_teacher_id -> profiles(id)`.
- **Pre-Flight Decision**: **SAFE TO PROCEED**. Although no data backfill was technically required on the local instance, a full PL/pgSQL backfill script was included in Migration 012 to ensure safety when executing against staging/production environments that may contain active data.

## 2. Migration 012 Summary

Created `supabase/migrations/012_employee_management.sql` implementing the approved Teacher & Staff Management architecture.

### Tables Created
1. `employees`: Core HR master identity. Contains `full_name`, `work_email`, `phone`, `employee_number`, `employment_type`, and `employment_status` (Prospective, Active, On Leave, Suspended, Resigned, Retired, Terminated, Archived).
2. `employee_profiles`: Extracted personal demographic data (`gender`, `address`, `date_of_birth`, etc).
3. `employee_hr_records`: Extracted sensitive HR data (`nik`, `npwp`, `contract_details`).
4. `employee_capabilities`: Normalized capabilities mapping (`Teaching`, `Homeroom`, etc).
5. `employee_departments`: Many-to-many department mappings.

### Homeroom FK Migration & Backfill
The `classes.homeroom_teacher_id` foreign key was successfully migrated away from `profiles(id)` to `employees(id)`.
- A temporary `homeroom_employee_id` was added.
- An idempotent `DO $$` block was executed to auto-generate `employees` records for any `profiles` previously mapped as homeroom teachers, granting them the `'Homeroom'` capability.
- The old constraint and column were dropped, and the new column was renamed, preserving existing references without silently altering UUID mappings.

### Constraints & Indexes
- **Employee Number Uniqueness**: `UNIQUE (school_id, employee_number) WHERE deleted_at IS NULL` on `employees`.
- **Capability Uniqueness**: `UNIQUE (employee_id, capability) WHERE deleted_at IS NULL` on `employee_capabilities`.
- **Department Head Uniqueness**: `UNIQUE (department_id) WHERE is_head_of_department = true AND deleted_at IS NULL` on `employee_departments`.
- **Strict Referential Integrity**: All foreign keys enforced with `ON DELETE RESTRICT`.

## 3. Row Level Security (RLS) Matrix

RLS was enabled for all five tables and correctly strictly scopes access.

| Table | SELECT | INSERT / UPDATE |
| :--- | :--- | :--- |
| `employees` (Directory) | Tenant Authenticated Users | `school_admin`, `super_admin` |
| `employee_capabilities` | Tenant Authenticated Users | `school_admin`, `super_admin` |
| `employee_departments` | Tenant Authenticated Users | `school_admin`, `super_admin` |
| `employee_profiles` (Personal) | `school_admin`, `super_admin`, or **Self** | `school_admin`, `super_admin` |
| `employee_hr_records` (Sensitive) | `school_admin`, `super_admin` **ONLY** | `school_admin`, `super_admin` |

*(Note: No `DELETE` policies exist, enforcing the strict soft-delete architecture via `deleted_at` updates).*

## 4. Behavioral SQL Verification

A strict validation-only pass was executed against the local database to guarantee all requested behavioral requirements.

| Test | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| 1. Employee Number Uniqueness | Attempting to create two active employees with the same `employee_number` in the same school rejects the second. | Duplicate rejected with `unique_violation`. Soft-delete allows reuse. | ✅ PASS |
| 2. Capability Uniqueness | Attempting to grant the exact same active `capability` to the same employee rejects the second. | Duplicate rejected with `unique_violation`. | ✅ PASS |
| 3. Department Assignment | Attempting to assign an employee to the same department twice (active) rejects the second. | Duplicate rejected with `unique_violation`. | ✅ PASS |
| 4. Department Head Uniqueness | Attempting to assign a second active head to a department rejects the second. One employee *can* head multiple departments. | Second head rejected. One employee successfully headed two departments. | ✅ PASS |
| 5. HR-Sensitive Self-Read | An authenticated employee querying `employee_hr_records` (where their `profile_id` matches) cannot read their own data. | Zero rows returned for self. Only `school_admin` and `super_admin` can read. | ✅ PASS |
| 6. Personal Self-Read | An authenticated employee querying `employee_profiles` can read their own row, but cannot read a peer's row. | Own row returned. Peer row filtered by RLS. | ✅ PASS |
| 7. Tenant Isolation | An authenticated employee in School A cannot view an employee in School B. | School B employee filtered entirely by RLS. | ✅ PASS |
| 8. Mutation RBAC | An authenticated teacher attempting to `INSERT` an employee is denied. A `school_admin` is allowed. | Teacher `INSERT` denied by RLS. Admin `INSERT` succeeded. | ✅ PASS |
| 9. Homeroom FK Integrity | `classes.homeroom_teacher_id` enforces a strict FK constraint to `employees(id)`. | Attempting to insert a non-existent UUID fails with `foreign_key_violation`. | ✅ PASS |
| 10. Populated Backfill Sim | Simulate a pre-012 state and verify the backfill logic maps `profiles` to `employees`. | *Impractical to mock locally without DDL destruction.* See Staging Procedure. | ⚠️ DRY-RUN REQ |

### Populated Backfill Simulation (Test 10) Impracticality & Staging Procedure
It is impractical to accurately simulate the pre-012 schema locally within a safe transaction because Migration 012 permanently drops the old `homeroom_teacher_id` constraint. To revert this for a test requires dropping and recreating tables which risks desynchronizing the local development schema from the migration ledger. 

**Staging Dry-Run Procedure:**
Before executing Migration 012 in production, a dry-run must be performed in the Staging environment using real obfuscated data:
1. Verify Staging has active classes with `homeroom_teacher_id` pointing to `profiles`.
2. Apply Migration 012 (`supabase db push`).
3. Run: `SELECT count(*) FROM classes c JOIN employees e ON c.homeroom_teacher_id = e.id;` (Should equal the previous non-null count).
4. Run: `SELECT * FROM employee_capabilities WHERE capability = 'Homeroom';` (Should match the distinct teacher count).

## 5. Execution & Build Results

1. **Supabase Reset**: `npx supabase db reset` executed successfully. All migrations (001-012) applied without errors.
2. **Type Generation**: `npx supabase gen types typescript --local` succeeded.
3. **Validation Suite**:
   - `pnpm typecheck`: ✅ Passed (5/5 packages).
   - `pnpm lint`: ✅ Passed (0 errors, warnings are known/existing UI any-types).

## 6. Known Issues
- Local database pre-flight revealed 0 existing homeroom teacher assignments. The automated backfill script remains untested against real populated data. The Staging Dry-Run Procedure is **REQUIRED**.

## 7. Phase 2 Readiness
The database layer for Employee Management is formally complete and locked. The project is fully prepared for Sprint 9 Phase 2 (Service and Repository Implementation).
