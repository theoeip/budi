// Auth Context — Authentication state management
// Handles session management, auto-login, role resolution, and school context.
// Delegates all Supabase Auth operations to AuthRepository.
// Resolves application user profiles from UserRepository (database-backed),
// NOT from Supabase user_metadata.

import type { RolePermissions, SchoolProfile, UserProfile, UserRole } from '@budi/types';
import { getRolePermissions } from '@budi/utils/permissions';
import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authRepository } from '../../repositories/authRepository';
import { userRepository } from '../../repositories/userRepository';

/**
 * Authentication context value interface.
 */
export interface AuthContextValue {
  user: UserProfile | null;
  school: SchoolProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  permissions: RolePermissions | null;
  userSchools: SchoolProfile[];
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  switchSchool: (school: SchoolProfile) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Resolve a UserProfile from UserRepository for a given authenticated user ID.
 * Falls back to a minimal auth-derived profile if the application database
 * profile is not yet available (e.g., the trigger hasn't completed).
 */
async function resolveProfile(
  authUserId: string,
  sessionUser: User,
): Promise<{ profile: UserProfile | null; error: string | null }> {
  const result = await userRepository.getUserProfileWithContext(authUserId);

  if (result.data) {
    return { profile: result.data, error: null };
  }

  // Fallback to minimal auth-derived profile when DB profile is not ready yet.
  // This avoids breaking the auth flow during the brief window between
  // signup and the `handle_new_user()` trigger completion.
  return {
    profile: {
      id: authUserId,
      email: sessionUser.email ?? '',
      full_name: sessionUser.email ?? '',
      role: 'viewer',
      school_id: null,
      avatar_url: null,
      phone: null,
      is_active: true,
      last_sign_in_at: sessionUser.last_sign_in_at ?? null,
      created_at: sessionUser.created_at,
      updated_at: sessionUser.updated_at ?? sessionUser.created_at,
    },
    error: result.error,
  };
}

/**
 * Resolve the user's school relationships from UserRepository.
 * Used by both initial load and super_admin school listing.
 */
async function resolveUserSchoolContext(
  authUserId: string,
): Promise<{ school: SchoolProfile | null; schools: SchoolProfile[] }> {
  // Get all school memberships
  const schoolsResult = await userRepository.getUserSchools(authUserId);
  const schools = schoolsResult.data ?? [];

  // Try to get the default school
  const defaultResult = await userRepository.getDefaultSchool(authUserId);

  // Fallback to first school if no default
  const school = defaultResult.data ?? schools[0] ?? null;

  return { school, schools };
}

/**
 * Authentication provider — wraps the application with AuthContext.
 * Handles session persistence, auto-login, and role resolution.
 * All Supabase Auth communication goes through AuthRepository.
 * Application user profiles are resolved from the database via UserRepository.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<SchoolProfile | null>(null);
  const [userSchools, setUserSchools] = useState<SchoolProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Resolve derived state
  const isAuthenticated = user !== null;
  const role: UserRole | null = user?.role ?? null;
  const permissions: RolePermissions | null = role ? getRolePermissions(role) : null;

  // Resolve user profile and school context from the database
  const resolveUserContext = useCallback(async (authUser: User) => {
    // Resolve application profile from UserRepository
    const { profile } = await resolveProfile(authUser.id, authUser);
    setUser(profile);

    // Resolve school relationships
    if (profile) {
      const { school: resolvedSchool, schools } = await resolveUserSchoolContext(profile.id);
      setSchool(resolvedSchool);
      setUserSchools(schools);
    }
  }, []);

  // Sign in with email and password
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      try {
        const result = await authRepository.signIn(email, password);

        if (result.error) {
          return { error: result.error };
        }

        if (result.session) {
          await resolveUserContext(result.session.user);
        }

        return {};
      } catch {
        return { error: 'An unexpected error occurred. Please try again.' };
      }
    },
    [resolveUserContext],
  );

  // Sign out
  const signOut = useCallback(async () => {
    await authRepository.signOut();
    setUser(null);
    setSchool(null);
    setUserSchools([]);
  }, []);

  // Reset password (forgot password flow)
  const resetPassword = useCallback(async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await authRepository.resetPassword(email);
      return error ? { error: error.message } : {};
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }, []);

  // Switch school (for super admin)
  const switchSchool = useCallback((newSchool: SchoolProfile) => {
    setSchool(newSchool);
  }, []);

  // Initialize auth state on mount (auto-login from session)
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await authRepository.getSession();

        if (session && mounted) {
          await resolveUserContext(session.user);
        }
      } catch {
        // Session invalid, stay unauthenticated
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    // Listen for auth state changes
    const subscription = authRepository.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session) {
        await resolveUserContext(session.user);
      } else {
        setUser(null);
        setSchool(null);
        setUserSchools([]);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [resolveUserContext]);

  const contextValue: AuthContextValue = {
    user,
    school,
    isAuthenticated,
    isLoading,
    role,
    permissions,
    userSchools,
    signIn,
    signOut,
    resetPassword,
    switchSchool,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
