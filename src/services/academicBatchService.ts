import { supabase } from '../lib/supabase';
import { AcademicBatch } from '../types';

function rowToBatch(row: Record<string, unknown>): AcademicBatch {
  return {
    id: row.id as string,
    batchCode: (row.code as string) || (row.batch_code as string) || '',
    name: (row.name as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    department: (row.department as string) || '',
    startDate: (row.start_date as string) || '',
    endDate: (row.end_date as string) || '',
    teacherId: (row.mentor_teacher_id as string) || '',
    teacherName: (row.mentor_teacher_name as string) || '',
    mentorTeacherId: (row.mentor_teacher_id as string) || '',
    mentorTeacherName: (row.mentor_teacher_name as string) || '',
    classroom: (row.classroom as string) || '',
    maxCapacity: (row.capacity as number) || 60,
    currentStudentsCount: (row.student_count as number) || 0,
    studentCount: (row.student_count as number) || 0,
    status: ((row.status as string) || 'active') as AcademicBatch['status'],
  };
}

export const getAcademicBatches = async (): Promise<AcademicBatch[]> => {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[academicBatchService] getAcademicBatches:', error.message);
    return [];
  }
  return (data || []).map(rowToBatch);
};

export const getAcademicBatchById = async (id: string): Promise<AcademicBatch | null> => {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToBatch(data);
};

export const createAcademicBatch = async (batchData: Partial<AcademicBatch>): Promise<AcademicBatch | null> => {
  const { data, error } = await supabase
    .from('batches')
    .insert({
      code: batchData.batchCode || `BAT-${Date.now().toString().slice(-4)}`,
      name: batchData.name || 'New Batch',
      course_id: batchData.courseId || null,
      course_name: batchData.courseName || '',
      department: batchData.department || '',
      start_date: batchData.startDate || new Date().toISOString().split('T')[0],
      end_date: batchData.endDate || null,
      mentor_teacher_id: batchData.mentorTeacherId || batchData.teacherId || null,
      mentor_teacher_name: batchData.mentorTeacherName || batchData.teacherName || '',
      classroom: batchData.classroom || '',
      capacity: batchData.maxCapacity || 60,
      status: batchData.status || 'active',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Batch',
    module: 'batches',
    entity: data.name,
    description: `Created new batch: ${data.name}`,
    admin_name: 'Admin',
  });

  return rowToBatch(data);
};

export const updateAcademicBatch = async (id: string, updates: Partial<AcademicBatch>): Promise<AcademicBatch | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.batchCode !== undefined) payload.code = updates.batchCode;
  if (updates.courseId !== undefined) payload.course_id = updates.courseId;
  if (updates.courseName !== undefined) payload.course_name = updates.courseName;
  if (updates.department !== undefined) payload.department = updates.department;
  if (updates.mentorTeacherId !== undefined || updates.teacherId !== undefined) payload.mentor_teacher_id = updates.mentorTeacherId || updates.teacherId;
  if (updates.mentorTeacherName !== undefined || updates.teacherName !== undefined) payload.mentor_teacher_name = updates.mentorTeacherName || updates.teacherName;
  if (updates.classroom !== undefined) payload.classroom = updates.classroom;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('batches')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToBatch(data);
};

export const deleteAcademicBatch = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('batches').delete().eq('id', id);
  return !error;
};

export const academicBatchService = {
  getAcademicBatches,
  getAcademicBatchById,
  createAcademicBatch,
  updateAcademicBatch,
  deleteAcademicBatch,
};
