# Theme

> Theme tokens and configuration for the BUDI application.

## Purpose

Centralizes theme-related configuration including Tailwind CSS extensions, CSS variables, and design tokens.

## Structure

- `index.ts` — Theme exports
- Theme context in `core/providers/themeProvider.tsx`

## Usage

```typescript
import { useTheme } from '@core/providers';

function Component() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle {theme}</button>;
}
```

## Related Documents

- [Coding Standard](../../../../CODE_STYLE.md)
- [Folder Structure](../../../../docs/folder-structure.md)

