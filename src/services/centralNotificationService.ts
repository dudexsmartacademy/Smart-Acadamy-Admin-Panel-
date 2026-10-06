import { supabase } from '../lib/supabase';
import { CentralNotification, AudienceType } from '../types';

function rowToNotification(row: Record<string, unknown>): CentralNotification {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    message: (row.message as string) || '',
    type: ((row.type as string) || 'info') as CentralNotification['type'],
    priority: ((row.priority as string) || 'Normal') as CentralNotification['priority'],
    audience: ((row.audience as string) || 'All Users') as AudienceType,
    courseName: (row.course_name as string) || '',
    batchName: (row.batch_name as string) || '',
    section: (row.section as string) || '',
    specificTeacherName: (row.specific_teacher_name as string) || '',
    specificStudentName: (row.specific_student_name as string) || '',
    actionUrl: (row.action_url as string) || '',
    status: ((row.status as string) || 'Sent') as CentralNotification['status'],
    createdAt: (row.created_at as string) || '',
    scheduledDate: (row.scheduled_date as string) || '',
    recipientsCount: (row.recipients_count as number) || 0,
    readCount: (row.read_count as number) || 0,
    unreadCount: (row.unread_count as number) || 0,
    read: (row.read as boolean) || false,
  };
}

export const getCentralNotifications = async (): Promise<CentralNotification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[centralNotificationService] getCentralNotifications:', error.message);
    return [];
  }
  return (data || []).map(rowToNotification);
};

export const sendCentralNotification = async (notificationData: Partial<CentralNotification>): Promise<CentralNotification | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      title: notificationData.title || 'System Notification',
      message: notificationData.message || '',
      type: notificationData.type || 'info',
      priority: notificationData.priority || 'Normal',
      audience: notificationData.audience || 'All Users',
      course_name: notificationData.courseName || '',
      batch_name: notificationData.batchName || '',
      section: notificationData.section || '',
      action_url: notificationData.actionUrl || '',
      status: notificationData.status || 'Sent',
      read: false,
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Sent Notification',
    module: 'notifications',
    entity: data.title,
    description: `Dispatched notification: ${data.title} to ${data.audience}`,
    admin_name: 'Admin',
  });

  return rowToNotification(data);
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  return !error;
};

export const markNotificationAsUnread = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('notifications').update({ read: false }).eq('id', id);
  return !error;
};

export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
  return !error;
};

export const duplicateCentralNotification = async (id: string): Promise<CentralNotification | null> => {
  const { data } = await supabase.from('notifications').select('*').eq('id', id).single();
  if (!data) return null;
  return sendCentralNotification({
    title: `${data.title} (Copy)`,
    message: data.message,
    type: data.type,
    priority: data.priority,
    audience: data.audience,
    courseName: data.course_name,
    batchName: data.batch_name,
    section: data.section,
    actionUrl: data.action_url,
    status: 'Draft',
  });
};

export const deleteCentralNotification = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  return !error;
};

export const centralNotificationService = {
  getCentralNotifications,
  sendCentralNotification,
  deleteCentralNotification,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotificationsAsRead,
  duplicateCentralNotification,
};
