import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Presentation,
  Search,
  Filter,
  Layers,
  Calendar,
  Clock,
  User,
  GraduationCap,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getAcademicClasses } from '../../services/academicClassService';
import { getStudents } from '../../services/studentService';

export const StudentClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const classes = getAcademicClasses();
  const students = getStudents();

  const [searchQuery, setSearchQuery] = useState('');

  // Flattened mapping of classes and enrolled students
  const classRows = classes.flatMap((cls) => {
    // Find students matching the course
    const enrolled = students.filter((s) => s.course === cls.courseName);
    return enrolled.map((stu) => ({
      classId: cls.id,
      classTitle: cls.title,
      courseId: cls.courseId,
      courseName: cls.courseName,
      subjectName: cls.subjectName,
      teacherId: cls.teacherId,
      teacherName: cls.teacherName,
      batchId: cls.batchId,
      batchName: cls.batchName,
      classroom: cls.classroom,
      date: cls.date,
      startTime: cls.startTime,
      endTime: cls.endTime,
      status: cls.status,
      studentId: stu.id,
      studentCode: stu.studentId,
      studentName: stu.fullName,
    }));
  });

  const filtered = classRows.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r.studentName.toLowerCase().includes(q) ||
        r.classTitle.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.teacherName.toLowerCase().includes(q) ||
        r.classroom.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Class Sessions"
        subtitle="Live roster of student attendance allocations, session rooms, and instructor schedules"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students' },
          { label: 'Classes' },
        ]}
      />

      <Card className="p-4 bg-[#140F0D] border-[#3A2922]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#946246] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, class, teacher, course, or room..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-[#3A2922] bg-[#140F0D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#1A1412] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class Title</th>
                <th className="py-3 px-4">Course Program</th>
                <th className="py-3 px-4">Faculty Instructor</th>
                <th className="py-3 px-4">Batch & Room</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {filtered.slice(0, 25).map((row, idx) => (
                <tr key={`${row.classId}-${row.studentId}-${idx}`} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/admin/students/${row.studentId}`)}
                      className="font-semibold text-[#F5F0EA] hover:text-[#946246] transition-colors flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#946246]" />
                      {row.studentName}
                    </button>
                    <div className="text-[11px] text-[#A89A91] font-mono">{row.studentCode}</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/admin/classes/${row.classId}`)}
                      className="font-semibold text-[#F5F0EA] hover:text-[#946246] transition-colors text-left"
                    >
                      {row.classTitle}
                    </button>
                    <div className="text-[11px] text-[#A89A91]">{row.subjectName}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F5F0EA]">
                    {row.courseName}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/admin/teachers/${row.teacherId}`)}
                      className="font-semibold text-[#F5F0EA] hover:text-[#946246] transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      {row.teacherName}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[#F5F0EA]">{row.batchName}</div>
                    <div className="text-[11px] text-[#946246] font-mono">Room {row.classroom}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#A89A91]">
                    <div>{row.date}</div>
                    <div className="text-[10px] text-[#F1E5D8]">{row.startTime} - {row.endTime}</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={row.status} size="sm" />
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
