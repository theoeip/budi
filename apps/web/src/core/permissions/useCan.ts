// useCan Hook — Thin permission-checking hook
// Consumes AuthContext and delegates to PermissionService.
// No Supabase queries. No business logic.

import { useAuth } from '@core/auth';
import { permissionService } from '../../services/permissionService';

/**
 * Hook that returns a boolean permission checker function.
 *
 * Usage:
 *   const canCreate = useCan('canManageFinance');
 *   if (canCreate) { ... }
 */
export function useCan(permissionKey: string): boolean {
  const { role } = useAuth();

  if (!role) return false;
  return permissionService.can(role, permissionKey).allowed;
}
