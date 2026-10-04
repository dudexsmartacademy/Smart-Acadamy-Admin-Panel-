import { supabase } from '../lib/supabase';
import { Student, StudentStatus } from '../types';

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function rowToStudent(row: Record<string, unknown>): Student {
  const sp = (row.student_profiles as Record<string, unknown>) || {};
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    fullName: row.full_name as string,
    avatar: (row.avatar_url as string) || '',
    profileImage: (row.avatar_url as string) || '',
    email: row.email as string,
    phone: (sp.phone as string) || '',
    dob: (sp.dob as string) || '',
    gender: (sp.gender as Student['gender']) || 'Male',
    address: (sp.address as string) || '',
    department: (sp.department as string) || '',
    course: (sp.course_name as string) || '',
    courseId: (sp.course_id as string) || '',
    courseName: (sp.course_name as string) || '',
    batch: (sp.batch_name as string) || '',
    batchId: (sp.batch_id as string) || '',
    batchName: (sp.batch_name as string) || '',
    section: (sp.section as string) || '',
    academicYear: (sp.academic_year as string) || '',
    admissionDate: (sp.admission_date as string) || '',
    guardianName: (sp.guardian_name as string) || '',
    guardianPhone: (sp.guardian_phone as string) || '',
    guardianEmail: (sp.guardian_email as string) || '',
    guardianRelation: (sp.guardian_relation as string) || '',
    emergencyContact: (sp.emergency_contact as string) || '',
    loginEmail: row.email as string,
    status: ((sp.status as string) || 'active') as StudentStatus,
    feeStatus: ((sp.fee_status as string) || 'pending') as Student['feeStatus'],
    attendancePercentage: (sp.attendance_percentage as number) || 0,
    averageScore: (sp.average_score as number) || 0,
    skills: (sp.skills as string[]) || [],
    careerInterests: (sp.career_interests as string) || '',
    notes: (sp.notes as string) || '',
    registerNumber: (sp.register_number as string) || '',
    specialization: (sp.specialization as string) || '',
    createdAt: row.created_at as string,
    updatedAt: (sp.updated_at as string) || (row.created_at as string),
  };
}

// ──────────────────────────────────────────────
// READ
// ──────────────────────────────────────────────
export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, student_profiles(*)')
    .eq('role', 'student')
    .order('created_at', { ascending: false });

  if (error) { console.error('[studentService] getStudents:', error.message); return []; }
  return (data || []).map(rowToStudent);
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, student_profiles(*)')
    .or(`id.eq.${id},student_id.eq.${id}`)
    .maybeSingle();

  if (error || !data) return null;
  return rowToStudent(data);
};

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────
export const createStudent = async (data: Partial<Student>): Promise<Student | null> => {
  // 1. Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email || '',
    password: 'DudexStudent@123',
    email_confirm: true,
  });

  if (authError || !authData.user) {
    console.error('[studentService] createStudent auth:', authError?.message);
    return null;
  }

  const userId = authData.user.id;
  const year = new Date().getFullYear();
  const studentId = data.studentId || `STU-${year}-${Date.now().toString().slice(-4)}`;

  // 2. Update profiles row (created by trigger)
  await supabase.from('profiles').update({
    full_name: data.fullName || 'New Student',
    student_id: studentId,
    role: 'student',
    avatar_url: data.avatar || '',
  }).eq('id', userId);

  // 3. Insert student_profiles row
  await supabase.from('student_profiles').insert({
    id: userId,
    phone: data.phone || '',
    dob: data.dob || null,
    gender: data.gender || 'Male',
    address: data.address || '',
    department: data.department || '',
    course_id: data.courseId || null,
    course_name: data.courseName || data.course || '',
    batch_id: data.batchId || null,
    batch_name: data.batchName || data.batch || '',
    section: data.section || '',
    academic_year: data.academicYear || '',
    admission_date: data.admissionDate || new Date().toISOString().split('T')[0],
    guardian_name: data.guardianName || '',
    guardian_phone: data.guardianPhone || '',
    guardian_email: data.guardianEmail || '',
    guardian_relation: data.guardianRelation || 'Parent / Guardian',
    emergency_contact: data.emergencyContact || '',
    status: data.status || 'active',
    fee_status: data.feeStatus || 'pending',
    skills: data.skills || [],
    career_interests: data.careerInterests || '',
    notes: data.notes || '',
    register_number: data.registerNumber || '',
    specialization: data.specialization || '',
  });

  // 4. Log activity
  await supabase.from('activity_logs').insert({
    action: 'Student Enrolled',
    module: 'students',
    entity: data.fullName || 'New Student',
    description: `Registered new student ${data.fullName} (${studentId})`,
    admin_name: 'Admin',
  });

  return getStudentById(userId);
};

// ──────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────
export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student | null> => {
  // Profile table fields
  const profileUpdates: Record<string, unknown> = {};
  if (updates.fullName) profileUpdates.full_name = updates.fullName;
  if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
  if (Object.keys(profileUpdates).length > 0) {
    await supabase.from('profiles').update(profileUpdates).or(`id.eq.${id},student_id.eq.${id}`);
  }

  // Student profiles fields
  const spUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.phone !== undefined) spUpdates.phone = updates.phone;
  if (updates.dob !== undefined) spUpdates.dob = updates.dob;
  if (updates.gender !== undefined) spUpdates.gender = updates.gender;
  if (updates.address !== undefined) spUpdates.address = updates.address;
  if (updates.department !== undefined) spUpdates.department = updates.department;
  if (updates.courseId !== undefined) spUpdates.course_id = updates.courseId;
  if (updates.courseName !== undefined) spUpdates.course_name = updates.courseName;
  if (updates.batchId !== undefined) spUpdates.batch_id = updates.batchId;
  if (updates.batchName !== undefined) spUpdates.batch_name = updates.batchName;
  if (updates.section !== undefined) spUpdates.section = updates.section;
  if (updates.academicYear !== undefined) spUpdates.academic_year = updates.academicYear;
  if (updates.status !== undefined) spUpdates.status = updates.status;
  if (updates.feeStatus !== undefined) spUpdates.fee_status = updates.feeStatus;
  if (updates.guardianName !== undefined) spUpdates.guardian_name = updates.guardianName;
  if (updates.guardianPhone !== undefined) spUpdates.guardian_phone = updates.guardianPhone;
  if (updates.guardianEmail !== undefined) spUpdates.guardian_email = updates.guardianEmail;
  if (updates.notes !== undefined) spUpdates.notes = updates.notes;
  if (updates.skills !== undefined) spUpdates.skills = updates.skills;
  if (updates.careerInterests !== undefined) spUpdates.career_interests = updates.careerInterests;

  await supabase.from('student_profiles').update(spUpdates).eq('id', id);

  await supabase.from('activity_logs').insert({
    action: 'Student Record Updated',
    module: 'students',
    entity: updates.fullName || id,
    description: `Updated student record for ${updates.fullName || id}`,
    admin_name: 'Admin',
  });

  return getStudentById(id);
};

export const updateStudentStatus = (id: string, status: StudentStatus) =>
  updateStudent(id, { status });

export const deleteStudent = async (id: string): Promise<boolean> => {
  const { error } = await supabase.auth.admin.deleteUser(id);
  return !error;
};

export const getAtRiskStudents = async (): Promise<Student[]> => {
  const list = await getStudents();
  return list.filter((s) => {
    const isInactive = s.status === 'suspended' || s.status === 'Suspended';
    const lowAtt = (s.attendancePercentage || 0) < 75;
    const lowMarks = (s.averageScore || 80) < 50;
    return isInactive || lowAtt || lowMarks;
  });
};

export const studentService = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  updateStudentStatus,
  deleteStudent,
  getAtRiskStudents,
};
