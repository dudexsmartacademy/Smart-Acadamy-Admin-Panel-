import { supabase } from '../lib/supabase';
import { TeacherAssignment, AssignmentSubmission } from '../types';

function rowToAssignment(row: Record<string, unknown>): TeacherAssignment {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    description: (row.description as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    subject: (row.subject_name as string) || '',
    batch: (row.batch_name as string) || '',
    assignedDate: (row.created_at as string)?.split('T')[0] || '',
    dueDate: (row.due_date as string) || '',
    totalMarks: (row.total_marks as number) || 100,
    attachmentUrl: (row.attachment_url as string) || '',
    status: ((row.status as string) || 'published') as TeacherAssignment['status'],
    studentCount: (row.student_count as number) || 0,
    submissionsCount: (row.submissions_count as number) || 0,
    gradedCount: (row.graded_count as number) || 0,
    lateSubmissionsCount: (row.late_submissions_count as number) || 0,
  };
}

export const teacherAssignmentService = {
  async getAll(teacherId?: string): Promise<TeacherAssignment[]> {
    let query = supabase.from('assessments').select('*').order('created_at', { ascending: false });
    if (teacherId) query = query.eq('teacher_id', teacherId);

    const { data, error } = await query;
    if (error) return [];
    return (data || []).map(rowToAssignment);
  },

  async getSubmissions(assignmentId: string): Promise<AssignmentSubmission[]> {
    const { data, error } = await supabase
      .from('student_attempts')
      .select('*, profiles(full_name, avatar_url)')
      .eq('assessment_id', assignmentId);

    if (error) return [];
    return (data || []).map((row) => {
      const p = (row.profiles as Record<string, unknown>) || {};
      return {
        id: row.id as string,
        assignmentId: (row.assessment_id as string) || assignmentId,
        studentId: (row.student_id as string) || '',
        studentName: (p.full_name as string) || 'Student',
        studentAvatar: (p.avatar_url as string) || '',
        submittedAt: row.created_at as string,
        status: ((row.status as string) || 'submitted') as AssignmentSubmission['status'],
        marksObtained: row.total_score as number,
        feedback: row.feedback as string,
      };
    });
  },
};
