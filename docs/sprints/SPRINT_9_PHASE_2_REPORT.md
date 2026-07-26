# Sprint 9 Phase 2 Report: Employee Service & Repository Layer

## 1. Overview
The domain, service, and repository layers for the Teachers & Staff Management module have been fully implemented according to the locked Migration 012 schema and the RPC extensions in Migration 013. The architecture strictly enforces privacy boundaries, atomicity, state machine constraints, and robust caching.

## 2. Files Created & Modified

### Database Migrations
- `[NEW]` `supabase/migrations/013_employee_rpcs.sql`: Implements atomic `set_department_head` operation.

### Packages & Shared Logic
- `[NEW]` `packages/utils/src/errors.ts`: Core `DomainError` foundation.
- `[MOD]` `packages/utils/src/index.ts`: Exports domain errors.
- `[NEW]` `packages/types/src/employee.types.ts`: Typings based on Supabase generated schema.
- `[MOD]` `packages/types/src/index.ts`: Exports employee types.

### Services (`apps/web/src/modules/employees/services/`)
- `[NEW]` `employeeService.ts`
- `[NEW]` `employeeProfileService.ts`
- `[NEW]` `employeeHrService.ts`
- `[NEW]` `employeeCapabilityService.ts`
- `[NEW]` `employeeDepartmentService.ts`
- `[NEW]` `__tests__/employee.test.ts`

### Repositories (`apps/web/src/modules/employees/repositories/`)
- `[NEW]` `employeeKeys.ts`
- `[NEW]` `useEmployeeRepository.ts`
- `[NEW]` `useEmployeeProfileRepository.ts`
- `[NEW]` `useEmployeeHrRepository.ts`
- `[NEW]` `useEmployeeCapabilityRepository.ts`
- `[NEW]` `useEmployeeDepartmentRepository.ts`

## 3. Architecture Details

### Privacy Boundary Implementation
Five distinct services and query hooks perfectly mirror the Phase 1 database boundaries:
1. **Directory**: `employeeService`, `employeeCapabilityService`, `employeeDepartmentService`
2. **Personal**: `employeeProfileService`
3. **HR-Sensitive**: `employeeHrService`

There is no "Get Everything" method. UI components must explicitly request HR data, guaranteeing RLS enforcement at both the API call and component-tree levels.

### Employment State Machine
Implemented in `employeeService.updateStatus(id, newStatus)`. 
Terminal states (`Terminated`, `Archived`, `Retired`) are locked. Any attempt to transition out of a terminal state throws an `InvalidEmploymentStatusTransitionError`.

### Atomic Operations
To guarantee data integrity and prevent `unique_violation` constraint errors, Department Head replacement is executed entirely within Postgres via the newly introduced `set_department_head(employee_id, dept_id)` RPC. The RPC internally validates active status, tenant isolation, handles soft deletes, and unsets the prior head atomically.

### Domain Error Mapping
Database errors (like Postgres constraint code `23505`) are aggressively mapped into the UI-friendly `DomainError` subclasses:
- `DuplicateEmployeeNumberError`
- `DuplicateCapabilityError`
- `DuplicateDepartmentAssignmentError`
- `EmployeeNotFoundError` / `EmployeeProfileNotFoundError` / `EmployeeHRRecordNotFoundError`

### Cache Invalidation Strategy
The `employeeKeys.ts` factory separates query keys by privacy tier. Mutations invalidate precisely:
- `useUpdateEmployeeProfile()` -> invalidates `employeeKeys.profile(id)` only.
- `useUpdateEmployeeHrRecord()` -> invalidates `employeeKeys.hr(id)` only.
- `useSetDepartmentHead()` -> invalidates `employeeKeys.departments(id)` and `employeeKeys.lists()` globally.

## 4. Automated Test Results
- **Database Validation (`validate_013.sql`)**: 6/6 tests passed. Successfully verified RPC tenant isolation, atomic replacement, single-head retention, cross-school block, inactive-employee block, and unauthorized bypass rejection.
- **Service Validation (`employee.test.ts`)**: Vitest unit test suite covering state machine blocking, error mappings, capability constants, and distinct cache key isolation passed.

## 5. Build & Type Verification
- **Typecheck**: `pnpm typecheck` passed (0 errors) in all packages.
- **Lint**: `pnpm lint` passed (0 errors).
- **Test**: `pnpm test` passed.
- **Build**: `pnpm build` succeeded for all packages.

## 6. Known Issues
None.

## 7. Phase 3 Readiness
The logic, state, and data fetching layers for the Employee module are robust, strongly typed, properly insulated against PostgreSQL constraint leaks, and tested.

Sprint 9 is fully ready for Phase 3 (UI Implementation & React Router Integration).
