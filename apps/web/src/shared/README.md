# Shared Layer

> Reusable code used across all modules in the BUDI platform.

## Purpose

The `shared/` layer contains code that is reused across multiple modules. It is organized by type:

- **components/** — UI primitives and shared components
- **layouts/** — Layout components (MainLayout, AuthLayout)
- **hooks/** — Custom React hooks
- **contexts/** — Shared React contexts
- **services/** — API service layer
- **repositories/** — Data access layer (TanStack Query wrappers)
- **types/** — Shared type definitions
- **utils/** — Utility functions
- **constants/** — Application-wide constants
- **assets/** — Images, icons, fonts

## Rules

- Shared code MUST NOT import from `@modules/*`
- Shared code CAN import from `@core/*` and `@budi/*` packages
- Keep shared code generic — no finance-specific logic here

## Related Documents

- [Architecture](../../docs/architecture.md)
- [Folder Structure](../../docs/folder-structure.md)

