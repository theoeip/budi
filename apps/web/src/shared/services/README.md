# Services

> API service layer for data fetching and external communication.

## Purpose

Provides the interface layer between the frontend and Supabase API. Services handle:

- API calls to Supabase
- Error handling and transformation
- Data type conversion

## Structure

Each module typically has its own service files. Shared services are cross-module:

```
services/
├── supabase.ts     # Supabase client instance
└── storage.ts      # File upload/storage service (future)
```

## Module Services

Module-specific services are located within their module:

```
modules/finance/
└── services/
    └── transactionService.ts
```

## Usage

```typescript
import { supabase } from '@shared/services';

async function getTransactions(schoolId: string) {
  const { data } = await supabase
    .from('finance_transactions')
    .select('*')
    .eq('school_id', schoolId);
  return data;
}
```

## Related Documents

- [API Guidelines](../../../../docs/api-guideline.md)
- [Architecture](../../../../docs/architecture.md)

