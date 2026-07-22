# Code Style — BUDI

> Coding standards and conventions for the BUDI project.

---

## 📋 Table of Contents

1. [TypeScript](#typescript)
2. [React](#react)
3. [CSS & Styling](#css--styling)
4. [Naming Conventions](#naming-conventions)
5. [File Organization](#file-organization)
6. [Imports](#imports)
7. [Comments](#comments)
8. [Testing](#testing)

---

## TypeScript

- **Strict mode** enabled — no exceptions
- **No `any`** — use `unknown` or proper types
- **NO `as`** — use type guards instead
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and aliases
- Use `const` assertions for literal types
- Use `satisfies` operator instead of type casts

### Good ✅

```typescript
interface User {
  id: string;
  email: string;
  role: UserRole;
}

type UserRole = 'super_admin' | 'school_admin' | 'treasurer' | 'viewer';
```

### Bad ❌

```typescript
interface User {
  id: any;
  email: any;
  role: string;
}
```

## React

- **Functional components** only (no class components)
- Use React 19 features (hooks, server components when applicable)
- **Custom hooks** for reusable logic
- **Proper naming**: `use` prefix for hooks
- Keep components **small and focused**
- One component per file (except small utility components)

### Component Structure

```tsx
// Imports
import { useState } from 'react';
import type { FC } from 'react';

// Types
interface TransactionListProps {
  schoolId: string;
}

// Component
export const TransactionList: FC<TransactionListProps> = ({ schoolId }) => {
  // Hooks at top
  const [filter, setFilter] = useState<string>('');

  // Derived state
  const filteredData = useMemo(() => filterData(data, filter), [data, filter]);

  // Effects
  useEffect(() => {
    // ...
  }, [schoolId]);

  // Handlers
  const handleFilter = (value: string) => setFilter(value);

  // Render
  return <div>{/* JSX */}</div>;
};
```

## CSS & Styling

- **Tailwind CSS** for all styling
- No custom CSS unless absolutely necessary
- Use `cn()` utility for conditional classes
- Follow Tailwind's utility-first approach
- Use CSS variables for theming (defined in `core/theme`)

### Good ✅

```tsx
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
  <span className="text-sm font-medium text-gray-700">Hello</span>
</div>
```

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Files | `kebab-case` | `transaction-list.tsx` |
| Components | `PascalCase` | `TransactionList` |
| Hooks | `use` prefix + camelCase | `useTransactions` |
| Contexts | `PascalCase` + `Context` | `AuthContext` |
| Providers | `PascalCase` + `Provider` | `AuthProvider` |
| Functions | `camelCase` | `formatCurrency` |
| Variables | `camelCase` | `schoolId` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_FILE_SIZE` |
| Types/Interfaces | `PascalCase` | `TransactionType` |
| Enums | `PascalCase` | `TransactionStatus` |
| Folders | `kebab-case` | `transaction-list/` |

## File Organization

- **One default export** per file (the main component)
- Named exports for utilities, types, hooks
- Co-locate tests (`Component.test.tsx`)
- Co-locate styles only if complex (rare)

## Imports

Order imports in groups, separated by blank line:

1. Node built-ins / External packages
2. Internal packages (`@budi/*`, `@core`, `@shared`, `@modules`)
3. Relative imports
4. Types (last group)

### Good ✅

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@core/auth';
import { Button } from '@shared/components';
import { formatCurrency } from '@shared/utils/format';

import { transactionService } from '../services';
import type { Transaction } from '../types';
```

## Comments

- **Self-documenting code** over comments
- Use JSDoc for public APIs and complex logic
- Use `TODO`, `FIXME`, `HACK` with context
- Explain **why**, not what

### Good ✅

```tsx
// TODO: Implement pagination for large datasets
// FIXME: This API call doesn't handle network errors
```

## Testing (Future)

- Vitest for unit tests
- React Testing Library for component tests
- Playwright for e2e tests
- Test behavior, not implementation

---

## Related Documents

- [Architecture](docs/architecture.md)
- [API Guidelines](docs/api-guideline.md)
- [Folder Structure](docs/folder-structure.md)

