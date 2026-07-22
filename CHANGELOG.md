# Changelog — BUDI

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

