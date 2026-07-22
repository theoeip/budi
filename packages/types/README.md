# @budi/types

> Shared TypeScript type definitions for the BUDI platform.

## Purpose

Provides consistent type definitions across all BUDI applications and packages. Types are organized by domain:

- **school.types.ts** — School entity types
- **user.types.ts** — User, role, and profile types
- **finance.types.ts** — Finance module types (active module)
- **supabase.ts** — Auto-generated Supabase types

## Usage

```typescript
import type { School, SchoolProfile } from '@budi/types';
import type { FinanceTransaction } from '@budi/types/finance';
```

## Development

```bash
# Generate Supabase types
supabase gen types typescript --local > src/supabase.ts
```

## Related Documents

- [Database Schema](../../docs/database.md)
- [Coding Standard](../../CODE_STYLE.md)

