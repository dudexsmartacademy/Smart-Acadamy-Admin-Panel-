import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  X,
} from 'lucide-react';

import { useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  hackerRankChallenges,
  hackerRankResults,
  hackerRankTeachers,
} from '../../data/teacherHackerrankDemo';

export default function TeacherHackerrankStudentResultPage() {
  const navigate = useNavigate();

  const {
    teacherId,
    challengeId,
    resultId,
  } = useParams<{
    teacherId: string;
    challengeId: string;
    resultId: string;
  }>();

  const teacher = hackerRankTeachers.find(
    (item) => item.id === teacherId
  );

  const challenge = hackerRankChallenges.find(
    (item) =>
      item.id === challengeId &&
      item.teacherId === teacherId
  );

  const result = hackerRankResults.find(
    (item) =>
      item.id === resultId &&
      item.teacherId === teacherId &&
      item.challengeId === challengeId
  );

  const [remarks, setRemarks] = useState(
    result?.facultyRemarks || ''
  );

  if (!teacher || !challenge || !result) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-10 text-center">
          Result not found.
        </div>
      </div>
    );
  }

  const saveRemarks = () => {
    result.facultyRemarks = remarks;
  };

  return (
    <div className="min-h-full bg-[#f7f7f4] p-6">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/hackerrank/${teacher.id}/results/${challenge.id}`
            )
          }
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </button>

        {/* RESULT CARD */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-slate-200 p-5">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-slate-100 p-2">
                <FileText className="h-5 w-5 text-slate-600" />
              </div>

              <div>
                <h1 className="text-sm font-bold text-slate-900">
                  {result.studentName} — {challenge.title}
                </h1>

                <p className="mt-1 text-[10px] text-slate-400">
                  Registration: {result.registerNumber} ·{' '}
                  {result.className}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/teachers/hackerrank/${teacher.id}/results/${challenge.id}`
                )
              }
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>

          </div>

          {/* SCORE SUMMARY */}

          <div className="grid gap-3 p-5 sm:grid-cols-4">

            <InfoCard
              label="Assessment"
              value={challenge.title}
            />

            <InfoCard
              label="Submitted At"
              value={result.submittedAt}
            />

            <InfoCard
              label="Student Score"
              value={`${result.score} / ${result.totalMarks}`}
            />

            <InfoCard
              label="Obtained %"
              value={`${result.percentage.toFixed(1)}% (${result.grade})`}
            />

          </div>

          {/* UPLOADED RESULT */}

          <div className="mx-5 overflow-hidden rounded-lg border border-slate-300 bg-[#080d1d]">

            <div className="flex items-center justify-between border-b border-slate-600 px-4 py-2">

              <span className="text-[10px] font-bold text-white">
                STUDENT UPLOADED RESULT SCREENSHOT & VERIFIED SCORECARD
              </span>

              <button
                type="button"
                className="rounded bg-slate-700 px-3 py-1 text-[10px] font-semibold text-white"
              >
                Full Screen
              </button>

            </div>

            <div className="flex h-48 items-center justify-center px-6">

              <div className="w-full max-w-md rounded-full border border-slate-400 px-5 py-2 text-center text-xs text-white">
                {result.studentName} Result Scorecard
              </div>

            </div>

            <div className="flex items-center justify-between border-t border-slate-600 px-4 py-2 text-[10px]">

              <span className="text-slate-300">
                ✓ Uploaded on {result.submittedAt}
              </span>

              <span className="font-semibold text-emerald-400">
                Status: Self-Submitted & Verified
              </span>

            </div>

          </div>

          {/* STUDENT REMARKS */}

          <div className="mx-5 mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">

            <p className="text-xs font-semibold text-amber-900">
              Student Remarks / Submission Memo:
            </p>

            <p className="mt-2 text-xs text-amber-800">
              {result.studentRemarks ||
                'Completed the assessment and submitted the result screenshot.'}
            </p>

          </div>

          {/* FACULTY REMARKS */}

          <div className="m-5 rounded-lg border border-slate-200 p-4">

            <label className="text-xs font-bold text-slate-600">
              FACULTY VERIFICATION & REMARKS
            </label>

            <textarea
              value={remarks}
              onChange={(event) =>
                setRemarks(event.target.value)
              }
              rows={4}
              placeholder="Enter remarks or verified comments for this student's result..."
              className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
            />

            <div className="mt-3 flex items-center justify-between">

              <p className="text-[10px] text-slate-400">
                Result verified against student test submission log.
              </p>

              <button
                type="button"
                onClick={saveRemarks}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                <Save className="h-3.5 w-3.5" />
                Save Remarks
              </button>

            </div>

          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4">

            <button
              type="button"
              className="text-xs font-medium text-slate-500"
            >
              View Full Academic Profile & All Test History ↗
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/teachers/hackerrank/${teacher.id}/results/${challenge.id}`
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
            >
              Close
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">

      <p className="text-[9px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-700">
        {value}
      </p>

    </div>
  );
}