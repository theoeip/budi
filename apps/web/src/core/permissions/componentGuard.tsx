// ComponentGuard — Conditional render based on permission
// Renders children or null based on the current user's permissions.

import type { ReactNode } from 'react';
import { usePermission } from './usePermission';

interface ComponentGuardProps {
  /** Permission key to check (e.g. 'canManageFinance') */
  permission: string;
  /** Optional fallback content when permission is denied */
  fallback?: ReactNode;
  /** Content to render when permission is granted */
  children: ReactNode;
}

/**
 * Conditionally renders children based on the current user's permissions.
 *
 * Usage:
 *   <ComponentGuard permission="canManageFinance">
 *     <FinanceDashboard />
 *   </ComponentGuard>
 */
export function ComponentGuard({ permission, fallback = null, children }: ComponentGuardProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
