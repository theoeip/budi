# Modules

> Feature modules for the BUDI School Management Platform.

## Structure

Each module is a self-contained feature with its own:

- **Feature slices** (dashboard, transactions, etc.)
- **Services** (API calls)
- **Repositories** (TanStack Query hooks)
- **Types** (module-specific types)
- **Components** (module-specific components)

## Active Module

| Module | Code | Status |
|--------|------|--------|
| [Finance](finance/) | `finance` | ✅ Active |

## Placeholder Modules

| Module | Code | Status |
|--------|------|--------|
| Academic | `academic` | ⚪ Placeholder |
| Library | `library` | ⚪ Placeholder |
| Attendance | `attendance` | ⚪ Placeholder |
| Inventory | `inventory` | ⚪ Placeholder |
| Payroll | `payroll` | ⚪ Placeholder |
| Student | `student` | ⚪ Placeholder |
| Teacher | `teacher` | ⚪ Placeholder |
| PPDB | `ppdb` | ⚪ Placeholder |

## Module Convention

Each module follows this structure:

```
<module>/
├── README.md            # Module documentation
├── dashboard/           # Overview/dashboard
│   └── README.md
├── <feature>/           # Feature slice (per domain)
│   └── README.md
└── settings/            # Module settings
    └── README.md
```

## Related Documents

- [Architecture](../../docs/architecture.md)
- [Folder Structure](../../docs/folder-structure.md)

