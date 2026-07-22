# Hooks

> Shared custom React hooks for the BUDI platform.

## Available Hooks

| Hook | Purpose |
|------|---------|
| `useDebounce` | Debounce a value |
| `useLocalStorage` | Persistent state in localStorage |
| `useMediaQuery` | Responsive media query hook |

## Usage

```typescript
import { useDebounce } from '@shared/hooks';

function SearchInput() {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);
  // Use debouncedValue for API calls
}
```

## Guidelines

- Hooks should be generic and reusable across modules
- Hooks should not import from modules
- Each hook in its own file with proper JSDoc

## Related Documents

- [Coding Standard](../../../../CODE_STYLE.md)

