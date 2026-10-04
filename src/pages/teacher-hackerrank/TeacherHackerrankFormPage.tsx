import {
  ArrowLeft,
  CalendarDays,
  Code2,
  Clock3,
  FileText,
  Link2,
  Save,
} from 'lucide-react';

import { FormEvent, useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  addHackerRankChallenge,
  hackerRankChallenges,
  hackerRankTeachers,
  updateHackerRankChallenge,
} from '../../data/teacherHackerrankDemo';

export default function TeacherHackerrankFormPage() {
  const navigate = useNavigate();

  const {
    teacherId,
    challengeId,
  } = useParams<{
    teacherId: string;
    challengeId?: string;
  }>();

  const teacher = hackerRankTeachers.find(
    (item) => item.id === teacherId
  );

  const editingChallenge = hackerRankChallenges.find(
    (challenge) =>
      challenge.id === challengeId &&
      challenge.teacherId === teacherId
  );

  const isEdit = Boolean(editingChallenge);

  const [title, setTitle] = useState(
    editingChallenge?.title || ''
  );

  const [format, setFormat] = useState<
    'Coding' | 'MCQ' | 'Coding + MCQ'
  >(
    editingChallenge?.type || 'Coding'
  );

  const [date, setDate] = useState(
    editingChallenge?.assessmentDate || '2026-10-01'
  );

  const [startTime, setStartTime] = useState(
    editingChallenge?.startTime || '10:00 AM'
  );

  const [duration, setDuration] = useState(
    String(editingChallenge?.duration || 60)
  );

  const [batch, setBatch] = useState(
    editingChallenge?.targetBatch || 'All Batches'
  );

  const [url, setUrl] = useState(
    editingChallenge?.assessmentUrl ||
      'https://www.hackerrank.com/dudexai-coding-challenge-2'
  );

  const [description, setDescription] = useState(
    editingChallenge?.description || ''
  );

  if (!teacher) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-10 text-center">
          Teacher not found.
        </div>
      </div>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('Challenge title is required.');
      return;
    }

    if (isEdit && editingChallenge) {
      updateHackerRankChallenge(
        editingChallenge.id,
        {
          title,
          type: format,
          assessmentDate: date,
          startTime,
          duration: Number(duration),
          targetBatch: batch,
          assessmentUrl: url,
          description,
        }
      );
    } else {
      const nextNumber =
        hackerRankChallenges.length + 1;

      addHackerRankChallenge({
        id: `HR-${String(nextNumber).padStart(3, '0')}`,
        teacherId: teacher.id,
        title,
        type: format,
        subject:
          format === 'MCQ'
            ? 'General Programming'
            : 'Programming',
        difficulty: 'Medium',
        questions:
          format === 'MCQ' ? 20 : 5,
        duration: Number(duration),
        totalMarks: 30,
        status: 'Published',
        createdAt: new Date()
          .toISOString()
          .slice(0, 10),

        assessmentDate: date,
        startTime,
        targetBatch: batch,
        assessmentUrl: url,
        description,
      });
    }

    navigate(
      `/admin/teachers/hackerrank/${teacher.id}`
    );
  };

  return (
    <div className="min-h-full bg-[#f7f7f4] p-6">

      <div className="mx-auto max-w-4xl">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/hackerrank/${teacher.id}`
            )
          }
          className="mb-5 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to HackerRank
        </button>

        {/* TEACHER */}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
              {teacher.name
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div>
              <p className="text-xs font-semibold text-teal-600">
                Teacher HackerRank
              </p>

              <h1 className="text-lg font-bold text-slate-900">
                {teacher.name}
              </h1>

              <p className="text-xs text-slate-500">
                {teacher.designation} · {teacher.department}
              </p>
            </div>

          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={submit}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >

          {/* HEADER */}

          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-slate-900 p-2 text-white">
                <Code2 className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isEdit
                    ? 'Edit HackerRank Challenge'
                    : 'Create New HackerRank Challenge'}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter details, schedule and provide the HackerRank link.
                </p>
              </div>

            </div>

          </div>

          <div className="space-y-6 p-6">

            {/* TITLE */}

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Challenge Title *
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. DudeXAI Coding Challenge 2"
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-teal-500"
              />
            </div>

            {/* FORMAT */}

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Assessment Format
              </label>

              <div className="grid grid-cols-3 gap-3">

                {(
                  [
                    'Coding',
                    'MCQ',
                    'Coding + MCQ',
                  ] as const
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setFormat(item)
                    }
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                      format === item
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>

            {/* DATE / TIME */}

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Assessment Date *
                </label>

                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                  Start Time *
                </label>

                <div className="relative">
                  <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={startTime}
                    onChange={(event) =>
                      setStartTime(event.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm"
                  />
                </div>
              </div>

            </div>

            {/* DURATION */}

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Total Duration *
              </label>

              <div className="flex flex-wrap gap-2">

                {['30', '45', '60', '90', '120'].map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setDuration(value)
                      }
                      className={`rounded-md border px-4 py-2 text-xs font-semibold ${
                        duration === value
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {value} Mins
                    </button>
                  )
                )}

                <input
                  type="number"
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value)
                  }
                  className="w-24 rounded-md border border-slate-200 px-3 text-sm"
                />

              </div>
            </div>

            {/* BATCH */}

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                Target Batches
              </label>

              <select
                value={batch}
                onChange={(event) =>
                  setBatch(event.target.value)
                }
                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm"
              >
                <option>All Batches</option>
                <option>Batch 1</option>
                <option>Batch 2</option>
                <option>Batch 3</option>
              </select>
            </div>

            {/* URL */}

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-slate-600">
                HackerRank / Assessment URL Link *
              </label>

              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={url}
                  onChange={(event) =>
                    setUrl(event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm"
                />
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Students will be redirected to this test URL when
                they click "Open Challenge".
              </p>
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                <FileText className="h-3.5 w-3.5" />
                Description / Instructions
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                rows={4}
                placeholder="Provide test instructions, problem topics, or passing requirements..."
                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-teal-500"
              />
            </div>

          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 p-5">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/teachers/hackerrank/${teacher.id}`
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Save className="h-4 w-4" />
              {isEdit
                ? 'Save Changes'
                : 'Create & Display'}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}