# Architecture — BUDI

> System architecture, design decisions, and component interactions.

---

## 📋 Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Multi-Tenant Design](#multi-tenant-design)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [Module Architecture](#module-architecture)
7. [Security Architecture](#security-architecture)

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WEB["Web App (React + Vite)"]
        DESKTOP["Desktop (Electron) - Future"]
    end

    subgraph "CDN / Edge"
        VERCEL["Vercel Edge Network"]
    end

    subgraph "BUDI Platform"
        ROUTER["React Router"]
        QUERY["TanStack Query"]
        AUTH["Auth Layer"]
        RLS["RLS Enforcement"]
    end

    subgraph "Supabase"
        API["Supabase API"]
        PG[("PostgreSQL Database")]
        STORAGE["Supabase Storage"]
        REALTIME["Realtime"]
    end

    subgraph "External"
        SENTRY["Sentry - Monitoring"]
    end

    WEB --> VERCEL
    DESKTOP --> VERCEL
    VERCEL --> ROUTER
    ROUTER --> QUERY
    QUERY --> AUTH
    AUTH --> API
    API --> PG
    PG --> RLS
    WEB --> SENTRY
```

## Multi-Tenant Design

```mermaid
graph LR
    subgraph "Application Instance"
        SCHOOL_A["School A<br/>school_id: 1"]
        SCHOOL_B["School B<br/>school_id: 2"]
        SCHOOL_C["School C<br/>school_id: 3"]
    end

    subgraph "Database"
        TABLE_A["finance_transactions<br/>school_id: 1"]
        TABLE_B["finance_transactions<br/>school_id: 2"]
        TABLE_C["finance_transactions<br/>school_id: 3"]
    end

    SCHOOL_A --> TABLE_A
    SCHOOL_B --> TABLE_B
    SCHOOL_C --> TABLE_C
```

### Tenant Isolation Strategy

1. **`school_id`** column in every business table
2. **RLS Policies** enforce `school_id = auth.school_id()`
3. **API Layer** passes `school_id` from authenticated user context
4. **Frontend** never allows selecting a different school's data

## Frontend Architecture

```mermaid
graph TD
    subgraph "apps/web/src"
        CORE["core/"]
        SHARED["shared/"]
        MODULES["modules/"]
        
        subgraph "Core"
            PROV["providers/"]
            ROUT["router/"]
            THEME["theme/"]
            AUTH["auth/"]
            PERM["permissions/"]
        end
        
        subgraph "Shared"
            COMP["components/"]
            LAY["layouts/"]
            HOOKS["hooks/"]
            CTX["contexts/"]
            SERV["services/"]
            REPO["repositories/"]
            TYPES["types/"]
            UTILS["utils/"]
        end
        
        subgraph "Modules"
            FINANCE["finance/"]
            ACADEMIC["academic/"]
            OTHER["..."]
        end
    end

    CORE --> SHARED
    SHARED --> MODULES
```

### Core Layer

The `core/` layer provides application-wide infrastructure:

- **providers/** — React context providers (QueryClient, Theme, Auth)
- **router/** — Route definitions with lazy loading
- **theme/** — Theme tokens and Tailwind CSS configuration
- **auth/** — Authentication context and utilities
- **permissions/** — Role-based access control

### Shared Layer

The `shared/` layer contains reusable code used across modules:

- **components/** — UI primitives and shared components
- **hooks/** — Custom React hooks
- **services/** — API service layer (data fetching)
- **repositories/** — Data access layer (cache, persistence)

### Module Layer

Each module in `modules/` is a self-contained feature:

```
finance/
├── dashboard/     # Dashboard views
├── transactions/  # Transaction management
├── categories/    # Category management
├── accounts/      # Account management
├── reports/       # Reports and exports
└── settings/      # Module settings
```

## Backend Architecture

```mermaid
graph TD
    subgraph "Supabase"
        API["REST API / GraphQL"]
        PG[("PostgreSQL")]
        
        subgraph "Security Layer"
            AUTH_SCHEMA["auth schema"]
            RLS_POLICIES["RLS Policies"]
        end
        
        subgraph "Database Objects"
            TABLES["Business Tables"]
            VIEWS["Views"]
            FUNCTIONS["Functions"]
            TRIGGERS["Triggers"]
        end
    end

    API --> RLS_POLICIES
    RLS_POLICIES --> TABLES
    TABLES --> VIEWS
    VIEWS --> FUNCTIONS
    FUNCTIONS --> TRIGGERS
    AUTH_SCHEMA --> RLS_POLICIES
```

## Data Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant Q as TanStack Query
    participant S as Supabase
    participant DB as PostgreSQL

    U->>F: Interact with UI
    F->>Q: Query hook
    Q->>S: API Request + JWT
    S->>DB: Query + RLS Check
    DB-->>S: Filtered Data
    S-->>Q: Response
    Q-->>F: Cached Data
    F-->>U: Render UI
```

## Module Architecture

### Active Module: Finance

```
modules/finance/
├── dashboard/       # Overview, charts, KPIs
├── transactions/    # Income/expense entries
├── categories/      # Transaction categories
├── accounts/        # Bank/cash accounts
├── reports/         # Financial statements
└── settings/        # Module configuration
```

### Placeholder Modules

Each future module follows the same pattern:

```
modules/<module>/
├── dashboard/
├── <feature>/
└── settings/
```

## Security Architecture

See [Security](security.md) for detailed security model.

**Key Principles:**

1. **Defense in depth** — RLS + API validation + UI restrictions
2. **Least privilege** — Each role has minimum required access
3. **Tenant isolation** — `school_id` enforced at every layer
4. **No BYO SQL** — All queries go through API/RLS

---

## Related Documents

- [Database Schema](database.md)
- [Folder Structure](folder-structure.md)
- [Security Model](security.md)
- [API Guidelines](api-guideline.md)

