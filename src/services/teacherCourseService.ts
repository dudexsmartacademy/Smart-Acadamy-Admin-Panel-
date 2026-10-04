import { supabase } from '../lib/supabase';
import { TeacherCourse } from '../types';

function rowToCourse(row: Record<string, unknown>): TeacherCourse {
  return {
    id: row.id as string,
    code: (row.code as string) || '',
    name: (row.name as string) || '',
    department: (row.department as string) || '',
    category: (row.category as string) || 'Core Engineering',
    credits: (row.credits as number) || 4,
    batch: (row.batch_name as string) || '',
    academicYear: (row.academic_year as string) || '2026-2027',
    teacherId: (row.lead_teacher_id as string) || '',
    teacherName: (row.lead_teacher_name as string) || '',
    totalStudents: (row.enrolled_students_count as number) || 0,
    startDate: (row.start_date as string) || '',
    endDate: (row.end_date as string) || '',
    status: ((row.status as string) || 'active') as TeacherCourse['status'],
    description: (row.description as string) || '',
  };
}

export const teacherCourseService = {
  async getAll(teacherId?: string): Promise<TeacherCourse[]> {
    let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (teacherId) query = query.eq('lead_teacher_id', teacherId);

    const { data, error } = await query;
    if (error) return [];
    return (data || []).map(rowToCourse);
  },
};
