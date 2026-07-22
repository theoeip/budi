// Login Route — Redirects authenticated users away from auth pages
// If user is already logged in, redirects to the appropriate page.

import { PageSpinner } from '@shared/components';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

interface LoginRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that redirects authenticated users away from auth pages
 * (e.g., login, forgot password) to their respective dashboard.
 *
 * Super Admin -> /school-select
 * Others -> /dashboard
 */
export function LoginRoute({ children }: LoginRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return <PageSpinner />;
  }

  if (isAuthenticated) {
    if (role === 'super_admin') {
      return <Navigate to="/school-select" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
