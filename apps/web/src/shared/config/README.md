# Config

> Frontend-specific configuration.

## Purpose

Contains configuration that is specific to the frontend application, such as:

- Environment variable access
- Feature flag helpers
- App-level configuration

## Usage

```typescript
import { isFeatureEnabled } from '@shared/config';

if (isFeatureEnabled('FINANCE')) {
  // Show finance module
}
```

## Related Documents

- [Package Config](../../../../../packages/config/README.md)
- [Environment Variables](../../.env.example)

