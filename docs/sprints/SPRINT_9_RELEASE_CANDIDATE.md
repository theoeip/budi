# Sprint 9 Release Candidate

## 1. Sprint 9 Scope
The scope of Sprint 9 was to implement the **Teachers & Staff Management** module, introducing core Employee database schema, domain services, UI, and module routing. It specifically decoupled Employee data from Authentication data (enabling staffs to exist without login accounts) and established a highly normalized capabilities system, replacing the legacy `is_teaching_staff` column. 

## 2. Migration 012 Summary
`012_employee_management.sql` created the core `employees`, `employee_hr_records`, `employee_departments`, and `employee_capabilities` tables. It successfully backfilled Homeroom Teachers directly into the employees and capabilities structures, ensuring backwards compatibility. The migration included strict RLS policies, isolating HR data aggressively and using soft-deletes natively.

## 3. Migration 013/RPC Summary
`013_employee_rpcs.sql` introduced `set_department_head(p_employee_id UUID, p_department_id UUID)`. This transactional RPC guarantees department head changes are atomic, soft-delete safe, and respect single-tenant isolation boundaries. The service tier strictly uses this single implementation instead of sequential UI calls.

## 4. Module Registry Integration
The module is officially registered as `employees` with the display name **Guru & Staf** via `employees.ts` inside `apps/web/src/core/modules/definitions/`. It leverages the existing `Users` icon. 

## 5. Routing/sidebar integration
Integrated into `@core/router/index.tsx` dynamically and statically binding `/employees` and `/employees/:id` with React Router lazy-loading patterns. Because it's injected into `ModuleRegistry`, the sidebar properly renders for authorized personnel.

## 6. RBAC Matrix Verification
- **super_admin / school_admin**: Has full view and mutation access (Create, Edit, Remove, Status Change, Roles, Departments). HR records are accessible.
- **staff / teacher**: Can view the Employee Directory and standard profile details (enabled via `canManageEmployees: false` logic handling). Completely restricted from HR data and any CRUD mutations in the UI.

## 7. Privacy Verification
- **A.** Employee Directory only exposes public profile fields (name, department, capabilities, standard emails).
- **B.** Initial render of `EmployeeDetailsPage` explicitly delays HR query mounting to avoid `42501 Permission denied` loops.
- **C.** Personal section respects RLS bounds.
- **D.** HR tab conditionally absent for `staff` and `teacher` roles.
- **E.** When authorized, HR records load successfully on tab active.
- **F.** Direct route linking enforces same checks. RLS blocks API-level data exposure.

## 8. CRUD/domain smoke-test results
- **Employee:** Create, View, and Edit behave perfectly.
- **Employment Status:** Valid status transitions execute cleanly. Terminal statuses disable mutations.
- **Capabilities:** Granting and Revoking execute properly.
- **Departments:** Assigning and removing functional.
- **Record Management:** Soft delete labeled successfully as "Remove Erroneous Record" and sets `deleted_at`, completely separate from the "Archived" employment lifecycle. React query cache successfully invalidates.
- **Result:** PASS ✅

## 9. Department Head RPC Verification
`set_department_head` triggers `rpc('set_department_head')` exclusively. There are no sequential calls occurring in the UI layer. `EmployeeDepartmentDialog` triggers this successfully.
- **Result:** PASS ✅

## 10. Automated Test Results
- **Total Test Count (@budi/web):** 40 tests
- **Employee-Specific Test Count:** 20 tests
- **Failures:** 0
- **Warnings:** 0

## 11. Build Results
- `pnpm typecheck`: Passed cleanly. 
- `pnpm lint`: Zero errors (3 warnings on fast-refresh rules, non-blocking).
- `pnpm build`: Completed locally without errors in 3.21s. Vite generated optimized chunks correctly.

## 12. Migration Reset Result
- `npx supabase db reset` successfully applied 001 through 013 sequentially without any failure.

## 13. Git Readiness
- Clean tree. Temporary SQL query validations (`validate_012.sql`, `validate_013.sql`) have been deleted.
- No debug code or `console.log` leftovers found. No duplicate components exist.

## 14. Known Issues
- None at this time.

## 15. Staging Homeroom-Backfill Deployment Gate
**[CRITICAL PREREQUISITE]**
Migration 012 contains automated backfills mapping `classes.homeroom_teacher_id` to the new `employees` table. Before pushing to production, this must be executed in STAGING on a recent production database mirror. 
1. Run dry-run of migration 012.
2. Verify exact match between `classes.homeroom_teacher_id` count and newly created employee profiles.
3. Validate homeroom relationship persists after migration completes.

## 16. Production Deployment Prerequisites
1. Staging Homeroom-Backfill deployment gate verified.
2. Ensure Environment variables for Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are properly populated for CI/CD test phases.

## 17. Rollback/forward-fix strategy
- Standard established strategy is required. If a failure occurs post-deploy: **Backup → Forward-Fix**
- Do NOT assume destructive down migrations are available since RLS and Table Data is extensively modified and mapped during 012. If a production defect occurs, create Migration 014 (or equivalent hotfix) for forward migration. 

## 18. Release Readiness Verdict
**PASS**. The module is fully ready for merge to main and staging deployment.
