# Core Layer

> Application-wide infrastructure for the BUDI platform.

## Purpose

The `core/` layer provides foundational infrastructure used by every part of the application. It should have **no dependencies on features or modules**.

## Structure

```
core/
├── providers/       # React context providers (QueryClient, Theme, Auth)
├── router/          # Route definitions & lazy loading
├── theme/           # Theme tokens & Tailwind CSS extensions
├── auth/            # Authentication context & utilities
└── permissions/     # Role-based access control utilities
```

## Rules

- Core code must NOT import from `@modules/*` or `@shared/*`
- Core can import from `@budi/types` and `@budi/config`
- Keep core minimal — only what every part of the app needs

## Related Documents

- [Architecture](../../docs/architecture.md)
- [Folder Structure](../../docs/folder-structure.md)

