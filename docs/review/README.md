# Engineering Review Workflow

> Automated code quality review for the BUDI project.

## Overview

The Engineering Review Workflow generates a comprehensive report every time it runs, including
linting, type-checking, build status, git changes, and recent commits.

## Usage

```bash
pnpm review
```

This will:

1. Run `git status` — list changed files
2. Run `git diff HEAD~1` — show changes since last commit
3. Run `git log --oneline -5` — show recent commits
4. Run `pnpm lint` — ESLint results
5. Run `pnpm typecheck` — TypeScript type checks
6. Run `pnpm build` — Build output
7. Generate `reports/latest/SUMMARY.md` — comprehensive summary
8. Generate `reports/latest/project-status.json` — machine-readable status

## Output Structure

```
reports/latest/
├── SUMMARY.md              # Human-readable report summary
├── project-status.json     # Machine-readable status (CI-friendly)
├── changed-files.txt       # Git status output
├── commits.txt             # Recent commit log
├── git.diff                # Full git diff
├── lint.txt                # ESLint output
├── typecheck.txt           # TypeScript type check output
└── build.txt               # Build output
```

## CI Integration

The `project-status.json` file is designed for CI pipeline consumption:

```json
{
  "status": "pass",
  "checks": {
    "lint": { "exitCode": 0, "passed": true },
    "typecheck": { "exitCode": 0, "passed": true },
    "build": { "exitCode": 0, "passed": true }
  }
}
```

## Requirements

- Node.js >= 20
- Git installed and accessible from CLI
- All project dependencies installed (`pnpm install`)

## Related Documents

- [Development Workflow](../development-workflow.md)
- [CI Pipeline](../../.github/workflows/ci.yml)
- [Contributing](../../CONTRIBUTING.md)
