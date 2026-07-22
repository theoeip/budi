# Components

> Shared UI components for the BUDI platform.

## Structure

```
components/
├── ui/           # Primitive UI components (Button, Input, Card, Modal, etc.)
└── shared/       # Domain-agnostic composite components (DataTable, SearchInput, etc.)
```

## Guidelines

- Each component has its own directory with index.ts export
- Components use Tailwind CSS for styling
- Components use `cn()` from `@budi/utils` for conditional classes
- Components are generic and don't import from modules

## Related Documents

- [Coding Standard](../../../../CODE_STYLE.md)
- [Architecture](../../../../docs/architecture.md)

