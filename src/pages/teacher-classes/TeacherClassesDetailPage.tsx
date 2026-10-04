import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Edit,
  ExternalLink,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getClassesByTeacherId,
  getTeacherById,
} from '../../data/teacherClassesDemo';

const TeacherClassesDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams<{ teacherId: string }>();

  const teacher = teacherId
    ? getTeacherById(teacherId)
    : undefined;

  const classes = useMemo(
    () =>
      teacherId
        ? getClassesByTeacherId(teacherId)
        : [],
    [teacherId]
  );

  const [search, setSearch] = useState('');

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#171717] p-8 text-[#F7F3EC]">
        Teacher not found.
      </div>
    );
  }

  const filteredClasses = classes.filter((item) =>
    `${item.title} ${item.subject} ${item.batch}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = classes.filter(
    (item) => item.status === 'Active'
  ).length;

  const upcomingCount = classes.filter(
    (item) => item.status === 'Upcoming'
  ).length;

  const completedCount = classes.filter(
    (item) => item.status === 'Completed'
  ).length;

  const handleDelete = (classId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this class?'
    );

    if (!confirmed) return;

    console.log('Delete class:', classId);

    // Connect this to your service/backend later.
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#F7F3EC]">

      <main className="p-6">

        {/* Back */}
        <button
          onClick={() => navigate('/admin/teachers/classes')}
          className="mb-5 flex items-center gap-2 text-sm text-[#A9A098] hover:text-[#F7F3EC]"
        >
          <ArrowLeft size={16} />
          Back to Teachers
        </button>

        {/* Teacher header */}
        <div className="mb-6 rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-6 text-[#171717]">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B66A3C] bg-[#EFE1D2] font-semibold text-[#6E351D]">
                {teacher.name
                  .split(' ')
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join('')}
              </div>

              <div>
                <h1 className="text-2xl font-semibold">
                  {teacher.name}
                </h1>

                <p className="mt-1 text-sm text-[#756E67]">
                  {teacher.designation}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <span className="rounded-full bg-[#E9DDD0] px-3 py-1 text-xs text-[#71391F]">
                    {teacher.department}
                  </span>

                  <span className="rounded-full border border-[#CFC2B4] px-3 py-1 text-xs text-[#5F574F]">
                    {teacher.facultyId}
                  </span>

                </div>
              </div>

            </div>

            <div className="text-right">
              <p className="text-xs text-[#81776F]">
                Total Classes
              </p>

              <p className="text-3xl font-semibold">
                {classes.length}
              </p>
            </div>

          </div>

        </div>

        {/* Page heading */}
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h2 className="text-xl font-semibold">
              Live Classes
            </h2>

            <p className="mt-1 text-sm text-[#A9A098]">
              Classes created by {teacher.name}.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                `/admin/teachers/classes/${teacher.id}/create`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#6E351D] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#8B4A28]"
          >
            <Plus size={16} />
            Create Class
          </button>

        </div>

        {/* Statistics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">

          <div className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-5">
            <p className="text-xs uppercase tracking-wide text-[#81776F]">
              Active Classes
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-5">
            <p className="text-xs uppercase tracking-wide text-[#81776F]">
              Upcoming
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {upcomingCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-5">
            <p className="text-xs uppercase tracking-wide text-[#81776F]">
              Completed
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {completedCount}
            </p>
          </div>

          <div className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-5">
            <p className="text-xs uppercase tracking-wide text-[#81776F]">
              Total Classes
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {classes.length}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="mb-5 rounded-xl border border-[#4A3326] bg-[#211E1C] p-4">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="w-full max-w-xl rounded-lg border border-[#574033] bg-[#171717] px-4 py-2.5 text-sm text-[#F7F3EC] outline-none placeholder:text-[#71665E] focus:border-[#8B4A28]"
          />

        </div>

        {/* Classes */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {filteredClasses.map((item) => (

            <div
              key={item.id}
              className="rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-5 text-[#171717]"
            >

              {/* Header */}
              <div className="flex items-start justify-between">

                <div>
                  <div className="flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFE1D2] text-[#6E351D]">
                      <Video size={17} />
                    </div>

                    <h3 className="font-semibold">
                      {item.title}
                    </h3>

                  </div>

                  <p className="mt-2 text-xs text-[#756E67]">
                    {item.subject} • {item.batch}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.status === 'Active'
                      ? 'bg-[#DCEFE4] text-[#28704C]'
                      : item.status === 'Upcoming'
                      ? 'bg-[#F7E9C2] text-[#8A6515]'
                      : 'bg-[#E7E5E1] text-[#625C56]'
                  }`}
                >
                  {item.status}
                </span>

              </div>

              <p className="mt-4 text-sm leading-6 text-[#756E67]">
                {item.description}
              </p>

              <div className="my-5 h-px bg-[#D8CFC3]" />

              {/* Information */}
              <div className="grid grid-cols-2 gap-4">

                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    className="text-[#8B4A28]"
                  />

                  <div>
                    <p className="text-[10px] uppercase text-[#81776F]">
                      Batch
                    </p>

                    <p className="text-sm">
                      {item.batch}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock
                    size={15}
                    className="text-[#8B4A28]"
                  />

                  <div>
                    <p className="text-[10px] uppercase text-[#81776F]">
                      Schedule
                    </p>

                    <p className="text-sm">
                      {item.schedule}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users
                    size={15}
                    className="text-[#8B4A28]"
                  />

                  <div>
                    <p className="text-[10px] uppercase text-[#81776F]">
                      Students
                    </p>

                    <p className="text-sm">
                      {item.students}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-[#81776F]">
                    Date
                  </p>

                  <p className="text-sm">
                    {item.date}
                  </p>
                </div>

              </div>

              <div className="my-5 h-px bg-[#D8CFC3]" />

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() =>
                    navigate(
                      `/admin/teachers/classes/${teacher.id}/edit/${item.id}`
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#CFC2B4] px-3 py-2 text-sm hover:bg-[#EEE7DE]"
                >
                  <Edit size={14} />
                  Edit
                </button>

                <button
                  onClick={() =>
                    window.open(item.meetLink, '_blank')
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#171717] px-3 py-2 text-sm text-white hover:bg-[#292929]"
                >
                  <ExternalLink size={14} />
                  Dashboard
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#D4AFA2] px-3 py-2 text-sm text-[#A94732] hover:bg-[#F8E9E5]"
                >
                  <Trash2 size={14} />
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

        {filteredClasses.length === 0 && (
          <div className="rounded-xl border border-[#4A3326] bg-[#211E1C] p-10 text-center">
            <p className="text-[#A9A098]">
              No classes found.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default TeacherClassesDetailPage;