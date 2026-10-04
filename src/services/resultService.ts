import { supabase } from '../lib/supabase';
import { StudentResult } from '../types';

function rowToResult(row: Record<string, unknown>): StudentResult {
  return {
    id: row.id as string,
    resultCode: (row.result_code as string) || (row.id as string),
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    studentAvatar: (row.student_avatar as string) || '',
    examId: (row.exam_id as string) || (row.assessment_id as string) || '',
    examTitle: (row.exam_title as string) || (row.assessment_title as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    batchName: (row.batch_name as string) || '',
    subject: (row.subject_name as string) || '',
    subjectName: (row.subject_name as string) || '',
    assessmentType: (row.assessment_type as string) || 'Exam',
    attemptNumber: (row.attempt_number as number) || 1,
    marksObtained: (row.marks_obtained as number) || 0,
    maxMarks: (row.max_marks as number) || 100,
    percentage: (row.percentage as number) || 0,
    grade: (row.grade as string) || 'F',
    resultStatus: (row.result_status as StudentResult['resultStatus']) || 'pass',
    publishedDate: (row.created_at as string)?.split('T')[0] || '',
    submittedAt: (row.created_at as string) || '',
    evaluatorTeacherId: (row.evaluator_teacher_id as string) || '',
    evaluatorTeacherName: (row.evaluator_teacher_name as string) || '',
    feedback: (row.feedback as string) || '',
  };
}

export const getResults = async (): Promise<StudentResult[]> => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[resultService] getResults:', error.message);
    return [];
  }
  return (data || []).map(rowToResult);
};

export const getResultById = async (id: string): Promise<StudentResult | null> => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToResult(data);
};

export const getResultsByStudentId = async (studentId: string): Promise<StudentResult[]> => {
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(rowToResult);
};

export const createResult = async (resultData: Partial<StudentResult>): Promise<StudentResult | null> => {
  const maxMarks = resultData.maxMarks || 100;
  const marksObtained = resultData.marksObtained || 0;
  const percentage = Math.round((marksObtained / maxMarks) * 100);
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  const { data, error } = await supabase
    .from('results')
    .insert({
      student_id: resultData.studentId || null,
      student_name: resultData.studentName || '',
      student_id_code: resultData.studentIdCode || '',
      assessment_id: resultData.examId || null,
      assessment_title: resultData.examTitle || '',
      course_id: resultData.courseId || null,
      course_name: resultData.courseName || '',
      batch_name: resultData.batchName || '',
      subject_name: resultData.subjectName || resultData.subject || '',
      marks_obtained: marksObtained,
      max_marks: maxMarks,
      percentage,
      grade,
      result_status: percentage >= 40 ? 'pass' : 'fail',
      evaluator_teacher_id: resultData.evaluatorTeacherId || null,
      evaluator_teacher_name: resultData.evaluatorTeacherName || '',
      feedback: resultData.feedback || '',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Published Result',
    module: 'results',
    entity: data.student_name,
    description: `Published result for ${data.student_name} in ${data.assessment_title}`,
    admin_name: 'Admin',
  });

  return rowToResult(data);
};

export const deleteResult = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('results').delete().eq('id', id);
  return !error;
};

export const resultService = {
  getResults,
  getResultById,
  getResultsByStudentId,
  createResult,
  deleteResult,
};
