# Sprint 6 Phase 2 — Production Runbook

## 1. Executive Summary
- **Purpose:** To safely deploy Migration 009 (RLS Policies & Role Normalization) to the remote production Supabase database.
- **Scope:** Enforcing Row Level Security on 18 core/finance tables, updating helper functions for safe session resolution, and normalizing the `treasurer` role.
- **Expected downtime:** Zero downtime. Migration executes non-blocking `CREATE POLICY` and `CREATE OR REPLACE FUNCTION` statements.
- **Deployment owner:** Engineering Team Lead
- **Rollback owner:** Database Administrator

## 2. Pre-Deployment Checklist
- [ ] Git working tree clean (no uncommitted changes).
- [ ] Migration 001-009 validated locally via `npx supabase db reset`.
- [ ] Docker validation completed (Local database boot, migration, and seeding succeeded).
- [ ] Supabase CLI authenticated (`npx supabase login`).
- [ ] Correct remote project linked (`npx supabase link --project-ref <PROJECT_ID>`).
- [ ] Production database backup completed via the Supabase Dashboard.
- [ ] Production environment variables verified and synchronized.

## 3. Deployment Procedure
Execute these commands sequentially. Record timestamps and capture all output.

1. **Verify Project Link:**
   ```bash
   npx supabase status
   ```
2. **Verify Current Migration Status:**
   ```bash
   npx supabase db remote info
   ```
   *Ensure 001-008 are present on the remote and 009 is pending.*
3. **Execute Migration Push:**
   ```bash
   npx supabase db push
   ```
4. **Record Execution Time:** Log the exact duration from the command output.
5. **Capture CLI Output:** Save the console output to deployment logs.
6. **Verify Migration History:** Check that `009_rls_policies.sql` is successfully marked as applied in the remote history.

## 4. Database Validation
Execute these queries in the Supabase SQL Editor to confirm the deployment:

**1. Migration History:**
```sql
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 5;
```

**2. RLS Enabled:**
```sql
SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('schools', 'accounts', 'transactions');
```

**3. Treasurer Role Level:**
```sql
SELECT code, level FROM public.roles WHERE code = 'treasurer';
-- Expected: level = 65
```

**4. Helper Functions (SECURITY DEFINER & search_path):**
```sql
SELECT p.proname, p.prosecdef, p.proconfig 
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' AND p.proname IN ('current_school_id', 'current_role_code', 'is_super_admin');
-- Expected: prosecdef = true, proconfig = {search_path=""}
```

**5. Policy Count:**
```sql
SELECT tablename, count(*) FROM pg_policies WHERE schemaname = 'public' GROUP BY tablename;
```

**6. Finance Tables (No DELETE Policies):**
```sql
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public' AND cmd = 'DELETE';
-- Expected: 0 rows for Finance tables.
```

## 5. Application Smoke Test
Verify the following user flows on the staging/production environment:
- [ ] **Login:** Successfully authenticate as a School Admin, Treasurer, and standard Teacher.
- [ ] **Dashboard:** Verify the main application dashboard renders without API 403 errors.
- [ ] **School Selection:** Verify tenant switching works and session updates correctly.
- [ ] **User Management:** Verify School Admin can list users.
- [ ] **Finance Dashboard:** Verify School Admin and Treasurer can access the Finance dashboard; Teacher is blocked (403 or UI hidden).
- [ ] **Create transaction:** Successfully insert a transaction as Treasurer.
- [ ] **Edit transaction:** Successfully modify an existing transaction.
- [ ] **Soft delete transaction:** Ensure "Delete" action performs a soft-delete (`deleted_at`) rather than a hard delete.
- [ ] **Logout/Login:** Session gracefully expires and reconstitutes properly.
- [ ] **Permission checks:** Ensure non-finance roles cannot bypass frontend UI to fetch finance endpoints directly.

## 6. Monitoring
Assign an engineer to monitor the following metrics for 15 minutes post-deployment:
- **Database logs:** Monitor `postgres` logs in the Supabase dashboard for unexpected spikes in slow queries or deadlocks.
- **Authentication failures:** Watch for spikes in `auth` schema errors.
- **Permission denied:** Monitor PostgREST logs for `PGRST301` (Row-level security policy violation) spikes.
- **API latency:** Ensure median latency remains stable (no RLS recursion causing CPU spikes).
- **Frontend console:** Verify no sudden influx of 401/403 network errors.
- **Error rate:** Check Sentry/Datadog (if configured) for unhandled exceptions.

## 7. Rollback Decision Tree
- **Minor issue (UI bug, non-critical fetch error):** Proceed. Create a follow-up patch.
- **Major issue (Specific user role unable to login):** Assess impact. If contained, issue a hotfix. If widespread, ROLLBACK.
- **Database corruption (Data loss):** Immediate ROLLBACK via PITR (Point-in-Time Recovery).
- **Authentication failure (Infinite recursion loop triggered):** Immediate ROLLBACK via SQL.
- **RLS failure (Finance data exposed to Teachers/Students):** Immediate ROLLBACK via SQL.
- **Deployment abort conditions:** If `supabase db push` fails mid-flight, immediately assess state and initiate ROLLBACK.

## 8. Rollback Procedure
If a rollback is required, execute the following:

**1. Revert Migration (via Supabase SQL Editor):**
```sql
-- Revert helpers to Migration 007 state
CREATE OR REPLACE FUNCTION public.current_school_id() RETURNS UUID LANGUAGE SQL STABLE AS $$ SELECT su.school_id FROM public.school_users su WHERE su.user_id = auth.uid() AND su.deleted_at IS NULL LIMIT 1; $$;
CREATE OR REPLACE FUNCTION public.current_role_code() RETURNS VARCHAR(50) LANGUAGE SQL STABLE AS $$ SELECT r.code FROM public.school_users su JOIN public.roles r ON r.id = su.role_id WHERE su.user_id = auth.uid() AND su.deleted_at IS NULL LIMIT 1; $$;
CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.code = 'super_admin' AND ur.deleted_at IS NULL); $$;

-- Drop newly added policies
DROP POLICY IF EXISTS "accounts_select_auth" ON public.accounts;
-- (Execute for all 18 tables)
```
**2. Restore Backup (If data corruption occurred):**
Use the Supabase Dashboard -> Database -> Backups -> Restore to the snapshot taken in the Pre-Deployment step.
**3. Validation after rollback:** Run the validation queries to ensure `prosecdef` is false and policies are dropped.
**4. Smoke test after rollback:** Re-run the Application Smoke Test to verify the system is stable in its pre-deployment state.

## 9. Success Criteria
Deployment is strictly considered successful ONLY if:
- Migration CLI command completes successfully.
- Verification SQL passes perfectly.
- All Smoke tests pass.
- No new authentication issues arise during monitoring.
- No RLS failures (data leakage) occur.
- No unexpected application errors spike in the 15-minute window.

## 10. Lessons Learned
(Derived from Sprint 6 Phase 1 Local Validation)
- **Seed conflict resolution:** Ensure development seed data uses `ON CONFLICT DO NOTHING` if it overlaps with migration-injected structural data.
- **CREATE OR REPLACE FUNCTION usage:** `DROP FUNCTION` should be strictly avoided when updating functions that are already heavily referenced by existing RLS policies (e.g., `schools` table).
- **Static RBAC compatibility:** Database role definitions (`level` integers) must be rigorously synchronized with the frontend's static TypeScript config to prevent runtime authorization mismatches (e.g., Treasurer level 60 vs 65).
