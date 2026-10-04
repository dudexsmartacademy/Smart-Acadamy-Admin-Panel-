import { supabase } from '../lib/supabase';
import { NotificationItem } from '../types';

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map((row) => ({
    id: row.id as string,
    title: (row.title as string) || '',
    message: (row.message as string) || '',
    type: ((row.type as string) || 'info') as NotificationItem['type'],
    link: (row.action_url as string) || '',
    read: (row.read as boolean) || false,
    createdAt: row.created_at as string,
  }));
};

export const markAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  return !error;
};

export const markAllAsRead = async (): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false);

  return !error;
};

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
