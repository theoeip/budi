# Providers

> React context providers that wrap the application.

## Purpose

Providers initialize and manage global application state. They are composed in `App.tsx` and wrap the entire component tree.

## Providers

| Provider | Purpose |
|----------|---------|
| `QueryClientProvider` | TanStack Query client (in App.tsx) |
| `ThemeProvider` | Theme/color mode management |
| `AuthProvider` | Authentication state & session |

## Usage

Providers are composed in `App.tsx`:

```tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
</QueryClientProvider>
```

## Related Documents

- [Architecture](../../../../docs/architecture.md)
- [Security](../../../../docs/security.md)

