import { supabase } from '../lib/supabase';
import { AcademicSubject } from '../types';

function rowToSubject(row: Record<string, unknown>): AcademicSubject {
  return {
    id: row.id as string,
    subjectCode: (row.code as string) || (row.subject_code as string) || '',
    code: (row.code as string) || (row.subject_code as string) || '',
    name: (row.name as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    department: (row.department as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    credits: (row.credits as number) || 3,
    description: (row.description as string) || '',
    status: ((row.status as string) || 'active') as AcademicSubject['status'],
  };
}

export const getAcademicSubjects = async (): Promise<AcademicSubject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[academicSubjectService] getAcademicSubjects:', error.message);
    return [];
  }
  return (data || []).map(rowToSubject);
};

export const getAcademicSubjectById = async (id: string): Promise<AcademicSubject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToSubject(data);
};

export const createAcademicSubject = async (subjectData: Partial<AcademicSubject>): Promise<AcademicSubject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      code: subjectData.code || subjectData.subjectCode || `SUB-${Date.now().toString().slice(-4)}`,
      name: subjectData.name || 'New Subject',
      course_id: subjectData.courseId || null,
      course_name: subjectData.courseName || '',
      department: subjectData.department || '',
      teacher_id: subjectData.teacherId || null,
      teacher_name: subjectData.teacherName || '',
      credits: subjectData.credits || 3,
      description: subjectData.description || '',
      status: subjectData.status || 'active',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Subject',
    module: 'subjects',
    entity: data.name,
    description: `Created new subject: ${data.name}`,
    admin_name: 'Admin',
  });

  return rowToSubject(data);
};

export const updateAcademicSubject = async (id: string, updates: Partial<AcademicSubject>): Promise<AcademicSubject | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.code !== undefined || updates.subjectCode !== undefined) payload.code = updates.code || updates.subjectCode;
  if (updates.courseId !== undefined) payload.course_id = updates.courseId;
  if (updates.courseName !== undefined) payload.course_name = updates.courseName;
  if (updates.department !== undefined) payload.department = updates.department;
  if (updates.teacherId !== undefined) payload.teacher_id = updates.teacherId;
  if (updates.teacherName !== undefined) payload.teacher_name = updates.teacherName;
  if (updates.credits !== undefined) payload.credits = updates.credits;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('subjects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToSubject(data);
};

export const deleteAcademicSubject = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  return !error;
};

export const academicSubjectService = {
  getAcademicSubjects,
  getAcademicSubjectById,
  createAcademicSubject,
  updateAcademicSubject,
  deleteAcademicSubject,
};
