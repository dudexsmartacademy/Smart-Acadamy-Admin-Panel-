import React from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  FileText,
  Paperclip,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  getTeacherNoteDemo,
} from '../../data/teacherNotesDemo';

const TeacherNoteViewPage: React.FC = () => {
  const { teacherId, noteId } = useParams();
  const navigate = useNavigate();

  const note = noteId
    ? getTeacherNoteDemo(noteId)
    : undefined;

  if (!note || note.teacherId !== teacherId) {
    return (
      <div className="min-h-full bg-[#151515] p-8 text-[#F5F0EA]">
        <h1 className="text-xl font-semibold">
          Note not found
        </h1>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/notes/${teacherId}`
            )
          }
          className="mt-4 text-[#C07A4D]"
        >
          Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#151515] px-6 py-6">

      <button
        type="button"
        onClick={() =>
          navigate(
            `/admin/teachers/notes/${teacherId}`
          )
        }
        className="mb-5 flex items-center gap-2 text-sm text-[#C07A4D] hover:text-[#D89A70]"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#F5F0EA]">
            {note.title}
          </h1>

          <div className="mt-2 flex items-center gap-2">

            <span className="text-sm text-[#A89A91]">
              {note.batch}
            </span>

            <span className="text-[#5A493E]">
              •
            </span>

            <span className="text-sm text-[#A89A91]">
              {note.subject}
            </span>

            <span
              className={
                note.status === 'Published'
                  ? 'rounded-full bg-[#DCEFE3] px-3 py-1 text-xs font-medium text-[#26734D]'
                  : 'rounded-full bg-[#F7E9B7] px-3 py-1 text-xs font-medium text-[#8A6812]'
              }
            >
              {note.status}
            </span>

          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/admin/teachers/notes/${teacherId}/edit/${note.id}`
            )
          }
          className="flex items-center gap-2 rounded-lg border border-[#7A4930] bg-[#1C1917] px-4 py-2 text-sm font-medium text-[#D8B59C] hover:bg-[#2A1710]"
        >
          <Edit3 size={15} />
          Edit Note
        </button>

      </div>

      {/* CONTENT */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_280px]">

        {/* LEFT */}
        <div className="space-y-5">

          <section className="rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-6">

            <h2 className="text-lg font-semibold text-[#171717]">
              Note Information
            </h2>

            <div className="my-5 h-px bg-[#D8CFC3]" />

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={15}
                    className="text-[#8B4A27]"
                  />

                  <p className="text-xs text-[#756E67]">
                    Note Date
                  </p>
                </div>

                <p className="mt-1 text-sm font-medium text-[#171717]">
                  {note.noteDate}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <FileText
                    size={15}
                    className="text-[#8B4A27]"
                  />

                  <p className="text-xs text-[#756E67]">
                    Subject / Topic
                  </p>
                </div>

                <p className="mt-1 text-sm font-medium text-[#171717]">
                  {note.subject} · {note.topic}
                </p>
              </div>

            </div>

            <div className="my-5 h-px bg-[#D8CFC3]" />

            <p className="text-xs text-[#756E67]">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-[#49433E]">
              {note.description}
            </p>

          </section>

          {/* ATTACHMENTS */}
          <section className="rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-6">

            <h2 className="text-lg font-semibold text-[#171717]">
              Attachments
            </h2>

            <div className="mt-4 space-y-3">

              {note.attachments.map((attachment) => (

                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-lg border border-[#D8CFC3] bg-white px-4 py-3"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F1E4D8] text-[#8B4A27]">
                      <Paperclip size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#171717]">
                        {attachment.name}
                      </p>

                      <p className="text-xs text-[#756E67]">
                        {attachment.type}
                        {attachment.size
                          ? ` · ${attachment.size}`
                          : ''}
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="rounded-lg border border-[#D8CFC3] px-3 py-1.5 text-xs font-medium text-[#7A4930] hover:bg-[#F1E4D8]"
                  >
                    View
                  </button>

                </div>

              ))}

            </div>

          </section>

        </div>

        {/* RIGHT */}
        <aside className="h-fit rounded-xl border border-[#D8CFC3] bg-[#F7F3EC] p-5">

          <h2 className="text-lg font-semibold text-[#171717]">
            Note Details
          </h2>

          <div className="mt-5 space-y-5">

            <div>
              <p className="text-xs text-[#756E67]">
                Teacher
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.teacherName}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#756E67]">
                Department
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.department}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#756E67]">
                Batch
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.batch}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#756E67]">
                Subject / Topic
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.subject}
              </p>

              <p className="mt-1 text-xs text-[#756E67]">
                {note.topic}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#756E67]">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.createdAt}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#756E67]">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium text-[#171717]">
                {note.updatedAt}
              </p>
            </div>

          </div>

        </aside>

      </div>

    </div>
  );
};

export default TeacherNoteViewPage;