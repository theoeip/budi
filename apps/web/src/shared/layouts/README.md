# Layouts

> Layout components for consistent page structure.

## Layouts

| Layout | Purpose |
|--------|---------|
| `MainLayout` | Authenticated app layout with sidebar and header |
| `AuthLayout` | Login/register pages layout |
| `MinimalLayout` | Minimal layout for error pages |

## Usage

```tsx
import { MainLayout } from '@shared/layouts';

function DashboardPage() {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
}
```

## Related Documents

- [Architecture](../../../../docs/architecture.md)
- [Router](../../../core/router/README.md)

