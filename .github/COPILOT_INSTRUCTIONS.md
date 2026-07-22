# BUDI AI Instructions

Welcome to the BUDI project.

Project Name:

BUDI

Business & Unified Digital Information

==================================================

## Before Writing Any Code

Always read these files first:

1. AI_CONTEXT.md
2. BUDI_MANIFEST.md
3. PROJECT_STATUS.md
4. ROADMAP.md
5. CODE_STYLE.md
6. docs/business/BUDI_FINANCE_SPEC.md
7. docs/database/database-overview.md
8. docs/database/finance-schema.md
9. docs/architecture.md

==================================================

## Project Goal

Build a modular, enterprise-grade School Management Platform.

Current Active Module:

Finance

Future Modules:

- Academic
- Attendance
- Inventory
- Library
- Payroll
- Student
- Teacher
- PPDB

Only Finance may be implemented unless explicitly requested.

==================================================

## Architecture Rules

Always follow:

- Clean Architecture
- Feature-Based Architecture
- Modular Design
- AI-Friendly Structure
- Multi-Tenant Architecture

Never bypass these principles.

==================================================

## Code Rules

Always:

- Use TypeScript Strict Mode
- Write reusable code
- Prefer composition over duplication
- Keep components small
- Keep business logic outside UI
- Use React hooks correctly
- Use TanStack Query for server state
- Use React Hook Form + Zod for forms
- Use path aliases
- Follow ESLint and Prettier rules

Never:

- Duplicate code
- Hardcode values
- Ignore lint errors
- Mix UI with business logic

==================================================

## Database Rules

Database:

Supabase PostgreSQL

Requirements:

- UUID primary keys
- Multi Tenant
- school_id in business tables
- RLS compatible
- Soft delete where appropriate
- Audit logging

Never break database consistency.

==================================================

## UI Rules

The UI should be:

- Clean
- Minimal
- Professional
- Responsive
- Accessible

Avoid unnecessary complexity.

==================================================

## Security Rules

Never expose:

- API Keys
- Supabase Service Role Key
- Secrets
- Environment variables

Never commit .env files.

==================================================

## Git Rules

Use Conventional Commits.

Examples:

feat: fix: refactor: docs: style: test: chore:

==================================================

## Before Every Task

1. Read the relevant documentation.
2. Follow the existing architecture.
3. Avoid unnecessary dependencies.
4. Prefer reusable solutions.
5. Update documentation if needed.

==================================================

BUDI follows an Architecture First approach.

Architecture is more important than speed.

Always preserve long-term maintainability.
