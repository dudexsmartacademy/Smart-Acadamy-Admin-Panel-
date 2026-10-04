import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Presentation,
  BookOpen,
  User,
  Layers,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getAcademicClassById } from '../../services/academicClassService';
import { getStudents } from '../../services/studentService';

export const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const [academicClass, setAcademicClass] = useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) { setLoading(false); return; }
    Promise.all([
      getAcademicClassById(classId),
      getStudents(),
    ]).then(([cls, students]) => {
      setAcademicClass(cls || null);
      if (cls) {
        setEnrolledStudents(students.filter((s: any) =>
          s.course === cls.courseName || s.courseName === cls.courseName
        ));
      }
      setLoading(false);
    });
  }, [classId]);

  if (loading) {
    return <div className="py-20 text-center text-[#A89A91] animate-pulse">Loading class details...</div>;
  }

  if (!academicClass) {
    return <div className="py-20 text-center text-[#A89A91]">Academic class session not found.</div>;
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={academicClass.title}
        subtitle={`Session Overview • ${academicClass.courseName} • ${academicClass.date}`}
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Classes', to: '/admin/classes' },
          { label: academicClass.title },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/classes')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            All Classes
          </Button>
        }
      />

      {/* Main Banner */}
      <Card className="p-6 bg-[#171311] border-[#3A2922]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2A1710] text-[#946246]">
                Room {academicClass.classroom}
              </span>
              <StatusBadge status={academicClass.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-[#F5F0EA] mt-1.5">{academicClass.title}</h1>
            <p className="text-xs text-[#A89A91] mt-1">
              Subject: <strong className="text-[#F5F0EA]">{academicClass.subjectName}</strong> • Batch: <strong className="text-[#F1E5D8]">{academicClass.batchName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 text-center">
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710]">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Date</span>
              <span className="text-xs font-mono font-bold text-[#F1E5D8]">{academicClass.date}</span>
            </div>
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710]">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Time</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {academicClass.startTime} - {academicClass.endTime}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Relational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Course Card */}
        <Card
          onClick={() => navigate(`/admin/courses/${academicClass.courseId}`)}
          className="p-4 bg-[#140F0D] border-[#2A1710] hover:border-[#5A321F] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#A89A91] mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#946246]" />
            Program Course
          </div>
          <div className="text-sm font-bold text-[#F5F0EA]">{academicClass.courseName}</div>
          <span className="text-[11px] text-[#946246] mt-2 block font-semibold">View Course Details →</span>
        </Card>

        {/* Faculty Instructor Card */}
        <Card
          onClick={() => navigate(`/admin/teachers/${academicClass.teacherId}`)}
          className="p-4 bg-[#140F0D] border-[#2A1710] hover:border-[#5A321F] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#A89A91] mb-2">
            <User className="w-3.5 h-3.5 text-blue-400" />
            Faculty Lead
          </div>
          <div className="text-sm font-bold text-[#F5F0EA]">{academicClass.teacherName}</div>
          <span className="text-[11px] text-blue-400 mt-2 block font-semibold">View Faculty Profile →</span>
        </Card>

        {/* Batch Card */}
        <Card
          onClick={() => navigate(`/admin/batches/${academicClass.batchId}`)}
          className="p-4 bg-[#140F0D] border-[#2A1710] hover:border-[#5A321F] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#A89A91] mb-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            Allocated Batch
          </div>
          <div className="text-sm font-bold text-[#F5F0EA]">{academicClass.batchName}</div>
          <span className="text-[11px] text-purple-400 mt-2 block font-semibold">View Batch Roster →</span>
        </Card>
      </div>

      {/* Attending Students List */}
      <Card className="p-5 bg-[#171311] border-[#3A2922]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#946246]" />
            Session Attendance Roster ({enrolledStudents.length} Students)
          </h3>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/students/attendance')}
          >
            <CalendarCheck className="w-4 h-4 mr-1.5" />
            Mark Attendance
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[#A89A91] text-[11px] font-bold uppercase">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Student ID</th>
                <th className="py-2.5 px-4">Batch</th>
                <th className="py-2.5 px-4 text-center">Cumulative Attendance</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {enrolledStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[#F5F0EA]">
                    {stu.fullName}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#F1E5D8]">{stu.studentId}</td>
                  <td className="py-2.5 px-4 text-[#A89A91]">{stu.batch}</td>
                  <td className="py-2.5 px-4 text-center font-bold text-emerald-400">
                    {stu.attendancePercentage}%
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/students/${stu.id}`)}
                      className="text-xs text-[#946246] hover:text-[#F1E5D8] font-semibold"
                    >
                      Dossier →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
