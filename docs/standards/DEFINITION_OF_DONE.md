# BUDI Platform Definition of Done (DoD)

This document establishes the official Definition of Done (DoD) for the BUDI Platform. Every feature, bugfix, migration, and sprint must satisfy these requirements before being eligible for merging into the `main` branch.

---

## 1. Database
- [ ] **Migration runs successfully:** The `UP` migration applies cleanly without manual intervention.
- [ ] **DB reset passes:** Running `npx supabase db reset` locally completes successfully.
- [ ] **RLS verified:** Row Level Security is explicitly enabled on all new tables and thoroughly tested against appropriate role policies.
- [ ] **Foreign keys verified:** All relationships use `ON DELETE RESTRICT` (or the explicitly designed fallback constraint) and validate against existing data.
- [ ] **Indexes verified:** `school_id`, `deleted_at`, and all foreign keys have accompanying database indexes.
- [ ] **Rollback considered:** A clear rollback strategy (revert scripts or backup restoration plan) is documented for the deployment runbook.

## 2. Backend
- [ ] **Repository follows standards:** Exactly one repository per Aggregate Root; no cross-contamination of bounded contexts.
- [ ] **Service follows standards:** Services abstract raw Supabase client logic away from the React layer.
- [ ] **Shared types used:** Database models strictly leverage generated Supabase types mapped to `@budi/types`. No inline/duplicate type definitions.
- [ ] **Error handling implemented:** Supabase/PostgREST errors are correctly caught, sanitized, and passed as structured Domain Errors to the frontend.

## 3. Frontend
- [ ] **Loading state:** Spinners or skeletons are implemented for all asynchronous data fetching.
- [ ] **Empty state:** Contextual UI (and CTAs if applicable) is displayed when lists return zero results.
- [ ] **Error state:** Graceful fallbacks exist for failed queries or network drops.
- [ ] **Responsive layout:** The feature is visually functional across mobile, tablet, and desktop breakpoints.
- [ ] **Accessibility basics:** Forms utilize proper `<label>`, ARIA attributes where complex, and keyboard navigation works cleanly.
- [ ] **Form validation:** `react-hook-form` and `zod` are implemented for robust client-side validation.

## 4. Testing
- [ ] **Typecheck passes:** `pnpm typecheck` succeeds with 0 errors across the monorepo.
- [ ] **Lint passes:** `pnpm lint` succeeds without critical violations.
- [ ] **Build passes:** `pnpm build` bundles production assets successfully.
- [ ] **Unit tests (where applicable):** Complex business logic, utility functions, and Zod schemas have passing tests.
- [ ] **Integration tests (where applicable):** Critical user flows (e.g., login, tenant switching) are verified.

## 5. Security
- [ ] **RLS enforced:** The database structurally isolates tenant data.
- [ ] **No secret exposure:** API keys, secrets, or JWT logic are never hardcoded or exposed in frontend bundles.
- [ ] **Route guards verified:** React Router strictly prevents unauthenticated or unauthorized roles from viewing protected pages.
- [ ] **Input validation:** User input is strictly sanitized and validated before API submission.

## 6. Documentation
- [ ] **Architecture updated if required:** Changes violating or expanding upon the existing Architecture Decision log are documented.
- [ ] **Domain Model updated if required:** New entities, relationships, or state changes are reflected in the Domain Model documentation.
- [ ] **JSDoc for complex logic:** Non-obvious custom hooks or services include comprehensive JSDoc comments.
- [ ] **CHANGELOG updated:** A user-facing explanation of the completed work is recorded.

## 7. Performance
- [ ] **No N+1 queries:** Supabase joins (`select()`) are used to fetch nested aggregates in a single network trip.
- [ ] **Proper indexes:** All query-heavy columns are backed by a B-Tree or partial index.
- [ ] **Pagination where needed:** Lists exceeding 100 theoretical records implement offset/cursor pagination natively.
- [ ] **Query cache configured:** TanStack Query `staleTime` and cache invalidations are explicitly configured to minimize unnecessary network traffic.

## 8. Code Review Checklist
- [ ] **Repository Pattern respected:** React UI absolutely does not import `supabase` directly.
- [ ] **Module boundaries respected:** `schools` logic remains in `schools`, `finance` logic remains in `finance`.
- [ ] **Naming standards respected:** Files, hooks, components, and SQL tables strictly follow `ENGINEERING_STANDARDS.md`.
- [ ] **No duplicated code:** Common UI elements are extracted to `@shared/components`.
- [ ] **AI Coding Rules respected:** AI assistance artifacts comply completely with the platform's architectural constraints.

## 9. Release Checklist
- [ ] **Smoke test completed:** The deployment has been verified in a staging environment simulating production load.
- [ ] **Deployment notes prepared:** A Deployment Runbook exists if the release includes database migrations.
- [ ] **Rollback plan confirmed:** The specific criteria dictating an abort and rollback are known to the deployment owner.

---

## 10. Merge Criteria
> **A feature or pull request may only be merged when EVERY mandatory item in this checklist is satisfied or explicitly marked as N/A with documented justification.**
