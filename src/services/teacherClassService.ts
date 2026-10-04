import { supabase } from '../lib/supabase';
import { TeacherClass } from '../types';

function rowToClass(row: Record<string, unknown>): TeacherClass {
  return {
    id: row.id as string,
    title: (row.name as string) || (row.title as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    subject: (row.subject_name as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    batch: (row.batch_name as string) || '',
    section: (row.section as string) || 'A',
    room: (row.room as string) || '',
    mode: ((row.mode as string) || 'offline') as TeacherClass['mode'],
    date: (row.date as string) || '',
    startTime: (row.start_time as string) || '',
    endTime: (row.end_time as string) || '',
    studentCount: (row.student_count as number) || 0,
    status: ((row.status as string) || 'upcoming') as TeacherClass['status'],
    meetLink: (row.meet_link as string) || '',
  };
}

export const teacherClassService = {
  async getAll(teacherId?: string): Promise<TeacherClass[]> {
    let query = supabase.from('classes').select('*').order('created_at', { ascending: false });
    if (teacherId) query = query.eq('teacher_id', teacherId);

    const { data, error } = await query;
    if (error) return [];
    return (data || []).map(rowToClass);
  },
};
