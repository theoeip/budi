// Permission Repository — Permission data access
// Responsible ONLY for loading permission data.
// Uses the application-level permission definitions as the data source
// since database permissions/role_permissions tables do not exist in the current schema.
// Does NOT make authorization decisions.

import { ROLES, ROLE_HIERARCHY } from '@budi/config';
import type { RolePermissions, UserRole } from '@budi/types';
import { canAccessModule, getRolePermissions, hasPermission } from '@budi/utils/permissions';

// ============================================================
// Types
// ============================================================

export interface PermissionRepositoryResult<T> {
  data: T | null;
  error: string | null;
}

export interface PermissionDef {
  key: string;
  label: string;
}

export interface RolePermissionSet {
  role: UserRole;
  label: string;
  level: number;
  permissions: RolePermissions;
}

// ============================================================
// Cache
// ============================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

class SimpleCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }

  invalidate(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }
}

const cache = new SimpleCache();

// ============================================================
// PermissionRepository
// ============================================================

class PermissionRepository {
  getAllPermissionKeys(): PermissionRepositoryResult<PermissionDef[]> {
    try {
      const permissionKeys: PermissionDef[] = [
        { key: 'canManageSchools', label: 'Manage Schools' },
        { key: 'canManageUsers', label: 'Manage Users' },
        { key: 'canManageFinance', label: 'Manage Finance' },
        { key: 'canManageAcademic', label: 'Manage Academic' },
        { key: 'canViewReports', label: 'View Reports' },
        { key: 'canExportData', label: 'Export Data' },
      ];
      return { data: permissionKeys, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'An unexpected error occurred.',
      };
    }
  }

  getAllRolePermissionSets(): PermissionRepositoryResult<RolePermissionSet[]> {
    try {
      const cached = cache.get<RolePermissionSet[]>('allRolePermissionSets');
      if (cached) return { data: cached, error: null };

      const sets: RolePermissionSet[] = Object.values(ROLES).map((config) => ({
        role: config.role,
        label: config.label,
        level: config.level,
        permissions: getRolePermissions(config.role) ?? {
          role: config.role,
          canManageSchools: false,
          canManageUsers: false,
          canManageFinance: false,
          canManageAcademic: false,
          canViewReports: false,
          canExportData: false,
        },
      }));

      cache.set('allRolePermissionSets', sets);
      return { data: sets, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'An unexpected error occurred.',
      };
    }
  }

  getPermissionsForRole(role: UserRole): PermissionRepositoryResult<RolePermissions> {
    try {
      const permissions = getRolePermissions(role);
      if (!permissions) {
        return { data: null, error: `No permissions defined for role '${role}'.` };
      }
      return { data: permissions, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'An unexpected error occurred.',
      };
    }
  }

  checkPermission(role: UserRole, permissionKey: string): boolean {
    try {
      const validKeys: readonly string[] = [
        'canManageSchools',
        'canManageUsers',
        'canManageFinance',
        'canManageAcademic',
        'canViewReports',
        'canExportData',
      ];
      if (validKeys.includes(permissionKey)) {
        return hasPermission(role, permissionKey as never);
      }
      return false;
    } catch {
      return false;
    }
  }

  checkModuleAccess(role: UserRole, module: string): boolean {
    try {
      return canAccessModule(role, module);
    } catch {
      return false;
    }
  }

  getRoleHierarchy(): UserRole[] {
    return ROLE_HIERARCHY;
  }

  invalidateCache(): void {
    cache.invalidate();
  }
}

export const permissionRepository = new PermissionRepository();
