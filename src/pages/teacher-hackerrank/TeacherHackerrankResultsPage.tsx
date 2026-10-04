import {
  ArrowLeft,
  Eye,
  Search,
  Users,
  CheckCircle2,
  Clock3,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { useMemo, useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  hackerRankChallenges,
  hackerRankResults,
  hackerRankTeachers,
} from '../../data/teacherHackerrankDemo';

export default function TeacherHackerrankResultsPage() {
  const navigate = useNavigate();

  const {
    teacherId,
    challengeId,
  } = useParams<{
    teacherId: string;
    challengeId: string;
  }>();

  const teacher = hackerRankTeachers.find(
    (item) => item.id === teacherId
  );

  const challenge = hackerRankChallenges.find(
    (item) =>
      item.id === challengeId &&
      item.teacherId === teacherId
  );

  const [search, setSearch] = useState('');
  const [batch, setBatch] = useState('All Batches');

  if (!teacher || !challenge) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-10 text-center">
          Result information not found.
        </div>
      </div>
    );
  }

  const results = hackerRankResults.filter(
    (result) =>
      result.teacherId === teacher.id &&
      result.challengeId === challenge.id
  );

  const filteredResults = useMemo(() => {
    const query = search.toLowerCase().trim();

    return results.filter((result) => {
      const matchesSearch =
        !query ||
        result.studentName
          .toLowerCase()
          .includes(query) ||
        result.registerNumber
          .toLowerCase()
          .includes(query);

      const matchesBatch =
        batch === 'All Batches' ||
        result.batch === batch;

      return matchesSearch && matchesBatch;
    });
  }, [results, search, batch]);

  const submitted = results.filter(
    (result) =>
      result.status === 'Submitted' ||
      result.status === 'Completed'
  ).length;

  const attempted = results.length;

  const average =
    results.length > 0
      ? results.reduce(
          (sum, result) =>
            sum + result.percentage,
          0
        ) / results.length
      : 0;

  const highest =
    results.length > 0
      ? Math.max(
          ...results.map(
            (result) => result.percentage
          )
        )
      : 0;

  const lowest =
    results.length > 0
      ? Math.min(
          ...results.map(
            (result) => result.percentage
          )
        )
      : 0;

  const passPercentage =
    results.length > 0
      ? (results.filter(
          (result) => result.percentage >= 40
        ).length /
          results.length) *
        100
      : 0;

  return (
    <div className="min-h-full bg-[#f7f7f4] p-6">

      <div className="mx-auto max-w-7xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/hackerrank/${teacher.id}`
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Challenges
        </button>

        {/* TITLE */}

        <div className="mb-5 flex items-start justify-between">

          <div>
            <p className="text-xs text-slate-400">
              Viewing submissions for:
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Results
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {challenge.title}
            </p>

            <p className="mt-1 text-xs text-teal-700">
              {teacher.name}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setBatch('All Batches');
            }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500"
          >
            Clear Assessment Filter
          </button>

        </div>

        {/* TOP STATS */}

        <div className="grid gap-4 md:grid-cols-4">

          <ResultStat
            label="Number Assigned"
            value={results.length + 2}
            icon={<Users className="h-4 w-4" />}
          />

          <ResultStat
            label="Number Attempted"
            value={attempted}
            icon={<Clock3 className="h-4 w-4" />}
          />

          <ResultStat
            label="Number Submitted"
            value={submitted}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />

          <ResultStat
            label="Average"
            value={`${average.toFixed(2)}%`}
            icon={<BarChart3 className="h-4 w-4" />}
          />

        </div>

        {/* SECOND STATS */}

        <div className="mt-4 grid gap-4 md:grid-cols-3">

          <ResultStat
            label="Highest"
            value={`${highest.toFixed(2)}%`}
            icon={<TrendingUp className="h-4 w-4" />}
          />

          <ResultStat
            label="Lowest"
            value={`${lowest.toFixed(2)}%`}
            icon={<TrendingDown className="h-4 w-4" />}
          />

          <ResultStat
            label="Pass Percentage"
            value={`${passPercentage.toFixed(2)}%`}
            icon={<CheckCircle2 className="h-4 w-4" />}
          />

        </div>

        {/* SEARCH / FILTER */}

        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 md:flex-row">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search student, RRN, or assessment..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-teal-500"
            />

          </div>

          <select
            value={batch}
            onChange={(event) =>
              setBatch(event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 px-4 text-sm text-slate-600"
          >
            <option>All Batches</option>
            <option>Batch 1</option>
            <option>Batch 2</option>
            <option>Batch 3</option>
          </select>

        </div>

        {/* TABLE */}

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  {[
                    'STUDENT',
                    'BATCH',
                    'ASSESSMENT',
                    'ATTEMPT',
                    'SCORE',
                    'PERCENTAGE',
                    'GRADE',
                    'SUBMITTED AT',
                    'STATUS',
                    'ACTION',
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[10px] font-bold tracking-wide text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filteredResults.map((result) => (

                  <tr
                    key={result.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-4 py-4">

                      <p className="text-xs font-bold text-slate-800">
                        {result.studentName}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {result.registerNumber} · {result.className}
                      </p>

                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        {result.batch}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-xs text-slate-600">
                      {challenge.title}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-600">
                      {result.attempt}
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold text-slate-700">
                      {result.score}/{result.totalMarks}
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-600">
                      {result.percentage.toFixed(2)}%
                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                        {result.grade}
                      </span>

                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500">
                      {result.submittedAt}
                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                        Submitted
                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/teachers/hackerrank/${teacher.id}/results/${challenge.id}/student/${result.id}`
                          )
                        }
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
}

function ResultStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-[10px] font-semibold tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
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