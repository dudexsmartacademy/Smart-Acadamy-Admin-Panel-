import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  FileCheck2,
  GraduationCap,
  CalendarCheck,
  Clock,
  CreditCard,
  CheckCircle2,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { getStudents, getAtRiskStudents } from '../../services/studentService';
import { getAdmissions } from '../../services/admissionService';
import { getEnrollments } from '../../services/enrollmentService';
import { getExams } from '../../services/examService';
import { getFees, getPayments } from '../../services/feeService';
import { getActivityLogs } from '../../services/activityService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [atRisk, setAtRisk] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    getStudents().then(setStudents);
    getAdmissions().then(setAdmissions);
    getEnrollments().then(setEnrollments);
    getExams().then(setExams);
    getFees().then(setFees);
    getPayments().then(setPayments);
    getAtRiskStudents().then(setAtRisk);
    getActivityLogs().then((logs) => setActivities(logs.slice(0, 8)));
  }, []);

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active' || s.status === 'active').length;
  const inactiveStudents = students.filter((s) => s.status === 'Inactive' || s.status === 'inactive').length;
  const pendingAdmissions = admissions.filter((a) => a.status === 'Pending' || a.status === 'pending').length;
  const activeEnrollments = enrollments.filter((e) => e.status === 'Active' || e.status === 'active').length;
  
  const avgAttendance = useMemo(() => {
    if (students.length === 0) return 0;
    const total = students.reduce((acc, curr) => acc + (curr.attendancePercentage || 0), 0);
    return Math.round(total / students.length);
  }, [students]);

  const upcomingExams = exams.filter((e) => e.status === 'Scheduled' || e.status === 'Ongoing');
  const pendingFees = fees.filter((f) => ['Pending','Overdue','Partially Paid','pending','overdue'].includes(f.status));
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + (f.remainingAmount || 0), 0);
  const totalPaidAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Growth Chart Mock Data
  const enrollmentGrowth = [
    { month: 'May', students: 120 },
    { month: 'Jun', students: 145 },
    { month: 'Jul', students: 180 },
    { month: 'Aug', students: 210 },
    { month: 'Sep', students: 245 },
    { month: 'Oct', students: totalStudents || 280 },
  ];

  // Course Breakdown
  const courseCounts = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      const cName = s.courseName || s.course || 'General';
      map[cName] = (map[cName] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  const COLORS = ['#946246', '#7A4930', '#5A321F', '#B38062', '#D9A482'];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Management Dashboard"
        subtitle="Live command center for admissions, enrollments, academics, attendance, and fee tracking"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Student Management' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/students/at-risk')}
              className={atRisk.length > 0 ? 'border-rose-500/50 text-rose-400 hover:bg-rose-950/40' : ''}
            >
              <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-400" />
              At-Risk ({atRisk.length})
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/students/new')}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Add Student
            </Button>
          </div>
        }
      />

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents.toString()}
          icon={<Users className="w-5 h-5 text-[#946246]" />}
          secondaryInfo="+14% this month"
          to="/admin/students/list"
        />
        <StatCard
          label="Active Students"
          value={activeStudents.toString()}
          icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          secondaryInfo={`${Math.round((activeStudents / (totalStudents || 1)) * 100)}% active rate`}
          to="/admin/students/list"
        />
        <StatCard
          label="Pending Admissions"
          value={pendingAdmissions.toString()}
          icon={<FileCheck2 className="w-5 h-5 text-amber-400" />}
          secondaryInfo="Needs review"
          to="/admin/students/admissions"
        />
        <StatCard
          label="Active Enrollments"
          value={activeEnrollments.toString()}
          icon={<GraduationCap className="w-5 h-5 text-blue-400" />}
          secondaryInfo="Across all batches"
          to="/admin/students/enrollments"
        />
        <StatCard
          label="Average Attendance"
          value={`${avgAttendance}%`}
          icon={<CalendarCheck className="w-5 h-5 text-purple-400" />}
          secondaryInfo={avgAttendance >= 75 ? 'Safe overall' : 'Warning threshold'}
          to="/admin/students/attendance"
        />
      </div>

      {/* Secondary Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Upcoming Exams"
          value={upcomingExams.length.toString()}
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          secondaryInfo="Next 14 days"
          to="/admin/students/exams"
        />
        <StatCard
          label="Pending Fees"
          value={`₹${totalPendingAmount.toLocaleString()}`}
          icon={<CreditCard className="w-5 h-5 text-rose-400" />}
          secondaryInfo={`${pendingFees.length} outstanding invoices`}
          to="/admin/students/fees"
        />
        <StatCard
          label="Completed Payments"
          value={`₹${totalPaidAmount.toLocaleString()}`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          secondaryInfo={`${payments.length} transactions`}
          to="/admin/students/payments"
        />
        <StatCard
          label="Inactive Students"
          value={inactiveStudents.toString()}
          icon={<UserX className="w-5 h-5 text-neutral-400" />}
          secondaryInfo="Suspended / On Leave"
          to="/admin/students/list"
        />
      </div>

      {/* Quick Action Bar */}
      <Card className="p-4 bg-[#140F0D] border-[#3A2922]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#A89A91] mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/new')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <Users className="w-4 h-4 text-[#946246]" />
            <span className="text-[11px]">Add Student</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/admissions')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span className="text-[11px]">New Admission</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/enrollments')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-[11px]">Enroll Student</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/attendance')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Attendance</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/assignments')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-[11px]">Assignments</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/exams')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px]">Create Exam</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/results')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-pink-400" />
            <span className="text-[11px]">Add Result</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/payments')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-teal-400" />
            <span className="text-[11px]">Record Pay</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/students/certificates')}
            className="flex flex-col items-center justify-center p-3 h-auto text-center gap-1.5"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span className="text-[11px]">Certificates</span>
          </Button>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trend */}
        <Card className="p-5 lg:col-span-2 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#946246]" />
                Student Enrollment Growth
              </h3>
              <p className="text-xs text-[#A89A91]">Monthly active student trajectory</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#946246" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#946246" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#946246"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#studentGrowthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Course Distribution */}
        <Card className="p-5 bg-[#171311] border-[#3A2922] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F5F0EA] mb-1">Students by Course</h3>
            <p className="text-xs text-[#A89A91] mb-4">Distribution across active programs</p>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {courseCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1815',
                      borderColor: '#3A2922',
                      borderRadius: '8px',
                      color: '#F1E5D8',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5 mt-2 max-h-24 overflow-y-auto">
            {courseCounts.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#A89A91] truncate max-w-[160px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {c.name}
                </span>
                <span className="font-semibold text-[#F5F0EA]">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Two Column Section: Upcoming Exams & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Upcoming Academic Exams
            </h3>
            <Link
              to="/admin/students/exams"
              className="text-xs text-[#946246] hover:text-[#F1E5D8] flex items-center gap-1 font-semibold"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {upcomingExams.slice(0, 4).map((exam) => (
              <div
                key={exam.id}
                onClick={() => navigate('/admin/students/exams')}
                className="p-3 rounded-lg bg-[#140F0D] border border-[#2A1710] hover:border-[#5A321F]/60 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-semibold text-[#F5F0EA]">{exam.title}</div>
                  <div className="text-[11px] text-[#A89A91] mt-0.5">
                    {exam.courseName} • {exam.subjectName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-[#F1E5D8]">{exam.startDate}</div>
                  <span className="text-[10px] text-[#A89A91]">{exam.startTime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Activity Feed */}
        <Card className="p-5 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#F5F0EA] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recent Academy Activity
            </h3>
            <Link
              to="/admin/activity-logs"
              className="text-xs text-[#946246] hover:text-[#F1E5D8] flex items-center gap-1 font-semibold"
            >
              All Logs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#946246] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#F5F0EA] truncate">{act.action}</div>
                  <div className="text-[11px] text-[#A89A91] truncate">{act.details}</div>
                </div>
                <div className="text-[10px] font-mono text-[#A89A91] shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
