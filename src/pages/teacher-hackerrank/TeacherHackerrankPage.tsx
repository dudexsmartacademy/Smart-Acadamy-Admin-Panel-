import {
  BarChart3,
  CalendarDays,
  Code2,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Users,
  Clock3,
  CheckCircle2,
  FileCode2,
  ListFilter,
} from 'lucide-react';

import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  hackerRankChallenges,
  hackerRankResults,
  hackerRankTeachers,
} from '../../data/teacherHackerrankDemo';

export default function TeacherHackerrankPage() {
  const navigate = useNavigate();

  const { teacherId } = useParams<{
    teacherId: string;
  }>();

  const teacher = hackerRankTeachers.find(
    (item) => item.id === teacherId
  );

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Formats');
  const [batchFilter, setBatchFilter] = useState('All Batches');

  if (!teacher) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Code2 className="mx-auto h-10 w-10 text-slate-400" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Teacher Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The selected teacher could not be found.
          </p>
        </div>
      </div>
    );
  }

  const teacherChallenges = hackerRankChallenges.filter(
    (challenge) => challenge.teacherId === teacher.id
  );

  const teacherResults = hackerRankResults.filter(
    (result) => result.teacherId === teacher.id
  );

  const filteredChallenges = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teacherChallenges.filter((challenge) => {
      const matchesSearch =
        !query ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.subject.toLowerCase().includes(query);

      const matchesType =
        typeFilter === 'All Formats' ||
        challenge.type === typeFilter;

      const matchesBatch =
        batchFilter === 'All Batches' ||
        challenge.targetBatch === batchFilter;

      return matchesSearch && matchesType && matchesBatch;
    });
  }, [
    teacherChallenges,
    search,
    typeFilter,
    batchFilter,
  ]);

  const codingCount = teacherChallenges.filter(
    (challenge) => challenge.type === 'Coding'
  ).length;

  const mcqCount = teacherChallenges.filter(
    (challenge) => challenge.type === 'MCQ'
  ).length;

  const activeCount = teacherChallenges.filter(
    (challenge) => challenge.status === 'Published'
  ).length;

  const batches = [
    'All Batches',
    ...Array.from(
      new Set(
        teacherChallenges.map(
          (challenge) => challenge.targetBatch
        )
      )
    ),
  ];

  const createChallenge = () => {
    navigate(
      `/admin/teachers/hackerrank/${teacher.id}/create`
    );
  };

  const editChallenge = (challengeId: string) => {
    navigate(
      `/admin/teachers/hackerrank/${teacher.id}/edit/${challengeId}`
    );
  };

  const viewResults = (challengeId: string) => {
    navigate(
      `/admin/teachers/hackerrank/${teacher.id}/results/${challengeId}`
    );
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Demo-only fallback.
    }
  };

  return (
    <div className="min-h-full bg-[#f7f7f4] p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
              <Code2 className="h-3 w-3" />
              HackerRank Integration
            </div>

            <p className="text-xs text-slate-400">
              Assessment Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              HackerRank Coding & MCQ Challenges
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, schedule, and distribute HackerRank coding
              challenges and MCQ assessments to your students.
            </p>

            <div className="mt-3 text-sm font-medium text-teal-700">
              {teacher.name}
              <span className="ml-2 text-slate-400">
                · {teacher.department}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={createChallenge}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Create New Challenge
          </button>
        </div>

        {/* STATISTICS */}

        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="TOTAL CHALLENGES"
            value={teacherChallenges.length}
            icon={<Code2 className="h-4 w-4" />}
          />

          <StatCard
            label="CODING TESTS"
            value={codingCount}
            icon={<FileCode2 className="h-4 w-4" />}
          />

          <StatCard
            label="MCQ TESTS"
            value={mcqCount}
            icon={<ListFilter className="h-4 w-4" />}
          />

          <StatCard
            label="ACTIVE / UPCOMING"
            value={activeCount}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />

        </div>

        {/* SEARCH */}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search challenges by title, format, batch..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex gap-3">

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-600 outline-none"
                >
                  <option>All Formats</option>
                  <option>Coding</option>
                  <option>MCQ</option>
                </select>
              </div>

              <select
                value={batchFilter}
                onChange={(event) =>
                  setBatchFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
              >
                {batches.map((batch) => (
                  <option key={batch}>{batch}</option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* TITLE */}

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Created Challenges & Tests ({filteredChallenges.length})
          </h2>

          <span className="text-xs text-slate-400">
            Click "Open Challenge" to launch or copy link to
            share with students
          </span>
        </div>

        {/* CHALLENGE CARDS */}

        <div className="grid gap-4 lg:grid-cols-3">

          {filteredChallenges.map((challenge) => {

            const resultCount = teacherResults.filter(
              (result) =>
                result.challengeId === challenge.id
            ).length;

            return (
              <div
                key={challenge.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >

                {/* BADGES */}

                <div className="mb-3 flex items-center justify-between">

                  <div className="flex gap-2">

                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      {challenge.type.toUpperCase()}
                    </span>

                    <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                      {challenge.targetBatch}
                    </span>

                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        editChallenge(challenge.id)
                      }
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                      title="Edit Challenge"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-100"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>

                {/* TITLE */}

                <h3 className="text-sm font-bold text-slate-900">
                  {challenge.title}
                </h3>

                <p className="mt-1 min-h-[36px] text-xs leading-5 text-slate-500">
                  {challenge.description}
                </p>

                {/* DATE */}

                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3">

                  <div>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      Date
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {challenge.assessmentDate}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock3 className="h-3 w-3" />
                      Duration
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-700">
                      {challenge.duration} Mins
                    </p>
                  </div>

                </div>

                {/* LINK */}

                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-2">

                  <span className="min-w-0 flex-1 truncate text-[10px] text-slate-400">
                    {challenge.assessmentUrl}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      copyLink(challenge.assessmentUrl)
                    }
                    className="flex shrink-0 items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>

                </div>

                {/* ACTIONS */}

                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      challenge.assessmentUrl,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Open Challenge
                  <ExternalLink className="h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    viewResults(challenge.id)
                  }
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <BarChart3 className="h-3 w-3" />
                  View Result
                  {resultCount > 0 && (
                    <span className="text-slate-400">
                      ({resultCount})
                    </span>
                  )}
                </button>

              </div>
            );
          })}

        </div>

        {filteredChallenges.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <Code2 className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-700">
              No challenges found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing the search or filter.
            </p>
          </div>
        )}

        {/* TEACHER INFORMATION */}

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
              {teacher.name
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {teacher.name}
              </p>

              <p className="text-xs text-slate-500">
                {teacher.designation} · {teacher.department}
              </p>

              <p className="text-[10px] text-slate-400">
                {teacher.email}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] font-semibold tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-teal-600">
          {icon}
        </div>

      </div>
    </div>
  );
}