# Contexts

> Shared React contexts for cross-module state sharing.

## Purpose

Provides contexts that are shared across multiple modules but are not core infrastructure.

## Available Contexts

| Context | Purpose |
|---------|---------|
| `SchoolContext` | Current school context (future) |
| `NotificationContext` | Toast/notification system (future) |

## Usage

```tsx
import { useNotifications } from '@shared/contexts';

function FinanceDashboard() {
  const { showToast } = useNotifications();
  return <button onClick={() => showToast('Data saved!')}>Save</button>;
}
```

## Related Documents

- [Architecture](../../../../docs/architecture.md)

