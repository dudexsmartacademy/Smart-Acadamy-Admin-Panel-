import { supabase } from '../lib/supabase';
import { AcademicClass } from '../types';

function rowToClass(row: Record<string, unknown>): AcademicClass {
  return {
    id: row.id as string,
    title: (row.title as string) || (row.name as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    subjectId: (row.subject_id as string) || '',
    subject: (row.subject_name as string) || '',
    subjectName: (row.subject_name as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    batchId: (row.batch_id as string) || '',
    batchName: (row.batch_name as string) || '',
    section: (row.section as string) || 'A',
    classroom: (row.room as string) || '',
    mode: ((row.mode as string) || 'offline') as AcademicClass['mode'],
    date: (row.date as string) || '',
    startTime: (row.start_time as string) || '',
    endTime: (row.end_time as string) || '',
    meetLink: (row.meet_link as string) || '',
    status: ((row.status as string) || 'scheduled') as AcademicClass['status'],
  };
}

export const getAcademicClasses = async (): Promise<AcademicClass[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[academicClassService] getAcademicClasses:', error.message);
    return [];
  }
  return (data || []).map(rowToClass);
};

export const getAcademicClassById = async (id: string): Promise<AcademicClass | null> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToClass(data);
};

export const createAcademicClass = async (classData: Partial<AcademicClass>): Promise<AcademicClass | null> => {
  const { data, error } = await supabase
    .from('classes')
    .insert({
      name: classData.title || 'New Class',
      course_id: classData.courseId || null,
      course_name: classData.courseName || '',
      subject_id: classData.subjectId || null,
      subject_name: classData.subjectName || classData.subject || '',
      teacher_id: classData.teacherId || null,
      teacher_name: classData.teacherName || '',
      batch_id: classData.batchId || null,
      batch_name: classData.batchName || '',
      section: classData.section || 'A',
      room: classData.classroom || '',
      mode: classData.mode || 'offline',
      date: classData.date || null,
      start_time: classData.startTime || null,
      end_time: classData.endTime || null,
      meet_link: classData.meetLink || '',
      status: classData.status || 'scheduled',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Class',
    module: 'classes',
    entity: data.name,
    description: `Created new class: ${data.name}`,
    admin_name: 'Admin',
  });

  return rowToClass(data);
};

export const updateAcademicClass = async (id: string, updates: Partial<AcademicClass>): Promise<AcademicClass | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.name = updates.title;
  if (updates.courseId !== undefined) payload.course_id = updates.courseId;
  if (updates.courseName !== undefined) payload.course_name = updates.courseName;
  if (updates.subjectId !== undefined) payload.subject_id = updates.subjectId;
  if (updates.subjectName !== undefined || updates.subject !== undefined) payload.subject_name = updates.subjectName || updates.subject;
  if (updates.teacherId !== undefined) payload.teacher_id = updates.teacherId;
  if (updates.teacherName !== undefined) payload.teacher_name = updates.teacherName;
  if (updates.batchId !== undefined) payload.batch_id = updates.batchId;
  if (updates.batchName !== undefined) payload.batch_name = updates.batchName;
  if (updates.section !== undefined) payload.section = updates.section;
  if (updates.classroom !== undefined) payload.room = updates.classroom;
  if (updates.mode !== undefined) payload.mode = updates.mode;
  if (updates.date !== undefined) payload.date = updates.date;
  if (updates.startTime !== undefined) payload.start_time = updates.startTime;
  if (updates.endTime !== undefined) payload.end_time = updates.endTime;
  if (updates.meetLink !== undefined) payload.meet_link = updates.meetLink;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('classes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToClass(data);
};

export const deleteAcademicClass = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('classes').delete().eq('id', id);
  return !error;
};

export const academicClassService = {
  getAcademicClasses,
  getAcademicClassById,
  createAcademicClass,
  updateAcademicClass,
  deleteAcademicClass,
};
