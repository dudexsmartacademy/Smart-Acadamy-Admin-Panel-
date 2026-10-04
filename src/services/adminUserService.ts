import { supabase } from '../lib/supabase';
import { AdminUser, AdminRoleName } from '../types';

function rowToAdminUser(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    fullName: (row.full_name as string) || 'Admin User',
    email: (row.email as string) || '',
    phone: (row.phone as string) || '',
    role: ((row.role as string) || 'Administrator') as AdminRoleName,
    status: ((row.status as string) || 'Active') as AdminUser['status'],
    avatar: (row.avatar_url as string) || '',
    lastLogin: (row.last_login as string) || (row.created_at as string) || '',
    createdAt: (row.created_at as string) || '',
  };
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'Super Admin', 'Administrator', 'Academic Manager'])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[adminUserService] getAdminUsers:', error.message);
    return [];
  }
  return (data || []).map(rowToAdminUser);
};

export const createAdminUser = async (userData: Partial<AdminUser>): Promise<AdminUser | null> => {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email || '',
    password: 'DudexAdmin@123',
    email_confirm: true,
  });

  if (authError || !authData.user) {
    console.error('[adminUserService] createAdminUser auth:', authError?.message);
    return null;
  }

  const userId = authData.user.id;

  await supabase.from('profiles').update({
    full_name: userData.fullName || '',
    role: userData.role || 'Administrator',
    phone: userData.phone || '',
    avatar_url: userData.avatar || '',
  }).eq('id', userId);

  await supabase.from('activity_logs').insert({
    action: 'Created Admin User',
    module: 'admin-users',
    entity: userData.fullName || '',
    description: `Created new admin account for ${userData.fullName} (${userData.email})`,
    admin_name: 'Admin',
  });

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return profile ? rowToAdminUser(profile) : null;
};

export const updateAdminUser = async (id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.fullName) payload.full_name = updates.fullName;
  if (updates.role) payload.role = updates.role;
  if (updates.phone) payload.phone = updates.phone;
  if (updates.avatar) payload.avatar_url = updates.avatar;

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToAdminUser(data);
};

export const deleteAdminUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  return !error;
};

export const adminUserService = {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};
