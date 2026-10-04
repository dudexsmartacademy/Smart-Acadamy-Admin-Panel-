import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminProfile } from '../types';
import { authService, AuthSession } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: AdminProfile | null;
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateAdmin: (partial: Partial<AdminProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Load current session on mount
    authService.getCurrentSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    // 2. Subscribe to Supabase auth state changes (token refresh, sign-out etc.)
    const { data: { subscription } } = authService.onAuthStateChange((s) => {
      setSession(s);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.success && res.session) {
      setSession(res.session);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  const updateAdmin = (partial: Partial<AdminProfile>) => {
    if (session?.admin) {
      setSession({ ...session, admin: { ...session.admin, ...partial } });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!session?.isAuthenticated,
        admin: session?.admin || null,
        session,
        loading,
        login,
        logout,
        updateAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
