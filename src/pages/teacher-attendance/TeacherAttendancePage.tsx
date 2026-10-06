import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  ChevronRight,
  Clock,
  GraduationCap,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { teacherService } from '../../services/teacherService';
import { getTeacherAttendanceDemo } from '../../data/teacherAttendanceDemo';
import { Teacher } from '../../types';

export const TeacherAttendancePage: React.FC = () => {

  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await teacherService.getTeachers();
      setTeachers(data.slice(0, 3));
    };
    load();
  }, []);


  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ================================================================ */}
      {/* PAGE HEADER                                                      */}
      {/* ================================================================ */}

      <PageHeader
        title="Teacher Attendance"
        description="Select a faculty member to view their 90-day attendance and course tracker."
        breadcrumbs={[
          {
            label: 'Teacher Management',
            path: '/admin/teachers',
          },
          {
            label: 'Teacher Attendance',
          },
        ]}
      />


      {/* ================================================================ */}
      {/* FACULTY SECTION                                                  */}
      {/* ================================================================ */}

      <div>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-[#F5F5F5]">
            Faculty Attendance Profiles
          </h2>

          <p className="text-sm text-[#A1A1AA] mt-1">
            Select a teacher to view their complete attendance history.
          </p>

        </div>


        {teachers.length === 0 ? (

          <Card className="p-10 text-center">

            <CalendarCheck
              className="
                w-10 h-10
                mx-auto
                text-[#8B4A2B]
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-[#A1A1AA]
              "
            >
              No teacher records are available.
            </p>

          </Card>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >

            {teachers.map((teacher) => (

              <TeacherAttendanceCard
                key={teacher.id}
                teacher={teacher}
                onClick={() =>
                  navigate(
                    `/admin/teachers/attendance/${teacher.id}`
                  )
                }
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
};


/* ========================================================================= */
/* TEACHER ATTENDANCE CARD                                                   */
/* ========================================================================= */

interface TeacherAttendanceCardProps {
  teacher: Teacher;
  onClick: () => void;
}


const TeacherAttendanceCard: React.FC<
  TeacherAttendanceCardProps
> = ({
  teacher,
  onClick,
}) => {

  /*
   * IMPORTANT:
   *
   * Attendance rate comes from the shared data.
   */
  const attendance =
    getTeacherAttendanceDemo(
      teacher.id
    );


  return (
    <Card
      onClick={onClick}
      hoverable
      className="
        group
        p-6
        cursor-pointer
        !bg-[#1C1A19]
        !border-[#4A3024]
        hover:!border-[#8B4A2B]
      "
    >

      {/* ================================================================ */}
      {/* TOP                                                               */}
      {/* ================================================================ */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <Avatar
          src={teacher.avatar}
          name={teacher.fullName}
          size="xl"
        />


        <div
          className="
            w-9 h-9
            rounded-lg
            bg-[#3A2418]
            border border-[#5A321F]
            flex
            items-center
            justify-center
            group-hover:bg-[#5A321F]
            transition-colors
          "
        >
          <ChevronRight
            className="
              w-5 h-5
              text-[#D78B55]
            "
          />
        </div>

      </div>


      {/* ================================================================ */}
      {/* TEACHER                                                           */}
      {/* ================================================================ */}

      <div className="mt-5">

        <h3
          className="
            text-lg
            font-bold
            text-[#F5F5F5]
          "
        >
          {teacher.fullName}
        </h3>


        <p
          className="
            text-sm
            text-[#A1A1AA]
            mt-1
          "
        >
          {teacher.designation}
        </p>


        <div className="mt-3">

          <StatusBadge
            status={teacher.status}
            size="sm"
          />

        </div>

      </div>


      {/* ================================================================ */}
      {/* INFORMATION                                                       */}
      {/* ================================================================ */}

      <div
        className="
          mt-5
          pt-5
          border-t
          border-[#3A302B]
          space-y-3
        "
      >

        {/* Faculty ID */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-8 h-8
              rounded-lg
              bg-[#2A1A14]
              flex
              items-center
              justify-center
            "
          >
            <ShieldCheck
              className="
                w-4 h-4
                text-[#D78B55]
              "
            />
          </div>


          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-wide
                text-[#8F8F96]
              "
            >
              Faculty ID
            </p>

            <p
              className="
                text-xs
                font-semibold
                text-[#F5F5F5]
              "
            >
              {attendance.teacherId}
            </p>

          </div>

        </div>


        {/* Department */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-8 h-8
              rounded-lg
              bg-[#2A1A14]
              flex
              items-center
              justify-center
            "
          >
            <GraduationCap
              className="
                w-4 h-4
                text-[#D78B55]
              "
            />
          </div>


          <div className="min-w-0">

            <p
              className="
                text-[10px]
                uppercase
                tracking-wide
                text-[#8F8F96]
              "
            >
              Department
            </p>

            <p
              className="
                text-xs
                font-semibold
                text-[#F5F5F5]
                truncate
              "
            >
              {teacher.department}
            </p>

          </div>

        </div>


        {/* Email */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-8 h-8
              rounded-lg
              bg-[#2A1A14]
              flex
              items-center
              justify-center
            "
          >
            <Mail
              className="
                w-4 h-4
                text-[#D78B55]
              "
            />
          </div>


          <div className="min-w-0">

            <p
              className="
                text-[10px]
                uppercase
                tracking-wide
                text-[#8F8F96]
              "
            >
              Email
            </p>

            <p
              className="
                text-xs
                text-[#D4D4D8]
                truncate
              "
            >
              {teacher.email}
            </p>

          </div>

        </div>


        {/* Attendance Rate */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-8 h-8
              rounded-lg
              bg-[#2A1A14]
              flex
              items-center
              justify-center
            "
          >
            <Clock
              className="
                w-4 h-4
                text-[#D78B55]
              "
            />
          </div>


          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-wide
                text-[#8F8F96]
              "
            >
              Attendance Rate
            </p>

            <p
              className="
                text-xs
                font-semibold
                text-[#F5F5F5]
              "
            >
              {attendance.attendanceRate}%
            </p>

          </div>

        </div>

      </div>


      {/* ================================================================ */}
      {/* FOOTER                                                            */}
      {/* ================================================================ */}

      <div
        className="
          mt-5
          pt-4
          border-t
          border-[#3A302B]
          flex
          items-center
          justify-between
        "
      >

        <span
          className="
            text-xs
            font-semibold
            text-[#D78B55]
          "
        >
          View Attendance
        </span>


        <span
          className="
            text-xs
            text-[#8F8F96]
          "
        >
          90 Days
        </span>

      </div>

    </Card>
  );
};