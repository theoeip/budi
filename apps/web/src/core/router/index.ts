// Core Router — Application route definitions
// Uses React Router v7 with lazy loading for code splitting.

import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, LoginRoute } from '@core/auth';
import { RootRedirect } from './rootRedirect';

// Fallback component for routes that haven't been created yet
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="mt-2 text-gray-500">Module under development</p>
      </div>
    </div>
  );
}

// Lazy-loaded page components for code splitting
const DashboardPage = lazy(() =>
  import('../../pages/dashboard/dashboardPage').catch(
    () => ({ default: () => <PlaceholderPage title="Dashboard" /> }),
  ),
);
const LoginPage = lazy(() =>
  import('../../pages/auth/loginPage').then((m) => ({ default: m.LoginPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('../../pages/auth/forgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
);
const SchoolSelectorPage = lazy(() =>
  import('../../pages/auth/schoolSelectorPage').then((m) => ({
    default: m.SchoolSelectorPage,
  })),
);

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );
}

/**
 * Application router with lazy-loaded routes.
 * Each route is a separate chunk for optimal loading.
 */
export function AppRouter(): ReactNode {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* === Public Auth Routes === */}
        <Route
          path="/auth/login"
          element={
            <LoginRoute>
              <LoginPage />
            </LoginRoute>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <LoginRoute>
              <ForgotPasswordPage />
            </LoginRoute>
          }
        />

        {/* === Super Admin Routes === */}
        <Route
          path="/school-select"
          element={
            <ProtectedRoute requiredRole={['super_admin']}>
              <SchoolSelectorPage />
            </ProtectedRoute>
          }
        />

        {/* === Protected Routes === */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* === Finance Module Routes (protected) === */}
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceOverview />
            </ProtectedRoute>
          }
        />

        {/* === Root & Catch-all === */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

const FinanceOverview = lazy(() =>
  import('../../modules/finance/dashboard/financeDashboard').catch(
    () => ({ default: () => <PlaceholderPage title="Finance Overview" /> }),
  ),
);

