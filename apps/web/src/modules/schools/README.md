# School Management Module

> Manages school/tenant entities in the BUDI multi-tenant platform.

## Purpose

This module provides comprehensive school management functionality for Super Admin users. It
enables:

- Viewing a list of all schools
- Creating new school tenants
- Editing school details
- Viewing school detail information
- Soft-deleting and restoring schools
- Toggling school active/inactive status

## Structure

```
schools/
├── README.md
├── components/       # School-specific UI components
├── hooks/            # Custom hooks (form logic)
├── repositories/     # TanStack Query hooks (data fetching)
├── services/         # Supabase API calls
├── types/            # Zod schemas and form types
└── pages/            # Route-level page components
```

## Key Concepts

- **Multi-tenant:** Each school is a tenant. School data is fully isolated.
- **Soft Delete:** Schools are soft-deleted (`deleted_at` timestamp).
- **Super Admin Only:** School CRUD is restricted to `super_admin` role.
- **Slug:** Auto-generated from school name for URL-friendly identifiers.

## Related Documents

- [Database Schema](../../../../docs/database/database-overview.md)
- [RLS Strategy](../../../../docs/database/rls-strategy.md)
