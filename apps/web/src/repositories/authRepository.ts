import { supabase } from '@core/providers/supabaseProvider';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface AuthResult {
  session: Session | null;
  error?: string;
}

export type AuthStateChangeCallback = (event: AuthChangeEvent, session: Session | null) => void;

export interface AuthSubscription {
  unsubscribe: () => void;
}

class AuthRepository {
  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return {
        session: null,
        error: error.message,
      };
    }

    return {
      session: data.session,
    };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getSession(): Promise<{ data: { session: Session | null } }> {
    return supabase.auth.getSession();
  }

  onAuthStateChange(callback: AuthStateChangeCallback): AuthSubscription {
    const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
    return data.subscription;
  }

  async resetPassword(email: string): Promise<{ error: Error | null }> {
    return supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/login`,
    });
  }
}

export const authRepository = new AuthRepository();
