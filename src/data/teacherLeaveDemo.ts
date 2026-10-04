export interface TeacherLeaveDemo {
  teacherId: string;
  facultyName: string;
  department: string;

  casualLeaveRemaining: number;
  medicalLeaveRemaining: number;

  totalLeaveTaken: number;
  pendingRequests: number;
}


/*
|--------------------------------------------------------------------------
| SHARED TEACHER LEAVE DATA
|--------------------------------------------------------------------------
|
| This is the single source of truth for the leave module.
|
*/

export const teacherLeaveDemo: Record<
  string,
  TeacherLeaveDemo
> = {

  /* ====================================================================== */
  /* DR. MARCUS HOLLOWAY                                                   */
  /* ====================================================================== */

  'tch-101': {
    teacherId: 'TCH-2024-001',

    facultyName: 'Dr. Marcus Holloway',

    department:
      'Computer Science & Engineering',

    casualLeaveRemaining: 2,

    medicalLeaveRemaining: 3,

    totalLeaveTaken: 1,

    pendingRequests: 0,
  },


  /* ====================================================================== */
  /* PROF. ELENA ROSTOVA                                                   */
  /* ====================================================================== */

  'tch-102': {
    teacherId: 'TCH-2024-002',

    facultyName: 'Prof. Elena Rostova',

    department:
      'Artificial Intelligence & Data Science',

    casualLeaveRemaining: 2,

    medicalLeaveRemaining: 2,

    totalLeaveTaken: 2,

    pendingRequests: 1,
  },


  /* ====================================================================== */
  /* DR. TARIQ AL-MANSOOR                                                 */
  /* ====================================================================== */

  'tch-103': {
    teacherId: 'TCH-2024-003',

    facultyName: 'Dr. Tariq Al-Mansoor',

    department:
      'Information Technology',

    casualLeaveRemaining: 1,

    medicalLeaveRemaining: 2,

    totalLeaveTaken: 3,

    pendingRequests: 0,
  },

};


/*
|--------------------------------------------------------------------------
| GET TEACHER LEAVE DATA
|--------------------------------------------------------------------------
*/

export function getTeacherLeaveDemo(
  teacherId: string
): TeacherLeaveDemo {

  return (
    teacherLeaveDemo[teacherId] ||
    teacherLeaveDemo['tch-101']
  );
}