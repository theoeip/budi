# Types

> Shared type definitions specific to the frontend application.

## Purpose

Contains TypeScript types that are specific to the frontend application, as opposed to the shared `@budi/types` package which contains domain types used across all packages.

## Examples

```typescript
// Component-specific props
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
}

// Form state types
interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}
```

## Guidelines

- Use `@budi/types` for domain types (School, User, Transaction)
- Use this directory for UI/frontend-specific types
- Keep types organized in files by domain

## Related Documents

- [Coding Standard](../../../../CODE_STYLE.md)
- [Package Types](../../../../../packages/types/README.md)

