// Permission guard component — conditionally renders children based on permissions.

import type { ReactNode } from 'react';
import type { RolePermissions } from '@budi/types';
import { useAuth } from '@core/auth';
import { hasPermission } from '@budi/utils/permissions';

interface RequirePermissionProps {
  permission: keyof RolePermissions;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the current user has the specified permission.
 * Optionally renders a fallback component when permission is denied.
 */
export function RequirePermission({ permission, fallback = null, children }: RequirePermissionProps) {
  const { role } = useAuth();

  if (!role) return <>{fallback}</>;
  if (!hasPermission(role, permission)) return <>{fallback}</>;

  return <>{children}</>;
}

