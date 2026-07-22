# ADR-001: Monorepo Structure with pnpm + Turborepo

**Status:** Accepted
**Date:** 2025-01-15

## Context

BUDI is a modular school management platform with multiple potential deployment targets (web, desktop, future mobile). The project needs to:

1. Share code between different applications (web app, Electron desktop app)
2. Maintain consistent TypeScript configurations across packages
3. Enable efficient parallel builds and caching
4. Support multiple teams working on different modules
5. Keep the developer experience fast with minimal configuration overhead

## Decision

We will use **pnpm workspaces** with **Turborepo** for the following reasons:

### Why pnpm?

- **Disk efficiency** — pnpm uses content-addressable storage, saving disk space
- **Strict dependency isolation** — prevents phantom dependencies
- **Fast installation** — parallel package installation
- **Workspace protocol** — native workspace support with `workspace:*` protocol

### Why Turborepo?

- **Parallel execution** — run tasks across packages concurrently
- **Caching** — skip redundant work with local/remote caching
- **Pipeline configuration** — define task dependencies explicitly
- **Zero config** — minimal setup for common patterns

### Structure

```
budi/
├── apps/           # Deployable applications
│   └── web/        # Main React web app
├── packages/       # Shared libraries
│   ├── types/      # TypeScript type definitions
│   ├── utils/      # Utility functions
│   └── config/     # Shared configuration
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

### Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Consequences

### Positive

- ✅ Shared types and utilities across all apps
- ✅ Fast CI with Turborepo caching
- ✅ Consistent dependency management
- ✅ Easy to add new apps (Electron, mobile) in the future
- ✅ Clear separation of concerns

### Negative

- ❌ Learning curve for contributors unfamiliar with monorepos
- ❌ Increased complexity in dependency management
- ❌ Need to manage versioning across packages manually

### Mitigations

- Document setup in README and AI_CONTEXT
- Use `workspace:*` protocol for internal dependencies
- Keep shared packages minimal and focused
- Use Turborepo pipeline to enforce build order

## Related Documents

- [Folder Structure](../folder-structure.md)
- [Architecture](../architecture.md)
- [AI Context](../../AI_CONTEXT.md)

