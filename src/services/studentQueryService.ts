import { supabase } from '../lib/supabase';
import { StudentQuery, StudentQueryStatus } from '../types';

function rowToQuery(row: Record<string, unknown>): StudentQuery {
  return {
    id: row.id as string,
    queryCode: (row.code as string) || (row.query_code as string) || '',
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentAvatar: (row.student_avatar as string) || '',
    studentEmail: (row.student_email as string) || '',
    studentPhone: (row.student_phone as string) || '',
    batch: (row.batch_name as string) || '',
    category: (row.category as string) || 'General Inquiry',
    subject: (row.subject_name as string) || '',
    description: (row.description as string) || '',
    priority: ((row.priority as string) || 'medium') as StudentQuery['priority'],
    status: ((row.status as string) || 'pending') as StudentQueryStatus,
    submittedAt: (row.created_at as string) || '',
    resolvedAt: (row.resolved_at as string) || '',
    assignedFaculty: (row.assigned_faculty as string) || '',
    adminResponse: (row.admin_response as string) || '',
    attachmentUrl: (row.attachment_url as string) || '',
  };
}

export const getStudentQueries = async (): Promise<StudentQuery[]> => {
  const { data, error } = await supabase
    .from('student_queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[studentQueryService] getStudentQueries:', error.message);
    return [];
  }
  return (data || []).map(rowToQuery);
};

export const updateStudentQueryStatus = async (id: string, status: StudentQueryStatus, response?: string): Promise<boolean> => {
  const payload: Record<string, unknown> = {
    status,
    admin_response: response || '',
  };
  if (status === 'resolved' || status === 'Resolved') {
    payload.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('student_queries')
    .update(payload)
    .eq('id', id);

  return !error;
};

export const updateStudentQuery = updateStudentQueryStatus;

export const studentQueryService = {
  getStudentQueries,
  updateStudentQueryStatus,
  updateStudentQuery,
};
