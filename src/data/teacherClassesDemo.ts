export interface TeacherClass {
  id: string;
  teacherId: string;
  title: string;
  batch: string;
  subject: string;
  students: number;
  schedule: string;
  meetLink: string;
  description: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  date: string;
}

export interface TeacherClassTeacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  facultyId: string;
  totalClasses: number;
}

export const teacherClassTeachers: TeacherClassTeacher[] = [
  {
    id: 'TCH-2024-001',
    name: 'Dr. Marcus Holloway',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    facultyId: 'TCH-2024-001',
    totalClasses: 3,
  },
  {
    id: 'TCH-2024-002',
    name: 'Prof. Elena Rostova',
    designation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',
    facultyId: 'TCH-2024-002',
    totalClasses: 2,
  },
  {
    id: 'TCH-2024-003',
    name: 'Dr. Tariq Al-Mansoor',
    designation: 'Associate Professor',
    department: 'Information Technology',
    facultyId: 'TCH-2024-003',
    totalClasses: 2,
  },
];

export const teacherClassesDemo: TeacherClass[] = [
  {
    id: 'CLS-001',
    teacherId: 'TCH-2024-001',
    title: 'Python Basics',
    batch: '2024-2028',
    subject: 'Python',
    students: 64,
    schedule: '10:00 - 11:00',
    meetLink: 'https://meet.google.com/example-python',
    description:
      'Introduction to Python programming, variables, data structures and algorithms.',
    status: 'Active',
    date: '2026-09-09',
  },
  {
    id: 'CLS-002',
    teacherId: 'TCH-2024-001',
    title: 'Data Structures - Arrays',
    batch: '2024-2028',
    subject: 'Data Structures',
    students: 62,
    schedule: '11:00 - 12:00',
    meetLink: 'https://meet.google.com/example-arrays',
    description:
      'Arrays, linked lists, stacks, queues and basic array operations.',
    status: 'Active',
    date: '2026-09-10',
  },
  {
    id: 'CLS-003',
    teacherId: 'TCH-2024-001',
    title: 'Python Functions & OOP',
    batch: '2023-2027',
    subject: 'Programming',
    students: 58,
    schedule: '14:00 - 15:00',
    meetLink: 'https://meet.google.com/example-oop',
    description:
      'Functions, parameters, scope, object-oriented concepts and return values.',
    status: 'Completed',
    date: '2026-08-28',
  },

  {
    id: 'CLS-004',
    teacherId: 'TCH-2024-002',
    title: 'Machine Learning Fundamentals',
    batch: '2024-2028',
    subject: 'Machine Learning',
    students: 60,
    schedule: '09:00 - 10:00',
    meetLink: 'https://meet.google.com/example-ml',
    description:
      'Introduction to supervised learning, unsupervised learning and model evaluation.',
    status: 'Active',
    date: '2026-09-11',
  },
  {
    id: 'CLS-005',
    teacherId: 'TCH-2024-002',
    title: 'Neural Networks',
    batch: '2024-2028',
    subject: 'Artificial Intelligence',
    students: 56,
    schedule: '11:00 - 12:00',
    meetLink: 'https://meet.google.com/example-neural',
    description:
      'Neural networks, layers, activation functions and model training.',
    status: 'Upcoming',
    date: '2026-10-05',
  },

  {
    id: 'CLS-006',
    teacherId: 'TCH-2024-003',
    title: 'REST API Fundamentals',
    batch: '2024-2028',
    subject: 'Web Development',
    students: 61,
    schedule: '10:00 - 11:00',
    meetLink: 'https://meet.google.com/example-api',
    description:
      'REST architecture, HTTP methods, API endpoints and JSON communication.',
    status: 'Active',
    date: '2026-09-12',
  },
  {
    id: 'CLS-007',
    teacherId: 'TCH-2024-003',
    title: 'Node.js & Express',
    batch: '2023-2027',
    subject: 'Backend Development',
    students: 54,
    schedule: '14:00 - 15:00',
    meetLink: 'https://meet.google.com/example-node',
    description:
      'Node.js runtime, Express routing, middleware and backend API development.',
    status: 'Completed',
    date: '2026-08-30',
  },
];

export function getTeacherById(
  teacherId: string
): TeacherClassTeacher | undefined {
  return teacherClassTeachers.find(
    (teacher) => teacher.id === teacherId
  );
}

export function getClassesByTeacherId(
  teacherId: string
): TeacherClass[] {
  return teacherClassesDemo.filter(
    (item) => item.teacherId === teacherId
  );
}

export function getClassById(
  classId: string
): TeacherClass | undefined {
  return teacherClassesDemo.find(
    (item) => item.id === classId
  );
}