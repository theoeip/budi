# Folder Structure — BUDI

> Complete reference of the BUDI project directory structure.

---

## 📋 Table of Contents

1. [Root Structure](#root-structure)
2. [Application Structure (apps/web/)](#application-structure-appsweb)
3. [Core Layer (src/core/)](#core-layer-srccore)
4. [Shared Layer (src/shared/)](#shared-layer-srcshared)
5. [Module Layer (src/modules/)](#module-layer-srcmodules)
6. [Package Structure (packages/)](#package-structure-packages)
7. [Documentation Structure (docs/)](#documentation-structure-docs)

---

## Root Structure

```
budi/
├── apps/                    # Application targets
│   └── web/                 # Main web application
├── packages/                # Shared libraries & configurations
│   ├── types/              # Shared TypeScript type definitions
│   ├── utils/              # Shared utility functions
│   ├── config/             # Shared configuration
│   └── eslint-config/      # Shared ESLint configuration
├── supabase/               # Database, RLS, migrations
│   ├── config.toml         # Supabase project configuration
│   ├── seed.sql            # Seed data for development
│   └── migrations/         # Database migration files
├── docs/                   # Project documentation
│   ├── decisions/          # Architecture Decision Records (ADRs)
│   └── prompts/            # AI development prompts
├── scripts/                # Automation & development scripts
├── public/                 # Static assets
│   └── branding/          # Branding assets (logo, favicon, icons)
├── .editorconfig           # Cross-IDE configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── .prettierignore         # Prettier ignore rules
├── .npmrc                  # PNPM configuration
├── .env.example            # Environment variable template
├── eslint.config.js        # ESLint flat configuration
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # PNPM workspace definition
├── turbo.json              # Turborepo pipeline
└── tsconfig.base.json      # Base TypeScript configuration
```

## Application Structure (apps/web/)

```
apps/web/
├── public/                 # Web-specific static assets
├── src/
│   ├── core/              # Application infrastructure
│   ├── shared/            # Reusable cross-module code
│   └── modules/           # Feature modules
│       ├── finance/       # ✅ Active module
│       ├── academic/      # ⚪ Placeholder
│       ├── library/       # ⚪ Placeholder
│       ├── attendance/    # ⚪ Placeholder
│       ├── inventory/     # ⚪ Placeholder
│       ├── payroll/       # ⚪ Placeholder
│       ├── student/       # ⚪ Placeholder
│       ├── teacher/       # ⚪ Placeholder
│       └── ppdb/          # ⚪ Placeholder
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Core Layer (src/core/)

```
core/
├── providers/             # React context providers (QueryClient, Theme, Auth)
├── router/                # Route definitions & lazy loading
├── theme/                 # Theme tokens & Tailwind extensions
├── auth/                  # Authentication context & utilities
└── permissions/           # Role-based access control
```

Each folder has a `README.md` explaining its purpose.

## Shared Layer (src/shared/)

```
shared/
├── components/            # Shared UI components
│   ├── ui/               # Primitives (Button, Input, Card, etc.)
│   └── shared/           # Domain-agnostic shared components
├── layouts/              # Layout components (MainLayout, AuthLayout)
├── hooks/                # Custom React hooks
├── contexts/             # Shared React contexts
├── services/             # API service layer
├── repositories/         # Data access layer (cache, persistence)
├── types/                # Shared type definitions
├── utils/                # Utility functions (cn, format, date)
├── constants/            # Application-wide constants
├── config/               # Shared configuration
└── assets/               # Images, icons, fonts
```

## Module Layer (src/modules/)

### Active: Finance Module

```
modules/finance/
├── README.md             # Module documentation
├── dashboard/            # Financial overview dashboard
│   └── README.md
├── transactions/         # Income & expense management
│   └── README.md
├── categories/           # Transaction categories
│   └── README.md
├── accounts/             # Bank & cash accounts
│   └── README.md
├── reports/              # Financial reports & exports
│   └── README.md
└── settings/             # Module configuration
    └── README.md
```

### Placeholder Modules

Each future module follows the same pattern:

```
modules/<module-name>/
├── README.md
├── dashboard/
│   └── README.md
└── settings/
    └── README.md
```

## Package Structure (packages/)

```
packages/
├── types/                # @budi/types
│   ├── src/
│   │   ├── index.ts
│   │   ├── school.types.ts
│   │   ├── user.types.ts
│   │   ├── finance.types.ts
│   │   └── supabase.ts
│   ├── package.json
│   └── tsconfig.json
├── utils/                # @budi/utils
│   ├── src/
│   │   ├── index.ts
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   ├── date.ts
│   │   └── permissions.ts
│   ├── package.json
│   └── tsconfig.json
├── config/               # @budi/config
│   ├── src/
│   │   ├── index.ts
│   │   ├── roles.ts
│   │   ├── modules.ts
│   │   └── navigation.ts
│   ├── package.json
│   └── tsconfig.json
└── eslint-config/        # @budi/eslint-config
    ├── src/
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Documentation Structure (docs/)

```
docs/
├── README.md             # Documentation index
├── architecture.md       # System architecture
├── database.md           # Database & RLS
├── coding-standard.md    # Detailed coding standards
├── folder-structure.md   # This file
├── api-guideline.md      # API design guidelines
├── security.md           # Security model
├── development-workflow.md # Development process
├── decisions/            # ADRs
│   ├── README.md
│   └── adr-001-monorepo-structure.md
└── prompts/              # AI prompts
    ├── README.md
    └── system-prompt.md
```

---

## Related Documents

- [Architecture](architecture.md)
- [Coding Standard](coding-standard.md)
- [AI Context](../AI_CONTEXT.md)

