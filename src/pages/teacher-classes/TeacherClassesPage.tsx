import React from 'react';
import { Eye, Users, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teacherClassTeachers } from '../../data/teacherClassesDemo';

const TeacherClassesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#171717] text-[#F7F3EC]">
      <main className="p-6">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-xs text-[#9B9187]">
          <span>Admin</span>
          <span>›</span>
          <span>Teacher Management</span>
          <span>›</span>
          <span className="text-[#F7F3EC]">
            Teacher Classes
          </span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-3xl font-semibold tracking-tight">
            Teacher Classes
          </h1>

          <p className="mt-1 text-sm text-[#A9A098]">
            Select a faculty member to view and manage their live classes.
          </p>
        </div>

        {/* Teacher cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {teacherClassTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-5 transition hover:border-[#8B4A28]"
            >

              {/* Header */}
              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B66A3C] bg-[#F2E7D9] text-sm font-semibold text-[#6E351D]">
                    {teacher.name
                      .split(' ')
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  <div>
                    <h2 className="font-semibold text-[#F7F3EC]">
                      {teacher.name}
                    </h2>

                    <p className="mt-1 text-xs text-[#A9A098]">
                      {teacher.designation}
                    </p>
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(`/admin/teachers/classes/${teacher.id}`)
                  }
                  className="rounded-lg bg-[#6E351D] p-2 text-[#F7F3EC] transition hover:bg-[#8B4A28]"
                  title="View Classes"
                >
                  <Eye size={16} />
                </button>

              </div>

              <div className="my-5 h-px bg-[#433027]" />

              {/* Department */}
              <div className="mb-5">
                <span className="inline-flex rounded-full bg-[#352219] px-3 py-1 text-xs text-[#D58A5B]">
                  {teacher.department}
                </span>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#81776F]">
                    Faculty ID
                  </p>

                  <p className="mt-1 text-sm text-[#F2EAE2]">
                    {teacher.facultyId}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-[#81776F]">
                    Total Classes
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-sm text-[#F2EAE2]">
                    <BookOpen size={14} />
                    {teacher.totalClasses}
                  </p>
                </div>

              </div>

              <div className="my-5 h-px bg-[#433027]" />

              {/* Bottom */}
              <button
                onClick={() =>
                  navigate(`/admin/teachers/classes/${teacher.id}`)
                }
                className="flex items-center gap-2 text-sm font-medium text-[#D58A5B] transition hover:text-[#F0A06A]"
              >
                <Users size={15} />
                View Classes →
              </button>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
};

export default TeacherClassesPage;