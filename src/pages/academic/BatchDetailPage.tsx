import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  User,
  Users,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getAcademicBatchById } from '../../services/academicBatchService';
import { getStudents } from '../../services/studentService';
import { getAcademicClasses } from '../../services/academicClassService';
import { getExams } from '../../services/examService';

export const BatchDetailPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [batchStudents, setBatchStudents] = useState<any[]>([]);
  const [batchClasses, setBatchClasses] = useState<any[]>([]);
  const [batchExams, setBatchExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!batchId) { setLoading(false); return; }
    Promise.all([
      getAcademicBatchById(batchId),
      getStudents(),
      getAcademicClasses(),
      getExams(),
    ]).then(([b, students, classes, exams]) => {
      setBatch(b || null);
      if (b) {
        setBatchStudents(students.filter((s: any) => s.batch === b.name || s.batchId === b.id));
        setBatchClasses(classes.filter((c: any) => c.batchName === b.name || c.batchId === b.id));
        setBatchExams(exams.filter((e: any) => e.batchName === b.name || e.batchId === b.id));
      }
      setLoading(false);
    });
  }, [batchId]);

  if (loading) {
    return <div className="py-20 text-center text-[#A89A91] animate-pulse">Loading batch details...</div>;
  }

  if (!batch) {
    return <div className="py-20 text-center text-[#A89A91]">Academic batch not found.</div>;
  }

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title={batch.name}
        subtitle={`Batch Code: ${batch.batchCode} • Course: ${batch.courseName} • Lead Instructor: ${batch.teacherName}`}
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Batches', to: '/admin/batches' },
          { label: batch.name },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/batches')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            All Batches
          </Button>
        }
      />

      {/* Top Banner */}
      <Card className="p-6 bg-[#171311] border-[#3A2922]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#2A1710] text-[#946246]">
                {batch.batchCode}
              </span>
              <StatusBadge status={batch.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-[#F5F0EA] mt-1.5">{batch.name}</h1>
            <p className="text-xs text-[#A89A91] mt-1">
              Program: <strong className="text-[#F5F0EA]">{batch.courseName}</strong> • Facility: <strong className="text-[#F1E5D8]">Room {batch.classroom}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710] text-center">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Timeline</span>
              <span className="text-xs font-mono font-semibold text-[#F1E5D8]">{batch.startDate} - {batch.endDate}</span>
            </div>
            <div className="p-3 bg-[#140F0D] rounded-xl border border-[#2A1710] text-center">
              <span className="text-[10px] text-[#A89A91] uppercase tracking-wider block">Students</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {batchStudents.length} / {batch.maxCapacity}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Linked Classes & Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <h3 className="text-sm font-bold text-[#F5F0EA] mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#946246]" />
            Scheduled Classes ({batchClasses.length})
          </h3>
          <div className="space-y-2">
            {batchClasses.map((cls) => (
              <div
                key={cls.id}
                onClick={() => navigate(`/admin/classes/${cls.id}`)}
                className="p-3 bg-[#140F0D] rounded-lg border border-[#2A1710] hover:border-[#5A321F] flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-[#F5F0EA]">{cls.title}</span>
                  <div className="text-[11px] text-[#A89A91]">Subject: {cls.subjectName}</div>
                </div>
                <div className="text-right font-mono text-[#A89A91]">
                  <div>{cls.date}</div>
                  <div className="text-[10px] text-[#946246]">{cls.startTime}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <h3 className="text-sm font-bold text-[#F5F0EA] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#946246]" />
            Exams Assigned ({batchExams.length})
          </h3>
          <div className="space-y-2">
            {batchExams.map((ex) => (
              <div
                key={ex.id}
                className="p-3 bg-[#140F0D] rounded-lg border border-[#2A1710] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-[#F5F0EA]">{ex.title}</span>
                  <div className="text-[11px] text-[#A89A91]">{ex.subjectName}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[#F1E5D8]">{ex.startDate}</div>
                  <StatusBadge status={ex.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Enrolled Students in Batch */}
      <Card className="p-5 bg-[#171311] border-[#3A2922]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#946246]" />
            Batch Student Roster ({batchStudents.length})
          </h3>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin/students/enrollments')}>
            Enroll Student
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[#A89A91] text-[11px] font-bold uppercase">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Student ID</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4 text-center">Attendance</th>
                <th className="py-2.5 px-4">Fee Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {batchStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-[#F5F0EA]">
                    {stu.fullName}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[#F1E5D8]">{stu.studentId}</td>
                  <td className="py-2.5 px-4 text-[#A89A91]">{stu.email}</td>
                  <td className="py-2.5 px-4 text-center font-bold text-emerald-400">
                    {stu.attendancePercentage}%
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={stu.feeStatus || 'Pending'} size="sm" />
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
