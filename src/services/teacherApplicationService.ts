import { supabase } from '../lib/supabase';
import { TeacherApplication, ApplicationStatus } from '../types';

function rowToApplication(row: Record<string, unknown>): TeacherApplication {
  return {
    id: row.id as string,
    applicationNumber: (row.application_number as string) || '',
    fullName: (row.full_name as string) || '',
    email: (row.email as string) || '',
    phone: (row.phone as string) || '',
    dob: (row.dob as string) || '',
    gender: row.gender as TeacherApplication['gender'],
    address: (row.address as string) || '',
    department: (row.department as string) || '',
    qualification: (row.qualification as string) || '',
    experienceYears: (row.experience_years as number) || 0,
    requestedSubject: (row.requested_subject as string) || '',
    skills: (row.skills as string[]) || [],
    resumeUrl: (row.resume_url as string) || '',
    portfolioUrl: (row.portfolio_url as string) || '',
    coverLetter: (row.cover_letter as string) || '',
    status: (row.status as ApplicationStatus) || 'pending',
    appliedDate: row.created_at as string,
    reviewedDate: (row.reviewed_date as string) || '',
    reviewerNotes: (row.reviewer_notes as string) || '',
    convertedTeacherId: (row.converted_teacher_id as string) || '',
  };
}

export const teacherApplicationService = {
  async getAll(): Promise<TeacherApplication[]> {
    const { data, error } = await supabase
      .from('teacher_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('[teacherApplicationService]', error.message); return []; }
    return (data || []).map(rowToApplication);
  },

  async getById(id: string): Promise<TeacherApplication | null> {
    const { data, error } = await supabase
      .from('teacher_applications')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToApplication(data);
  },

  async create(data: Partial<TeacherApplication>): Promise<TeacherApplication | null> {
    const appNumber = `APP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const { data: row, error } = await supabase
      .from('teacher_applications')
      .insert({
        application_number: appNumber,
        full_name: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        dob: data.dob || null,
        gender: data.gender || '',
        address: data.address || '',
        department: data.department || '',
        qualification: data.qualification || '',
        experience_years: data.experienceYears || 0,
        requested_subject: data.requestedSubject || '',
        skills: data.skills || [],
        resume_url: data.resumeUrl || '',
        portfolio_url: data.portfolioUrl || '',
        cover_letter: data.coverLetter || '',
        status: 'pending',
      })
      .select()
      .single();
    if (error || !row) return null;
    return rowToApplication(row);
  },

  async updateStatus(id: string, status: ApplicationStatus, notes?: string): Promise<boolean> {
    const { error } = await supabase
      .from('teacher_applications')
      .update({
        status,
        reviewer_notes: notes || '',
        reviewed_date: new Date().toISOString(),
      })
      .eq('id', id);

    if (!error) {
      await supabase.from('activity_logs').insert({
        action: `Application ${status}`,
        module: 'applications',
        entity: id,
        description: `Teacher application status updated to ${status}`,
        admin_name: 'Admin',
      });
    }
    return !error;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('teacher_applications').delete().eq('id', id);
    return !error;
  },

  async convertToTeacher(id: string): Promise<boolean> {
    const app = await this.getById(id);
    if (!app) return false;
    const { data: teacher, error } = await supabase
      .from('teachers')
      .insert({
        full_name: app.fullName,
        email: app.email,
        phone: app.phone,
        department: app.department,
        qualification: app.qualification,
        experience_years: app.experienceYears,
        status: 'Active',
      })
      .select()
      .single();

    if (error || !teacher) return false;
    await this.updateStatus(id, 'approved', 'Converted to Active Faculty');
    return true;
  },

  getApplications() {
    return this.getAll();
  },

  updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string) {
    return this.updateStatus(id, status, notes);
  },

  deleteApplication(id: string) {
    return this.delete(id);
  },
};
