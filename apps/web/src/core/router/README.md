# Router

> Application routing configuration using React Router v7.

## Purpose

Defines all application routes with lazy loading for code splitting. Routes are organized by module:

- **Core routes** — `/dashboard`, `/settings`, `/auth`
- **Module routes** — `/finance/*`, `/academic/*` (future)

## Lazy Loading

All page-level components use `React.lazy()` for code splitting:

```typescript
const FinanceDashboard = lazy(() => import('@modules/finance/dashboard'));
```

## Route Configuration

Routes can be extended by each module. See [Module Architecture](../../../docs/architecture.md) for details.

## Related Documents

- [Architecture](../../../../docs/architecture.md)
- [API Guidelines](../../../../docs/api-guideline.md)

