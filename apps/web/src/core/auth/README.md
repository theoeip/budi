# Auth

> Authentication context and utilities.

## Purpose

Manages authentication state, user session, and provides auth-related hooks and utilities.

## Current Status

Authentication is **not yet implemented**. This directory contains the scaffolding for:

- `authContext.tsx` — Auth provider and hook (to be implemented)
- `authGuard.tsx` — Route protection component (to be implemented)

## Future Implementation

Will use Supabase Auth for:

- Email/password login
- Session management with JWT
- Role-based access control
- School context from JWT claims

## Usage (Future)

```typescript
import { useAuth } from '@core/auth';

function Dashboard() {
  const { user, school, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return <div>Welcome, {user?.fullName}</div>;
}
```

## Related Documents

- [Security](../../../../docs/security.md)
- [Architecture](../../../../docs/architecture.md)

