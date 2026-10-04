import {
  ArrowRight,
  Code2,
  Mail,
  Users,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {
  hackerRankChallenges,
  hackerRankResults,
  hackerRankTeachers,
} from '../../data/teacherHackerrankDemo';

export default function TeacherHackerrankTeachersPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#111111] p-6">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">

          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#202020] px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-[#303030]">
            <Code2 className="h-3 w-3 text-teal-400" />
            HackerRank Integration
          </div>

          <p className="text-xs text-slate-500">
            Teacher Assessment Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Teacher HackerRank
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Select a teacher to manage their HackerRank coding
            challenges, MCQ assessments and student results.
          </p>

        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL TEACHERS */}

          <div className="rounded-xl border border-[#2b2b2b] bg-[#181818] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Total Teachers
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {hackerRankTeachers.length}
                </p>

              </div>

              <div className="rounded-lg bg-teal-950/60 p-3 text-teal-400">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* TOTAL CHALLENGES */}

          <div className="rounded-xl border border-[#2b2b2b] bg-[#181818] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Total Challenges
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {hackerRankChallenges.length}
                </p>

              </div>

              <div className="rounded-lg bg-blue-950/60 p-3 text-blue-400">
                <Code2 className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* STUDENT RESULTS */}

          <div className="rounded-xl border border-[#2b2b2b] bg-[#181818] p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Student Results
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {hackerRankResults.length}
                </p>

              </div>

              <div className="rounded-lg bg-emerald-950/60 p-3 text-emerald-400">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            TEACHER LIST HEADER
        ===================================================== */}

        <div className="mb-3">

          <h2 className="text-sm font-bold text-white">
            Select Teacher
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Click a teacher to open their HackerRank assessment workspace.
          </p>

        </div>

        {/* =====================================================
            TEACHER CARDS
        ===================================================== */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {hackerRankTeachers.map((teacher) => {

            const teacherChallenges =
              hackerRankChallenges.filter(
                (challenge) =>
                  challenge.teacherId === teacher.id
              );

            const teacherResults =
              hackerRankResults.filter(
                (result) =>
                  result.teacherId === teacher.id
              );

            const publishedChallenges =
              teacherChallenges.filter(
                (challenge) =>
                  challenge.status === 'Published'
              ).length;

            return (
              <button
                key={teacher.id}
                type="button"
                onClick={() =>
                  navigate(
                    `/admin/teachers/hackerrank/${teacher.id}`
                  )
                }
                className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg"
              >

                {/* =================================================
                    TEACHER HEADER
                ================================================= */}

                <div className="flex items-start justify-between">

                  <div className="flex items-start gap-3">

                    {/* AVATAR */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                      {teacher.name
                        .split(' ')
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    {/* TEACHER DETAILS */}

                    <div>

                      <p className="text-sm font-bold text-slate-900">
                        {teacher.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {teacher.designation}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {teacher.department}
                      </p>

                    </div>

                  </div>

                  {/* ARROW */}

                  <div className="rounded-lg p-2 text-slate-300 transition group-hover:bg-teal-50 group-hover:text-teal-600">
                    <ArrowRight className="h-4 w-4" />
                  </div>

                </div>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                  <span className="truncate text-xs text-slate-500">
                    {teacher.email}
                  </span>

                </div>

                {/* =================================================
                    STATS
                ================================================= */}

                <div className="mt-4 grid grid-cols-3 gap-2">

                  {/* CHALLENGES */}

                  <div className="rounded-lg bg-slate-50 p-3">

                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Challenges
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {teacherChallenges.length}
                    </p>

                  </div>

                  {/* PUBLISHED */}

                  <div className="rounded-lg bg-slate-50 p-3">

                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Published
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {publishedChallenges}
                    </p>

                  </div>

                  {/* RESULTS */}

                  <div className="rounded-lg bg-slate-50 p-3">

                    <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                      Results
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {teacherResults.length}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    ACTION
                ================================================= */}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-[10px] text-slate-400">
                    Teacher ID: {teacher.id}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                    Open HackerRank

                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>

                </div>

              </button>
            );
          })}

        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {hackerRankTeachers.length === 0 && (
          <div className="rounded-xl border border-[#2b2b2b] bg-[#181818] p-12 text-center">

            <Users className="mx-auto h-8 w-8 text-slate-600" />

            <p className="mt-3 text-sm font-semibold text-white">
              No teachers available
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No teachers are currently configured for HackerRank.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}