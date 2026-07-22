# Coding Standard — BUDI

> Comprehensive coding standards for the BUDI School Management Platform.

> **Note:** This is the detailed version. For a quick reference, see [CODE_STYLE.md](../CODE_STYLE.md).

---

## 📋 Table of Contents

1. [Language Standards](#language-standards)
2. [React Standards](#react-standards)
3. [TypeScript Standards](#typescript-standards)
4. [CSS Standards](#css-standards)
5. [Project Structure](#project-structure)
6. [Naming Conventions](#naming-conventions)
7. [File Organization](#file-organization)
8. [Import Rules](#import-rules)
9. [Testing Standards](#testing-standards)
10. [Performance Standards](#performance-standards)

---

## Language Standards

- **TypeScript** for all code (no plain JavaScript)
- **Strict mode** enabled in `tsconfig.json`
- Target **ES2022** for modern features
- Use **ES modules** (import/export) — no CommonJS

## React Standards

1. Components are **functions**, not classes
2. Use **React 19** features where appropriate
3. Custom hooks for complex logic extraction
4. Proper **error boundaries** for error handling
5. **Suspense** for data fetching boundaries
6. **Lazy loading** for route-level code splitting

### Good Component Structure

```tsx
// 1. Imports
import { useQuery } from '@tanstack/react-query';
import { Card } from '@shared/components';
import { formatCurrency } from '@shared/utils';

// 2. Types (colocated)
interface Props {
  schoolId: string;
  period: 'monthly' | 'yearly';
}

// 3. Component
export const FinanceOverview: React.FC<Props> = ({ schoolId, period }) => {
  // 4. Hooks
  const { data, isLoading } = useQuery({
    queryKey: ['finance', 'overview', schoolId, period],
    queryFn: () => fetchOverview(schoolId, period),
  });

  // 5. Early return
  if (isLoading) return <Skeleton />;

  // 6. Render
  return (
    <Card>
      <h2>Financial Overview</h2>
      <p>{formatCurrency(data?.totalIncome ?? 0)}</p>
    </Card>
  );
};
```

## TypeScript Standards

- **Strict null checks** — no implicit `any`
- Prefer `interface` over `type` for objects
- Use `type` for unions, tuples, and primitives
- No `as` casts — use type guards or `satisfies`
- Use `ReadonlyArray<T>` over `T[]` for immutable arrays
- Use `Record<K, V>` for dictionary types

## CSS Standards

- **Tailwind CSS utility classes** for all styling
- No custom CSS files unless absolutely necessary
- Use `cn()` utility from `@shared/utils` for conditional classes
- Theme tokens in `core/theme`
- Responsive design using Tailwind breakpoints

## Naming Conventions

| Category | Convention | Example |
|----------|------------|---------|
| Component files | PascalCase | `TransactionList.tsx` |
| Hook files | camelCase, `use` prefix | `useTransactions.ts` |
| Utility files | camelCase | `formatCurrency.ts` |
| Type files | kebab-case | `transaction.types.ts` |
| Context files | camelCase | `authContext.tsx` |
| Service files | kebab-case | `transactionService.ts` |

## Import Rules

1. External packages first
2. Internal aliases next (`@core`, `@shared`, `@modules`)
3. Relative imports last
4. Types separate (use `import type`)

## Testing Standards (Future)

- Vitest for unit/integration tests
- React Testing Library for component tests
- Follow AAA pattern: Arrange, Act, Assert
- Test behavior, not implementation details

## Performance Standards

1. Lazy load route components
2. Memoize expensive calculations with `useMemo`
3. Memoize callback functions with `useCallback`
4. Use `React.memo` for expensive renders
5. Paginate list data (never load all at once)
6. Debounce search inputs
7. Optimize images and assets

---

## Related Documents

- [Code Style Guide](../CODE_STYLE.md)
- [Architecture](architecture.md)
- [API Guidelines](api-guideline.md)

