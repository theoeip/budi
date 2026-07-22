# BUDI — Business & Unified Digital Information

> **Modular School Management Platform** — Built for scale, designed for AI.

[![CI](https://github.com/your-org/budi/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/budi/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🏫 Project Overview

BUDI is a **multi-tenant School Management Platform** that serves multiple schools from a single
application instance. Each school only accesses its own data through Row Level Security (RLS).

| Aspect            | Detail                                   |
| ----------------- | ---------------------------------------- |
| **Type**          | Multi-Tenant SaaS Platform               |
| **Current Phase** | Foundation (v0.1.0)                      |
| **Active Module** | Finance                                  |
| **Architecture**  | Feature-Based Modules                    |
| **Target**        | School Groups / Educational Institutions |

## 🚀 Technology Stack

```yaml
frontend:
  framework: React 19
  build: Vite 6
  language: TypeScript 5 (strict mode)
  styling: Tailwind CSS 4
  routing: React Router 7
  data-fetching: TanStack Query 5

backend:
  provider: Supabase
  database: PostgreSQL 15
  security: Row Level Security (RLS)

monorepo:
  manager: pnpm 9
  orchestrator: Turborepo 2

quality:
  linting: ESLint 9 (flat config)
  formatting: Prettier 3
  testing: Vitest + React Testing Library
  ci: GitHub Actions

deployment:
  platform: Vercel (frontend)
  desktop: Electron (future)
```

## 📦 Module Ecosystem

| Module                         | Code         | Status         | Priority  |
| ------------------------------ | ------------ | -------------- | :-------: |
| [Finance](src/modules/finance) | `finance`    | ✅ **Active**  |  🔴 High  |
| Academic                       | `academic`   | ⚪ Placeholder | 🟡 Medium |
| Attendance                     | `attendance` | ⚪ Placeholder | 🟡 Medium |
| Student                        | `student`    | ⚪ Placeholder |  🔴 High  |
| Teacher                        | `teacher`    | ⚪ Placeholder |  🔴 High  |
| Payroll                        | `payroll`    | ⚪ Placeholder | 🟡 Medium |
| PPDB                           | `ppdb`       | ⚪ Placeholder | 🟡 Medium |
| Library                        | `library`    | ⚪ Placeholder |  🟢 Low   |
| Inventory                      | `inventory`  | ⚪ Placeholder |  🟢 Low   |

## 🧩 Folder Structure

```
budi/
├── apps/                    # Applications
│   └── web/                 # React + Vite web app
│       ├── src/
│       │   ├── core/        # App infrastructure (providers, router, auth)
│       │   ├── shared/      # Reusable code (components, hooks, utils)
│       │   └── modules/     # Feature modules (finance, etc.)
│       └── vitest.config.ts
├── packages/                # Shared libraries
│   ├── types/               # @budi/types — TypeScript definitions
│   ├── utils/               # @budi/utils — Utility functions
│   ├── config/              # @budi/config — Shared configuration
│   └── eslint-config/       # @budi/eslint-config — ESLint presets
├── supabase/                # Database migrations & RLS policies
├── docs/                    # Documentation (architecture, ADRs, prompts)
│   ├── decisions/           # Architecture Decision Records
│   ├── prompts/             # AI assistant prompts
│   ├── database/            # Database schema & design
│   └── business/            # Business Requirement Specifications
├── scripts/                 # Automation & dev tools
├── public/                  # Static assets & branding
└── .github/                 # CI/CD, issue templates, PR templates
```

## 🛠️ Development Setup

### Prerequisites

| Tool    | Version   | Installation                       |
| ------- | --------- | ---------------------------------- |
| Node.js | >= 20.0.0 | [nodejs.org](https://nodejs.org)   |
| pnpm    | >= 9.0.0  | `npm install -g pnpm`              |
| Git     | Latest    | [git-scm.com](https://git-scm.com) |

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/budi.git
cd budi

# 2. Install all dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development
pnpm dev
```

### Available Commands

```bash
pnpm dev          # Start all development servers
pnpm build        # Build all packages & apps
pnpm lint         # Run ESLint across all packages
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without changing
pnpm typecheck    # TypeScript type checking
pnpm test         # Run all tests
pnpm test:watch   # Run tests in watch mode
pnpm clean        # Clean all builds & caches
```

### Environment Variables

See [.env.example](.env.example) for a complete list of required variables.

**Important:** Never commit `.env` files. Only `.env.example` is tracked.

## 🔄 Git Workflow

### Branch Strategy

```
main              # Production-ready code
└── develop       # Integration branch
    ├── feat/*    # New features
    ├── fix/*     # Bug fixes
    ├── docs/*    # Documentation
    └── chore/*   # Maintenance
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(finance): add transaction export
fix(auth): resolve token refresh
docs(architecture): update RLS diagram
chore(deps): upgrade TanStack Query
```

### Pull Request Process

1. Create a branch from `develop`
2. Make your changes
3. Ensure all checks pass (`pnpm typecheck && pnpm lint && pnpm test`)
4. Update documentation if needed
5. Create a PR using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)
6. Request review from code owners
7. Squash-merge to `develop`

## 🤝 Contribution Guide

See [CONTRIBUTING.md](CONTRIBUTING.md) for complete guidelines.

### Quick Checklist

- [ ] Code follows [CODE_STYLE.md](CODE_STYLE.md)
- [ ] TypeScript strict mode passes
- [ ] No `any` types or `as` casts
- [ ] Feature-based architecture respected
- [ ] Multi-tenant isolation maintained (`school_id`)
- [ ] Path aliases used (`@core`, `@shared`, `@modules`)
- [ ] Tests written for new functionality
- [ ] Documentation updated

## 📋 Sprint Status

| Sprint     | Focus                                                  |   Status    |
| ---------- | ------------------------------------------------------ | :---------: |
| Foundation | Project architecture, documentation, structure         | ✅ Complete |
| Sprint 1   | Authentication (Supabase Auth, Login, Forgot Password) | ✅ Complete |
| Sprint 2   | Database Schema & RLS Policies                         | 📅 Planned  |
| Sprint 3   | Finance Module — Transactions API                      |   🔜 Next   |
| Sprint 4   | Finance Module — Transactions UI                       |  🔜 Future  |

## 🔮 Roadmap

See [ROADMAP.md](ROADMAP.md) for the complete strategic plan.

### Upcoming Milestones

| Version | Focus             | Target     |
| ------- | ----------------- | ---------- |
| v0.1.0  | Foundation & Docs | ✅ Current |
| v0.2.0  | Database & Auth   | 📅 Q1 2025 |
| v0.3.0  | Finance — API     | 📅 Q1 2025 |
| v0.4.0  | Finance — UI      | 📅 Q2 2025 |
| v1.0.0  | Production Launch | 📅 Q3 2025 |

## 📖 Documentation Index

| Document                                            | Description                                      |
| --------------------------------------------------- | ------------------------------------------------ |
| [Architecture](docs/architecture.md)                | System design, data flow, component interactions |
| [Database](docs/database.md)                        | Schema, RLS policies, migration strategy         |
| [Business Spec](docs/business/BUDI_FINANCE_SPEC.md) | Finance module requirements                      |
| [API Guidelines](docs/api-guideline.md)             | API design standards                             |
| [Security](docs/security.md)                        | Security model & vulnerability reporting         |
| [Coding Standard](docs/coding-standard.md)          | Code style & conventions                         |
| [AI Context](AI_CONTEXT.md)                         | Guide for AI assistants                          |
| [ADR](docs/decisions/)                              | Architecture Decision Records                    |

## 🔒 Security

See [SECURITY.md](SECURITY.md) for our security policy and vulnerability reporting process.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

_Built with ❤️ for modern education._
