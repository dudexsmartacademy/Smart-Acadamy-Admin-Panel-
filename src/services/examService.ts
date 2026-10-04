import { supabase } from '../lib/supabase';
import { StudentExam, ExamStatus } from '../types';

function rowToExam(row: Record<string, unknown>): StudentExam {
  return {
    id: row.id as string,
    examCode: (row.code as string) || (row.exam_code as string) || '',
    title: (row.title as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    subject: (row.subject_name as string) || '',
    subjectName: (row.subject_name as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    batchId: (row.batch_id as string) || '',
    batchName: (row.batch_name as string) || '',
    startDate: (row.start_date as string) || '',
    startTime: (row.start_time as string) || '',
    endDate: (row.end_date as string) || '',
    endTime: (row.end_time as string) || '',
    durationMinutes: (row.duration_minutes as number) || 60,
    totalMarks: (row.total_marks as number) || 100,
    passingMarks: (row.passing_marks as number) || 40,
    room: (row.room as string) || '',
    mode: ((row.mode as string) || 'offline') as StudentExam['mode'],
    status: ((row.status as string) || 'scheduled') as ExamStatus,
    studentCount: (row.student_count as number) || 0,
    description: (row.description as string) || '',
  };
}

export const getExams = async (): Promise<StudentExam[]> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[examService] getExams:', error.message);
    return [];
  }
  return (data || []).map(rowToExam);
};

export const getExamById = async (id: string): Promise<StudentExam | null> => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToExam(data);
};

export const createExam = async (examData: Partial<StudentExam>): Promise<StudentExam | null> => {
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      code: examData.examCode || `EXM-${Date.now().toString().slice(-4)}`,
      title: examData.title || 'New Assessment',
      course_id: examData.courseId || null,
      course_name: examData.courseName || '',
      subject_name: examData.subjectName || examData.subject || '',
      teacher_id: examData.teacherId || null,
      teacher_name: examData.teacherName || '',
      batch_id: examData.batchId || null,
      batch_name: examData.batchName || '',
      start_date: examData.startDate || new Date().toISOString().split('T')[0],
      start_time: examData.startTime || '10:00',
      duration_minutes: examData.durationMinutes || 60,
      total_marks: examData.totalMarks || 100,
      passing_marks: examData.passingMarks || 40,
      room: examData.room || '',
      mode: examData.mode || 'offline',
      status: examData.status || 'scheduled',
      description: examData.description || '',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Assessment',
    module: 'exams',
    entity: data.title,
    description: `Created new assessment: ${data.title}`,
    admin_name: 'Admin',
  });

  return rowToExam(data);
};

export const updateExamStatus = async (id: string, status: ExamStatus): Promise<StudentExam | null> => {
  const { data, error } = await supabase
    .from('assessments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToExam(data);
};

export const deleteExam = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('assessments').delete().eq('id', id);
  return !error;
};

export const examService = {
  getExams,
  getExamById,
  createExam,
  updateExamStatus,
  deleteExam,
};
