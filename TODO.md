# TypeScript Fixes - Progress

## Issues to Fix

- [x] Plan created and approved
- [ ] **Issue 1:** Supabase typing - Add `schools` table to `Database` in
      `packages/types/src/supabase.ts`
- [ ] **Issue 2:** ThemeProvider missing from `@core/theme` - Re-export in
      `apps/web/src/core/theme/index.ts`
- [ ] **Issue 3:** LoginRoute/ProtectedRoute missing from `@core/auth` - Export in
      `apps/web/src/core/auth/index.ts`
- [ ] **Issue 4:** PermissionKey type mismatch - Export `PermissionKey` from utils, use in
      requirePermission.tsx
- [ ] **Issue 5:** React Hook Form resolver type mismatch - Fix school-form.schema.ts
- [ ] **Run `pnpm typecheck`** to verify
- [ ] **Run `pnpm build`** to verify
