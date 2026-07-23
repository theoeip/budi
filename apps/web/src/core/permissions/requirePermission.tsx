// Permission guard component — conditionally renders children based on permissions.

import type { PermissionKey } from '@budi/utils/permissions';
import { hasPermission } from '@budi/utils/permissions';
import { useAuth } from '@core/auth';
import type { ReactNode } from 'react';

interface RequirePermissionProps {
  permission: PermissionKey;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders children only if the current user has the specified permission.
 * Optionally renders a fallback component when permission is denied.
 */
export function RequirePermission({
  permission,
  fallback = null,
  children,
}: RequirePermissionProps) {
  const { role } = useAuth();

  if (!role) return <>{fallback}</>;
  if (!hasPermission(role, permission)) return <>{fallback}</>;

  return <>{children}</>;
}
