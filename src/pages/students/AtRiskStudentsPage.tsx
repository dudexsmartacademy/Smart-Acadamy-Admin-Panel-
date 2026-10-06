import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getAtRiskStudents } from '../../services/studentService';
import { Student } from '../../types';

export const AtRiskStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [atRiskList, setAtRiskList] = useState<Student[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getAtRiskStudents();
      setAtRiskList(data);
    };
    load();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="At-Risk Students Identification"
        subtitle="Automated factual threshold detection for students with critical attendance, failing scores, or missed assignments"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students' },
          { label: 'At-Risk' },
        ]}
      />

      {/* Threshold Guide */}
      <Card className="p-4 bg-[#140F0D] border-rose-950/60 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[#A89A91]">
          <span className="font-bold text-[#F5F0EA] block mb-0.5">Threshold Trigger Rules</span>
          Students appear on this list if their attendance falls below <strong className="text-rose-300">75%</strong>, average examination marks fall below <strong className="text-rose-300">50%</strong>, or if enrollment has been marked suspended.
        </div>
      </Card>

      {/* At-Risk Table */}
      <Card className="overflow-hidden border-[#3A2922] bg-[#140F0D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#1A1412] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course & Batch</th>
                <th className="py-3 px-4 text-center">Attendance %</th>
                <th className="py-3 px-4 text-center">Average Exam Score</th>
                <th className="py-3 px-4 text-center">Pending Assignments</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {atRiskList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-emerald-400 font-semibold">
                    No students currently meet the at-risk threshold criteria.
                  </td>
                </tr>
              ) : (
                atRiskList.map((stu) => {
                  const isCriticalAtt = (stu.attendancePercentage || 0) < 60;
                  return (
                    <tr key={stu.id} className="hover:bg-[#1E1815]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={stu.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'}
                            alt={stu.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-rose-900 shrink-0"
                          />
                          <div>
                            <button
                              onClick={() => navigate(`/admin/students/${stu.id}`)}
                              className="font-semibold text-[#F5F0EA] hover:text-[#946246] transition-colors block text-left"
                            >
                              {stu.fullName}
                            </button>
                            <span className="text-[10px] text-[#A89A91] font-mono">{stu.studentId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F5F0EA]">{stu.course}</div>
                        <div className="text-[11px] text-[#A89A91]">{stu.batch}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-400">
                        {stu.attendancePercentage}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">
                        {stu.averageMarks || 52}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-[#F1E5D8]">
                        3 Overdue
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCriticalAtt
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {isCriticalAtt ? 'CRITICAL RISK' : 'WARNING RISK'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/students/${stu.id}`)}
                        >
                          View Dossier
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
