# Utils

> Shared utility functions for the frontend application.

## Purpose

Contains utility functions that are specific to the frontend application. For cross-package utilities, see `@budi/utils`.

## Examples

```typescript
// Validation helpers
function isValidEmail(email: string): boolean { ... }

// UI helpers
function getStatusColor(status: TransactionStatus): string { ... }
```

## Guidelines

- Use `@budi/utils` for generic utilities (cn, format, date)
- Use this directory for frontend-specific utilities
- Keep utilities pure and testable

## Related Documents

- [Coding Standard](../../../../CODE_STYLE.md)
- [Package Utils](../../../../../packages/utils/README.md)

