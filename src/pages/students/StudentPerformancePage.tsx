import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  Award,
  CalendarCheck,
  FileText,
  Clock,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { getStudents, getAtRiskStudents } from '../../services/studentService';
import { getResults } from '../../services/resultService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const StudentPerformancePage: React.FC = () => {
  const navigate = useNavigate();
  const students = getStudents();
  const results = getResults();
  const atRisk = getAtRiskStudents();

  // Performance trends data
  const performanceTrend = [
    { month: 'May', avgScore: 78, attendance: 82, completion: 80 },
    { month: 'Jun', avgScore: 81, attendance: 85, completion: 84 },
    { month: 'Jul', avgScore: 84, attendance: 83, completion: 88 },
    { month: 'Aug', avgScore: 82, attendance: 87, completion: 91 },
    { month: 'Sep', avgScore: 86, attendance: 89, completion: 93 },
    { month: 'Oct', avgScore: 88, attendance: 90, completion: 95 },
  ];

  // Subject-wise comparative performance
  const subjectPerformance = [
    { subject: 'React Frontend', avgScore: 89, passRate: 94 },
    { subject: 'Node & Express', avgScore: 84, passRate: 91 },
    { subject: 'PostgreSQL DB', avgScore: 81, passRate: 88 },
    { subject: 'Python AI', avgScore: 86, passRate: 92 },
    { subject: 'Cloud DevOps', avgScore: 80, passRate: 85 },
  ];

  const overallAvgExam = useMemo(() => {
    if (results.length === 0) return 85;
    const sum = results.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / results.length);
  }, [results]);

  const overallAvgAtt = useMemo(() => {
    if (students.length === 0) return 88;
    const sum = students.reduce((acc, curr) => acc + (curr.attendancePercentage || 0), 0);
    return Math.round(sum / students.length);
  }, [students]);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Academic Performance Analytics"
        subtitle="Cross-sectional assessment of student learning outcomes, module mastery, and benchmark trends"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students' },
          { label: 'Performance' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Overall Exam Average"
          value={`${overallAvgExam}%`}
          icon={<Award className="w-5 h-5 text-amber-400" />}
          change="+3.2% vs last term"
          changeType="positive"
        />
        <StatCard
          title="Average Attendance"
          value={`${overallAvgAtt}%`}
          icon={<CalendarCheck className="w-5 h-5 text-emerald-400" />}
          change="Safe threshold (>75%)"
          changeType="positive"
        />
        <StatCard
          title="Assignment Submissions"
          value="94.6%"
          icon={<FileText className="w-5 h-5 text-blue-400" />}
          change="1,240 completed"
          changeType="positive"
        />
        <StatCard
          title="At-Risk Students"
          value={atRisk.length.toString()}
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          change="Requires intervention"
          changeType="negative"
          onClick={() => navigate('/admin/students/at-risk')}
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Longitudinal Performance Trend */}
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#946246]" />
              Academic Metrics Progression (Term Trend)
            </h3>
            <p className="text-xs text-[#A89A91]">Score averages vs attendance vs assignment submission %</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#946246" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#946246" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A1710" />
                <XAxis dataKey="month" stroke="#A89A91" fontSize={11} />
                <YAxis stroke="#A89A91" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1815',
                    borderColor: '#3A2922',
                    borderRadius: '8px',
                    color: '#F1E5D8',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="avgScore" name="Avg Exam %" stroke="#946246" fill="url(#scoreGrad)" />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="#10B981" fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subject-Wise Performance Breakdown */}
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Subject-Wise Average Score & Pass Rate
            </h3>
            <p className="text-xs text-[#A89A91]">Comparative analysis across fundamental technical modules</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A1710" />
                <XAxis dataKey="subject" stroke="#A89A91" fontSize={10} interval={0} angle={-15} textAnchor="end" height={40} />
                <YAxis stroke="#A89A91" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E1815',
                    borderColor: '#3A2922',
                    borderRadius: '8px',
                    color: '#F1E5D8',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgScore" name="Avg Score %" fill="#946246" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#5A321F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Performing Students Table */}
      <Card className="p-5 bg-[#171311] border-[#3A2922]">
        <h3 className="text-sm font-bold text-[#F5F0EA] mb-4 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#946246]" />
          Top Honor Students (Academic Distinction)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[#A89A91] text-[11px] font-bold uppercase">
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Course</th>
                <th className="py-2.5 px-4">Batch</th>
                <th className="py-2.5 px-4 text-center">Attendance</th>
                <th className="py-2.5 px-4 text-center">Average Exam Score</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {students
                .filter((s) => (s.attendancePercentage || 0) >= 85)
                .slice(0, 5)
                .map((stu) => (
                  <tr key={stu.id} className="hover:bg-[#1E1815]/60 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-[#F5F0EA]">
                      {stu.fullName}
                      <span className="text-[10px] text-[#A89A91] block font-mono">{stu.studentId}</span>
                    </td>
                    <td className="py-2.5 px-4 text-[#A89A91]">{stu.course}</td>
                    <td className="py-2.5 px-4 text-[#A89A91]">{stu.batch}</td>
                    <td className="py-2.5 px-4 text-center font-bold text-emerald-400">
                      {stu.attendancePercentage}%
                    </td>
                    <td className="py-2.5 px-4 text-center font-bold text-amber-300">
                      92% (Grade A+)
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/admin/students/${stu.id}`)}
                        className="text-xs text-[#946246] hover:text-[#F1E5D8] font-semibold"
                      >
                        View Dossier →
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
