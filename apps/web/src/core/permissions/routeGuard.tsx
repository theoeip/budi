// RouteGuard — Route-level permission guard
// Conditionally renders children or a fallback component.
// Does NOT hardcode redirect paths.

import { useAuth } from '@core/auth';
import type { ReactNode } from 'react';
import { permissionService } from '../../services/permissionService';

interface RouteGuardProps {
  /** Permission key required to access the route */
  permission: string;
  /** Optional fallback rendered instead of redirecting */
  fallback?: ReactNode;
  /** Route content to render when permission is granted */
  children: ReactNode;
}

/**
 * Route-level guard that conditionally renders children based on permission.
 *
 * Usage:
 *   <RouteGuard
 *     permission="canManageFinance"
 *     fallback={<UnauthorizedPage />}
 *   >
 *     <FinanceDashboard />
 *   </RouteGuard>
 */
export function RouteGuard({ permission, fallback = null, children }: RouteGuardProps) {
  const { role } = useAuth();

  if (!role) {
    return <>{fallback}</>;
  }

  const { allowed } = permissionService.can(role, permission);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
