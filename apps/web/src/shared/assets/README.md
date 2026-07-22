# Assets

> Static assets used in the frontend application.

## Structure

```
assets/
├── images/     # Images and illustrations
├── icons/      # Custom SVG icons
└── fonts/      # Custom fonts (if not using CDN)
```

## Usage

```typescript
import logo from '@shared/assets/images/logo.svg';

<img src={logo} alt="BUDI" />
```

## Guidelines

- Optimize images before adding (compress, resize)
- Use SVG for icons and logos
- Prefer CDN fonts over local font files

## Related Documents

- [Branding](../../../../../public/branding/README.md)

