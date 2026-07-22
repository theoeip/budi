// Role guard component — conditionally renders children based on user role.

import type { ReactNode } from 'react';
import type { UserRole } from '@budi/types';
import { useAuth } from '@core/auth';

interface RequireRoleProps {
  roles: UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the current user has one of the specified roles.
 * Optionally renders a fallback component when access is denied.
 */
export function RequireRole({ roles, fallback = null, children }: RequireRoleProps) {
  const { role } = useAuth();

  if (!role) return <>{fallback}</>;
  if (!roles.includes(role)) return <>{fallback}</>;

  return <>{children}</>;
}

