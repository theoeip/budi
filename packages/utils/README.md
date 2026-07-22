# @budi/utils

> Shared utility functions for the BUDI platform.

## Purpose

Provides reusable utility functions used across all modules. Includes:

- **cn.ts** — Tailwind CSS class merging (clsx + tailwind-merge)
- **format.ts** — Currency, number, and string formatting
- **date.ts** — Date formatting and manipulation
- **permissions.ts** — Role-based permission utilities

## Usage

```typescript
import { cn } from '@budi/utils';
import { formatCurrency } from '@budi/utils/format';
import { hasPermission } from '@budi/utils/permissions';
```

## Related Documents

- [Coding Standard](../../CODE_STYLE.md)
- [Folder Structure](../../docs/folder-structure.md)

