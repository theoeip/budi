# Pages

> Top-level page components for the BUDI application.

## Structure

```
pages/
├── dashboard/        # Main dashboard page
├── finance/          # Finance pages (redirects to module)
├── auth/             # Authentication pages (future)
├── settings/         # Settings pages (future)
└── errors/           # Error pages (404, 500)
```

## Guidelines

- Pages are high-level route components
- Pages compose layouts, modules, and shared components
- Pages handle data loading and error states
- Pages should be thin — delegate logic to modules

## Related Documents

- [Router](../core/router/README.md)
- [Architecture](../../docs/architecture.md)

