# Contributing to BUDI

> Guidelines for contributing to the BUDI School Management Platform.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Guidelines](#pull-request-guidelines)
5. [Commit Convention](#commit-convention)
6. [Code Review](#code-review)
7. [Module Development](#module-development)

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Assume good intentions
- Collaborate openly

## Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/budi.git
cd budi

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Start development
pnpm dev
```

## Development Workflow

1. **Pick an issue** — Check [PROJECT_STATUS.md](PROJECT_STATUS.md) for current priorities
2. **Create a branch** — `feat/your-feature-name` or `fix/your-fix-name`
3. **Develop** — Follow [CODE_STYLE.md](CODE_STYLE.md)
4. **Test** — Ensure tests pass (`pnpm test`)
5. **Lint** — Run `pnpm lint`
6. **Format** — Run `pnpm format`
7. **PR** — Create a pull request

## Pull Request Guidelines

- **Title**: Use conventional commits (e.g., `feat(finance): add transaction export`)
- **Description**: Explain what and why, include screenshots for UI changes
- **Scope**: Keep PRs focused — one feature/fix per PR
- **Size**: Prefer small, reviewable PRs
- **Checks**: Ensure all CI checks pass
- **Related**: Link relevant issues

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`
**Scopes**: `finance`, `academic`, `auth`, `core`, `ui`, `deps`, `docs`

### Examples

```
feat(finance): add transaction list with pagination
fix(auth): handle expired token refresh
docs(architecture): add RLS policy diagram
chore(deps): upgrade react-router to v7
```

## Code Review

- All PRs require at least one approval
- Review for: correctness, security, performance, readability
- Use GitHub's review features (comments, suggestions)
- Be respectful and constructive in feedback

## Module Development

When creating a new module:

1. Create folder under `src/modules/<module-name>`
2. Add feature slices (e.g., `dashboard/`, `settings/`)
3. Create `README.md` for the module
4. Add feature flag in `.env.example`
5. Register routes in `core/router`
6. Register nav items in shared navigation config

For detailed module structure, see [Folder Structure](docs/folder-structure.md).

## Documentation

- Update relevant documentation when changing features
- Cross-reference related documents
- Keep AI_CONTEXT.md up to date
- Add ADRs for significant decisions

## Questions?

Check [docs/](docs/) for detailed guides.

---

## Related Documents

- [Code Style](CODE_STYLE.md)
- [Development Workflow](docs/development-workflow.md)
- [Architecture](docs/architecture.md)

