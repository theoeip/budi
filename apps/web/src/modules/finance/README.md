# Finance Module

> Fee management, transactions, and accounting module.

## Status: ✅ Active

The Finance module is the first and currently only active module in BUDI.

## Feature Slices

```
finance/
├── dashboard/        # Financial overview, charts, KPIs
├── transactions/     # Income & expense management
├── categories/       # Transaction category management
├── accounts/         # Bank & cash account management
├── reports/          # Financial reports & exports
└── settings/         # Module configuration
```

## Sub-Module Structure

Each feature slice follows this pattern:

```
<feature>/
├── README.md         # Feature documentation
├── components/       # Feature-specific components
├── hooks/            # Feature-specific hooks
├── services/         # Feature-specific API services
└── types/            # Feature-specific types
```

## Database Tables

- `finance_transactions` — Income/expense records
- `finance_categories` — Transaction categories
- `finance_accounts` — Bank/cash accounts
- `finance_reports` — Generated reports

## Related Documents

- [Types](../../../../packages/types/src/finance.types.ts)
- [Database Schema](../../../docs/database.md)
- [API Guidelines](../../../docs/api-guideline.md)

