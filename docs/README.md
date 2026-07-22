# BUDI Documentation

> Central documentation hub for the BUDI School Management Platform.

## Structure

```
docs/
├── README.md               # This file
├── architecture.md         # System architecture & diagrams
├── database.md             # Database schema & RLS
├── coding-standard.md      # Code style guide
├── folder-structure.md     # Directory structure reference
├── api-guideline.md        # API design standards
├── security.md             # Security model
├── development-workflow.md # Development process
├── decisions/              # Architecture Decision Records (ADRs)
│   ├── README.md
│   └── adr-001-monorepo-structure.md
└── prompts/                # AI development prompts
    ├── README.md
    └── system-prompt.md
```

## Document Index

| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture](architecture.md) | System architecture, component design, data flow | Architects, Developers |
| [Database](database.md) | Schema design, RLS policies, migrations | Backend, DBAs |
| [Coding Standard](coding-standard.md) | Code style, patterns, conventions | All Developers |
| [Folder Structure](folder-structure.md) | Directory layout and conventions | All Developers |
| [API Guidelines](api-guideline.md) | API design, versioning, error handling | Frontend, Backend |
| [Security](security.md) | Security model, tenant isolation, auth | Architects, Security |
| [Development Workflow](development-workflow.md) | Git workflow, CI/CD, review process | All Developers |
| [Decisions](decisions/) | Architectural Decision Records | Architects |
| [Prompts](prompts/) | AI assistant prompts | AI, Developers |

## Cross-References

- See [AI_CONTEXT.md](../AI_CONTEXT.md) for AI assistant onboarding
- See [CODE_STYLE.md](../CODE_STYLE.md) for coding conventions
- See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## Updating Documentation

1. Keep docs in sync with code changes
2. Cross-reference related documents
3. Add ADRs for significant decisions
4. Update AI prompts when workflows change

