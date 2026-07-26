# BUDI Platform Engineering Standards

This document establishes the universal engineering standards and conventions for the BUDI platform. These rules govern all future sprints and code contributions, ensuring scalability, maintainability, and security.

---

## 1. Repository Standards
- **Naming conventions:** CamelCase prefixed with `use` for hooks (e.g., `useAcademicYearRepository.ts`), representing the TanStack Query layer.
- **Folder structure:** Located under `apps/web/src/modules/[moduleName]/repositories/`.
- **Responsibilities:** Strictly responsible for data fetching, caching, invalidation, and providing React hooks.
- **Repository boundaries:** Exactly one repository per Aggregate Root. Never mix multiple aggregates into a single repository file.
- **Query responsibilities:** Wrap `useQuery` to fetch data from the corresponding Service layer.
- **Mutation responsibilities:** Wrap `useMutation` to execute writes and strictly manage query invalidation to ensure UI consistency.
- **TanStack Query rules:** 
  - Query keys must be defined as strongly-typed arrays at the top of the file.
  - Queries must handle `isLoading`, `isError`, and `data` states explicitly.

## 2. Service Standards
- **Rules for CRUD:** Must map 1:1 with Supabase database interactions. Located in `apps/web/src/modules/[moduleName]/services/`.
- **Rules for RPC:** Supabase RPC calls must be heavily typed and reserved for complex transactions that cannot be done natively via PostgREST.
- **Transactions:** Complex multi-table writes should be pushed to the database layer as Stored Procedures to guarantee ACID compliance.
- **Error handling:** Services must catch raw Supabase errors, log them, and throw standardized Domain Errors back to the Repository layer.
- **Logging:** Use structured logging for all mutations and failed queries.
- **Validation:** Rely on database constraints for structural integrity, but services must validate required parameters before network transmission.
- **Retry strategy:** Rely on standard Supabase/TanStack query retry strategies for transient network failures.

## 3. Database Standards
- **Migration naming:** `[XXX]_[description_in_snake_case].sql` (e.g., `010_school_foundation.sql`).
- **Index naming:** `idx_[table_name]_[columns]` (e.g., `idx_classes_school_id`).
- **Constraint naming:** Handled natively or explicitly named as `chk_[table_name]_[rule]`.
- **Foreign key naming:** `fk_[table_name]_[referenced_table]` (if named explicitly, otherwise default Supabase naming is acceptable).
- **Trigger naming:** `trg_[table_name]_[action]` (e.g., `trg_set_updated_at`).
- **Function naming:** `snake_case` (e.g., `current_school_id()`).
- **RLS naming:** `[table_name]_[action]_[role]` (e.g., `accounts_select_auth`).
- **Soft delete rules:** 
  - Never permanently delete records. 
  - Use `deleted_at TIMESTAMPTZ`. 
  - Apply `ON DELETE RESTRICT` for structural foreign keys. 
  - All queries must append `WHERE deleted_at IS NULL`.
- **Audit fields:** Every table MUST have `created_at`, `updated_at`, and `deleted_at`.
- **UUID policy:** Every primary key must be a `UUID DEFAULT gen_random_uuid()`.

## 4. React Standards
- **Folder structure:** Organized by feature module (`modules/[moduleName]/pages/`, `components/`, `hooks/`).
- **Page composition:** Pages act as containers. They fetch data via Repositories and pass props to dumb components.
- **Component separation:** 
  - UI components (Dumb) go in `components/`.
  - Smart logic goes in custom `hooks/`.
- **Hooks:** All complex business logic in React must be extracted into custom hooks.
- **Forms:** Must use `react-hook-form` integrated with Zod for robust validation.
- **Dialogs:** Must be controlled via local state or URL search parameters, completely decoupled from underlying forms.
- **Tables:** Must support empty states, loading skeletons, and error states natively.
- **Loading states:** Always show a skeleton or spinner during asynchronous repository queries.
- **Error states:** Always render a fallback UI if a repository query fails.
- **Empty states:** Always provide contextual empty states (e.g., "No classes found for this academic year") with a CTA if applicable.

## 5. TypeScript Standards
- **Strict mode:** `tsconfig.json` must enforce `"strict": true`.
- **No any:** `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, and type-guard it.
- **Shared types:** Database types must be generated via Supabase CLI into `packages/types/src/supabase.ts` and extended/exported via domain-specific files (e.g., `school.types.ts`).
- **Enums:** Avoid TypeScript `enum`. Use union types (e.g., `type SemesterType = 'Odd' | 'Even'`) to ensure compatibility with Supabase generated types.
- **Interfaces:** Prefer `interface` over `type` for object definitions to allow declaration merging.
- **Utility types:** Use `Pick`, `Omit`, and `Partial` to derive form types from database base types.

## 6. Error Handling Standards
- **Domain errors:** Business logic violations (e.g., "Cannot activate two academic years"). Handled gracefully in the UI.
- **Validation errors:** Zod schema failures. Displayed inline beneath form inputs.
- **Database errors:** PostgREST errors (e.g., foreign key violations). Must be abstracted by the Service layer into readable messages.
- **Network errors:** Handled globally by TanStack Query (offline banners or toast notifications).
- **Permission errors:** HTTP 403 or RLS violations. The UI must redirect to a generic "Access Denied" page or hide the restricted component.

## 7. Testing Standards
- **Unit Test:** `vitest` for pure functions, custom hooks, and Zod schemas.
- **Repository Test:** Mock Supabase client to ensure mutations invalidate the correct query keys.
- **Integration Test:** Ensure pages render correctly with mocked TanStack Query providers.
- **RLS Test:** Must write raw SQL tests (or pgTAP) verifying that standard roles cannot read/write protected rows.
- **Build Validation:** Every PR must pass `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

## 8. Security Standards
- **RLS:** Row Level Security must be enabled on EVERY table in the `public` schema.
- **Authentication:** Managed strictly via Supabase Auth.
- **Authorization:** Handled via RLS `public.current_role_code()` checks at the database layer, mirrored by UI route guards.
- **Input validation:** Zod validation on the frontend; CHECK constraints on the backend.
- **Output sanitization:** React automatically escapes string rendering; avoid `dangerouslySetInnerHTML`.
- **Secrets:** Never hardcode secrets. 
- **Environment variables:** Frontend uses `VITE_` prefixed variables (non-secret). Backend keys remain strictly in server environments.

## 9. Performance Standards
- **Pagination:** Any list expected to exceed 100 items must implement cursor or offset pagination.
- **Lazy loading:** Code-split route pages using React Router's lazy loading.
- **Memoization:** Use `useMemo` for expensive calculations (e.g., filtering large arrays client-side).
- **Caching:** Maximize TanStack Query caching (`staleTime`); do not refetch static master data unnecessarily.
- **Indexes:** Always index `school_id`, `deleted_at`, and foreign keys.
- **Batch queries:** Avoid N+1 queries. Use Supabase joined queries (e.g., `select("*, department:departments(*)")`) to fetch aggregates in a single network request.

## 10. Code Review Checklist
Every Pull Request must verify:
- [ ] **Architecture:** Does this respect module boundaries and the Repository Pattern?
- [ ] **Naming:** Are variables, files, and database objects named according to standard?
- [ ] **Performance:** Are there missing indexes or N+1 query risks?
- [ ] **Security:** Is RLS enforced and correct? Are UI guards in place?
- [ ] **Accessibility:** Do forms have labels? Are empty/error states accessible?
- [ ] **Testing:** Are there unit tests for complex logic? Does the build pass?
- [ ] **Documentation:** Are complex hooks and services documented via JSDoc?

---

## 11. AI Coding Rules
Rules that every AI coding assistant MUST follow during implementation:

1. **Never duplicate code:** Utilize existing generic components (e.g., `Card`, `Button`, `Table`) in `@shared/components`.
2. **Never bypass Repository Pattern:** React components must never import `supabase` directly. All data fetching routes through Repositories.
3. **Never bypass RLS:** Database functions and migrations must respect `school_id` tenant isolation and use `SECURITY DEFINER` safely with `SET search_path = ''`.
4. **Never use inline SQL when Repository exists:** Use the Supabase JS client in the Service layer.
5. **Never introduce business logic inside React components:** Extract complex data mutations to Custom Hooks or Services.
6. **Always use shared types:** Import types from `@budi/types`, never redefine database schemas inline.
7. **Always use strict TypeScript:** No `any` types. Ensure exact type compliance with Supabase generated definitions.
