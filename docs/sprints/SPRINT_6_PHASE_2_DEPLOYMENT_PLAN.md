# Sprint 6 Phase 2 — Remote Deployment Plan

## 1. Overview
This document outlines the strategy for deploying Migration 009 (RLS Policies) and the updated `supabase/seed.sql` to the production/remote Supabase environment. This plan ensures zero data loss, minimal downtime, and provides a clear rollback path if issues arise.

## 2. Risk Analysis
- **Downtime Risk:** Low. Adding RLS policies and updating functions via `CREATE OR REPLACE` are non-blocking operations and execute rapidly.
- **Data Loss Risk:** Zero. Migration 009 does not perform any `DROP TABLE`, `DELETE`, or structural modifications to existing data schemas.
- **Access Risk:** Moderate. If the helper functions (`current_school_id`, `current_role_code`, `is_super_admin`) fail in production, authenticated users could be locked out of the Finance module. This risk is heavily mitigated by our exhaustive local testing and avoidance of `DROP FUNCTION` to prevent dependency errors.
- **Backward Compatibility:** High. The frontend strictly expects `treasurer` (level 65), `school_admin`, and `super_admin` to access Finance. The new RLS policies perfectly align with the frontend's RBAC implementation.

## 3. Deployment Sequence
1. **Communication:** Notify stakeholders of the impending database update (Optional, depending on organization policy).
2. **Backup:** Manually trigger a database backup in the remote Supabase dashboard (or via CLI) before pushing.
3. **Link Verification:** Ensure the CLI is linked to the correct remote Supabase project.
4. **Deploy Migration:** Push the migration files to the remote database.
5. **Validation:** Run the post-deployment verification queries on the remote database.
6. **Frontend Deployment:** Deploy the frontend application (if any pending changes exist) pointing to the updated remote database.

## 4. Required Commands
```bash
# 1. Link to the remote project (if not already linked)
npx supabase link --project-ref <YOUR_PROJECT_REF>

# 2. Check remote status and pending migrations
npx supabase db remote info

# 3. Apply pending migrations to the remote database
npx supabase db push
```

*(Note: Do not run `supabase db reset` on remote, as it destroys data. `db push` safely applies only new migrations.)*

## 5. Rollback Strategy
Because Migration 009 only adds policies and replaces functions, a rollback involves removing the new policies and restoring the previous `LANGUAGE SQL` functions if necessary.

**Rollback Commands (to be executed via Supabase SQL Editor if needed):**
```sql
-- Revert helper functions to Migration 007 state (LANGUAGE SQL without SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_school_id() RETURNS UUID LANGUAGE SQL STABLE AS $$ SELECT su.school_id FROM public.school_users su WHERE su.user_id = auth.uid() AND su.deleted_at IS NULL LIMIT 1; $$;
CREATE OR REPLACE FUNCTION public.current_role_code() RETURNS VARCHAR(50) LANGUAGE SQL STABLE AS $$ SELECT r.code FROM public.school_users su JOIN public.roles r ON r.id = su.role_id WHERE su.user_id = auth.uid() AND su.deleted_at IS NULL LIMIT 1; $$;
CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.code = 'super_admin' AND ur.deleted_at IS NULL); $$;

-- Drop newly added policies (Example for 'accounts')
DROP POLICY IF EXISTS "accounts_select_auth" ON public.accounts;
DROP POLICY IF EXISTS "accounts_insert_auth" ON public.accounts;
DROP POLICY IF EXISTS "accounts_update_auth" ON public.accounts;
-- (Repeat for all 18 tables defined in 009)
```

## 6. Expected Verification Queries
After `db push`, execute these queries in the remote Supabase SQL Editor to verify success:

**Verify Treasurer Role Level:**
```sql
SELECT code, level FROM public.roles WHERE code = 'treasurer';
-- Expected Output: treasurer | 65
```

**Verify Function Context (SECURITY DEFINER):**
```sql
SELECT p.proname, p.prosecdef, p.proconfig 
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' AND p.proname IN ('current_school_id', 'is_super_admin');
-- Expected Output: prosecdef = true, proconfig = {search_path=""}
```

**Verify RLS Enforcement:**
```sql
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname IN ('accounts', 'transactions', 'school_users');
-- Expected Output: relrowsecurity = true
```

## 7. Go / No-Go Checklist

### Pre-Deployment (Go/No-Go)
- [x] Local migration 001-009 executed without errors.
- [x] Local frontend builds successfully (`pnpm build`).
- [x] Local test suite passes (`pnpm test`).
- [x] `DROP FUNCTION` statements removed from 009 to prevent dependency breaks.
- [x] Seed data duplicate key conflict resolved.
- [ ] Supabase CLI authenticated and linked to the correct remote project.
- [ ] Remote database backup completed successfully.

### Post-Deployment
- [ ] Remote database migration command (`supabase db push`) completes with 0 errors.
- [ ] Verification queries return expected results.
- [ ] Application login and basic Finance navigation confirmed working on staging/production.
