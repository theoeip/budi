# Constants

> Application-wide constant values.

## Purpose

Centralizes constant values used across the frontend application.

## Examples

```typescript
export const PAGE_SIZE = 20;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
export const API_ENDPOINTS = {
  TRANSACTIONS: '/finance/transactions',
  CATEGORIES: '/finance/categories',
} as const;
```

## Guidelines

- Use `@budi/config` for configuration patterns
- Use this directory for app-specific constants
- Use `as const` for literal types

## Related Documents

- [Package Config](../../../../../packages/config/README.md)

