# Supabase — BUDI

> Database configuration, migrations, and Row Level Security for the BUDI platform.

## Structure

```
supabase/
├── config.toml       # Supabase project settings
├── seed.sql          # Development seed data
└── migrations/       # Database migration files
```

## Getting Started

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --local > packages/types/src/supabase.ts
```

## Rules

1. Always enable RLS on new tables
2. Every business table must have `school_id`
3. Create migrations via `supabase migration new <name>`
4. Never modify existing migrations — create new ones
5. Seed data for development only

## Related Documents

- [Database Schema](../docs/database.md)
- [Security Model](../docs/security.md)

