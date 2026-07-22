# Migrations — BUDI

> Database migrations for the BUDI platform.

## Creating Migrations

```bash
# Create a new migration
supabase migration new add_finance_tables

# This creates: supabase/migrations/YYYYMMDDHHMMSS_add_finance_tables.sql
```

## Applying Migrations

```bash
# Apply all pending migrations to local database
supabase db push

# Apply to remote (production)
supabase db push --db-url <production-url>
```

## Guidelines

1. **One migration per change** — Keep migrations focused
2. **Never modify existing migrations** — Create a new one
3. **Always include RLS policies** — Enable RLS and add policies
4. **Test locally first** — Run `supabase db push` on local environment
5. **Version control** — All migrations are committed to git

## Related Documents

- [Database Schema](../../docs/database.md)
- [Security Model](../../docs/security.md)

