import { supabase } from '../lib/supabase';
import { StudentAdmission, AdmissionStatus } from '../types';

function rowToAdmission(row: Record<string, unknown>): StudentAdmission {
  return {
    id: row.id as string,
    applicationId: (row.application_id as string) || (row.id as string),
    applicantName: (row.full_name as string) || '',
    fullName: (row.full_name as string) || '',
    email: (row.email as string) || '',
    phone: (row.phone as string) || '',
    dob: (row.dob as string) || '',
    gender: row.gender as StudentAdmission['gender'],
    address: (row.address as string) || '',
    department: (row.department as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    batchId: (row.batch_id as string) || '',
    batchName: (row.batch_name as string) || '',
    qualification: (row.qualification as string) || '',
    previousInstitute: (row.previous_institute as string) || '',
    percentageScore: (row.percentage_score as number) || 0,
    guardianName: (row.guardian_name as string) || '',
    guardianPhone: (row.guardian_phone as string) || '',
    guardianEmail: (row.guardian_email as string) || '',
    applicationDate: (row.created_at as string)?.split('T')[0] || '',
    status: ((row.status as string) || 'pending') as AdmissionStatus,
    reviewedBy: (row.reviewed_by as string) || '',
    reviewedDate: (row.reviewed_date as string) || '',
    reviewerNotes: (row.reviewer_notes as string) || '',
    convertedStudentId: (row.converted_student_id as string) || '',
    notes: (row.notes as string) || '',
  };
}

export const getAdmissions = async (): Promise<StudentAdmission[]> => {
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admissionService] getAdmissions:', error.message);
    return [];
  }
  return (data || []).map(rowToAdmission);
};

export const getAdmissionById = async (id: string): Promise<StudentAdmission | null> => {
  const { data, error } = await supabase
    .from('admissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToAdmission(data);
};

export const createAdmission = async (admissionData: Partial<StudentAdmission>): Promise<StudentAdmission | null> => {
  const appId = `ADM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const { data, error } = await supabase
    .from('admissions')
    .insert({
      application_id: appId,
      full_name: admissionData.fullName || admissionData.applicantName || 'New Applicant',
      email: admissionData.email || '',
      phone: admissionData.phone || '',
      dob: admissionData.dob || null,
      gender: admissionData.gender || 'Male',
      address: admissionData.address || '',
      department: admissionData.department || '',
      course_id: admissionData.courseId || null,
      course_name: admissionData.courseName || '',
      batch_id: admissionData.batchId || null,
      batch_name: admissionData.batchName || '',
      qualification: admissionData.qualification || '',
      previous_institute: admissionData.previousInstitute || '',
      percentage_score: admissionData.percentageScore || 0,
      guardian_name: admissionData.guardianName || '',
      guardian_phone: admissionData.guardianPhone || '',
      guardian_email: admissionData.guardianEmail || '',
      status: admissionData.status || 'pending',
      notes: admissionData.notes || '',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Submitted Admission',
    module: 'admissions',
    entity: data.full_name,
    description: `Submitted admission application: ${data.full_name} (${appId})`,
    admin_name: 'Admin',
  });

  return rowToAdmission(data);
};

export const updateAdmissionStatus = async (id: string, status: AdmissionStatus, reviewerNotes?: string): Promise<StudentAdmission | null> => {
  const { data, error } = await supabase
    .from('admissions')
    .update({
      status,
      reviewer_notes: reviewerNotes || '',
      reviewed_date: new Date().toISOString(),
      reviewed_by: 'Admin',
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToAdmission(data);
};

export const deleteAdmission = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('admissions').delete().eq('id', id);
  return !error;
};

export const admissionService = {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionStatus,
  deleteAdmission,
};
