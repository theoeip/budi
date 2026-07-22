# BUDI Web Application

> The main web application for the BUDI School Management Platform.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 6
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **Data Fetching:** TanStack Query 5

## Quick Start

```bash
# From root
pnpm dev

# From this directory
pnpm --filter @budi/web dev
```

## Path Aliases

| Alias | Path | Purpose |
|-------|------|---------|
| `@core` | `src/core` | App infrastructure |
| `@shared` | `src/shared` | Reusable code |
| `@modules` | `src/modules` | Feature modules |
| `@components` | `src/shared/components` | Shared components |
| `@utils` | `src/shared/utils` | Utility functions |

## Architecture

See [Architecture](../../docs/architecture.md) for details.

## Related Documents

- [Folder Structure](../../docs/folder-structure.md)
- [Coding Standard](../../CODE_STYLE.md)
- [API Guidelines](../../docs/api-guideline.md)

