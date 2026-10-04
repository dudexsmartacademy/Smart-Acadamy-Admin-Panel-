import { supabase } from '../lib/supabase';
import { AcademicCourse } from '../types';

function rowToCourse(row: Record<string, unknown>): AcademicCourse {
  return {
    id: row.id as string,
    courseCode: (row.code as string) || (row.course_code as string) || '',
    code: (row.code as string) || (row.course_code as string) || '',
    name: (row.name as string) || '',
    department: (row.department as string) || '',
    category: (row.category as string) || 'Core Engineering',
    duration: (row.duration as string) || '4 Years',
    durationMonths: (row.duration_months as number) || 48,
    fee: (row.fee as number) || (row.total_fee as number) || 0,
    totalFee: (row.total_fee as number) || (row.fee as number) || 0,
    credits: (row.credits as number) || 4,
    description: (row.description as string) || '',
    status: ((row.status as string) || 'active') as AcademicCourse['status'],
    leadTeacherId: (row.lead_teacher_id as string) || '',
    leadTeacherName: (row.lead_teacher_name as string) || '',
    enrolledStudentsCount: (row.enrolled_students_count as number) || 0,
    createdAt: (row.created_at as string)?.split('T')[0] || '',
  };
}

export const getAcademicCourses = async (): Promise<AcademicCourse[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[academicCourseService] getAcademicCourses:', error.message);
    return [];
  }
  return (data || []).map(rowToCourse);
};

export const getAcademicCourseById = async (id: string): Promise<AcademicCourse | null> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .or(`id.eq.${id},code.eq.${id}`)
    .maybeSingle();

  if (error || !data) return null;
  return rowToCourse(data);
};

export const createAcademicCourse = async (courseData: Partial<AcademicCourse>): Promise<AcademicCourse | null> => {
  const { data, error } = await supabase
    .from('courses')
    .insert({
      code: courseData.code || courseData.courseCode || `CRS-${Date.now().toString().slice(-4)}`,
      name: courseData.name || 'New Course',
      department: courseData.department || '',
      category: courseData.category || 'Core Engineering',
      duration: courseData.duration || '4 Years',
      credits: courseData.credits || 4,
      fee: courseData.totalFee || courseData.fee || 0,
      description: courseData.description || '',
      status: courseData.status || 'active',
      lead_teacher_id: courseData.leadTeacherId || null,
      lead_teacher_name: courseData.leadTeacherName || '',
    })
    .select()
    .single();

  if (error || !data) {
    console.error('[academicCourseService] createAcademicCourse:', error?.message);
    return null;
  }

  await supabase.from('activity_logs').insert({
    action: 'Created Course',
    module: 'courses',
    entity: data.name,
    description: `Created new course: ${data.name} (${data.code})`,
    admin_name: 'Admin',
  });

  return rowToCourse(data);
};

export const updateAcademicCourse = async (id: string, updates: Partial<AcademicCourse>): Promise<AcademicCourse | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.code !== undefined || updates.courseCode !== undefined) payload.code = updates.code || updates.courseCode;
  if (updates.department !== undefined) payload.department = updates.department;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.credits !== undefined) payload.credits = updates.credits;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('courses')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Updated Course',
    module: 'courses',
    entity: data.name,
    description: `Updated course: ${data.name}`,
    admin_name: 'Admin',
  });

  return rowToCourse(data);
};

export const deleteAcademicCourse = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (!error) {
    await supabase.from('activity_logs').insert({
      action: 'Deleted Course',
      module: 'courses',
      entity: id,
      description: `Deleted course ${id}`,
      admin_name: 'Admin',
    });
  }
  return !error;
};

export const getCourses = getAcademicCourses;
export const getCourseById = getAcademicCourseById;
export const createCourse = createAcademicCourse;
export const updateCourse = updateAcademicCourse;
export const deleteCourse = deleteAcademicCourse;

export const academicCourseService = {
  getCourses: getAcademicCourses,
  getCourseById: getAcademicCourseById,
  createCourse: createAcademicCourse,
  updateCourse: updateAcademicCourse,
  deleteCourse: deleteAcademicCourse,
  getAcademicCourses,
  getAcademicCourseById,
  createAcademicCourse,
  updateAcademicCourse,
  deleteAcademicCourse,
};
