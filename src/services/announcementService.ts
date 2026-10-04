import { supabase } from '../lib/supabase';
import { Announcement, AudienceType, AnnouncementPriority, AnnouncementStatus } from '../types';

function rowToAnnouncement(row: Record<string, unknown>): Announcement {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    content: (row.content as string) || '',
    audience: ((row.audience as string) || 'All Users') as AudienceType,
    courseName: (row.course_name as string) || '',
    batchName: (row.batch_name as string) || '',
    section: (row.section as string) || '',
    specificTeacherName: (row.specific_teacher_name as string) || '',
    specificStudentName: (row.specific_student_name as string) || '',
    priority: ((row.priority as string) || 'Normal') as AnnouncementPriority,
    publishDate: (row.publish_date as string) || (row.created_at as string)?.split('T')[0] || '',
    expiryDate: (row.expiry_date as string) || '',
    status: ((row.status as string) || 'Published') as AnnouncementStatus,
    viewsCount: (row.views_count as number) || 0,
    author: (row.author as string) || 'Super Admin',
  };
}

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[announcementService] getAnnouncements:', error.message);
    return [];
  }
  return (data || []).map(rowToAnnouncement);
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToAnnouncement(data);
};

export const createAnnouncement = async (announcementData: Partial<Announcement>): Promise<Announcement | null> => {
  const { data, error } = await supabase
    .from('announcements')
    .insert({
      title: announcementData.title || 'New Announcement',
      content: announcementData.content || '',
      audience: announcementData.audience || 'All Users',
      course_name: announcementData.courseName || '',
      batch_name: announcementData.batchName || '',
      section: announcementData.section || '',
      specific_teacher_name: announcementData.specificTeacherName || '',
      specific_student_name: announcementData.specificStudentName || '',
      priority: announcementData.priority || 'Normal',
      publish_date: announcementData.publishDate || new Date().toISOString().split('T')[0],
      expiry_date: announcementData.expiryDate || null,
      status: announcementData.status || 'Published',
      author: announcementData.author || 'Super Admin',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Announcement',
    module: 'announcements',
    entity: data.title,
    description: `Created announcement: ${data.title} for ${data.audience}`,
    admin_name: 'Admin',
  });

  return rowToAnnouncement(data);
};

export const updateAnnouncement = async (id: string, updates: Partial<Announcement>): Promise<Announcement | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.audience !== undefined) payload.audience = updates.audience;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('announcements')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToAnnouncement(data);
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('announcements').delete().eq('id', id);
  return !error;
};

export const announcementService = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
