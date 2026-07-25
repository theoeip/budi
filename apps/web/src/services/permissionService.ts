// Permission Service — Single authority for authorization decisions
// Orchestrates repositories and existing permission utilities.
// Does NOT access Supabase directly. All data access is delegated.
// All authorization decisions are centralized here.

import { ROLES, ROLE_HIERARCHY } from '@budi/config';
import type { UserRole } from '@budi/types';
import { hasPermission as utilHasPermission } from '@budi/utils/permissions';

// ============================================================
// Types
// ============================================================

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
}

// ============================================================
// PermissionService
// ============================================================

class PermissionService {
  /**
   * Check if a role has a specific permission.
   */
  can(role: UserRole | null, permissionKey: string): AuthorizationResult {
    if (!role) {
      return { allowed: false, reason: 'No role assigned.' };
    }

    const validKeys: readonly string[] = [
      'canManageSchools',
      'canManageUsers',
      'canManageFinance',
      'canManageAcademic',
      'canViewReports',
      'canExportData',
    ];

    if (!validKeys.includes(permissionKey)) {
      return { allowed: false, reason: `Unknown permission key: '${permissionKey}'.` };
    }

    const result = utilHasPermission(role, permissionKey as never);
    return { allowed: result };
  }

  /**
   * Inverse of can().
   */
  cannot(role: UserRole | null, permissionKey: string): AuthorizationResult {
    const result = this.can(role, permissionKey);
    return { allowed: !result.allowed, reason: result.reason };
  }

  /**
   * Check if the user has a specific role.
   */
  hasRole(role: UserRole | null, targetRole: UserRole): boolean {
    if (!role) return false;
    return role === targetRole;
  }

  /**
   * Check if the user has at least one of the specified roles.
   */
  hasAnyRole(role: UserRole | null, targetRoles: UserRole[]): boolean {
    if (!role || targetRoles.length === 0) return false;
    return targetRoles.includes(role);
  }

  /**
   * Check if the user has all of the specified roles.
   * Note: Since a user has exactly one role in the current model,
   * this is equivalent to hasRole with a single-element check.
   */
  hasAllRoles(role: UserRole | null, targetRoles: UserRole[]): boolean {
    if (!role || targetRoles.length === 0) return false;
    return targetRoles.length === 1 && targetRoles[0] === role;
  }

  /**
   * Get role metadata from config.
   */
  getRoleConfig(role: UserRole | null) {
    if (!role) return null;
    return ROLES[role] ?? null;
  }

  /**
   * Get the role hierarchy (lowest to highest).
   */
  getRoleHierarchy(): UserRole[] {
    return ROLE_HIERARCHY;
  }

  /**
   * Check if a role has sufficient level compared to a minimum level.
   */
  hasMinimumLevel(role: UserRole | null, minLevel: number): boolean {
    if (!role) return false;
    const config = ROLES[role];
    if (!config) return false;
    return config.level >= minLevel;
  }
}

export const permissionService = new PermissionService();
