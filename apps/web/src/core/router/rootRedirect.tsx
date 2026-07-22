// Root Redirect — Determines initial redirect based on auth state
// Separated into its own file to avoid circular dependency with App.tsx

import { useAuth } from '@core/auth';
import { Navigate } from 'react-router-dom';

export function RootRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role === 'super_admin') {
    return <Navigate to="/school-select" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
