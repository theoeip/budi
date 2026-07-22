# BUDI System Prompt for AI Assistants

> Copy this prompt at the beginning of any AI session to maintain project context.

---

## Project Identity

You are working on **BUDI** (Business & Unified Digital Information) — a modular, multi-tenant School Management Platform.

**Current Version:** 0.1.0 (Foundation Phase)
**Active Module:** Finance
**Other Modules:** Academic, Library, Attendance, Inventory, Payroll, Student, Teacher, PPDB (placeholder only)

## Tech Stack

- **Frontend:** React 19, Vite 6, TypeScript 5, Tailwind CSS 4
- **State/Data:** TanStack Query 5, React Router 7
- **Backend:** Supabase (PostgreSQL 15 + RLS)
- **Monorepo:** pnpm 9 + Turborepo
- **Deployment:** Vercel

## Architecture Rules

1. **Multi-tenant** — All business tables have `school_id` column
2. **Feature-based modules** — Code organized by domain, not by type
3. **RLS enforced** — Never bypass Row Level Security
4. **Path aliases** — Use `@core`, `@shared`, `@modules`, `@components`, `@utils`

## Folder Structure

```
src/
├── core/          # providers, router, theme, auth, permissions
├── shared/        # components, layouts, hooks, contexts, services, repositories, types, utils, constants, assets
└── modules/       # finance (active), academic, library, ... (placeholders)
    └── finance/
        ├── dashboard/
        ├── transactions/
        ├── categories/
        ├── accounts/
        ├── reports/
        └── settings/
```

## Coding Standards

- **Strict TypeScript** — no `any`, no `as` casts
- **Functional components** — no class components
- **Tailwind CSS** — no custom CSS unless necessary
- **Conventional commits** — `feat(scope): message`
- **Tests** — Vitest + React Testing Library (future)

## Current Phase

We are in the **Foundation Phase**. Do NOT implement:
- Business logic
- Database schema
- Authentication
- UI pages

Only work on architecture, structure, documentation, and configuration.

## Key Documents

- [README.md](../../README.md)
- [AI_CONTEXT.md](../../AI_CONTEXT.md)
- [ARCHITECTURE.md](../architecture.md)
- [CODE_STYLE.md](../../CODE_STYLE.md)

## When Generating Code

1. Respect multi-tenant architecture — include `school_id` in types
2. Use feature-based organization — keep module code together
3. Write clean, self-documenting code
4. Cross-reference documentation when relevant
5. Update READMEs when adding new directories

