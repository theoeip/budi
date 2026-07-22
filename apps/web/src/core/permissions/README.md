# Permissions

> Role-based access control utilities.

## Purpose

Provides components and hooks for permission-based UI rendering:

- `canAccess` — Check if current user has permission
- `RequirePermission` — Component wrapper for conditional rendering
- `RequireRole` — Component wrapper for role-based rendering

## Usage

```tsx
import { RequirePermission } from '@core/permissions';

function FinanceDashboard() {
  return (
    <RequirePermission permission="canManageFinance">
      <TransactionForm />
    </RequirePermission>
  );
}
```

## Related Documents

- [Security](../../../../docs/security.md)
- [User Types](../../../../../packages/types/src/user.types.ts)

