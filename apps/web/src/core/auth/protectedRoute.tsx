// Protected Route — Guards authenticated routes
// Redirects unauthenticated users to the login page.

import { PageSpinner } from '@shared/components';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

/**
 * Route guard that requires authentication.
 * If user is not authenticated, redirects to /auth/login.
 * If requiredRole is specified, checks user's role.
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return <PageSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && role && !requiredRole.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
