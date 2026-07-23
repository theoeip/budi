// Auth Context — Authentication state management
// Handles session management, auto-login, role resolution, and school context.
// Delegates all Supabase Auth operations to AuthRepository.

import type { RolePermissions, SchoolProfile, UserProfile, UserRole } from '@budi/types';
import { getRolePermissions } from '@budi/utils/permissions';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authRepository } from '../../repositories/authRepository';

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

function mapSupabaseUserToProfile(user: User, _session: Session | null): UserProfile | null {
  if (!user) return null;

  const metadata = user.user_metadata ?? {};
  const role = (metadata.role as UserRole) ?? 'viewer';

  return {
    id: user.id,
    email: user.email ?? '',
    full_name: (metadata.full_name as string) ?? user.email ?? '',
    role,
    school_id: (metadata.school_id as string) ?? null,
    avatar_url: (metadata.avatar_url as string) ?? null,
    phone: (metadata.phone as string) ?? null,
    is_active: true,
    last_sign_in_at: user.last_sign_in_at ?? null,
    created_at: user.created_at,
    updated_at: user.updated_at ?? user.created_at,
  };
}

/**
 * Authentication provider — wraps the application with AuthContext.
 * Handles session persistence, auto-login, and role resolution.
 * All Supabase Auth communication goes through AuthRepository.
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

  // Resolve schools for super admin
  const resolveUserSchools = useCallback(async (_user: User) => {
    // TODO: Fetch schools from DB when available
    // For now, placeholder
    setUserSchools([]);
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
          const profile = mapSupabaseUserToProfile(result.session.user, result.session);
          setUser(profile);

          // If super admin, resolve schools
          if (profile?.role === 'super_admin') {
            await resolveUserSchools(result.session.user);
          } else if (profile?.school_id) {
            setSchool({
              id: profile.school_id,
              name: profile.full_name,
              slug: profile.school_id,
              logo_url: null,
            });
          }
        }

        return {};
      } catch {
        return { error: 'An unexpected error occurred. Please try again.' };
      }
    },
    [resolveUserSchools],
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
          const profile = mapSupabaseUserToProfile(session.user, session);
          setUser(profile);

          if (profile?.role === 'super_admin') {
            await resolveUserSchools(session.user);
          } else if (profile?.school_id) {
            setSchool({
              id: profile.school_id,
              name: profile.full_name,
              slug: profile.school_id,
              logo_url: null,
            });
          }
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
        const profile = mapSupabaseUserToProfile(session.user, session);
        setUser(profile);

        if (profile?.role === 'super_admin') {
          await resolveUserSchools(session.user);
        } else if (profile?.school_id) {
          setSchool({
            id: profile.school_id,
            name: profile.full_name,
            slug: profile.school_id,
            logo_url: null,
          });
        }
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
  }, [resolveUserSchools]);

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
