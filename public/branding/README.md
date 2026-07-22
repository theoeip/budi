# Branding — BUDI

> Branding assets for the BUDI School Management Platform.

## Contents

| File | Purpose |
|------|---------|
| `logo.svg` | Main BUDI logo |
| `favicon.svg` | Browser favicon |
| `app-icon.svg` | Application icon (PWA, desktop) |

## Usage

### Logo

```tsx
import logo from '@assets/logo.svg';

<img src={logo} alt="BUDI" />
```

### Favicon

```html
<link rel="icon" type="image/svg+xml" href="/branding/favicon.svg" />
```

### App Icon

Used for PWA and future Electron desktop app.

## Guidelines

- **Do not modify** SVG files directly without design approval
- Maintain consistent branding across all platforms
- Use SVG format for scalability

## Related Documents

- [Architecture](../../docs/architecture.md)
- [Development Workflow](../../docs/development-workflow.md)

