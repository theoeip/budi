// usePermission Hook — Consumes AuthContext and exposes permission helpers
// Thin layer. No Supabase queries. No business logic.

import type { RolePermissions } from '@budi/types';
import { useAuth } from '@core/auth';
import { permissionService } from '../../services/permissionService';

interface PermissionHelpers {
  permissions: RolePermissions | null;
  can: (key: string) => boolean;
  cannot: (key: string) => boolean;
}

/**
 * Hook returning permission state and helpers for the current user.
 */
export function usePermission(): PermissionHelpers {
  const { role } = useAuth();

  const rolePermissions: RolePermissions | null = role
    ? {
        role,
        canManageSchools: permissionService.can(role, 'canManageSchools').allowed,
        canManageUsers: permissionService.can(role, 'canManageUsers').allowed,
        canManageFinance: permissionService.can(role, 'canManageFinance').allowed,
        canManageAcademic: permissionService.can(role, 'canManageAcademic').allowed,
        canViewReports: permissionService.can(role, 'canViewReports').allowed,
        canExportData: permissionService.can(role, 'canExportData').allowed,
      }
    : null;

  return {
    permissions: rolePermissions,
    can: (key: string): boolean => {
      if (!role) return false;
      return permissionService.can(role, key).allowed;
    },
    cannot: (key: string): boolean => {
      if (!role) return true;
      return permissionService.cannot(role, key).allowed;
    },
  };
}
