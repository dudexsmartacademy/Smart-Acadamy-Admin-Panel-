import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Save,
  UserRound,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
}

interface TeacherClass {
  id: string;
  teacherId: string;
  title: string;
  batch: string;
  subject: string;
  students: number;
  schedule: string;
  meetingUrl: string;
  description: string;
}

const teachers: Teacher[] = [
  {
    id: 'TCH-2024-001',
    name: 'Dr. Marcus Holloway',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
  },
  {
    id: 'TCH-2024-002',
    name: 'Prof. Elena Rostova',
    designation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',
  },
  {
    id: 'TCH-2024-003',
    name: 'Dr. Tariq Al-Mansoor',
    designation: 'Associate Professor',
    department: 'Information Technology',
  },
];

const demoClasses: TeacherClass[] = [
  {
    id: 'CLS-001',
    teacherId: 'TCH-2024-001',
    title: 'Python Basics',
    batch: '2024-2028',
    subject: 'Python',
    students: 64,
    schedule: '10:00 - 11:00',
    meetingUrl: 'https://meet.google.com/example-python',
    description:
      'Introduction to Python programming, variables, data structures and algorithms.',
  },
  {
    id: 'CLS-002',
    teacherId: 'TCH-2024-001',
    title: 'Data Structures - Arrays',
    batch: '2024-2028',
    subject: 'Data Structures',
    students: 62,
    schedule: '11:00 - 12:00',
    meetingUrl: 'https://meet.google.com/example-arrays',
    description:
      'Arrays, linked lists, stacks, queues and basic array operations.',
  },
  {
    id: 'CLS-003',
    teacherId: 'TCH-2024-001',
    title: 'Python Functions & OOP',
    batch: '2023-2027',
    subject: 'Programming',
    students: 58,
    schedule: '14:00 - 15:00',
    meetingUrl: 'https://meet.google.com/example-oop',
    description:
      'Functions, parameters, scope, object-oriented concepts and return values.',
  },
  {
    id: 'CLS-004',
    teacherId: 'TCH-2024-002',
    title: 'Machine Learning Fundamentals',
    batch: '2024-2028',
    subject: 'Machine Learning',
    students: 60,
    schedule: '09:00 - 10:00',
    meetingUrl: 'https://meet.google.com/example-ml',
    description:
      'Introduction to supervised and unsupervised machine learning concepts.',
  },
  {
    id: 'CLS-005',
    teacherId: 'TCH-2024-003',
    title: 'REST API Fundamentals',
    batch: '2024-2028',
    subject: 'Web Development',
    students: 55,
    schedule: '13:00 - 14:00',
    meetingUrl: 'https://meet.google.com/example-api',
    description:
      'REST APIs, HTTP methods, request handling and API integration.',
  },
];

const batches = [
  'All Batches',
  '2024-2028',
  '2023-2027',
  '2022-2026',
];

const TeacherHeader: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  const initials = teacher.name
    .replace('Dr. ', '')
    .replace('Prof. ', '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="
        rounded-xl
        border border-[#4b392e]
        bg-[#241f1c]
        px-5 py-4
        shadow-sm
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-full
            border border-[#d9b58f]
            bg-[#f5eadc]
            text-sm font-semibold
            text-[#8b4f2b]
          "
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#bda894]">
            Faculty
          </div>

          <h1 className="text-base font-semibold text-[#f8f1e8]">
            {teacher.name}
          </h1>

          <p className="mt-0.5 text-xs text-[#b9aaa0]">
            {teacher.designation}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="
                rounded-full
                border border-[#5b3d2b]
                bg-[#30231d]
                px-2.5 py-1
                text-[10px] font-medium
                text-[#d7a477]
              "
            >
              {teacher.department}
            </span>

            <span
              className="
                rounded-full
                border border-[#6b5749]
                bg-[#2b2724]
                px-2.5 py-1
                text-[10px] font-medium
                text-[#d8ccc3]
              "
            >
              {teacher.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherClassesFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { teacherId, classId } = useParams<{
    teacherId: string;
    classId?: string;
  }>();

  const isEdit = Boolean(classId);

  const teacher = useMemo(() => {
    return (
      teachers.find((item) => item.id === teacherId) ??
      teachers[0]
    );
  }, [teacherId]);

  const existingClass = useMemo(() => {
    if (!classId) return undefined;

    return demoClasses.find(
      (item) =>
        item.id === classId &&
        item.teacherId === teacher.id
    );
  }, [classId, teacher.id]);

  const [title, setTitle] = useState(
    existingClass?.title ?? ''
  );

  const [batch, setBatch] = useState(
    existingClass?.batch ?? 'All Batches'
  );

  const [subject, setSubject] = useState(
    existingClass?.subject ?? ''
  );

  const [students, setStudents] = useState(
    existingClass?.students?.toString() ?? '60'
  );

  const [schedule, setSchedule] = useState(
    existingClass?.schedule ?? '10:00 - 11:00'
  );

  const [meetingUrl, setMeetingUrl] = useState(
    existingClass?.meetingUrl ?? ''
  );

  const [description, setDescription] = useState(
    existingClass?.description ?? ''
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const classData = {
      teacherId: teacher.id,
      title,
      batch,
      subject,
      students: Number(students),
      schedule,
      meetingUrl,
      description,
    };

    console.log(
      isEdit ? 'Updating class:' : 'Creating class:',
      classData
    );

    navigate(`/admin/teachers/classes/${teacher.id}`);
  };

  const handleCancel = () => {
    navigate(`/admin/teachers/classes/${teacher.id}`);
  };

  return (
    <div className="min-h-screen bg-[#191715] text-[#201b18]">
      <main className="mx-auto w-full max-w-[930px] px-6 py-6">
        {/* Back */}
        <button
          type="button"
          onClick={handleCancel}
          className="
            mb-5 inline-flex items-center gap-2
            text-xs font-medium
            text-[#c9b9aa]
            transition-colors
            hover:text-[#e5c09d]
          "
        >
          <ArrowLeft size={14} />
          Back to Classes
        </button>

        {/* Teacher */}
        <TeacherHeader teacher={teacher} />

        {/* Form Card */}
        <div
          className="
            mt-3
            overflow-hidden
            rounded-xl
            border border-[#dfd4c7]
            bg-[#f7f2ea]
            shadow-sm
          "
        >
          {/* Header */}
          <div className="border-b border-[#e1d7cc] px-6 py-4">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-lg
                  bg-[#eee3d5]
                  text-[#8b4f2b]
                "
              >
                <Building2 size={17} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#211d1a]">
                  {isEdit ? 'Edit Class' : 'Create New Class'}
                </h2>

                <p className="mt-0.5 text-xs text-[#756a62]">
                  {isEdit
                    ? 'Update class information and schedule'
                    : 'Configure details and schedule for a new class section'}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5">
              {/* Class Name */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                  Class Name / Title *
                </label>

                <input
                  required
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Advanced Machine Learning"
                  className="
                    h-10 w-full rounded-lg
                    border border-[#d8cec2]
                    bg-[#fffdfa]
                    px-3
                    text-sm text-[#28221e]
                    outline-none
                    placeholder:text-[#a69a90]
                    focus:border-[#9a6744]
                    focus:ring-2 focus:ring-[#9a6744]/10
                  "
                />
              </div>

              {/* Batch + Subject */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                    Batches *
                  </label>

                  <select
                    required
                    value={batch}
                    onChange={(event) =>
                      setBatch(event.target.value)
                    }
                    className="
                      h-10 w-full rounded-lg
                      border border-[#d8cec2]
                      bg-[#fffdfa]
                      px-3
                      text-sm text-[#28221e]
                      outline-none
                      focus:border-[#9a6744]
                      focus:ring-2 focus:ring-[#9a6744]/10
                    "
                  >
                    {batches.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                    Subject *
                  </label>

                  <input
                    required
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value)
                    }
                    placeholder="e.g. Python Programming"
                    className="
                      h-10 w-full rounded-lg
                      border border-[#d8cec2]
                      bg-[#fffdfa]
                      px-3
                      text-sm text-[#28221e]
                      outline-none
                      placeholder:text-[#a69a90]
                      focus:border-[#9a6744]
                      focus:ring-2 focus:ring-[#9a6744]/10
                    "
                  />
                </div>
              </div>

              {/* Students + Schedule */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                    Number of Students
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={students}
                    onChange={(event) =>
                      setStudents(event.target.value)
                    }
                    className="
                      h-10 w-full rounded-lg
                      border border-[#d8cec2]
                      bg-[#fffdfa]
                      px-3
                      text-sm text-[#28221e]
                      outline-none
                      focus:border-[#9a6744]
                      focus:ring-2 focus:ring-[#9a6744]/10
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                    Schedule / Time
                  </label>

                  <input
                    value={schedule}
                    onChange={(event) =>
                      setSchedule(event.target.value)
                    }
                    placeholder="10:00 - 11:00"
                    className="
                      h-10 w-full rounded-lg
                      border border-[#d8cec2]
                      bg-[#fffdfa]
                      px-3
                      text-sm text-[#28221e]
                      outline-none
                      placeholder:text-[#a69a90]
                      focus:border-[#9a6744]
                      focus:ring-2 focus:ring-[#9a6744]/10
                    "
                  />
                </div>
              </div>

              {/* Meeting URL */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                  Meet Link / Online Class URL
                </label>

                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(event) =>
                    setMeetingUrl(event.target.value)
                  }
                  placeholder="e.g. https://meet.google.com/abc-defg-hij or Zoom link"
                  className="
                    h-10 w-full rounded-lg
                    border border-[#d8cec2]
                    bg-[#fffdfa]
                    px-3
                    text-sm text-[#28221e]
                    outline-none
                    placeholder:text-[#a69a90]
                    focus:border-[#9a6744]
                    focus:ring-2 focus:ring-[#9a6744]/10
                  "
                />
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-[#3d352f]">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Provide a brief overview of course objectives and syllabus..."
                  className="
                    w-full resize-none rounded-lg
                    border border-[#d8cec2]
                    bg-[#fffdfa]
                    px-3 py-2.5
                    text-sm text-[#28221e]
                    outline-none
                    placeholder:text-[#a69a90]
                    focus:border-[#9a6744]
                    focus:ring-2 focus:ring-[#9a6744]/10
                  "
                />
              </div>
            </div>

            {/* Footer */}
            <div
              className="
                flex items-center justify-end gap-3
                border-t border-[#e1d7cc]
                px-6 py-4
              "
            >
              <button
                type="button"
                onClick={handleCancel}
                className="
                  rounded-lg
                  border border-[#d4c8bb]
                  bg-[#fffdfa]
                  px-4 py-2
                  text-xs font-medium
                  text-[#514840]
                  transition-colors
                  hover:bg-[#f1e9df]
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  inline-flex items-center gap-2
                  rounded-lg
                  bg-[#1f2020]
                  px-4 py-2
                  text-xs font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#302f2d]
                "
              >
                <Save size={14} />
                {isEdit ? 'Save Changes' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TeacherClassesFormPage;