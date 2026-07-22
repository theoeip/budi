# Repositories

> Data access layer — TanStack Query wrappers around services.

## Purpose

Repositories provide React hooks that wrap service calls with TanStack Query for caching, refetching, and state management.

## Structure

```
repositories/
├── useQuery hooks (GET operations)
└── useMutation hooks (POST, PUT, DELETE operations)
```

Module-specific repositories are located within their module:

```
modules/finance/
└── repositories/
    └── transactionRepository.ts
```

## Usage

```typescript
import { useTransactions } from '@modules/finance/repositories/transactionRepository';

function TransactionList({ schoolId }: { schoolId: string }) {
  const { data, isLoading } = useTransactions(schoolId);
  if (isLoading) return <Spinner />;
  return <List items={data} />;
}
```

## Related Documents

- [API Guidelines](../../../../docs/api-guideline.md)
- [TanStack Query Docs](https://tanstack.com/query/latest)

