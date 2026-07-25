// Role Repository — Role data access
// Responsible ONLY for loading role data from the database.
// Does NOT make authorization decisions.

import type { Tables } from '@budi/types/supabase';
import { supabase } from '@core/providers/supabaseProvider';

// ============================================================
// Types
// ============================================================

/** Result type for repository operations */
export interface RoleRepositoryResult<T> {
  data: T | null;
  error: string | null;
}

/** Role row type from the roles table */
export type RoleRow = Tables<'roles'>;

// ============================================================
// RoleRepository
// ============================================================

class RoleRepository {
  /**
   * Load all roles from the database, ordered by level descending.
   */
  async getAllRoles(): Promise<RoleRepositoryResult<RoleRow[]>> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('level', { ascending: false });

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data ?? [], error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error ? err.message : 'An unexpected error occurred while loading roles.',
      };
    }
  }

  /**
   * Load a single role by its code.
   */
  async getRoleByCode(code: string): Promise<RoleRepositoryResult<RoleRow>> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('code', code)
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: `Role with code '${code}' not found.` };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading the role.',
      };
    }
  }

  /**
   * Load a single role by its ID.
   */
  async getRoleById(id: string): Promise<RoleRepositoryResult<RoleRow>> {
    try {
      const { data, error } = await supabase.from('roles').select('*').eq('id', id).maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: `Role with ID '${id}' not found.` };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading the role.',
      };
    }
  }

  /**
   * Load the hierarchy of roles (all roles ordered by level).
   * Returns roles from highest level to lowest.
   */
  async getRoleHierarchy(): Promise<RoleRepositoryResult<RoleRow[]>> {
    return this.getAllRoles();
  }

  /**
   * Get the level of a specific role by code.
   * Returns -1 if role not found.
   */
  async getRoleLevel(code: string): Promise<RoleRepositoryResult<number>> {
    try {
      const result = await this.getRoleByCode(code);
      if (result.error || !result.data) {
        return { data: -1, error: result.error };
      }

      return { data: result.data.level, error: null };
    } catch (err) {
      return {
        data: -1,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading role level.',
      };
    }
  }
}

export const roleRepository = new RoleRepository();
