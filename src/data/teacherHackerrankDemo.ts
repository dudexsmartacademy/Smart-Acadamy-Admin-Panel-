export type HackerRankTeacher = {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
};

export type HackerRankChallenge = {
  id: string;
  teacherId: string;
  title: string;
  type: 'Coding' | 'MCQ' | 'Coding + MCQ';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  duration: number;
  totalMarks: number;
  status: 'Draft' | 'Published' | 'Closed';
  createdAt: string;

  assessmentDate: string;
  startTime: string;
  targetBatch: string;
  assessmentUrl: string;
  description: string;
};

export type HackerRankResult = {
  id: string;
  challengeId: string;
  teacherId: string;

  studentName: string;
  registerNumber: string;
  className: string;

  score: number;
  totalMarks: number;
  percentage: number;

  grade: string;

  status:
    | 'Completed'
    | 'In Progress'
    | 'Not Attempted'
    | 'Submitted';

  submittedAt: string;

  attempt: number;
  batch: string;

  studentRemarks?: string;
  facultyRemarks?: string;
};

export const hackerRankTeachers: HackerRankTeacher[] = [
  {
    id: 'TCH-2024-001',
    name: 'Dr. Marcus Holloway',
    designation: 'Professor',
    department: 'Computer Science & Engineering',
    email: 'marcus.holloway@dudex.edu',
  },
  {
    id: 'TCH-2024-002',
    name: 'Prof. Elena Rostova',
    designation: 'Assistant Professor',
    department: 'Information Technology',
    email: 'elena.rostova@dudex.edu',
  },
  {
    id: 'TCH-2024-003',
    name: 'Dr. Tariq Al-Mansoor',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'tariq.almansoor@dudex.edu',
  },
];

export const hackerRankChallenges: HackerRankChallenge[] = [
  {
    id: 'HR-001',
    teacherId: 'TCH-2024-001',
    title: 'DudeX AI Coding Challenge 2',
    type: 'Coding',
    subject: 'Python',
    difficulty: 'Easy',
    questions: 5,
    duration: 90,
    totalMarks: 30,
    status: 'Published',
    createdAt: '2026-09-28',

    assessmentDate: '2026-09-28',
    startTime: '10:00 AM',
    targetBatch: 'Batch 1',
    assessmentUrl:
      'https://www.hackerrank.com/dudexai-coding-challenge-2',
    description:
      'Algorithmic problem solving, dynamic programming and Python data structure challenges.',
  },

  {
    id: 'HR-002',
    teacherId: 'TCH-2024-001',
    title: 'Core Java & DSA Assessment',
    type: 'Coding',
    subject: 'Java',
    difficulty: 'Medium',
    questions: 5,
    duration: 60,
    totalMarks: 30,
    status: 'Published',
    createdAt: '2026-09-25',

    assessmentDate: '2026-09-25',
    startTime: '02:00 PM',
    targetBatch: 'Batch 1',
    assessmentUrl:
      'https://www.hackerrank.com/dudex-java-dsa',
    description:
      'Core Java programming, arrays, strings, hash maps and recursion challenges.',
  },

  {
    id: 'HR-003',
    teacherId: 'TCH-2024-002',
    title: 'Python Fundamentals & OOP MCQ',
    type: 'MCQ',
    subject: 'Python',
    difficulty: 'Easy',
    questions: 20,
    duration: 45,
    totalMarks: 30,
    status: 'Published',
    createdAt: '2026-09-22',

    assessmentDate: '2026-09-22',
    startTime: '11:00 AM',
    targetBatch: 'Batch 2',
    assessmentUrl:
      'https://www.hackerrank.com/python-oop-mcq',
    description:
      'Multiple choice assessment covering Python syntax, OOP, memory management and basic programming concepts.',
  },

  {
    id: 'HR-004',
    teacherId: 'TCH-2024-002',
    title: 'JavaScript Fundamentals',
    type: 'MCQ',
    subject: 'JavaScript',
    difficulty: 'Easy',
    questions: 20,
    duration: 30,
    totalMarks: 30,
    status: 'Published',
    createdAt: '2026-09-26',

    assessmentDate: '2026-09-26',
    startTime: '10:30 AM',
    targetBatch: 'Batch 2',
    assessmentUrl:
      'https://www.hackerrank.com/javascript-fundamentals',
    description:
      'JavaScript fundamentals, ES6 syntax, arrays, objects and asynchronous programming.',
  },

  {
    id: 'HR-005',
    teacherId: 'TCH-2024-003',
    title: 'Algorithms & Problem Solving',
    type: 'Coding',
    subject: 'Algorithms',
    difficulty: 'Hard',
    questions: 4,
    duration: 90,
    totalMarks: 30,
    status: 'Published',
    createdAt: '2026-09-29',

    assessmentDate: '2026-09-29',
    startTime: '09:00 AM',
    targetBatch: 'Batch 3',
    assessmentUrl:
      'https://www.hackerrank.com/algorithms-problem-solving',
    description:
      'Advanced algorithms, graph traversal, dynamic programming and optimization problems.',
  },

  {
    id: 'HR-006',
    teacherId: 'TCH-2024-003',
    title: 'C++ Programming Assessment',
    type: 'Coding',
    subject: 'C++',
    difficulty: 'Medium',
    questions: 5,
    duration: 60,
    totalMarks: 30,
    status: 'Draft',
    createdAt: '2026-09-30',

    assessmentDate: '2026-10-02',
    startTime: '11:00 AM',
    targetBatch: 'Batch 3',
    assessmentUrl:
      'https://www.hackerrank.com/cpp-programming-assessment',
    description:
      'C++ programming, STL, classes, pointers and object-oriented programming.',
  },
];

export const hackerRankResults: HackerRankResult[] = [
  {
    id: 'RES-001',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Arun Kumar',
    registerNumber: 'RRN001',
    className: 'AI & DS',
    score: 26,
    totalMarks: 30,
    percentage: 86.67,
    grade: 'A',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:25 AM',
    attempt: 1,
    batch: 'Batch 1',
    studentRemarks:
      'Completed test with 18/20. Verified screenshot of assessment submission screen attached.',
  },

  {
    id: 'RES-002',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Priya Sharma',
    registerNumber: 'RRN002',
    className: 'AI & DS',
    score: 24,
    totalMarks: 30,
    percentage: 80,
    grade: 'A',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:21 AM',
    attempt: 1,
    batch: 'Batch 1',
  },

  {
    id: 'RES-003',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Rahul Raj',
    registerNumber: 'RRN003',
    className: 'AI & DS',
    score: 18,
    totalMarks: 30,
    percentage: 60,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:22 AM',
    attempt: 1,
    batch: 'Batch 1',
  },

  {
    id: 'RES-004',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Sneha Joseph',
    registerNumber: 'RRN004',
    className: 'AI & DS',
    score: 12,
    totalMarks: 30,
    percentage: 40,
    grade: 'D',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:23 AM',
    attempt: 1,
    batch: 'Batch 1',
  },

  {
    id: 'RES-005',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Vishal Kumar',
    registerNumber: 'RRN005',
    className: 'AI & DS',
    score: 22,
    totalMarks: 30,
    percentage: 73.33,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:24 AM',
    attempt: 1,
    batch: 'Batch 2',
  },

  {
    id: 'RES-006',
    challengeId: 'HR-001',
    teacherId: 'TCH-2024-001',
    studentName: 'Meena Devi',
    registerNumber: 'RRN006',
    className: 'AI & DS',
    score: 20,
    totalMarks: 30,
    percentage: 66.67,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-28 10:25 AM',
    attempt: 1,
    batch: 'Batch 2',
  },

  {
    id: 'RES-007',
    challengeId: 'HR-002',
    teacherId: 'TCH-2024-001',
    studentName: 'Arun Kumar',
    registerNumber: 'RRN001',
    className: 'AI & DS',
    score: 25,
    totalMarks: 30,
    percentage: 83.33,
    grade: 'A',
    status: 'Submitted',
    submittedAt: '2026-09-25 02:50 PM',
    attempt: 1,
    batch: 'Batch 1',
  },

  {
    id: 'RES-008',
    challengeId: 'HR-002',
    teacherId: 'TCH-2024-001',
    studentName: 'Priya Sharma',
    registerNumber: 'RRN002',
    className: 'AI & DS',
    score: 21,
    totalMarks: 30,
    percentage: 70,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-25 02:52 PM',
    attempt: 1,
    batch: 'Batch 1',
  },

  {
    id: 'RES-009',
    challengeId: 'HR-003',
    teacherId: 'TCH-2024-002',
    studentName: 'Karthik Raj',
    registerNumber: 'RRN101',
    className: 'IT-A',
    score: 27,
    totalMarks: 30,
    percentage: 90,
    grade: 'A+',
    status: 'Submitted',
    submittedAt: '2026-09-22 11:32 AM',
    attempt: 1,
    batch: 'Batch 2',
  },

  {
    id: 'RES-010',
    challengeId: 'HR-003',
    teacherId: 'TCH-2024-002',
    studentName: 'Divya S',
    registerNumber: 'RRN102',
    className: 'IT-A',
    score: 23,
    totalMarks: 30,
    percentage: 76.67,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-22 11:34 AM',
    attempt: 1,
    batch: 'Batch 2',
  },

  {
    id: 'RES-011',
    challengeId: 'HR-005',
    teacherId: 'TCH-2024-003',
    studentName: 'Naveen Kumar',
    registerNumber: 'RRN201',
    className: 'CSE-B',
    score: 28,
    totalMarks: 30,
    percentage: 93.33,
    grade: 'A+',
    status: 'Submitted',
    submittedAt: '2026-09-29 10:20 AM',
    attempt: 1,
    batch: 'Batch 3',
  },

  {
    id: 'RES-012',
    challengeId: 'HR-005',
    teacherId: 'TCH-2024-003',
    studentName: 'Harini M',
    registerNumber: 'RRN202',
    className: 'CSE-B',
    score: 22,
    totalMarks: 30,
    percentage: 73.33,
    grade: 'B',
    status: 'Submitted',
    submittedAt: '2026-09-29 10:24 AM',
    attempt: 1,
    batch: 'Batch 3',
  },
];

export function addHackerRankChallenge(
  challenge: HackerRankChallenge
) {
  hackerRankChallenges.unshift(challenge);
}

export function updateHackerRankChallenge(
  challengeId: string,
  updates: Partial<HackerRankChallenge>
) {
  const index = hackerRankChallenges.findIndex(
    (challenge) => challenge.id === challengeId
  );

  if (index !== -1) {
    hackerRankChallenges[index] = {
      ...hackerRankChallenges[index],
      ...updates,
    };
  }
}