export type TeacherAttendanceStatus =
  | 'present'
  | 'leave'
  | 'absent'
  | 'pending';

export interface TeacherAttendanceDemo {
  teacherId: string;

  totalCourseDays: number;
  completedDays: number;
  remainingDays: number;

  workingDays: number;
  presentDays: number;
  leaveDays: number;
  absentDays: number;

  casualLeave: number;
  medicalLeave: number;

  clRemaining: number;
  mlRemaining: number;

  attendanceRate: number;

  subject: string;

  /*
   * Exact days which are leave/absent.
   * All other working days are automatically
   * generated as present.
   */
  leaveDaysList: number[];
  absentDaysList: number[];
}


/*
|--------------------------------------------------------------------------
| SHARED TEACHER ATTENDANCE DATA
|--------------------------------------------------------------------------
|
| This is the single source of truth.
|
| Teacher Attendance page and individual attendance page
| both use this same data.
|
*/

export const teacherAttendanceDemo: Record<
  string,
  TeacherAttendanceDemo
> = {

  /* ====================================================================== */
  /* MARCUS                                                                */
  /* ====================================================================== */

  'tch-101': {
    teacherId: 'TCH-2024-001',

    totalCourseDays: 90,
    completedDays: 80,
    remainingDays: 10,

    workingDays: 63,
    presentDays: 62,
    leaveDays: 1,
    absentDays: 0,

    casualLeave: 1,
    medicalLeave: 0,

    clRemaining: 2,
    mlRemaining: 3,

    attendanceRate: 98.4,

    subject: 'Python, Data Structures',

    leaveDaysList: [
      24,
    ],

    absentDaysList: [],
  },


  /* ====================================================================== */
  /* ELENA                                                                 */
  /* ====================================================================== */

  'tch-102': {
    teacherId: 'TCH-2024-002',

    totalCourseDays: 90,
    completedDays: 80,
    remainingDays: 10,

    workingDays: 63,
    presentDays: 61,
    leaveDays: 2,
    absentDays: 0,

    casualLeave: 1,
    medicalLeave: 1,

    clRemaining: 2,
    mlRemaining: 2,

    attendanceRate: 96.8,

    subject: 'Artificial Intelligence & Data Science',

    leaveDaysList: [
      17,
      39,
    ],

    absentDaysList: [],
  },


  /* ====================================================================== */
  /* TARIQ                                                                 */
  /* ====================================================================== */

  'tch-103': {
    teacherId: 'TCH-2024-003',

    totalCourseDays: 90,
    completedDays: 80,
    remainingDays: 10,

    workingDays: 69,
    presentDays: 65,
    leaveDays: 3,
    absentDays: 1,

    casualLeave: 2,
    medicalLeave: 1,

    clRemaining: 1,
    mlRemaining: 2,

    attendanceRate: 94.2,

    subject: 'Computer Networks & Cloud Computing',

    leaveDaysList: [
      8,
      24,
      79,
    ],

    absentDaysList: [
      31,
    ],
  },

};


/* ========================================================================== */
/* GET DATA                                                                  */
/* ========================================================================== */

export function getTeacherAttendanceDemo(
  teacherId: string
): TeacherAttendanceDemo {

  return (
    teacherAttendanceDemo[teacherId] ||
    teacherAttendanceDemo['tch-101']
  );
}