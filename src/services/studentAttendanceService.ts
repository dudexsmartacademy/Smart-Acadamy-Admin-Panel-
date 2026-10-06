import { supabase } from '../lib/supabase';
import { StudentAttendance, AttendanceStatus } from '../types';

function rowToAttendance(row: Record<string, unknown>): StudentAttendance {
  return {
    id: row.id as string,
    studentId: (row.student_id as string) || '',
    studentName: (row.student_name as string) || '',
    studentIdCode: (row.student_id_code as string) || '',
    courseId: (row.course_id as string) || '',
    courseName: (row.course_name as string) || '',
    batchId: (row.batch_id as string) || '',
    batchName: (row.batch_name as string) || '',
    classId: (row.class_id as string) || '',
    className: (row.class_name as string) || '',
    subject: (row.subject_name as string) || '',
    subjectName: (row.subject_name as string) || '',
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    date: row.date as string,
    session: (row.session as string) || 'FN',
    status: (row.status as AttendanceStatus) || 'present',
    remarks: (row.remarks as string) || '',
    recordedBy: (row.recorded_by as string) || 'Admin',
    updatedAt: (row.created_at as string) || '',
  };
}

export const getStudentAttendanceRecords = async (studentId?: string): Promise<StudentAttendance[]> => {
  let query = supabase.from('attendance_records').select('*').order('date', { ascending: false });
  if (studentId) query = query.eq('student_id', studentId);

  const { data, error } = await query;
  if (error) {
    console.error('[studentAttendanceService] getStudentAttendanceRecords:', error.message);
    return [];
  }
  return (data || []).map(rowToAttendance);
};

export const markStudentAttendance = async (records: Partial<StudentAttendance>[]): Promise<boolean> => {
  const insertPayload = records.map((r) => ({
    student_id: r.studentId,
    student_name: r.studentName,
    student_id_code: r.studentIdCode,
    course_id: r.courseId || null,
    course_name: r.courseName || '',
    batch_id: r.batchId || null,
    batch_name: r.batchName || '',
    class_id: r.classId || null,
    class_name: r.className || '',
    subject_name: r.subjectName || r.subject || '',
    teacher_id: r.teacherId || null,
    teacher_name: r.teacherName || '',
    date: r.date || new Date().toISOString().split('T')[0],
    session: r.session || 'FN',
    status: r.status || 'present',
    remarks: r.remarks || '',
    recorded_by: r.recordedBy || 'Admin',
  }));

  const { error } = await supabase
    .from('attendance_records')
    .upsert(insertPayload, { onConflict: 'student_id,date,session' });

  if (!error) {
    await supabase.from('activity_logs').insert({
      action: 'Marked Student Attendance',
      module: 'attendance',
      entity: `${records.length} records`,
      description: `Marked attendance for ${records.length} students on ${records[0]?.date || 'today'}`,
      admin_name: 'Admin',
    });
  }

  return !error;
};

export const updateStudentAttendanceRecord = async (id: string, status: AttendanceStatus, remarks?: string): Promise<boolean> => {
  const { error } = await supabase
    .from('attendance_records')
    .update({ status, remarks: remarks || '' })
    .eq('id', id);

  return !error;
};

export const getStudentAttendance = getStudentAttendanceRecords;
export const saveBulkBatchAttendance = markStudentAttendance;

export const getSubjectWiseAttendance = async (studentId: string) => {
  const records = await getStudentAttendanceRecords(studentId);
  const subjectsMap: Record<string, { total: number; present: number }> = {};
  for (const r of records) {
    const subj = r.subjectName || r.subject || 'General';
    if (!subjectsMap[subj]) subjectsMap[subj] = { total: 0, present: 0 };
    subjectsMap[subj].total += 1;
    if (r.status === 'present' || r.status === 'late' || r.status === 'Present' || r.status === 'Late') {
      subjectsMap[subj].present += 1;
    }
  }
  return Object.entries(subjectsMap).map(([subject, counts]) => ({
    subject,
    totalClasses: counts.total,
    attendedClasses: counts.present,
    percentage: counts.total > 0 ? Math.round((counts.present / counts.total) * 100) : 0,
  }));
};

export const studentAttendanceService = {
  getStudentAttendanceRecords,
  getStudentAttendance,
  markStudentAttendance,
  saveBulkBatchAttendance,
  updateStudentAttendanceRecord,
  getSubjectWiseAttendance,
};
