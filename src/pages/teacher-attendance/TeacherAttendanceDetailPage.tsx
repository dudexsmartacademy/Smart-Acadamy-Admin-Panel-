import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Check,
  Download,
  Edit2,
  Search,
} from 'lucide-react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

import { teacherService } from '../../services/teacherService';

import { Teacher } from '../../types';

import {
  getTeacherAttendanceDemo,
  TeacherAttendanceDemo,
  TeacherAttendanceStatus,
} from '../../data/teacherAttendanceDemo';


/* ========================================================================= */
/* ATTENDANCE RECORD                                                         */
/* ========================================================================= */

interface AttendanceDay {
  day: number;
  date: string;
  status: TeacherAttendanceStatus;
  checkIn: string;
  checkOut: string;
  classes: number;
  subject: string;
  remarks: string;
}


/* ========================================================================= */
/* MAIN PAGE                                                                 */
/* ========================================================================= */

export const TeacherAttendanceDetailPage: React.FC =
  () => {

    const navigate =
      useNavigate();

    const { teacherId } =
      useParams<{
        teacherId: string;
      }>();


    const [teacher, setTeacher] =
      useState<Teacher | null>(null);


    const [records, setRecords] =
      useState<AttendanceDay[]>([]);


    const [searchQuery, setSearchQuery] =
      useState('');


    const [statusFilter, setStatusFilter] =
      useState('');


    const [monthFilter, setMonthFilter] =
      useState('all');


    const [editingDay, setEditingDay] =
      useState<AttendanceDay | null>(null);


    const [todayStatus, setTodayStatus] =
      useState<TeacherAttendanceStatus>(
        'pending'
      );


    /* ===================================================================== */
    /* SHARED ATTENDANCE DATA                                                */
    /* ===================================================================== */

    const attendanceDemo:
      TeacherAttendanceDemo =
      getTeacherAttendanceDemo(
        teacherId || 'tch-101'
      );


    /* ===================================================================== */
    /* LOAD TEACHER                                                         */
    /* ===================================================================== */

    useEffect(() => {

      if (!teacherId) {
        return;
      }


      const foundTeacher =
        teacherService.getTeacherById(
          teacherId
        );


      if (!foundTeacher) {
        return;
      }


      setTeacher(foundTeacher);


      const attendance =
        getTeacherAttendanceDemo(
          foundTeacher.id
        );


      setRecords(
        createDemoAttendance(
          foundTeacher,
          attendance
        )
      );

    }, [teacherId]);


    /* ===================================================================== */
    /* SUMMARY                                                              */
    /* ===================================================================== */

    const summary =
      useMemo(() => {

        const pending =
          records.filter(
            (record) =>
              record.status ===
              'pending'
          ).length;


        return {

          present:
            attendanceDemo.presentDays,

          leave:
            attendanceDemo.leaveDays,

          absent:
            attendanceDemo.absentDays,

          pending,

          attendanceRate:
            attendanceDemo.attendanceRate,

        };

      }, [
        records,
        attendanceDemo,
      ]);


    /* ===================================================================== */
    /* FILTER                                                               */
    /* ===================================================================== */

    const filteredRecords =
      useMemo(() => {

        return records.filter(
          (record) => {

            const query =
              searchQuery
                .trim()
                .toLowerCase();


            const matchesSearch =
              !query ||
              record.date
                .toLowerCase()
                .includes(query) ||
              record.subject
                .toLowerCase()
                .includes(query) ||
              record.remarks
                .toLowerCase()
                .includes(query) ||
              `day ${record.day}`
                .includes(query);


            const matchesStatus =
              !statusFilter ||
              record.status ===
                statusFilter;


            const matchesMonth =
              monthFilter === 'all' ||
              getMonthName(
                record.date
              ) === monthFilter;


            return (
              matchesSearch &&
              matchesStatus &&
              matchesMonth
            );
          }
        );

      }, [
        records,
        searchQuery,
        statusFilter,
        monthFilter,
      ]);


    /* ===================================================================== */
    /* MARK PRESENT                                                         */
    /* ===================================================================== */

    const handleMarkPresent =
      () => {

        setTodayStatus(
          'present'
        );


        setRecords(
          (previous) =>
            previous.map(
              (record) =>
                record.day === 80
                  ? {
                      ...record,

                      status:
                        'present',

                      checkIn:
                        '08:45 AM',

                      checkOut:
                        '04:45 PM',

                      classes: 2,

                      remarks:
                        'Attendance marked present for scheduled classes.',
                    }
                  : record
            )
        );
      };


    /* ===================================================================== */
    /* APPLY LEAVE                                                          */
    /* ===================================================================== */

    const handleApplyLeave =
      () => {

        setTodayStatus(
          'leave'
        );


        setRecords(
          (previous) =>
            previous.map(
              (record) =>
                record.day === 80
                  ? {
                      ...record,

                      status:
                        'leave',

                      checkIn:
                        '-- : --',

                      checkOut:
                        '-- : --',

                      classes: 0,

                      remarks:
                        'Leave applied for the selected attendance day.',
                    }
                  : record
            )
        );
      };


    /* ===================================================================== */
    /* SAVE EDIT                                                            */
    /* ===================================================================== */

    const handleSaveEdit =
      () => {

        if (!editingDay) {
          return;
        }


        setRecords(
          (previous) =>
            previous.map(
              (record) =>
                record.day ===
                editingDay.day
                  ? editingDay
                  : record
            )
        );


        setEditingDay(null);
      };


    /* ===================================================================== */
    /* CSV EXPORT                                                           */
    /* ===================================================================== */

    const handleExport =
      () => {

        if (!teacher) {
          return;
        }


        const headers = [
          'Course Day',
          'Date',
          'Status',
          'Check In',
          'Check Out',
          'Classes Held',
          'Subject',
          'Remarks',
        ];


        const rows =
          records.map(
            (record) => [
              `Day ${record.day}`,
              record.date,
              formatStatus(
                record.status
              ),
              record.checkIn,
              record.checkOut,
              String(
                record.classes
              ),
              record.subject,
              record.remarks,
            ]
          );


        const csv =
          [
            headers,
            ...rows,
          ]
            .map(
              (row) =>
                row
                  .map(
                    (value) =>
                      `"${String(
                        value
                      ).replace(
                        /"/g,
                        '""'
                      )}"`
                  )
                  .join(',')
            )
            .join('\n');


        const blob =
          new Blob(
            [csv],
            {
              type:
                'text/csv;charset=utf-8;',
            }
          );


        const url =
          URL.createObjectURL(
            blob
          );


        const link =
          document.createElement(
            'a'
          );


        link.href = url;


        link.download =
          `${teacher.fullName.replace(
            /\s+/g,
            '-'
          )}-attendance-90-days.csv`;


        document.body.appendChild(
          link
        );


        link.click();


        document.body.removeChild(
          link
        );


        URL.revokeObjectURL(
          url
        );
      };


    /* ===================================================================== */
    /* NOT FOUND                                                             */
    /* ===================================================================== */

    if (!teacher) {

      return (

        <div
          className="
            min-h-[500px]
            flex
            items-center
            justify-center
          "
        >

          <Card
            className="
              p-8
              text-center
              !bg-[#1C1A19]
              !border-[#4A3024]
            "
          >

            <CalendarCheck
              className="
                w-10 h-10
                mx-auto
                text-[#D78B55]
              "
            />


            <h2
              className="
                mt-4
                font-bold
                text-[#F5F5F5]
              "
            >
              Teacher Not Found
            </h2>


            <p
              className="
                mt-2
                text-sm
                text-[#A1A1AA]
              "
            >
              The requested teacher attendance
              profile does not exist.
            </p>


            <div className="mt-5">

              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    '/admin/teachers/attendance'
                  )
                }
              >
                Back to Teachers
              </Button>

            </div>

          </Card>

        </div>

      );
    }


    /* ===================================================================== */
    /* PAGE                                                                  */
    /* ===================================================================== */

    return (

      <div
        className="
          space-y-5
          max-w-[1400px]
          mx-auto
        "
      >

        {/* =============================================================== */}
        {/* HEADER                                                          */}
        {/* =============================================================== */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-end
            lg:justify-between
            gap-4
          "
        >

          <div>

            <button
              onClick={() =>
                navigate(
                  '/admin/teachers/attendance'
                )
              }
              className="
                flex
                items-center
                gap-2
                text-xs
                font-semibold
                text-[#A1A1AA]
                hover:text-[#E7A66D]
                mb-3
                transition-colors
              "
            >
              <ArrowLeft className="w-4 h-4" />

              BACK TO TEACHERS
            </button>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-[#2A1A14]
                  border
                  border-[#4A2C1F]
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarCheck
                  className="
                    w-5 h-5
                    text-[#D78B55]
                  "
                />

              </div>


              <div>

                <h1
                  className="
                    text-2xl
                    md:text-3xl
                    font-bold
                    text-[#F5F5F5]
                  "
                >
                  My Attendance &
                  90-Day Course Tracker
                </h1>


                <p
                  className="
                    text-sm
                    text-[#A1A1AA]
                    mt-1
                  "
                >
                  Comprehensive faculty
                  attendance record for
                  the 3-Month (90 Days)
                  semester curriculum
                </p>

              </div>

            </div>


            {/* Teacher Identity */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <span
                className="
                  px-3 py-1.5
                  rounded-full
                  bg-[#3A2418]
                  text-[#E7A66D]
                  text-xs
                  font-semibold
                  border
                  border-[#5A321F]
                "
              >
                {teacher.fullName}
              </span>


              <span
                className="
                  px-3 py-1.5
                  rounded-full
                  bg-[#242424]
                  text-[#D4D4D8]
                  text-xs
                  border
                  border-[#3A3A3A]
                "
              >
                {teacher.department}
              </span>


              <span
                className="
                  px-3 py-1.5
                  rounded-full
                  bg-[#242424]
                  text-[#D4D4D8]
                  text-xs
                  border
                  border-[#3A3A3A]
                "
              >
                {attendanceDemo.teacherId}
              </span>

            </div>

          </div>


          {/* Export */}

          <button
            onClick={handleExport}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4 py-2.5
              rounded-xl
              border
              border-[#3A3A3A]
              bg-[#242424]
              text-[#E5E5E7]
              text-sm
              font-semibold
              hover:bg-[#2E2E2E]
              hover:border-[#8B4A2B]
              transition-colors
            "
          >

            <Download className="w-4 h-4" />

            Export Report (CSV)

          </button>

        </div>


        {/* =============================================================== */}
        {/* TODAY                                                            */}
        {/* =============================================================== */}

        <Card
          className="
            !bg-[#FFF8E9]
            !border-[#E5D6B9]
            p-5
            md:p-6
          "
        >

          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-5
            "
          >

            <div
              className="
                flex
                items-start
                gap-4
              "
            >

              <div
                className="
                  w-12 h-12
                  rounded-xl
                  bg-[#1D1D1D]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <Calendar
                  className="
                    w-6 h-6
                    text-white
                  "
                />

              </div>


              <div>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >

                  <span
                    className="
                      text-[11px]
                      font-bold
                      tracking-wide
                      text-[#9B681A]
                    "
                  >
                    TODAY · DAY 80 OF 90
                  </span>


                  <span
                    className="
                      text-xs
                      text-[#756F69]
                    "
                  >
                    Thursday, 2026-10-01
                  </span>

                </div>


                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#22201E]
                    mt-1
                  "
                >
                  Mark Today’s Attendance
                </h2>


                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    mt-1
                    text-xs
                  "
                >

                  <span
                    className="
                      font-semibold
                      text-[#4E4944]
                    "
                  >
                    Status:
                  </span>


                  <span
                    className={`
                      px-2 py-0.5
                      rounded-full
                      font-semibold

                      ${
                        todayStatus ===
                        'present'
                          ? 'bg-[#DDF5E8] text-[#26734D]'
                          : todayStatus ===
                            'leave'
                            ? 'bg-[#FFF0C8] text-[#956D14]'
                            : 'bg-[#F7DDE3] text-[#A83D54]'
                      }
                    `}
                  >
                    {todayStatus ===
                    'present'
                      ? 'Present'
                      : todayStatus ===
                        'leave'
                        ? 'Leave'
                        : 'Pending'}
                  </span>


                  <span
                    className="
                      text-[#B4AAA2]
                    "
                  >
                    •
                  </span>


                  <span
                    className="
                      text-[#5E5751]
                    "
                  >
                    Scheduled Sessions:
                    2 Classes (
                    {attendanceDemo.subject}
                    )
                  </span>

                </div>

              </div>

            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <button
                onClick={
                  handleMarkPresent
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5 py-2.5
                  rounded-xl
                  bg-[#42966D]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-[#37855F]
                  transition-colors
                "
              >

                <Check className="w-4 h-4" />

                Mark Present

              </button>


              <button
                onClick={
                  handleApplyLeave
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-5 py-2.5
                  rounded-xl
                  border
                  border-[#DDD8D0]
                  bg-white
                  text-[#5B5550]
                  text-sm
                  font-semibold
                  hover:bg-[#F7F4EF]
                  transition-colors
                "
              >
                Apply Leave
              </button>

            </div>

          </div>

        </Card>


        {/* =============================================================== */}
        {/* METRICS                                                         */}
        {/* =============================================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-4
          "
        >

          <MetricCard
            title="TOTAL COURSE DAYS"
            value={String(
              attendanceDemo.totalCourseDays
            )}
            suffix="Days (3 Months)"
            footerLeft={`Completed: ${attendanceDemo.completedDays} Days`}
            footerRight={`Left: ${attendanceDemo.remainingDays} Days`}
            progress={
              (
                attendanceDemo.completedDays /
                attendanceDemo.totalCourseDays
              ) * 100
            }
            icon={
              <Calendar
                className="w-4 h-4"
              />
            }
            progressType="orange"
          />


          <MetricCard
            title="CLASSES ATTENDED"
            value={String(
              attendanceDemo.presentDays
            )}
            suffix={`/ ${attendanceDemo.workingDays} Working Days`}
            footerLeft={`${attendanceDemo.presentDays} Days Present`}
            footerRight=""
            progress={
              (
                attendanceDemo.presentDays /
                attendanceDemo.workingDays
              ) * 100
            }
            icon={
              <CalendarCheck
                className="w-4 h-4"
              />
            }
            progressType="green"
          />


          <MetricCard
            title="LEAVES & ABSENT"
            value={String(
              attendanceDemo.leaveDays +
              attendanceDemo.absentDays
            )}
            suffix="Days Total"
            footerLeft={`Leaves: ${attendanceDemo.leaveDays}`}
            footerRight={`Absent: ${attendanceDemo.absentDays}`}
            progress={
              (
                (
                  attendanceDemo.leaveDays +
                  attendanceDemo.absentDays
                ) /
                attendanceDemo.workingDays
              ) * 100
            }
            icon={
              <span className="text-lg">
                △
              </span>
            }
            progressType="yellow"
          />


          <MetricCard
            title="ATTENDANCE RATE"
            value={`${attendanceDemo.attendanceRate}%`}
            suffix="Benchmark: 85%"
            footerLeft={`CL: ${attendanceDemo.clRemaining} left`}
            footerRight={`ML: ${attendanceDemo.mlRemaining} left`}
            progress={
              attendanceDemo.attendanceRate
            }
            icon={
              <span className="text-lg">
                ↗
              </span>
            }
            progressType="blue"
          />

        </div>


        {/* =============================================================== */}
        {/* HEATMAP                                                         */}
        {/* =============================================================== */}

        <Card
          className="
            !bg-white
            !border-[#E2DED7]
            p-5
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-start
              lg:justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-bold
                  text-[#24211F]
                "
              >
                90-Day Semester Curriculum Heatmap
              </h2>


              <p
                className="
                  text-xs
                  text-[#96908A]
                  mt-1
                "
              >
                Interactive timeline of all
                90 days across Month 1
                (July), Month 2 (August),
                and Month 3 (September)
              </p>

            </div>


            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4
                text-[11px]
                text-[#706A65]
              "
            >

              <LegendItem
                className="bg-[#57B88B]"
                label={`Present (${summary.present})`}
              />


              <LegendItem
                className="bg-[#EBA314]"
                label={`Leave (${summary.leave})`}
              />


              <LegendItem
                className="bg-[#D9455E]"
                label={`Absent (${summary.absent})`}
              />


              <LegendItem
                className="bg-[#E7E2D9]"
                label={`Pending (${summary.pending})`}
              />

            </div>

          </div>


          <div
            className="
              mt-5
              pt-5
              border-t
              border-[#ECE8E2]
            "
          >

            <div
              className="
                grid
                grid-cols-10
                sm:grid-cols-15
                md:grid-cols-30
                gap-1.5
              "
            >

              {records.map(
                (record) => (

                  <button
                    key={record.day}
                    onClick={() =>
                      setEditingDay(
                        record
                      )
                    }
                    title={`${record.date} - ${formatStatus(
                      record.status
                    )}`}
                    className={`
                      h-7
                      rounded-md
                      text-[10px]
                      font-semibold
                      transition-transform
                      hover:scale-105
                      border

                      ${
                        record.status ===
                        'present'
                          ? 'bg-[#57B88B] border-[#57B88B] text-white'
                          : record.status ===
                            'leave'
                            ? 'bg-[#EBA314] border-[#EBA314] text-white'
                            : record.status ===
                              'absent'
                              ? 'bg-[#D9455E] border-[#D9455E] text-white'
                              : 'bg-[#E7E2D9] border-[#DDD8CE] text-[#817A72]'
                      }

                      ${
                        record.day === 80
                          ? 'ring-2 ring-[#2C2927] ring-offset-1'
                          : ''
                      }
                    `}
                  >
                    {record.day}
                  </button>

                )
              )}

            </div>

          </div>

        </Card>


        {/* =============================================================== */}
        {/* TABLE                                                           */}
        {/* =============================================================== */}

        <Card
          className="
            !bg-white
            !border-[#E2DED7]
            overflow-hidden
          "
        >

          {/* Toolbar */}

          <div
            className="
              p-4
              flex
              flex-col
              lg:flex-row
              gap-3
              lg:items-center
              lg:justify-between
            "
          >

            <div
              className="
                relative
                w-full
                lg:w-[320px]
              "
            >

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4 h-4
                  text-[#A49D96]
                "
              />


              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search by day, date, remarks..."
                className="
                  w-full
                  h-10
                  pl-9
                  pr-3
                  rounded-xl
                  border
                  border-[#DDD8D0]
                  bg-white
                  text-sm
                  text-[#332F2C]
                  outline-none
                  focus:ring-2
                  focus:ring-[#C9A88D]
                "
              />

            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-[#DDD8D0]
                  bg-white
                  text-sm
                  text-[#403B37]
                  outline-none
                "
              >

                <option value="">
                  All Status (90)
                </option>

                <option value="present">
                  Present
                </option>

                <option value="leave">
                  Leave
                </option>

                <option value="absent">
                  Absent
                </option>

                <option value="pending">
                  Pending
                </option>

              </select>


              <select
                value={monthFilter}
                onChange={(event) =>
                  setMonthFilter(
                    event.target.value
                  )
                }
                className="
                  h-10
                  px-3
                  rounded-xl
                  border
                  border-[#DDD8D0]
                  bg-white
                  text-sm
                  text-[#403B37]
                  outline-none
                "
              >

                <option value="all">
                  All Months (3 Mo)
                </option>

                <option value="July">
                  Month 1 (July)
                </option>

                <option value="August">
                  Month 2 (August)
                </option>

                <option value="September">
                  Month 3 (September)
                </option>

              </select>

            </div>

          </div>


          {/* Table */}

          <div className="overflow-x-auto">

            <table
              className="
                w-full
                min-w-[1050px]
                border-collapse
              "
            >

              <thead>

                <tr
                  className="
                    bg-[#FBFAF8]
                    border-y
                    border-[#ECE8E2]
                  "
                >

                  <TableHeader>
                    Course Day #
                  </TableHeader>

                  <TableHeader>
                    Date & Day
                  </TableHeader>

                  <TableHeader>
                    Attendance Status
                  </TableHeader>

                  <TableHeader>
                    Check-In / Out
                  </TableHeader>

                  <TableHeader>
                    Classes Held
                  </TableHeader>

                  <TableHeader>
                    Subject / Remarks
                  </TableHeader>

                  <TableHeader align="right">
                    Actions
                  </TableHeader>

                </tr>

              </thead>


              <tbody>

                {filteredRecords.map(
                  (record) => (

                    <tr
                      key={record.day}
                      className="
                        border-b
                        border-[#EEEAE4]
                        hover:bg-[#FCFBF9]
                      "
                    >

                      <td className="px-5 py-3">

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[#38332F]
                          "
                        >
                          Day {record.day}
                        </span>

                        <span
                          className="
                            text-[10px]
                            text-[#A19A93]
                            ml-1
                          "
                        >
                          / 90
                        </span>

                      </td>


                      <td className="px-5 py-3">

                        <div
                          className="
                            text-sm
                            font-medium
                            text-[#403B37]
                          "
                        >
                          {record.date}
                        </div>

                        <div
                          className="
                            text-[11px]
                            text-[#9A938C]
                          "
                        >
                          {getDayName(
                            record.date
                          )}
                        </div>

                      </td>


                      <td className="px-5 py-3">

                        <AttendanceStatusBadge
                          status={
                            record.status
                          }
                        />

                      </td>


                      <td
                        className="
                          px-5 py-3
                          text-xs
                          text-[#77716B]
                        "
                      >
                        {record.checkIn}
                        {' — '}
                        {record.checkOut}
                      </td>


                      <td className="px-5 py-3">

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[#403B37]
                          "
                        >
                          {record.classes}{' '}
                          {record.classes ===
                          1
                            ? 'Class'
                            : 'Classes'}
                        </span>

                      </td>


                      <td
                        className="
                          px-5 py-3
                          max-w-[330px]
                        "
                      >

                        <div
                          className="
                            text-sm
                            font-medium
                            text-[#403B37]
                            truncate
                          "
                        >
                          {record.subject}
                        </div>


                        <div
                          className="
                            text-[11px]
                            text-[#9A938C]
                            truncate
                          "
                        >
                          {record.remarks}
                        </div>

                      </td>


                      <td
                        className="
                          px-5 py-3
                          text-right
                        "
                      >

                        <button
                          onClick={() =>
                            setEditingDay(
                              record
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1
                            px-3 py-1.5
                            rounded-lg
                            border
                            border-[#DDD8D0]
                            text-xs
                            font-semibold
                            text-[#635D57]
                            hover:bg-[#F7F4EF]
                            hover:border-[#C8A88F]
                            transition-colors
                          "
                        >

                          <Edit2
                            className="w-3 h-3"
                          />

                          Edit

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>


          {filteredRecords.length === 0 && (

            <div
              className="
                p-12
                text-center
              "
            >

              <CalendarCheck
                className="
                  w-8 h-8
                  mx-auto
                  text-[#B0A9A2]
                "
              />


              <p
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-[#615A54]
                "
              >
                No attendance records found
              </p>


              <p
                className="
                  mt-1
                  text-xs
                  text-[#99928B]
                "
              >
                Try changing the search
                or filters.
              </p>

            </div>

          )}

        </Card>


        {/* =============================================================== */}
        {/* EDIT MODAL                                                      */}
        {/* =============================================================== */}

        {editingDay && (

          <Modal
            isOpen={true}
            onClose={() =>
              setEditingDay(null)
            }
            title={`Edit Attendance — Day ${editingDay.day}`}
            description={`${editingDay.date} • ${teacher.fullName}`}
            maxWidth="md"
          >

            <div className="space-y-4">

              <Select
                label="Attendance Status"
                value={
                  editingDay.status
                }
                onChange={(event) =>
                  setEditingDay({
                    ...editingDay,

                    status:
                      event.target
                        .value as TeacherAttendanceStatus,
                  })
                }
                options={[
                  {
                    value: 'present',
                    label: 'Present',
                  },
                  {
                    value: 'leave',
                    label: 'Leave',
                  },
                  {
                    value: 'absent',
                    label: 'Absent',
                  },
                  {
                    value: 'pending',
                    label: 'Pending',
                  },
                ]}
              />


              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                <Input
                  label="Check In"
                  value={
                    editingDay.checkIn
                  }
                  onChange={(event) =>
                    setEditingDay({
                      ...editingDay,

                      checkIn:
                        event.target
                          .value,
                    })
                  }
                />


                <Input
                  label="Check Out"
                  value={
                    editingDay.checkOut
                  }
                  onChange={(event) =>
                    setEditingDay({
                      ...editingDay,

                      checkOut:
                        event.target
                          .value,
                    })
                  }
                />

              </div>


              <Input
                label="Classes Held"
                type="number"
                value={
                  editingDay.classes
                }
                onChange={(event) =>
                  setEditingDay({
                    ...editingDay,

                    classes:
                      Number(
                        event.target
                          .value
                      ),
                  })
                }
              />


              <Input
                label="Subject"
                value={
                  editingDay.subject
                }
                onChange={(event) =>
                  setEditingDay({
                    ...editingDay,

                    subject:
                      event.target
                        .value,
                  })
                }
              />


              <Input
                label="Remarks"
                value={
                  editingDay.remarks
                }
                onChange={(event) =>
                  setEditingDay({
                    ...editingDay,

                    remarks:
                      event.target
                        .value,
                  })
                }
              />


              <div
                className="
                  flex
                  justify-end
                  gap-2
                  pt-4
                  border-t
                  border-[#E7E2DA]
                "
              >

                <Button
                  variant="outline"
                  onClick={() =>
                    setEditingDay(
                      null
                    )
                  }
                >
                  Cancel
                </Button>


                <Button
                  variant="primary"
                  onClick={
                    handleSaveEdit
                  }
                >
                  Save Changes
                </Button>

              </div>

            </div>

          </Modal>

        )}

      </div>
    );
  };


/* ========================================================================= */
/* METRIC CARD                                                              */
/* ========================================================================= */

interface MetricCardProps {
  title: string;
  value: string;
  suffix: string;
  footerLeft: string;
  footerRight: string;
  progress: number;
  icon: React.ReactNode;
  progressType:
    | 'orange'
    | 'green'
    | 'yellow'
    | 'blue';
}


const MetricCard: React.FC<
  MetricCardProps
> = ({
  title,
  value,
  suffix,
  footerLeft,
  footerRight,
  progress,
  icon,
  progressType,
}) => {

  const progressClass = {
    orange: 'bg-[#C9790B]',
    green: 'bg-[#4CA878]',
    yellow: 'bg-[#D79A0A]',
    blue: 'bg-[#4A4FA3]',
  }[progressType];


  return (

    <Card
      className="
        !bg-white
        !border-[#E2DED7]
        p-5
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <span
          className="
            text-[11px]
            font-bold
            tracking-wide
            text-[#817A73]
          "
        >
          {title}
        </span>


        <span
          className="
            text-[#8B4A2B]
          "
        >
          {icon}
        </span>

      </div>


      <div
        className="
          mt-2
          flex
          items-baseline
          gap-2
        "
      >

        <span
          className="
            text-3xl
            font-bold
            text-[#1D1B1A]
          "
        >
          {value}
        </span>


        <span
          className="
            text-[11px]
            font-semibold
            text-[#9A938B]
          "
        >
          {suffix}
        </span>

      </div>


      <div
        className="
          mt-4
          h-1.5
          rounded-full
          bg-[#EEEAE4]
          overflow-hidden
        "
      >

        <div
          className={`
            h-full
            rounded-full
            ${progressClass}
          `}
          style={{
            width: `${Math.min(
              progress,
              100
            )}%`,
          }}
        />

      </div>


      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          gap-2
          text-[10px]
          text-[#837B74]
        "
      >

        <span>
          {footerLeft}
        </span>


        <span>
          {footerRight}
        </span>

      </div>

    </Card>
  );
};


/* ========================================================================= */
/* TABLE HEADER                                                             */
/* ========================================================================= */

const TableHeader: React.FC<{
  children: React.ReactNode;
  align?: 'left' | 'right';
}> = ({
  children,
  align = 'left',
}) => {

  return (

    <th
      className={`
        px-5
        py-3
        text-${align}
        text-[10px]
        font-bold
        uppercase
        tracking-wide
        text-[#77716B]
      `}
    >
      {children}
    </th>

  );
};


/* ========================================================================= */
/* LEGEND                                                                    */
/* ========================================================================= */

const LegendItem: React.FC<{
  className: string;
  label: string;
}> = ({
  className,
  label,
}) => {

  return (

    <span
      className="
        inline-flex
        items-center
        gap-1.5
      "
    >

      <span
        className={`
          w-2.5
          h-2.5
          rounded-full
          ${className}
        `}
      />

      {label}

    </span>

  );
};


/* ========================================================================= */
/* STATUS BADGE                                                             */
/* ========================================================================= */

const AttendanceStatusBadge: React.FC<{
  status: TeacherAttendanceStatus;
}> = ({
  status,
}) => {

  const styles = {

    present:
      'bg-[#DDF5E8] text-[#26734D]',

    leave:
      'bg-[#FFF0C8] text-[#956D14]',

    absent:
      'bg-[#F7DDE3] text-[#A83D54]',

    pending:
      'bg-[#E9E5DE] text-[#77716A]',

  };


  const labels = {

    present:
      'Present',

    leave:
      'Leave (Casual)',

    absent:
      'Absent',

    pending:
      'Pending',

  };


  return (

    <span
      className={`
        inline-flex
        items-center
        px-2.5
        py-1
        rounded-full
        text-[10px]
        font-bold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>

  );
};


/* ========================================================================= */
/* CREATE 90-DAY DATA                                                       */
/* ========================================================================= */

function createDemoAttendance(
  teacher: Teacher,
  attendance: TeacherAttendanceDemo
): AttendanceDay[] {

  /*
   * The first `workingDays` course days are treated
   * as attendance-eligible days.
   *
   * This makes the attendance calculation match
   * the teacher card.
   *
   * The remaining course days are pending.
   */

  const workingDays =
    attendance.workingDays;


  const leaveSet =
    new Set(
      attendance.leaveDaysList
    );


  const absentSet =
    new Set(
      attendance.absentDaysList
    );


  const records: AttendanceDay[] =
    [];


  for (
    let day = 1;
    day <= attendance.totalCourseDays;
    day++
  ) {

    const date =
      createDateForDay(day);


    let status:
      TeacherAttendanceStatus;


    /*
     * Course days beyond the current
     * working-day period remain pending.
     */

    if (day > workingDays) {

      status = 'pending';

    }

    else if (
      leaveSet.has(day)
    ) {

      status = 'leave';

    }

    else if (
      absentSet.has(day)
    ) {

      status = 'absent';

    }

    else {

      status = 'present';

    }


    /*
     * Day 80 represents today's
     * attendance action in the UI.
     *
     * If it falls after the configured
     * working period, keep it pending.
     */

    if (day === 80) {

      status = 'pending';

    }


    const isPresent =
      status === 'present';


    records.push({

      day,

      date,

      status,

      checkIn:
        isPresent
          ? '08:45 AM'
          : '-- : --',

      checkOut:
        isPresent
          ? '04:45 PM'
          : '-- : --',

      classes:
        isPresent
          ? day % 2 === 0
            ? 2
            : 1
          : 0,

      subject:
        attendance.subject,

      remarks:
        status === 'present'
          ? 'Conducted scheduled lecture & practical session'
          : status === 'leave'
            ? 'Leave approved by department'
            : status === 'absent'
              ? 'Absent for scheduled academic session'
              : 'Attendance not yet recorded',

    });

  }


  /*
   * Keep the teacher argument referenced so
   * TypeScript does not report it as unused
   * when no additional teacher fields are needed.
   */

  void teacher;


  return records;
}


/* ========================================================================= */
/* DATE HELPERS                                                              */
/* ========================================================================= */

function createDateForDay(
  day: number
): string {

  const date =
    new Date(
      2026,
      6,
      day
    );


  return [

    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(
      2,
      '0'
    ),

    String(
      date.getDate()
    ).padStart(
      2,
      '0'
    ),

  ].join('-');
}


function getDayName(
  dateString: string
): string {

  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
    }
  );
}


function getMonthName(
  dateString: string
): string {

  const date =
    new Date(
      `${dateString}T00:00:00`
    );


  return date.toLocaleDateString(
    'en-US',
    {
      month: 'long',
    }
  );
}


function formatStatus(
  status: TeacherAttendanceStatus
): string {

  return {

    present:
      'Present',

    leave:
      'Leave',

    absent:
      'Absent',

    pending:
      'Pending',

  }[status];
}