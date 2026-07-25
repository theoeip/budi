// User Repository — Application user/profile data access
// Handles resolution of authenticated Supabase users into BUDI application users
// using the actual database schema from migrations 001-008.
//
// Schema relationships:
//   profiles (PK: id -> auth.users.id) — user profiles
//   user_roles (user_id -> profiles.id, role_id -> roles.id) — system-wide roles (e.g. super_admin)
//   school_users (user_id -> profiles.id, school_id -> schools.id, role_id -> roles.id) — school-specific roles
//   roles (PK: id, code: unique role identifier)
//   schools (PK: id) — tenant/school entities

import type { SchoolProfile, UserProfile, UserRole } from '@budi/types';
import type { Tables } from '@budi/types/supabase';
import { supabase } from '@core/providers/supabaseProvider';

// ============================================================
// Types
// ============================================================

/** Result type for repository operations */
export interface UserRepositoryResult<T> {
  data: T | null;
  error: string | null;
}

/** Row type for the profiles table */
type ProfileRow = Tables<'profiles'>;

/** Joined row from user_roles -> roles query */
interface UserRoleJoin {
  roles: {
    code: string;
    name: string;
  } | null;
}

/** Joined row from school_users -> roles -> schools query */
interface SchoolUserJoin {
  school_id: string;
  is_default: boolean;
  roles: {
    code: string;
    name: string;
  } | null;
  schools: {
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
}

/** Joined row from school_users -> schools (for default school query) */
interface DefaultSchoolJoin {
  school_id: string;
  schools: {
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
}

// ============================================================
// Role Mapping — Controlled type-safe domain validation
// ============================================================

/** Known database role codes that map to UserRole */
const VALID_ROLE_CODES: Record<string, UserRole> = {
  super_admin: 'super_admin',
  school_admin: 'school_admin',
  teacher: 'teacher',
  staff: 'staff',
  student: 'student',
  parent: 'parent',
  treasurer: 'treasurer',
  viewer: 'viewer',
};

/**
 * Maps a database role code to a UserRole.
 * Throws if the role code is unknown — this means the database and
 * domain types are out of sync and requires attention.
 */
function mapRoleCode(roleCode: string): UserRole {
  const mapped = VALID_ROLE_CODES[roleCode];
  if (!mapped) {
    throw new Error(
      `Unknown role code '${roleCode}' returned from database. ` +
        `The application UserRole type must be synchronized with the roles table.`,
    );
  }
  return mapped;
}

// ============================================================
// UserRepository
// ============================================================

class UserRepository {
  /**
   * Fetch the base profile from the `profiles` table for a given auth user ID.
   * Does NOT resolve role or school context — use getUserProfileWithContext().
   */
  async getProfileByAuthUserId(authUserId: string): Promise<UserRepositoryResult<ProfileRow>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, email, full_name, avatar_url, phone, is_active, last_sign_in_at, created_at, updated_at, deleted_at',
        )
        .eq('id', authUserId)
        .is('deleted_at', null)
        .single();

      if (error) {
        return {
          data: null,
          error:
            error.message === 'No rows found'
              ? 'User profile not found. The auth user may not have a corresponding application profile.'
              : error.message,
        };
      }

      if (!data) {
        return {
          data: null,
          error: 'User profile not found.',
        };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching the user profile.',
      };
    }
  }

  /**
   * Fetch the user's system-wide role assignments (user_roles table).
   * Used to check for super_admin status.
   */
  private async getSystemRoleCodes(authUserId: string): Promise<UserRepositoryResult<string[]>> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles!inner(code, name)')
        .eq('user_id', authUserId);

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: [], error: null };
      }

      const rows = data as unknown as UserRoleJoin[];
      const roleCodes = rows.map((r) => r.roles?.code ?? '').filter(Boolean);

      return { data: roleCodes, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching system roles.',
      };
    }
  }

  /**
   * Fetch the user's school memberships with role and school details.
   */
  async getUserSchools(authUserId: string): Promise<UserRepositoryResult<SchoolProfile[]>> {
    try {
      const { data, error } = await supabase
        .from('school_users')
        .select(
          `school_id, is_default, roles!inner(code, name), schools!inner(name, slug, logo_url)`,
        )
        .eq('user_id', authUserId)
        .is('deleted_at', null);

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data || data.length === 0) {
        return { data: [], error: null };
      }

      const rows = data as unknown as SchoolUserJoin[];
      const schools: SchoolProfile[] = rows
        .filter((row) => row.schools !== null)
        .map((row) => ({
          id: row.school_id,
          name: row.schools!.name,
          slug: row.schools!.slug,
          logo_url: row.schools!.logo_url,
        }));

      return { data: schools, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching user schools.',
      };
    }
  }

  /**
   * Fetch the user's default school based on school_users.is_default flag.
   */
  async getDefaultSchool(authUserId: string): Promise<UserRepositoryResult<SchoolProfile | null>> {
    try {
      const { data, error } = await supabase
        .from('school_users')
        .select(`school_id, schools!inner(name, slug, logo_url)`)
        .eq('user_id', authUserId)
        .eq('is_default', true)
        .is('deleted_at', null)
        .maybeSingle();

      if (error) {
        return { data: null, error: error.message };
      }

      if (!data) {
        return { data: null, error: null };
      }

      const row = data as unknown as DefaultSchoolJoin;

      if (!row.schools) {
        return { data: null, error: null };
      }

      const school: SchoolProfile = {
        id: row.school_id,
        name: row.schools.name,
        slug: row.schools.slug,
        logo_url: row.schools.logo_url,
      };

      return { data: school, error: null };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while fetching default school.',
      };
    }
  }

  /**
   * Resolve the full UserProfile for a given authenticated Supabase user.
   *
   * Resolution strategy:
   * 1. Fetch base profile from `profiles` table.
   * 2. Check `user_roles JOIN roles` for system-wide role (e.g. super_admin).
   *    - If super_admin -> role = super_admin, school_id = null.
   * 3. If not super_admin, query `school_users JOIN roles JOIN schools` for
   *    school-specific role. Prefer `is_default = true` school membership.
   *    If no default, use the first active school membership.
   * 4. Role codes are validated against UserRole via mapRoleCode().
   *    Unknown role codes throw a controlled error.
   */
  async getUserProfileWithContext(authUserId: string): Promise<UserRepositoryResult<UserProfile>> {
    try {
      // Step 1: Fetch base profile
      const profileResult = await this.getProfileByAuthUserId(authUserId);
      if (profileResult.error || !profileResult.data) {
        return { data: null, error: profileResult.error ?? 'User profile not found.' };
      }

      const profile = profileResult.data;

      // Step 2: Check for system-wide roles (super_admin)
      const systemRoleResult = await this.getSystemRoleCodes(authUserId);
      if (systemRoleResult.error) {
        return { data: null, error: systemRoleResult.error };
      }

      const roleCodes = systemRoleResult.data ?? [];
      const isSuperAdmin = roleCodes.includes('super_admin');

      if (isSuperAdmin) {
        return {
          data: {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: mapRoleCode('super_admin'),
            school_id: null,
            avatar_url: profile.avatar_url,
            phone: profile.phone,
            is_active: profile.is_active,
            last_sign_in_at: profile.last_sign_in_at,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          },
          error: null,
        };
      }

      // Step 3: Fetch school-specific role via school_users
      const { data: schoolUserData, error: schoolUserError } = await supabase
        .from('school_users')
        .select(
          `school_id, is_default, roles!inner(code, name), schools!inner(name, slug, logo_url)`,
        )
        .eq('user_id', authUserId)
        .is('deleted_at', null)
        .order('is_default', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (schoolUserError) {
        return { data: null, error: schoolUserError.message };
      }

      // If no school membership found, return profile without role/school context
      if (!schoolUserData) {
        return {
          data: {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            role: 'viewer' as UserRole,
            school_id: null,
            avatar_url: profile.avatar_url,
            phone: profile.phone,
            is_active: profile.is_active,
            last_sign_in_at: profile.last_sign_in_at,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          },
          error: null,
        };
      }

      const schoolUser = schoolUserData as unknown as SchoolUserJoin;

      if (!schoolUser.roles) {
        return {
          data: null,
          error: 'School membership exists but no role information was found.',
        };
      }

      // Validate the role code via our controlled mapper
      const role = mapRoleCode(schoolUser.roles.code);

      return {
        data: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role,
          school_id: schoolUser.school_id,
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          is_active: profile.is_active,
          last_sign_in_at: profile.last_sign_in_at,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while resolving user context.',
      };
    }
  }
}

export const userRepository = new UserRepository();
