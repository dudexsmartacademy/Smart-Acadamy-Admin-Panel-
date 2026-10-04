import { supabase } from '../lib/supabase';
import { Teacher, TeacherStatus } from '../types';

function rowToTeacher(row: Record<string, unknown>): Teacher {
  const tp = (row.teacher_profiles as Record<string, unknown>) || {};
  return {
    id: row.id as string,
    teacherId: (row.teacher_id as string) || '',
    fullName: row.full_name as string,
    avatar: (row.avatar_url as string) || '',
    email: row.email as string,
    phone: (tp.phone as string) || '',
    dob: (tp.dob as string) || '',
    gender: (tp.gender as Teacher['gender']) || 'male',
    address: (tp.address as string) || '',
    department: (tp.department as string) || '',
    designation: (tp.designation as string) || '',
    qualification: (tp.qualification as string) || '',
    experienceYears: (tp.experience_years as number) || 0,
    joiningDate: (tp.joining_date as string) || '',
    employmentType: (tp.employment_type as Teacher['employmentType']) || 'full-time',
    primarySubject: (tp.primary_subject as string) || '',
    skills: (tp.skills as string[]) || [],
    bio: (tp.bio as string) || '',
    linkedinUrl: (tp.linkedin_url as string) || '',
    githubUrl: (tp.github_url as string) || '',
    portfolioUrl: (tp.portfolio_url as string) || '',
    notes: (tp.notes as string) || '',
    loginEmail: row.email as string,
    status: ((tp.status as string) || 'active') as TeacherStatus,
    assignedCourseIds: (tp.assigned_course_ids as string[]) || [],
    assignedClassIds: (tp.assigned_class_ids as string[]) || [],
    totalStudentsHandled: (tp.total_students_handled as number) || 0,
    attendanceRate: (tp.attendance_rate as number) || 0,
    rating: (tp.rating as number) || 0,
    createdAt: row.created_at as string,
    updatedAt: (tp.updated_at as string) || (row.created_at as string),
  };
}

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, teacher_profiles(*)')
    .eq('role', 'teacher')
    .order('created_at', { ascending: false });
  if (error) { console.error('[teacherService] getTeachers:', error.message); return []; }
  return (data || []).map(rowToTeacher);
};

export const getTeacherById = async (id: string): Promise<Teacher | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, teacher_profiles(*)')
    .or(`id.eq.${id},teacher_id.eq.${id}`)
    .maybeSingle();
  if (error || !data) return null;
  return rowToTeacher(data);
};

export const createTeacher = async (data: Partial<Teacher>): Promise<Teacher | null> => {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email || '',
    password: 'DudexTeacher@123',
    email_confirm: true,
  });
  if (authError || !authData.user) {
    console.error('[teacherService] createTeacher auth:', authError?.message);
    return null;
  }
  const userId = authData.user.id;
  const year = new Date().getFullYear();
  const teacherId = data.teacherId || `TCH-${year}-${Date.now().toString().slice(-4)}`;

  await supabase.from('profiles').update({
    full_name: data.fullName || '',
    teacher_id: teacherId,
    role: 'teacher',
    avatar_url: data.avatar || '',
  }).eq('id', userId);

  await supabase.from('teacher_profiles').insert({
    id: userId,
    phone: data.phone || '',
    dob: data.dob || null,
    gender: data.gender || 'male',
    address: data.address || '',
    department: data.department || '',
    designation: data.designation || '',
    qualification: data.qualification || '',
    experience_years: data.experienceYears || 0,
    joining_date: data.joiningDate || new Date().toISOString().split('T')[0],
    employment_type: data.employmentType || 'full-time',
    primary_subject: data.primarySubject || '',
    skills: data.skills || [],
    bio: data.bio || '',
    linkedin_url: data.linkedinUrl || '',
    github_url: data.githubUrl || '',
    status: data.status || 'active',
  });

  await supabase.from('activity_logs').insert({
    action: 'Teacher Created',
    module: 'teachers',
    entity: data.fullName || '',
    description: `Created new teacher ${data.fullName} (${teacherId})`,
    admin_name: 'Admin',
  });

  return getTeacherById(userId);
};

export const updateTeacher = async (id: string, updates: Partial<Teacher>): Promise<Teacher | null> => {
  const profileUpdates: Record<string, unknown> = {};
  if (updates.fullName) profileUpdates.full_name = updates.fullName;
  if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
  if (Object.keys(profileUpdates).length > 0) {
    await supabase.from('profiles').update(profileUpdates).or(`id.eq.${id},teacher_id.eq.${id}`);
  }

  const tpUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.phone !== undefined) tpUpdates.phone = updates.phone;
  if (updates.dob !== undefined) tpUpdates.dob = updates.dob;
  if (updates.department !== undefined) tpUpdates.department = updates.department;
  if (updates.designation !== undefined) tpUpdates.designation = updates.designation;
  if (updates.qualification !== undefined) tpUpdates.qualification = updates.qualification;
  if (updates.primarySubject !== undefined) tpUpdates.primary_subject = updates.primarySubject;
  if (updates.bio !== undefined) tpUpdates.bio = updates.bio;
  if (updates.status !== undefined) tpUpdates.status = updates.status;
  if (updates.skills !== undefined) tpUpdates.skills = updates.skills;

  await supabase.from('teacher_profiles').update(tpUpdates).eq('id', id);

  await supabase.from('activity_logs').insert({
    action: 'Teacher Record Updated',
    module: 'teachers',
    entity: updates.fullName || id,
    description: `Updated teacher record`,
    admin_name: 'Admin',
  });

  return getTeacherById(id);
};

export const updateTeacherStatus = (id: string, status: TeacherStatus) =>
  updateTeacher(id, { status });

export const deleteTeacher = async (id: string): Promise<boolean> => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  return !error;
};

export const teacherService = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  updateTeacherStatus,
  deleteTeacher,
};
