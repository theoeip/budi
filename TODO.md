# BUDI Project — TODO

## Foundation Phase — Complete ✅

### Root Configuration ✅

- [x] .editorconfig, .gitignore, .prettierrc, .npmrc, eslint.config.js
- [x] Root package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json
- [x] .env.example, .gitattributes, .github/ (CI, templates, CODEOWNERS)

### Root Documentation ✅

- [x] README.md, AI_CONTEXT.md, PROJECT_STATUS.md, ROADMAP.md
- [x] CHANGELOG.md, BUDI_MANIFEST.md, CONTRIBUTING.md, CODE_STYLE.md

### docs/ Directory ✅

- [x] Architecture (with Mermaid), Database, Coding Standard, Folder Structure
- [x] API Guidelines, Security, Development Workflow
- [x] Decisions (ADR-001), Prompts (system prompt)
- [x] database/ (overview, finance-schema, relationship-diagram, rls-strategy, migration-plan)
- [x] business/BUDI_FINANCE_SPEC.md (32-section BRS)

### supabase/ ✅

- [x] Supabase config, seed data, 6 migration files (001–006)

### scripts/, public/ ✅

- [x] Automation scripts, branding assets (logo, favicon, icons)

### packages/ ✅

- [x] @budi/types, @budi/utils, @budi/config, @budi/eslint-config

### apps/web/ Setup ✅

- [x] Vite + React + TS + Tailwind w/ path aliases
- [x] src/core/ (providers, router, theme, auth, permissions)
- [x] src/shared/ (components, layouts, hooks, contexts, services, repositories, types, utils,
      constants, assets)
- [x] src/modules/ (finance active, others placeholders)
- [x] UI primitives: Button, Input, Card, Spinner, Alert

### Sprint 1: Auth & Routes ✅

- [x] Auth Provider, Login Page, Forgot Password, School Selector
- [x] Protected Route, Login Route, App Shell, Auth Layout

### DevOps ✅

- [x] CI workflow, PR template, issue templates, SECURITY.md, LICENSE
- [x] Vitest + RTL config, test setup

## Sprint 2.1.0 — School Management Foundation ✅

- [x] Dependencies: react-hook-form, @hookform/resolvers, zod
- [x] School types enriched (school_code, education_level, city, province, postal_code,
      principal_name)
- [x] Supabase migration 007: school table enhancement + RLS functions & policies
- [x] modules/schools/ folder structure (types/, services/, repositories/, hooks/, pages/,
      components/)
- [x] Zod validation schema (EducationLevel enum, school form)
- [x] School Service (Supabase CRUD: list, getById, create, update, softDelete, restore,
      toggleStatus)
- [x] School Repository (TanStack Query: 7 hooks with cache invalidation)
- [x] School Form Hook (React Hook Form + ZodResolver)
- [x] Placeholder Schools page (lazy-loaded)
- [x] `/schools` route registered (Super Admin only)
- [x] PROJECT_STATUS.md updated
- [x] CHANGELOG.md updated (v0.2.0)

## Sprint 2.1.1 — Next (School CRUD UI)

- [ ] School list view with DataTable (sort, search, paginate)
- [ ] School create form
- [ ] School edit form (pre-populated)
- [ ] School detail view
- [ ] School soft-delete with confirm dialog
- [ ] School restore from trash
- [ ] Active/inactive toggle

## Future Sprints

- [ ] v0.3.0: Database & Auth (Supabase setup, RLS enforcement)
- [ ] v0.4.0: Finance Module — API
- [ ] v0.5.0: Finance Module — UI
- [ ] v0.6.0: Finance Module — Reports
- [ ] v1.0.0: Production Launch
