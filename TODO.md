# Sprint 5 — Module Registry

## ✅ Step 1: Create core Module types

- [x] Create `apps/web/src/core/modules/types.ts`
  - ModuleDefinition (declarative, no React components)
  - ModuleRoute (metadata only: id, path, roles, permission, componentKey)
  - ModuleWidget (extends WidgetDefinition pattern)
  - ModuleNavItem (navigation metadata)

## ✅ Step 2: Create ModuleRegistry

- [x] Create `apps/web/src/core/modules/registry.ts`
  - Singleton class
  - register(), unregister(), getModule(), getModules(), getEnabledModules()
  - getModuleNavItems(), getModuleWidgets(), getModuleRoutes()
  - Immutable returns (frozen/readonly)
  - No React rendering logic

## ✅ Step 3: Create ModuleLoader

- [x] Create `apps/web/src/core/modules/loader.ts`
  - Bootstraps built-in modules
  - Idempotent registration
  - Sorted by order

## ✅ Step 4: Create module definitions

- [x] Create `apps/web/src/core/modules/definitions/dashboard.ts`
- [x] Create `apps/web/src/core/modules/definitions/finance.ts`
- [x] Create `apps/web/src/core/modules/definitions/schools.ts`
- [x] Create `apps/web/src/core/modules/definitions/index.ts`

## ✅ Step 5: Create route generator helpers

- [x] Create `apps/web/src/core/modules/routeGenerator.ts`
  - Route metadata helpers
  - Does NOT modify router

## ✅ Step 6: Barrel export

- [x] Create `apps/web/src/core/modules/index.ts`

## ✅ Step 7: Refactor dashboard.config.ts

- [x] `getSortedWidgets()` pulls from ModuleRegistry
- [x] Legacy DASHBOARD_WIDGETS derives from module definitions

## ✅ Step 8: Refactor dashboardLayout.tsx

- [x] Navigation comes from ModuleRegistry (getModuleNavItems())
- [x] Legacy NAV_ITEMS compatibility maintained

## ✅ Step 9: Validation

- [x] Run `pnpm typecheck` — **5/5 packages PASSED**
- [x] Run `pnpm build` — **1/1 tasks PASSED** (Vite build 4.25s, 278 modules)
- [x] Both pass
- [x] No duplicate navigation entries
- [x] No duplicate widget IDs
- [x] Module loader is idempotent
- [x] Disabled modules do not contribute
- [x] Existing dashboard still renders
