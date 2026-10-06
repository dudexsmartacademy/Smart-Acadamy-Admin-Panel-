import { supabase } from '../lib/supabase';
import { StudentCertificate } from '../types';

function rowToCertificate(row: Record<string, unknown>): StudentCertificate {
  return {
    id: row.id as string,
    certificateNumber: (row.certificate_number as string) || (row.id as string),
    certificateId: (row.certificate_number as string) || (row.id as string),
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    completionDate: (row.completion_date as string) || '',
    issuedDate: (row.issued_date as string) || (row.created_at as string)?.split('T')[0] || '',
    issueDate: (row.issued_date as string) || (row.created_at as string)?.split('T')[0] || '',
    gradeAchieved: (row.grade_achieved as string) || 'A',
    status: ((row.status as string) || 'issued') as StudentCertificate['status'],
    issuedBy: (row.issued_by as string) || 'Dr. Alexander Vance',
    verificationUrl: (row.verification_url as string) || '',
    signatoryTitle: (row.signatory_title as string) || 'Director of Academic Affairs',
  };
}

export const getCertificates = async (): Promise<StudentCertificate[]> => {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[certificateService] getCertificates:', error.message);
    return [];
  }
  return (data || []).map(rowToCertificate);
};

export const issueCertificate = async (certData: Partial<StudentCertificate>): Promise<StudentCertificate | null> => {
  const certNum = `CERT-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      certificate_number: certNum,
      student_id: certData.studentId || null,
      student_name: certData.studentName || '',
      student_id_code: certData.studentIdCode || '',
      course_id: certData.courseId || null,
      course_name: certData.courseName || '',
      completion_date: certData.completionDate || new Date().toISOString().split('T')[0],
      issued_date: certData.issuedDate || new Date().toISOString().split('T')[0],
      grade_achieved: certData.gradeAchieved || 'A',
      status: certData.status || 'issued',
      issued_by: certData.issuedBy || 'Dr. Alexander Vance',
      verification_url: `https://dudex.academy/verify/${certNum}`,
      signatory_title: certData.signatoryTitle || 'Director of Academic Affairs',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Issued Certificate',
    module: 'certificates',
    entity: data.student_name,
    description: `Issued certificate ${certNum} to ${data.student_name}`,
    admin_name: 'Admin',
  });

  return rowToCertificate(data);
};

export const revokeCertificate = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('certificates')
    .update({ status: 'revoked' })
    .eq('id', id);

  return !error;
};

export const updateCertificateStatus = async (id: string, status: StudentCertificate['status']): Promise<boolean> => {
  const { error } = await supabase
    .from('certificates')
    .update({ status })
    .eq('id', id);
  return !error;
};

export const getStudentCertificates = getCertificates;

export const certificateService = {
  getCertificates,
  getStudentCertificates,
  issueCertificate,
  revokeCertificate,
  updateCertificateStatus,
};
