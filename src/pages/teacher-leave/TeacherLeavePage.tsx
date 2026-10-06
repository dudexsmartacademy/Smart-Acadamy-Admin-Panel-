import React, { useState, useEffect } from 'react';

import {
  ChevronRight,
  Mail,
  ShieldCheck,
  GraduationCap,
  CalendarDays,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PageHeader } from '../../components/common/PageHeader';

import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';

import {
  getTeacherLeaveDemo,
} from '../../data/teacherLeaveDemo';


export const TeacherLeavePage: React.FC = () => {

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
    <div
      className="
        max-w-7xl
        mx-auto
        space-y-6
      "
    >

      {/* ================================================================ */}
      {/* HEADER                                                           */}
      {/* ================================================================ */}

      <PageHeader
        title="Teacher Leave"
        description="Select a faculty member to manage advance leave requests."
        breadcrumbs={[
          {
            label: 'Teacher Management',
            path: '/admin/teachers',
          },
          {
            label: 'Teacher Leave',
          },
        ]}
      />


      {/* ================================================================ */}
      {/* TEACHER PROFILES                                                 */}
      {/* ================================================================ */}

      <div>

        <div className="mb-4">

          <h2
            className="
              text-lg
              font-bold
              text-[#F5F5F5]
            "
          >
            Faculty Leave Profiles
          </h2>


          <p
            className="
              text-sm
              text-[#A1A1AA]
              mt-1
            "
          >
            Select a teacher to view and submit
            their leave request.
          </p>

        </div>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          {teachers.map(
            (teacher) => (

              <TeacherLeaveCard
                key={teacher.id}
                teacher={teacher}
                onClick={() =>
                  navigate(
                    `/admin/teachers/leave/${teacher.id}`
                  )
                }
              />

            )
          )}

        </div>

      </div>

    </div>
  );
};


/* ========================================================================= */
/* TEACHER LEAVE CARD                                                       */
/* ========================================================================= */

interface TeacherLeaveCardProps {
  teacher: Teacher;
  onClick: () => void;
}


const TeacherLeaveCard: React.FC<
  TeacherLeaveCardProps
> = ({
  teacher,
  onClick,
}) => {

  const leave =
    getTeacherLeaveDemo(
      teacher.id
    );


  return (

    <Card
      onClick={onClick}
      hoverable
      className="
        group
        cursor-pointer
        p-6
        !bg-[#1C1A19]
        !border-[#4A3024]
        hover:!border-[#8B4A2B]
        transition-all
      "
    >

      {/* ================================================================ */}
      {/* PROFILE HEADER                                                   */}
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
            w-9
            h-9
            rounded-lg
            bg-[#3A2418]
            border
            border-[#5A321F]
            flex
            items-center
            justify-center
            group-hover:bg-[#5A321F]
            transition-colors
          "
        >

          <ChevronRight
            className="
              w-5
              h-5
              text-[#D78B55]
            "
          />

        </div>

      </div>


      {/* ================================================================ */}
      {/* NAME                                                              */}
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
            mt-1
            text-sm
            text-[#A1A1AA]
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

        <LeaveInfoRow
          icon={
            <ShieldCheck className="w-4 h-4" />
          }
          label="Faculty ID"
          value={leave.teacherId}
        />


        {/* Department */}

        <LeaveInfoRow
          icon={
            <GraduationCap className="w-4 h-4" />
          }
          label="Department"
          value={leave.department}
        />


        {/* Email */}

        <LeaveInfoRow
          icon={
            <Mail className="w-4 h-4" />
          }
          label="Email"
          value={teacher.email}
        />


        {/* Casual Leave */}

        <LeaveInfoRow
          icon={
            <CalendarDays className="w-4 h-4" />
          }
          label="Casual Leave"
          value={`${leave.casualLeaveRemaining} Days Remaining`}
        />

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
          Manage Leave
        </span>


        <span
          className="
            text-xs
            text-[#8F8F96]
          "
        >
          Advance Leave
        </span>

      </div>

    </Card>
  );
};


/* ========================================================================= */
/* INFO ROW                                                                 */
/* ========================================================================= */

interface LeaveInfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}


const LeaveInfoRow: React.FC<
  LeaveInfoRowProps
> = ({
  icon,
  label,
  value,
}) => {

  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <div
        className="
          w-8
          h-8
          rounded-lg
          bg-[#2A1A14]
          flex
          items-center
          justify-center
          shrink-0
        "
      >

        <span className="text-[#D78B55]">
          {icon}
        </span>

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
          {label}
        </p>


        <p
          className="
            text-xs
            font-semibold
            text-[#F5F5F5]
            truncate
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
};


export default TeacherLeavePage;