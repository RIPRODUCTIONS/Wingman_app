import { useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthState(prev => ({ ...prev, error, loading: false }));
          return;
        }
        setAuthState({ user: session?.user ?? null, session, loading: false, error: null });
      } catch (error) {
        setAuthState(prev => ({ ...prev, error: error as AuthError, loading: false }));
      }
    };
    getInitialSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({ user: session?.user ?? null, session, loading: false, error: null });
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }));
      return { success: false, error };
    }
    setAuthState(prev => ({ ...prev, loading: false }));
    return { success: true };
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }));
      return { success: false, error };
    }
    setAuthState({ user: null, session: null, loading: false, error: null });
    return { success: true };
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    login,
    logout,
  };
}; 