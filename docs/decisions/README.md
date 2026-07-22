# Architecture Decision Records (ADR)

> This folder contains Architecture Decision Records for the BUDI project.
> ADRs document significant architectural decisions and their context.

## What is an ADR?

An Architecture Decision Record (ADR) is a short document that captures an important architectural decision along with its context and consequences.

## ADR Format

Each ADR follows the [Michael Nygard template](https://github.com/joelparkerhenderson/architecture-decision-record):

- **Title**: Clear, descriptive title
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: Problem description and forces
- **Decision**: The chosen approach
- **Consequences**: Trade-offs and implications

## ADR Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| 001 | Monorepo Structure with pnpm + Turborepo | Accepted | 2025-01-15 |

## Creating a New ADR

1. Copy the template below
2. Assign next sequential ID
3. Fill in context, decision, and consequences
4. Submit via PR

### Template

```markdown
# ADR-NNN: Title

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD

## Context

[Describe the problem and forces at play]

## Decision

[Describe the decision and solution]

## Consequences

[Describe trade-offs and implications]
```

## Related Documents

- [Architecture](../architecture.md)
- [Development Workflow](../development-workflow.md)

