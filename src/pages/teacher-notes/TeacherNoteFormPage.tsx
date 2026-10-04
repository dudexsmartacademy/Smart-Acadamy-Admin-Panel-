import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Paperclip,
  Save,
  Upload,
  X,
} from 'lucide-react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getTeacherNoteDemo,
  getTeacherNotesDemo,
} from '../../data/teacherNotesDemo';

const teachers = {
  'TCH-2024-001': {
    id: 'TCH-2024-001',
    name: 'Dr. Marcus Holloway',
    designation: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
  },

  'TCH-2024-002': {
    id: 'TCH-2024-002',
    name: 'Prof. Elena Rostova',
    designation: 'Lead AI Research Instructor',
    department: 'Artificial Intelligence & Data Science',
  },

  'TCH-2024-003': {
    id: 'TCH-2024-003',
    name: 'Dr. Tariq Al-Mansoor',
    designation: 'Associate Professor',
    department: 'Information Technology',
  },
};

const TeacherNoteFormPage: React.FC = () => {
  const {
    teacherId,
    noteId,
  } = useParams();

  const navigate = useNavigate();

  const isEditMode = Boolean(noteId);

  const teacher =
    teachers[teacherId as keyof typeof teachers];

  const existingNote = useMemo(
    () =>
      noteId
        ? getTeacherNoteDemo(noteId)
        : undefined,
    [noteId]
  );

  const [noteDate, setNoteDate] = useState(
    existingNote?.noteDate || ''
  );

  const [batch, setBatch] = useState(
    existingNote?.batch || ''
  );

  const [title, setTitle] = useState(
    existingNote?.title || ''
  );

  const [subject, setSubject] = useState(
    existingNote?.subject || ''
  );

  const [topic, setTopic] = useState(
    existingNote?.topic || ''
  );

  const [description, setDescription] = useState(
    existingNote?.description || ''
  );

  const [files, setFiles] = useState<
    { name: string; size: number }[]
  >(
    existingNote?.attachments.map((file) => ({
      name: file.name,
      size: 0,
    })) || []
  );

  const teacherNotes = getTeacherNotesDemo(
    teacherId
  );

  const availableBatches =
    Array.from(
      new Set(
        teacherNotes.map(
          (note) => note.batch
        )
      )
    );

  const availableSubjects =
    Array.from(
      new Set(
        teacherNotes.map(
          (note) => note.subject
        )
      )
    );

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    setFiles((previous) => [
      ...previous,
      ...selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
      })),
    ]);

    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((previous) =>
      previous.filter(
        (_, fileIndex) => fileIndex !== index
      )
    );
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !noteDate ||
      !batch ||
      !title ||
      !subject ||
      !description
    ) {
      window.alert(
        'Please complete all required fields.'
      );

      return;
    }

    console.log(
      isEditMode
        ? 'Updating teacher note'
        : 'Creating teacher note',
      {
        teacherId,
        noteId,
        teacherName: teacher?.name,
        noteDate,
        batch,
        title,
        subject,
        topic,
        description,
        files,
      }
    );

    navigate(
      `/admin/teachers/notes/${teacherId}`
    );
  };

  if (!teacher) {
    return (
      <div className="min-h-full bg-[#151515] p-8 text-[#F5F0EA]">
        Teacher not found.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F3EC] px-6 py-6">

      {/* TOP */}
      <div className="mb-5 flex items-center justify-between">

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/notes/${teacher.id}`
            )
          }
          className="flex items-center gap-2 text-sm text-[#7A4930] hover:text-[#946246]"
        >
          <ArrowLeft size={16} />
          Back to Notes
        </button>

      </div>

      {/* PAGE TITLE */}
      <div className="mb-5">

        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#946246]">
          Teacher Notes
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-[#171717]">
          {isEditMode
            ? 'Edit Note'
            : 'Create Note'}
        </h1>

        <p className="mt-1 text-sm text-[#756E67]">
          {isEditMode
            ? 'Update the note details and attachments.'
            : 'Create a note for an authorized batch and subject.'}
        </p>

      </div>

      {/* TEACHER IDENTIFICATION */}
      <div className="mb-5 rounded-xl border border-[#D8CFC3] bg-[#EFE9E0] px-5 py-4">

        <p className="text-[10px] font-bold uppercase tracking-wide text-[#756E67]">
          Faculty
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">

          <span className="font-semibold text-[#171717]">
            {teacher.name}
          </span>

          <span className="rounded-full bg-[#F1E4D8] px-3 py-1 text-xs font-medium text-[#8B4A27]">
            {teacher.department}
          </span>

          <span className="rounded-full border border-[#D8CFC3] bg-white px-3 py-1 text-xs text-[#756E67]">
            {teacher.id}
          </span>

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-6"
      >

        {/* DATE + BATCH */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-[#49433E]">
              Note Date
            </label>

            <div className="relative">

              <CalendarDays
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756E67]"
              />

              <input
                type="date"
                value={noteDate}
                onChange={(event) =>
                  setNoteDate(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-[#D8CFC3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8B4A27] focus:ring-1 focus:ring-[#8B4A27]"
                required
              />

            </div>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-[#49433E]">
              Batch
            </label>

            <select
              value={batch}
              onChange={(event) =>
                setBatch(event.target.value)
              }
              className="w-full rounded-lg border border-[#D8CFC3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8B4A27]"
              required
            >

              <option value="">
                Select Batch
              </option>

              {availableBatches.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

              {!availableBatches.length && (
                <>
                  <option value="Batch 1">
                    Batch 1
                  </option>

                  <option value="Batch 2">
                    Batch 2
                  </option>

                  <option value="Batch 3">
                    Batch 3
                  </option>
                </>
              )}

            </select>

          </div>

        </div>

        {/* TITLE */}
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-[#49433E]">
            Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter note title"
            className="w-full rounded-lg border border-[#D8CFC3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none placeholder:text-[#9B938B] focus:border-[#8B4A27] focus:ring-1 focus:ring-[#8B4A27]"
            required
          />

        </div>

        {/* SUBJECT + TOPIC */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-[#49433E]">
              Subject
            </label>

            <select
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              className="w-full rounded-lg border border-[#D8CFC3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#8B4A27]"
              required
            >

              <option value="">
                Select Subject
              </option>

              {availableSubjects.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-[#49433E]">
              Topic
            </label>

            <input
              value={topic}
              onChange={(event) =>
                setTopic(event.target.value)
              }
              placeholder="Enter topic"
              className="w-full rounded-lg border border-[#D8CFC3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none placeholder:text-[#9B938B] focus:border-[#8B4A27] focus:ring-1 focus:ring-[#8B4A27]"
            />

          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-[#49433E]">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            placeholder="Enter note description"
            className="w-full resize-none rounded-lg border border-[#D8CFC3] bg-white px-3 py-3 text-sm text-[#171717] outline-none placeholder:text-[#9B938B] focus:border-[#8B4A27] focus:ring-1 focus:ring-[#8B4A27]"
            required
          />

        </div>

        {/* ATTACHMENTS */}
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-[#49433E]">
            Attachments
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#CBBDAF] bg-white px-6 py-10 transition hover:border-[#8B4A27] hover:bg-[#FBF8F3]">

            <Upload
              size={24}
              className="text-[#8B4A27]"
            />

            <p className="mt-3 text-sm font-medium text-[#49433E]">
              Upload PDF, documents, or images
            </p>

            <p className="mt-1 text-xs text-[#756E67]">
              Multiple PDFs, documents, or images can be attached
            </p>

            <span className="mt-4 rounded-lg border border-[#D8CFC3] bg-white px-4 py-2 text-xs font-medium text-[#49433E]">
              Choose Files
            </span>

            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFiles}
              className="hidden"
            />

          </label>

          {files.length > 0 && (
            <div className="mt-3 space-y-2">

              {files.map((file, index) => (

                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-[#D8CFC3] bg-white px-4 py-3"
                >

                  <div className="flex items-center gap-3">

                    <Paperclip
                      size={16}
                      className="text-[#8B4A27]"
                    />

                    <div>

                      <p className="text-sm font-medium text-[#171717]">
                        {file.name}
                      </p>

                      {file.size > 0 && (
                        <p className="text-xs text-[#756E67]">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      )}

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeFile(index)
                    }
                    className="rounded-md p-1.5 text-[#756E67] hover:bg-[#F7E0DC] hover:text-[#A33A2B]"
                  >
                    <X size={15} />
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3 border-t border-[#D8CFC3] pt-5">

          <button
            type="button"
            onClick={() =>
              navigate(
                `/admin/teachers/notes/${teacher.id}`
              )
            }
            className="rounded-lg border border-[#D8CFC3] bg-white px-5 py-2.5 text-sm font-medium text-[#49433E] hover:bg-[#EFE9E0]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#7A4930] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#946246]"
          >
            <Save size={15} />

            {isEditMode
              ? 'Save Changes'
              : 'Save Note'}
          </button>

        </div>

      </form>

    </div>
  );
};

export default TeacherNoteFormPage;