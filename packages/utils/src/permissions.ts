// Permission utility functions for role-based access control.

import type { UserRole, RolePermissions } from '@budi/types';

/** Permission definitions for each role */
const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    canManageSchools: true,
    canManageUsers: true,
    canManageFinance: true,
    canManageAcademic: true,
    canViewReports: true,
    canExportData: true,
  },
  school_admin: {
    role: 'school_admin',
    canManageSchools: false,
    canManageUsers: true,
    canManageFinance: true,
    canManageAcademic: true,
    canViewReports: true,
    canExportData: true,
  },
  treasurer: {
    role: 'treasurer',
    canManageSchools: false,
    canManageUsers: false,
    canManageFinance: true,
    canManageAcademic: false,
    canViewReports: true,
    canExportData: true,
  },
  viewer: {
    role: 'viewer',
    canManageSchools: false,
    canManageUsers: false,
    canManageFinance: false,
    canManageAcademic: false,
    canViewReports: true,
    canExportData: false,
  },
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions[permission] ?? false;
}

/**
 * Get all permissions for a given role.
 */
export function getRolePermissions(role: UserRole): RolePermissions | null {
  return ROLE_PERMISSIONS[role] ?? null;
}

/**
 * Check if a user can access a specific module.
 * Module access is determined by role.
 */
export function canAccessModule(role: UserRole, module: string): boolean {
  switch (module) {
    case 'finance':
      return ['super_admin', 'school_admin', 'treasurer'].includes(role);
    case 'academic':
      return ['super_admin', 'school_admin'].includes(role);
    case 'reports':
      return ['super_admin', 'school_admin', 'treasurer', 'viewer'].includes(role);
    case 'settings':
      return ['super_admin', 'school_admin'].includes(role);
    default:
      return false;
  }
}

