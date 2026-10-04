import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getAcademicCourseById } from '../../services/academicCourseService';
import { getAcademicSubjects } from '../../services/academicSubjectService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { getStudents } from '../../services/studentService';
import { getAcademicClasses } from '../../services/academicClassService';
import { getExams } from '../../services/examService';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    Promise.all([
      getAcademicCourseById(courseId),
      getAcademicSubjects(),
      getAcademicBatches(),
      getStudents(),
      getAcademicClasses(),
      getExams(),
    ]).then(([c, subs, bats, students]) => {
      setCourse(c || null);
      if (c) {
        setSubjects(subs.filter((s: any) => s.courseId === c.id || s.courseName === c.name));
        setBatches(bats.filter((b: any) => b.courseId === c.id || b.courseName === c.name));
        setEnrolledStudents(students.filter((s: any) => s.course === c.name || s.courseName === c.name));
      }
      setLoading(false);
    });
  }, [courseId]);

  if (loading) {
    return <div className="py-20 text-center text-[#A89A91] animate-pulse">Loading course details...</div>;
  }

  if (!course) {
    return (
      <div className="py-20 text-center text-[#A89A91]">
        Course program not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={course.name}
        subtitle={`Course Code: ${course.courseCode} • Duration: ${course.duration} • Fee: ₹${course.fee}`}
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Courses', to: '/admin/courses' },
          { label: course.name },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/courses')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            All Courses
          </Button>
        }
      />

      <Card className="p-6 bg-[#171311] border-[#3A2922]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2A1710] text-[#946246]">
                {course.courseCode}
              </span>
              <StatusBadge status={course.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-[#F5F0EA] mt-1.5">{course.name}</h1>
            <p className="text-xs text-[#A89A91] mt-1 max-w-2xl">{course.description}</p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710]">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Duration</span>
              <span className="text-sm font-bold font-mono text-[#F1E5D8]">{course.duration}</span>
            </div>
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710]">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Fee</span>
              <span className="text-sm font-bold font-mono text-emerald-400">₹{course.fee}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#946246]" />
              Subjects ({subjects.length})
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/subjects')}>Manage</Button>
          </div>
          <div className="space-y-2">
            {subjects.length === 0
              ? <p className="text-xs text-[#A89A91] py-4 text-center">No subjects mapped yet.</p>
              : subjects.map((s) => (
                <div key={s.id} className="p-3 bg-[#140F0D] rounded-lg border border-[#2A1710] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#F5F0EA]">{s.name}</span>
                    <div className="text-[11px] text-[#A89A91]">{s.subjectCode} • {s.teacherName}</div>
                  </div>
                  <StatusBadge status={s.status} size="sm" />
                </div>
              ))
            }
          </div>
        </Card>

        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#946246]" />
              Batches ({batches.length})
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin/batches')}>Manage</Button>
          </div>
          <div className="space-y-2">
            {batches.length === 0
              ? <p className="text-xs text-[#A89A91] py-4 text-center">No batches assigned.</p>
              : batches.map((b) => (
                <div key={b.id} onClick={() => navigate(`/admin/batches/${b.id}`)}
                  className="p-3 bg-[#140F0D] rounded-lg border border-[#2A1710] hover:border-[#5A321F] transition-colors flex items-center justify-between text-xs cursor-pointer">
                  <div>
                    <span className="font-semibold text-[#F5F0EA]">{b.name}</span>
                    <div className="text-[11px] text-[#A89A91]">{b.teacherName} • {b.classroom}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#F1E5D8]">{b.currentStudentsCount || 0} Students</span>
                    <span className="text-[10px] text-[#A89A91] block">{b.startDate}</span>
                  </div>
                </div>
              ))
            }
          </div>
        </Card>
      </div>

      <Card className="p-5 bg-[#171311] border-[#3A2922]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#946246]" />
            Enrolled Students ({enrolledStudents.length})
          </h3>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/students/new')}>Enroll Student</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[#A89A91] text-[11px] font-bold uppercase">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">ID</th>
                <th className="py-2.5 px-4">Batch</th>
                <th className="py-2.5 px-4">Attendance</th>
                <th className="py-2.5 px-4">Fee Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {enrolledStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[#F5F0EA]">{stu.fullName}</td>
                  <td className="py-2.5 px-4 font-mono text-[#F1E5D8]">{stu.studentId}</td>
                  <td className="py-2.5 px-4 text-[#A89A91]">{stu.batch}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-400">{stu.attendancePercentage || 0}%</td>
                  <td className="py-2.5 px-4"><StatusBadge status={stu.feeStatus || 'Pending'} size="sm" /></td>
                  <td className="py-2.5 px-4 text-right">
                    <button onClick={() => navigate(`/admin/students/${stu.id}`)}
                      className="text-xs text-[#946246] hover:text-[#F1E5D8] font-semibold">
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
