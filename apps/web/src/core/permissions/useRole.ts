// useRole Hook — Consumes AuthContext and returns role info
// Thin layer. No Supabase queries. No business logic.

import { ROLES, type RoleConfig } from '@budi/config';
import type { UserRole } from '@budi/types';
import { useAuth } from '@core/auth';
import { permissionService } from '../../services/permissionService';

interface RoleHelpers {
  role: UserRole | null;
  roleConfig: RoleConfig | null;
  hasRole: (target: UserRole) => boolean;
  hasAnyRole: (targets: UserRole[]) => boolean;
  hasAllRoles: (targets: UserRole[]) => boolean;
}

/**
 * Hook returning role information and role-checking helpers.
 */
export function useRole(): RoleHelpers {
  const { role } = useAuth();

  return {
    role,
    roleConfig: role ? (ROLES[role] ?? null) : null,
    hasRole: (target: UserRole): boolean => permissionService.hasRole(role, target),
    hasAnyRole: (targets: UserRole[]): boolean => permissionService.hasAnyRole(role, targets),
    hasAllRoles: (targets: UserRole[]): boolean => permissionService.hasAllRoles(role, targets),
  };
}
