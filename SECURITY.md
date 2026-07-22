# Security — BUDI

> Security policies, vulnerability reporting, and best practices for the BUDI platform.

---

## 🔒 Reporting Vulnerabilities

We take security seriously. If you discover a security vulnerability within BUDI, please follow
these steps:

### Do NOT

- **Do NOT** disclose the vulnerability publicly (e.g., GitHub Issues, Discussions)
- **Do NOT** create a public PR to fix a vulnerability
- **Do NOT** share details on social media

### Do

1. **Email** the security team at: `security@budi.app` (placeholder)
2. Include as much detail as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Affected versions
   - Potential impact
   - Suggested fix (if any)
3. Allow **72 hours** for initial response
4. Allow **14 days** for resolution before public disclosure

### What to Expect

- Acknowledgment within 72 hours
- Regular updates on progress
- Credit in release notes (if desired)
- CVE assignment if applicable

---

## 🛡️ Security Principles

| Principle             | Description                                     |
| --------------------- | ----------------------------------------------- |
| **Defense in Depth**  | Multiple security layers protect every resource |
| **Least Privilege**   | Users have minimum required access              |
| **Zero Trust**        | Verify every request, never trust implicitly    |
| **Secure by Default** | Opt-out for security exceptions, never opt-in   |
| **Fail Secure**       | Default deny when errors occur                  |

---

## 🔐 Environment Variables Policy

### Rules

1. **NEVER** commit real secrets to version control
2. **ALWAYS** use `.env.example` as the template
3. **ALWAYS** add `.env` to `.gitignore`
4. **USE** environment variables for all configuration
5. **ROTATE** secrets regularly (minimum quarterly)
6. **LIMIT** who has access to production secrets

### Frontend Secrets

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe in frontend code:

| Variable                    | Safe in Frontend? | Reason               |
| --------------------------- | :---------------: | -------------------- |
| `VITE_SUPABASE_URL`         |      ✅ Yes       | Public URL           |
| `VITE_SUPABASE_ANON_KEY`    |      ✅ Yes       | Restricted by RLS    |
| `SUPABASE_SERVICE_ROLE_KEY` |       ❌ No       | Full database access |

---

## 🔑 Secret Management

### GitHub Secrets (CI/CD)

Store the following as GitHub Actions secrets:

| Secret Name                 | Description                         |
| --------------------------- | ----------------------------------- |
| `SUPABASE_URL`              | Supabase project URL                |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key              |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (CI only) |
| `VERCEL_TOKEN`              | Vercel deployment token             |
| `SENTRY_AUTH_TOKEN`         | Sentry authentication token         |

### Local Development

```bash
cp .env.example .env
# Edit .env with your local values
# .env is in .gitignore — safe from commits
```

---

## 🔄 Security Checklist

### Before Deployment

- [ ] All RLS policies enabled and tested
- [ ] No service role keys in frontend code
- [ ] CORS configured for known origins only
- [ ] HTTPS enforced (Vercel handles this)
- [ ] Rate limiting configured (Supabase)
- [ ] Audit logging enabled

### Before Merge

- [ ] Code reviewed by at least one peer
- [ ] No hardcoded secrets or tokens
- [ ] Input validation implemented
- [ ] Error messages do not leak internals
- [ ] Dependencies are up-to-date

### Regular Maintenance

- [ ] Dependencies audited (`pnpm audit`)
- [ ] Secrets rotated (quarterly)
- [ ] Access reviews conducted (quarterly)
- [ ] Penetration testing (annually)

---

## 📋 Related Documents

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [API Guidelines](docs/api-guideline.md)
- [Development Workflow](docs/development-workflow.md)
