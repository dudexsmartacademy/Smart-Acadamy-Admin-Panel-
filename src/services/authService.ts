import { supabase } from '../lib/supabase';
import { AdminProfile } from '../types';

export interface AuthSession {
  isAuthenticated: boolean;
  token: string;
  admin: AdminProfile;
  loginTimestamp: string;
}

export const authService = {
  /** Get the currently active Supabase session */
  async getCurrentSession(): Promise<AuthSession | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const profile = await this.fetchAdminProfile(session.user.id);
    if (!profile) return null;

    return {
      isAuthenticated: true,
      token: session.access_token,
      admin: profile,
      loginTimestamp: session.user.last_sign_in_at || new Date().toISOString(),
    };
  },

  /** Sign in with email + password via Supabase Auth */
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return { success: false, error: error?.message || 'Authentication failed' };
    }

    const profile = await this.fetchAdminProfile(data.session.user.id);
    if (!profile) {
      return { success: false, error: 'Admin profile not found. Contact system administrator.' };
    }

    // Update last login
    await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.session.user.id);

    const session: AuthSession = {
      isAuthenticated: true,
      token: data.session.access_token,
      admin: profile,
      loginTimestamp: new Date().toISOString(),
    };

    return { success: true, session };
  },

  /** Sign out via Supabase Auth */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  /** Fetch admin profile from the `profiles` table */
  async fetchAdminProfile(userId: string): Promise<AdminProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.full_name || 'Admin',
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'Super Admin',
      avatar: data.avatar_url || '',
      department: data.department || 'Administration',
      joinedDate: data.created_at?.split('T')[0] || '',
      lastLogin: data.last_login || new Date().toISOString(),
      twoFactorEnabled: data.two_factor_enabled || false,
    };
  },

  /** Send password reset email */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: `Password reset email sent to ${email}.` };
  },

  /** Subscribe to auth state changes */
  onAuthStateChange(callback: (session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        callback(null);
        return;
      }
      const profile = await this.fetchAdminProfile(session.user.id);
      if (!profile) {
        callback(null);
        return;
      }
      callback({
        isAuthenticated: true,
        token: session.access_token,
        admin: profile,
        loginTimestamp: session.user.last_sign_in_at || new Date().toISOString(),
      });
    });
  },
};
