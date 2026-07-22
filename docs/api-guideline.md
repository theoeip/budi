# API Guidelines — BUDI

> Standards for API design, data fetching, and error handling.

---

## 📋 Table of Contents

1. [API Philosophy](#api-philosophy)
2. [Endpoint Design](#endpoint-design)
3. [Data Fetching Patterns](#data-fetching-patterns)
4. [Error Handling](#error-handling)
5. [Type Safety](#type-safety)
6. [Versioning](#versioning)
7. [Pagination](#pagination)

---

## API Philosophy

BUDI uses **Supabase as the API layer**. There is no custom backend server. All data access goes through:

1. **Supabase REST API** — For standard CRUD operations
2. **Supabase Realtime** — For live updates (future)
3. **PostgreSQL Views/Functions** — For complex queries
4. **RLS Policies** — For authorization at database level

## Endpoint Design

### Pattern

```
/{schema}/{table}
```

### Examples

```typescript
// Supabase client queries
const { data } = await supabase
  .from('finance_transactions')
  .select('*')
  .eq('school_id', schoolId);
```

### Query Filters

| Operation | Method | Supabase Method |
|-----------|--------|-----------------|
| List | GET | `.select('*')` |
| Get by ID | GET | `.select('*').eq('id', id).single()` |
| Create | POST | `.insert(object)` |
| Update | PATCH | `.update(object).eq('id', id)` |
| Delete | DELETE | `.delete().eq('id', id)` |
| Filter | GET | `.eq('field', value)` |
| Search | GET | `.ilike('name', '%search%')` |
| Paginate | GET | `.range(start, end)` |
| Count | GET | `.select('*', { count: 'exact' })` |

## Data Fetching Patterns

All data fetching uses **TanStack Query**.

### Service Layer

```typescript
// src/modules/finance/services/transactionService.ts
import { supabase } from '@core/providers/supabase';
import type { Transaction } from '../types';

export const transactionService = {
  async list(schoolId: string, filters?: TransactionFilters) {
    let query = supabase
      .from('finance_transactions')
      .select('*')
      .eq('school_id', schoolId);

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Transaction[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('finance_transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Transaction;
  },
};
```

### Repository Pattern

```typescript
// src/modules/finance/repositories/transactionRepository.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { transactionService } from '../services';
import type { Transaction } from '../types';

export function useTransactions(schoolId: string, filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['finance', 'transactions', schoolId, filters],
    queryFn: () => transactionService.list(schoolId, filters),
    enabled: !!schoolId,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['finance', 'transactions', id],
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
  });
}
```

### In React Components

```typescript
// src/modules/finance/transactions/hooks/useTransactionList.ts
import { useTransactions } from '../../repositories/transactionRepository';

export function useTransactionList(schoolId: string) {
  const { data, isLoading, error } = useTransactions(schoolId);

  // Transform data for UI
  const summary = useMemo(() => ({
    totalIncome: data?.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0) ?? 0,
    totalExpense: data?.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) ?? 0,
  }), [data]);

  return { data, isLoading, error, summary };
}
```

## Error Handling

### Supabase Errors

```typescript
interface ApiError {
  message: string;
  code: string;
  details: string | null;
  hint: string | null;
}
```

### Error Handling Pattern

```typescript
try {
  const { data, error } = await supabase.from('finance_transactions').select('*');
  if (error) throw error;
  return data;
} catch (err) {
  // Log to Sentry
  console.error('Failed to fetch transactions:', err);
  
  // Transform for UI
  throw new AppError('Unable to load transactions. Please try again.', 'FETCH_ERROR');
}
```

## Type Safety

### Generated Types

```bash
supabase gen types typescript --local > packages/types/src/supabase.ts
```

### Manual Types

```typescript
// packages/types/src/finance.types.ts
export interface FinanceTransaction {
  id: string;
  school_id: string;
  category_id: string;
  amount: number;
  description: string | null;
  transaction_date: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}
```

## Versioning

- Database schema versioning via Supabase migrations
- No REST API versioning (Supabase handles this)
- Breaking changes communicated via CHANGELOG.md

## Pagination

```typescript
// Paginated query
const PAGE_SIZE = 20;

function usePaginatedTransactions(schoolId: string, page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  return useQuery({
    queryKey: ['finance', 'transactions', schoolId, page],
    queryFn: async () => {
      const { data, count } = await supabase
        .from('finance_transactions')
        .select('*', { count: 'exact' })
        .eq('school_id', schoolId)
        .range(from, to)
        .order('transaction_date', { ascending: false });

      return {
        data: data as Transaction[],
        totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
      };
    },
  });
}
```

---

## Related Documents

- [Architecture](architecture.md)
- [Database Schema](database.md)
- [Coding Standard](coding-standard.md)

