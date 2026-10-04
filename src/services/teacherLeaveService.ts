import { supabase } from '../lib/supabase';
import { TeacherLeave, LeaveStatus } from '../types';

function rowToLeave(row: Record<string, unknown>): TeacherLeave {
  return {
    id: row.id as string,
    teacherId: (row.teacher_id as string) || '',
    teacherName: (row.teacher_name as string) || '',
    department: (row.department as string) || '',
    leaveType: row.leave_type as TeacherLeave['leaveType'],
    fromDate: row.from_date as string,
    toDate: row.to_date as string,
    totalDays: (row.total_days as number) || 0,
    reason: (row.reason as string) || '',
    submittedDate: (row.created_at as string) || '',
    status: (row.status as LeaveStatus) || 'pending',
    reviewedBy: (row.reviewed_by as string) || '',
    reviewedDate: (row.reviewed_date as string) || '',
    reviewRemarks: (row.review_remarks as string) || '',
  };
}

export const teacherLeaveService = {
  async getAll(teacherId?: string): Promise<TeacherLeave[]> {
    let query = supabase
      .from('teacher_leave')
      .select('*')
      .order('created_at', { ascending: false });
    if (teacherId) query = query.eq('teacher_id', teacherId);
    const { data, error } = await query;
    if (error) { console.error('[teacherLeaveService]', error.message); return []; }
    return (data || []).map(rowToLeave);
  },

  async create(data: Partial<TeacherLeave>): Promise<TeacherLeave | null> {
    const { data: row, error } = await supabase
      .from('teacher_leave')
      .insert({
        teacher_id: data.teacherId,
        teacher_name: data.teacherName,
        department: data.department,
        leave_type: data.leaveType,
        from_date: data.fromDate,
        to_date: data.toDate,
        total_days: data.totalDays,
        reason: data.reason,
        status: 'pending',
      })
      .select()
      .single();
    if (error) { console.error('[teacherLeaveService] create:', error.message); return null; }
    return rowToLeave(row);
  },

  async updateStatus(id: string, status: LeaveStatus, remarks?: string): Promise<boolean> {
    const { error } = await supabase
      .from('teacher_leave')
      .update({
        status,
        review_remarks: remarks || '',
        reviewed_date: new Date().toISOString(),
        reviewed_by: 'Admin',
      })
      .eq('id', id);

    if (!error) {
      await supabase.from('activity_logs').insert({
        action: `Leave Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        module: 'leave',
        entity: id,
        description: `Teacher leave ${status}`,
        admin_name: 'Admin',
      });
    }
    return !error;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('teacher_leave').delete().eq('id', id);
    return !error;
  },
};
