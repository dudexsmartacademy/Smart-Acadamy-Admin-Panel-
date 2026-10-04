export interface TeacherNoteAttachment {
  id: string;
  name: string;
  type: string;
  size?: string;
  url?: string;
}

export interface TeacherNote {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherDesignation: string;
  department: string;

  title: string;
  description: string;
  subject: string;
  topic: string;
  batch: string;

  noteDate: string;
  createdAt: string;
  updatedAt: string;

  status: 'Published' | 'Draft';

  attachments: TeacherNoteAttachment[];
}

export const teacherNotesDemo: TeacherNote[] = [
  {
    id: 'N001',
    teacherId: 'TCH-2024-001',
    teacherName: 'Dr. Marcus Holloway',
    teacherDesignation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',

    title: 'Python Variables and Data Types',
    description:
      'Study notes covering variables, data types and basic Python syntax.',

    subject: 'Python',
    topic: 'Python Basics',
    batch: 'Batch 1',

    noteDate: '2026-09-05',
    createdAt: '2026-09-05 10:00',
    updatedAt: '2026-09-05 10:00',

    status: 'Published',

    attachments: [
      {
        id: 'A001',
        name: 'python-variables-data-types.pdf',
        type: 'PDF',
        size: '1.2 MB',
      },
    ],
  },

  {
    id: 'N002',
    teacherId: 'TCH-2024-001',
    teacherName: 'Dr. Marcus Holloway',
    teacherDesignation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',

    title: 'Python Conditional Statements',
    description:
      'Notes covering if, elif and else statements.',

    subject: 'Python',
    topic: 'Control Flow',
    batch: 'Batch 1',

    noteDate: '2026-09-06',
    createdAt: '2026-09-06 10:00',
    updatedAt: '2026-09-06 10:00',

    status: 'Draft',

    attachments: [
      {
        id: 'A002',
        name: 'conditional-statements.pdf',
        type: 'PDF',
        size: '850 KB',
      },
    ],
  },

  {
    id: 'N003',
    teacherId: 'TCH-2024-001',
    teacherName: 'Dr. Marcus Holloway',
    teacherDesignation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',

    title: 'Arrays Introduction',
    description:
      'Introduction to arrays and basic array operations.',

    subject: 'Data Structures',
    topic: 'Arrays',
    batch: 'Batch 1',

    noteDate: '2026-09-07',
    createdAt: '2026-09-07 10:00',
    updatedAt: '2026-09-07 10:00',

    status: 'Published',

    attachments: [
      {
        id: 'A003',
        name: 'arrays-introduction.pdf',
        type: 'PDF',
        size: '920 KB',
      },
    ],
  },

  {
    id: 'N004',
    teacherId: 'TCH-2024-002',
    teacherName: 'Prof. Elena Rostova',
    teacherDesignation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',

    title: 'Machine Learning Fundamentals',
    description:
      'Fundamental concepts of supervised and unsupervised machine learning.',

    subject: 'Machine Learning',
    topic: 'ML Fundamentals',
    batch: 'Batch 2',

    noteDate: '2026-09-08',
    createdAt: '2026-09-08 11:00',
    updatedAt: '2026-09-08 11:00',

    status: 'Published',

    attachments: [
      {
        id: 'A004',
        name: 'machine-learning-fundamentals.pdf',
        type: 'PDF',
        size: '1.5 MB',
      },
    ],
  },

  {
    id: 'N005',
    teacherId: 'TCH-2024-002',
    teacherName: 'Prof. Elena Rostova',
    teacherDesignation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',

    title: 'Neural Networks',
    description:
      'Introduction to neural networks, layers, activation functions and training.',

    subject: 'Artificial Intelligence',
    topic: 'Neural Networks',
    batch: 'Batch 2',

    noteDate: '2026-09-09',
    createdAt: '2026-09-09 11:00',
    updatedAt: '2026-09-09 11:00',

    status: 'Draft',

    attachments: [
      {
        id: 'A005',
        name: 'neural-networks.pdf',
        type: 'PDF',
        size: '1.1 MB',
      },
    ],
  },

  {
    id: 'N006',
    teacherId: 'TCH-2024-003',
    teacherName: 'Dr. Tariq Al-Mansoor',
    teacherDesignation: 'Associate Professor',
    department: 'Information Technology',

    title: 'REST API Fundamentals',
    description:
      'Introduction to REST architecture, HTTP methods and API communication.',

    subject: 'Web Development',
    topic: 'REST APIs',
    batch: 'Batch 3',

    noteDate: '2026-09-10',
    createdAt: '2026-09-10 09:30',
    updatedAt: '2026-09-10 09:30',

    status: 'Published',

    attachments: [
      {
        id: 'A006',
        name: 'rest-api-fundamentals.pdf',
        type: 'PDF',
        size: '780 KB',
      },
    ],
  },
];

export function getTeacherNotesDemo(
  teacherId?: string
): TeacherNote[] {
  if (!teacherId) {
    return teacherNotesDemo;
  }

  return teacherNotesDemo.filter(
    (note) => note.teacherId === teacherId
  );
}

export function getTeacherNoteDemo(
  noteId: string
): TeacherNote | undefined {
  return teacherNotesDemo.find(
    (note) => note.id === noteId
  );
}

export function getTeacherNoteCount(
  teacherId: string
): number {
  return teacherNotesDemo.filter(
    (note) => note.teacherId === teacherId
  ).length;
}