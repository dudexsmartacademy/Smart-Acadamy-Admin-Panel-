import React from 'react';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  getTeacherNotesDemo,
  teacherNotesDemo,
} from '../../data/teacherNotesDemo';

interface Teacher {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
}

const teachers: Teacher[] = [
  {
    id: 'TCH-2024-001',
    name: 'Dr. Marcus Holloway',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    email: 'm.holloway@dudex.academy',
  },
  {
    id: 'TCH-2024-002',
    name: 'Prof. Elena Rostova',
    designation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',
    email: 'e.rostova@dudex.academy',
  },
  {
    id: 'TCH-2024-003',
    name: 'Dr. Tariq Al-Mansoor',
    designation: 'Associate Professor',
    department: 'Information Technology',
    email: 't.almansoor@dudex.academy',
  },
];

const TeacherNotesPage: React.FC = () => {
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name
      .replace(/^Dr\. |^Prof\. /, '')
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const handleDelete = (noteId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) return;

    console.log('Delete note:', noteId);

    /*
      Demo data is static.
      Connect this handler to your backend/service
      when persistence is added.
    */
  };

  return (
    <div className="min-h-full bg-[#151515] px-6 py-6 text-[#171717]">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#946246]">
          Teacher Management
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#F5F0EA]">
          Teacher Notes
        </h1>

        <p className="mt-1 text-sm text-[#A89A91]">
          Select a faculty member to manage their uploaded notes.
        </p>
      </div>

      {/* TEACHER CARDS */}
      <div className="grid gap-5 xl:grid-cols-3">

        {teachers.map((teacher) => {
          const notes = getTeacherNotesDemo(teacher.id);

          return (
            <div
              key={teacher.id}
              className="rounded-xl border border-[#4A3428] bg-[#1C1917] p-5 shadow-sm transition hover:border-[#7A4930]"
            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#7A4930] bg-[#F1E5D8] text-sm font-bold text-[#7A4930]">
                    {getInitials(teacher.name)}
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#F5F0EA]">
                      {teacher.name}
                    </h2>

                    <p className="mt-1 text-xs text-[#A89A91]">
                      {teacher.designation}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/teachers/notes/${teacher.id}`
                    )
                  }
                  className="rounded-lg bg-[#5A321F] p-2 text-[#F1E5D8] transition hover:bg-[#7A4930]"
                  title="View Notes"
                >
                  <Eye size={16} />
                </button>

              </div>

              <div className="mt-5 border-t border-[#3A2922] pt-4">

                <span className="inline-flex rounded-full bg-[#2A1710] px-3 py-1 text-xs font-medium text-[#D8B59C]">
                  {teacher.department}
                </span>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#756E67]">
                      Faculty ID
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#F5F0EA]">
                      {teacher.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#756E67]">
                      Total Notes
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#F5F0EA]">
                      {notes.length}
                    </p>
                  </div>

                </div>

              </div>

              <div className="mt-5 border-t border-[#3A2922] pt-4">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin/teachers/notes/${teacher.id}`
                    )
                  }
                  className="text-sm font-medium text-[#C07A4D] hover:text-[#D89A70]"
                >
                  View Notes →
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default TeacherNotesPage;