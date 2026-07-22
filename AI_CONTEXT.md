# AI Context — BUDI

> This file provides essential context for AI assistants (Claude, ChatGPT, Gemini, Blackbox) to understand the BUDI project quickly.

## Project Identity

- **Name:** BUDI — Business & Unified Digital Information
- **Type:** Modular School Management Platform
- **Architecture:** Multi-tenant (one application, many schools)
- **Current Module:** Finance (others are placeholder placeholders)

## Tech Stack

```yaml
frontend:
  framework: React 19
  build: Vite 6
  language: TypeScript 5
  styling: Tailwind CSS 4
  routing: React Router 7
  data-fetching: TanStack Query 5

backend:
  provider: Supabase
  database: PostgreSQL 15
  security: Row Level Security (RLS)

monorepo:
  manager: pnpm
  orchestrator: Turborepo

deployment:
  platform: Vercel
```

## Architecture Principles

1. **Multi-tenant isolation** — Every business table has `school_id`
2. **Feature-based modules** — Each domain is a self-contained module
3. **AI-friendly** — Every folder has a README explaining its purpose
4. **Security-first** — RLS policies enforced at database level
5. **Scalable** — Monorepo with shared packages for maximum reuse

## Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full system access, manage schools |
| `school_admin` | Full access within their school |
| `treasurer` | Finance module access |
| `viewer` | Read-only access |

## Folder Convention

```
src/
├── core/          # App infrastructure (providers, router, auth)
├── shared/        # Reusable across modules (components, hooks, utils)
└── modules/       # Feature modules (finance, academic, ...)
    └── finance/   # Feature slices within module
        └── dashboard/
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@core` | `src/core` |
| `@shared` | `src/shared` |
| `@modules` | `src/modules` |
| `@components` | `src/shared/components` |
| `@utils` | `src/shared/utils` |

## Current Status

- **Version:** 0.1.0 (Foundation Phase)
- **Active Module:** Finance
- **Database:** Not yet created
- **Authentication:** Not yet implemented
- **Business Logic:** Not yet implemented

## AI Guidelines

When working on BUDI:

1. Always respect multi-tenant isolation — include `school_id` filters
2. Use feature-based architecture — keep module code self-contained
3. Write TypeScript with strict types — avoid `any`
4. Follow the existing naming conventions
5. Update relevant README files when adding new features
6. Cross-reference documentation when making architectural decisions

## Related Documents

- [Architecture](docs/architecture.md)
- [Coding Standard](CODE_STYLE.md)
- [Folder Structure](docs/folder-structure.md)
- [API Guidelines](docs/api-guideline.md)
- [Security Model](docs/security.md)

