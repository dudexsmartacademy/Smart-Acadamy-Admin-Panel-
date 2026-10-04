import { supabase } from '../lib/supabase';
import { TeacherAttendance, AttendanceStatus } from '../types';

function rowToAttendance(row: Record<string, unknown>): TeacherAttendance {
  return {
    id: row.id as string,
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    facultyId: (row.faculty_id as string) || '',
    department: (row.department as string) || '',
    date: row.date as string,
    checkInTime: (row.check_in_time as string) || '',
    checkOutTime: (row.check_out_time as string) || '',
    durationMinutes: (row.duration_minutes as number) || 0,
    status: (row.status as AttendanceStatus) || 'present',
    remarks: (row.remarks as string) || '',
    recordedBy: (row.recorded_by as string) || '',
    updatedAt: (row.updated_at as string) || (row.created_at as string),
  };
}

export const teacherAttendanceService = {
  async getAll(teacherId?: string): Promise<TeacherAttendance[]> {
    let query = supabase
      .from('teacher_attendance')
      .select('*')
      .order('date', { ascending: false });
    if (teacherId) query = query.eq('teacher_id', teacherId);
    const { data, error } = await query;
    if (error) { console.error('[teacherAttendanceService] getAll:', error.message); return []; }
    return (data || []).map(rowToAttendance);
  },

  async getByDate(date: string): Promise<TeacherAttendance[]> {
    const { data, error } = await supabase
      .from('teacher_attendance')
      .select('*')
      .eq('date', date);
    if (error) return [];
    return (data || []).map(rowToAttendance);
  },

  async markAttendance(record: Partial<TeacherAttendance>): Promise<TeacherAttendance | null> {
    const { data, error } = await supabase
      .from('teacher_attendance')
      .upsert({
        teacher_id: record.teacherId,
        teacher_name: record.teacherName,
        faculty_id: record.facultyId,
        department: record.department,
        date: record.date,
        check_in_time: record.checkInTime,
        check_out_time: record.checkOutTime,
        duration_minutes: record.durationMinutes,
        status: record.status,
        remarks: record.remarks,
        recorded_by: record.recordedBy || 'Admin',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'teacher_id,date' })
      .select()
      .single();
    if (error) { console.error('[teacherAttendanceService] mark:', error.message); return null; }
    return rowToAttendance(data);
  },

  async update(id: string, updates: Partial<TeacherAttendance>): Promise<boolean> {
    const { error } = await supabase
      .from('teacher_attendance')
      .update({
        status: updates.status,
        remarks: updates.remarks,
        check_in_time: updates.checkInTime,
        check_out_time: updates.checkOutTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (!error) {
      await supabase.from('activity_logs').insert({
        action: 'Teacher Attendance Modified',
        module: 'attendance',
        entity: updates.teacherName || id,
        description: `Updated teacher attendance record`,
        admin_name: 'Admin',
      });
    }
    return !error;
  },
};
