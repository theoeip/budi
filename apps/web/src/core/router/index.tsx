// Core Router — Application route definitions
// Uses React Router v7 with lazy loading for code splitting.

import { LoginRoute, ProtectedRoute } from '@core/auth';
import { DashboardLayout } from '@core/dashboard/dashboardLayout';
import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootRedirect } from './rootRedirect';

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

const DashboardPage = lazy(() =>
  import('../../pages/dashboard/dashboardPage').catch(() => ({
    default: () => <PlaceholderPage title="Dashboard" />,
  })),
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
const AcademicYearsPage = lazy(() =>
  import('../../modules/schools/pages/AcademicYearsPage').then((m) => ({ default: m.AcademicYearsPage }))
);
const SemestersPage = lazy(() =>
  import('../../modules/schools/pages/SemestersPage').then((m) => ({ default: m.SemestersPage }))
);
const DepartmentsPage = lazy(() =>
  import('../../modules/schools/pages/DepartmentsPage').then((m) => ({ default: m.DepartmentsPage }))
);
const ClassesPage = lazy(() =>
  import('../../modules/schools/pages/ClassesPage').then((m) => ({ default: m.ClassesPage }))
);
const SubjectsPage = lazy(() =>
  import('../../modules/schools/pages/SubjectsPage').then((m) => ({ default: m.SubjectsPage }))
);
const StudentListPage = lazy(() =>
  import('../../modules/students/pages/StudentListPage').then((m) => ({ default: m.StudentListPage }))
);
const StudentDetailsPage = lazy(() =>
  import('../../modules/students/pages/StudentDetailsPage').then((m) => ({ default: m.StudentDetailsPage }))
);
const FinanceOverview = lazy(() =>
  import('../../modules/finance/dashboard/financeDashboard').catch(() => ({
    default: () => <PlaceholderPage title="Finance Overview" />,
  })),
);

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
    </div>
  );
}

export function AppRouter(): ReactNode {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
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
        <Route
          path="/school-select"
          element={
            <ProtectedRoute requiredRole={['super_admin']}>
              <SchoolSelectorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/schools">
          <Route index element={<Navigate to="/schools/academic-years" replace />} />
          <Route path="academic-years" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><AcademicYearsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="semesters" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><SemestersPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="departments" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><DepartmentsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="classes" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><ClassesPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="subjects" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><SubjectsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Route>
        <Route path="/students">
          <Route index element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><StudentListPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path=":id" element={
            <ProtectedRoute requiredRole={['super_admin', 'school_admin']}>
              <DashboardLayout><StudentDetailsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Route>
        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceOverview />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
