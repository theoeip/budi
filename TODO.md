# Sprint 4B — Dashboard Foundation TODO

## ✅ Step 1: Complete DashboardLayout

- [x] Complete `dashboardLayout.tsx` with:
  - [x] Full Header (BUDI logo, school name, desktop/mobile toggle)
  - [x] Sidebar menu generated from `NAV_ITEMS` via `PermissionService`
  - [x] User Menu (Profile, Preferences, Settings placeholders, Logout functional)
  - [x] Theme toggle placeholder
  - [x] Notification placeholder
  - [x] School Selector placeholder
  - [x] Mobile-responsive sidebar toggle

## ✅ Step 2: Create Widget Components

- [x] Create `widgets/UserSummaryWidget.tsx`
- [x] Create `widgets/SchoolSummaryWidget.tsx`
- [x] Create `widgets/PermissionSummaryWidget.tsx`
- [x] Create `widgets/SystemStatusWidget.tsx`
- [x] Create `widgets/index.ts` (WidgetRegistry)

## ✅ Step 3: Update Dashboard Config

- [x] Ensure `dashboard.config.ts` has proper config structure

## ✅ Step 4: Rewrite DashboardPage

- [x] Rewrite `dashboardPage.tsx` to:
  - [x] Load config from `dashboard.config.ts`
  - [x] Filter widgets via `PermissionService`
  - [x] Resolve components from `WidgetRegistry`
  - [x] Wrap sensitive widgets with `ComponentGuard`
  - [x] Pass data via props (single data fetch)

## ✅ Step 5: Wrap Dashboard in Layout

- [x] Router uses `DashboardLayout` to wrap `DashboardPage`

## 🔄 Step 6: Validation

- [x] Run `pnpm typecheck`
- [x] Run `pnpm build`
- [x] Both pass
