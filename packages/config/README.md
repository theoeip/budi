# @budi/config

> Shared configuration for the BUDI platform.

## Purpose

Provides centralized configuration constants used across all modules:

- **roles.ts** — Role definitions and permissions
- **modules.ts** — Module registry and feature flags
- **navigation.ts** — Navigation menu structure

## Usage

```typescript
import { ROLES, type UserRole } from '@budi/config';
import { MODULES } from '@budi/config/modules';
import { NAV_ITEMS } from '@budi/config/navigation';
```

## Related Documents

- [Architecture](../../docs/architecture.md)
- [Security](../../docs/security.md)

