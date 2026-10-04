import { supabase } from '../lib/supabase';
import { StudentEnrollment } from '../types';

function rowToEnrollment(row: Record<string, unknown>): StudentEnrollment {
  return {
    id: row.id as string,
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    batchId: (row.batch_id as string) || '',
    batchName: (row.batch_name as string) || '',
    section: (row.section as string) || 'A',
    enrollmentDate: (row.created_at as string)?.split('T')[0] || '',
    academicYear: (row.academic_year as string) || '2026-2027',
    feePlan: (row.fee_plan as string) || 'Semester Installments',
    totalFee: (row.total_fee as number) || 0,
    status: ((row.status as string) || 'active') as StudentEnrollment['status'],
  };
}

export const getEnrollments = async (): Promise<StudentEnrollment[]> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[enrollmentService] getEnrollments:', error.message);
    return [];
  }
  return (data || []).map(rowToEnrollment);
};

export const getEnrollmentById = async (id: string): Promise<StudentEnrollment | null> => {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToEnrollment(data);
};

export const createEnrollment = async (enrollmentData: Partial<StudentEnrollment>): Promise<StudentEnrollment | null> => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: enrollmentData.studentId || null,
      student_name: enrollmentData.studentName || '',
      student_id_code: enrollmentData.studentIdCode || '',
      course_id: enrollmentData.courseId || null,
      course_name: enrollmentData.courseName || '',
      batch_id: enrollmentData.batchId || null,
      batch_name: enrollmentData.batchName || '',
      section: enrollmentData.section || 'A',
      academic_year: enrollmentData.academicYear || '2026-2027',
      fee_plan: enrollmentData.feePlan || 'Semester Installments',
      total_fee: enrollmentData.totalFee || 0,
      status: enrollmentData.status || 'active',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Enrollment',
    module: 'enrollments',
    entity: data.student_name,
    description: `Enrolled ${data.student_name} in ${data.course_name}`,
    admin_name: 'Admin',
  });

  return rowToEnrollment(data);
};

export const updateEnrollmentStatus = async (id: string, status: StudentEnrollment['status']): Promise<StudentEnrollment | null> => {
  const { data, error } = await supabase
    .from('enrollments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToEnrollment(data);
};

export const deleteEnrollment = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('enrollments').delete().eq('id', id);
  return !error;
};

export const enrollmentService = {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment,
};

// Convenience filter alias
export const getEnrollmentsByStudent = async (studentId: string): Promise<StudentEnrollment[]> => {
  const all = await getEnrollments();
  return all.filter((e) => e.studentId === studentId);
};
