# Changelog — BUDI

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] — 2025-01-16

### Added

- **School Management Module Foundation**
  - Feature-based module structure under `modules/schools/`
  - School types enriched with: `school_code`, `education_level`, `city`, `province`, `postal_code`, `principal_name`
  - Zod validation schema for school forms with Indonesian locale error messages
  - Supabase migration 007: schools table enhancement with new columns and RLS policies
  - RLS helper functions: `auth.current_school_id()`, `auth.current_role_code()`, `auth.is_super_admin()`
  - RLS policies for schools table (super_admin full access, authenticated select, school_admin update)
  - School service with full CRUD operations (list, getById, create, update, softDelete, restore, toggleStatus)
  - TanStack Query repository with 7 hooks (useSchools, useSchool, useCreateSchool, useUpdateSchool, useDeleteSchool, useRestoreSchool, useToggleSchoolStatus)
  - React Hook Form wrapper with Zod resolver
  - Placeholder Schools page with loading state
  - `/schools` route registered in the router (Super Admin only, lazy-loaded)

- **Dependencies**
  - Added `react-hook-form`, `@hookform/resolvers`, `zod` to `@budi/web`

### Notes
- This is the foundation phase for School Management. CRUD UI will be implemented in Sprint 2.1.1.
- No business logic from other modules was modified.
- The Finance module remains unchanged.

---

## [0.1.0] — 2025-01-15

### Added

- **Monorepo Foundation**
  - pnpm workspace with Turborepo
  - TypeScript base configuration
  - ESLint flat config with TypeScript rules
  - Prettier formatting configuration
  - EditorConfig for cross-IDE consistency
  - Environment variable template (.env.example)

- **Documentation Framework**
  - README with project overview
  - AI_CONTEXT for AI assistant onboarding
  - PROJECT_STATUS tracking
  - ROADMAP for strategic planning
  - BUDI_MANIFEST as system specification
  - CONTRIBUTING for developer guidelines
  - CODE_STYLE for coding conventions
  - CHANGELOG for version tracking

- **docs/ Directory**
  - Architecture documentation with Mermaid diagrams
  - Database design document
  - Coding standard specification
  - Folder structure reference
  - API guideline standards
  - Security model documentation
  - Development workflow guide
  - Architecture Decision Records (ADRs)
  - AI prompts for development workflows

- **Package Structure**
  - `@budi/types` — Shared TypeScript types
  - `@budi/utils` — Utility functions
  - `@budi/config` — Shared configuration
  - `@budi/eslint-config` — ESLint presets

- **Frontend Scaffolding**
  - Vite + React + TypeScript setup
  - Tailwind CSS v4 configuration
  - React Router with lazy loading
  - TanStack Query setup
  - Path aliases (@core, @shared, @modules, etc.)

- **Architecture**
  - Feature-based module structure
  - Core/Shared/Modules pattern
  - Finance module as active module
  - All other modules as placeholders
  - Supabase RLS preparation

- **Developer Experience**
  - VSCode workspace settings
  - Recommended extensions
  - Automation scripts scaffold
  - Branding assets placeholders

### Notes

- This is the foundation phase. No business logic, database, or UI implemented.
- Finance is the only active module — others are structural placeholders.
- RLS policies and Supabase migration will be added in v0.2.0.

---

## Template

```
## [0.0.0] — YYYY-MM-DD

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
```

## Related Documents

- [Project Status](PROJECT_STATUS.md)
- [Roadmap](ROADMAP.md)

