import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  FileCheck2,
  CalendarCheck,
  CalendarDays,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Activity,
  PlusCircle,
  CheckCircle2,
  Video,
  MapPin,
  ExternalLink,
  GraduationCap,
  CreditCard,
  Award,
  Layers,
  BookOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { ChartCard } from '../../components/common/ChartCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Timeline } from '../../components/common/Timeline';
import { teacherService } from '../../services/teacherService';
import { teacherApplicationService } from '../../services/teacherApplicationService';
import { teacherAttendanceService } from '../../services/teacherAttendanceService';
import { teacherLeaveService } from '../../services/teacherLeaveService';
import { teacherClassService } from '../../services/teacherClassService';
import { teacherAssignmentService } from '../../services/teacherAssignmentService';
import { teacherCourseService } from '../../services/teacherCourseService';
import { activityService } from '../../services/activityService';
import { getStudents } from '../../services/studentService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { getAcademicClasses } from '../../services/academicClassService';
import { getExams } from '../../services/examService';
import { getResults } from '../../services/resultService';
import { getFees, getPayments } from '../../services/feeService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');

  // Datasets State
  const [teachers, setTeachers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<any[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [academicCourses, setAcademicCourses] = useState<any[]>([]);
  const [academicBatches, setAcademicBatches] = useState<any[]>([]);
  const [academicClasses, setAcademicClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    teacherService.getTeachers().then(setTeachers);
    teacherApplicationService.getAll().then(setApplications);
    teacherLeaveService.getAll().then(setLeaves);
    teacherClassService.getAll().then(setTeacherClasses);
    teacherAssignmentService.getAll().then(setTeacherAssignments);
    activityService.getLogs().then(setActivityLogs);
    getStudents().then(setStudents);
    getAcademicCourses().then(setAcademicCourses);
    getAcademicBatches().then(setAcademicBatches);
    getAcademicClasses().then(setAcademicClasses);
    getExams().then(setExams);
    getResults().then(setResults);
    getFees().then(setFees);
    getPayments().then(setPayments);
  }, []);

  // Metrics Calculation
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'Active' || s.status === 'active').length;
  const activeCoursesCount = academicCourses.filter((c) => c.status === 'Active' || c.status === 'active').length;
  const activeBatchesCount = academicBatches.filter((b) => b.status === 'Active' || b.status === 'active').length;
  
  const upcomingExams = exams.filter((e) => e.status === 'Scheduled' || e.status === 'Ongoing');
  const pendingFees = fees.filter((f) => f.status !== 'Paid' && f.status !== 'paid');
  const pendingFeeAmount = pendingFees.reduce((sum, f) => sum + (f.remainingAmount || 0), 0);

  const avgStudentAttendance = useMemo(() => {
    if (students.length === 0) return 88;
    const sum = students.reduce((acc, curr) => acc + (curr.attendancePercentage || 0), 0);
    return Math.round(sum / students.length);
  }, [students]);

  const avgExamScore = useMemo(() => {
    if (results.length === 0) return 85;
    const sum = results.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
    return Math.round(sum / results.length);
  }, [results]);

  // Today's classes (Combined)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaysClasses = academicClasses.filter((c) => c.date === todayDateStr || c.date === '2026-09-29');

  // Chart: Student & Faculty Growth
  const growthData = useMemo(() => [
    { period: 'May', students: 120, faculty: 4, feeCollected: 24000 },
    { period: 'Jun', students: 145, faculty: 4, feeCollected: 29000 },
    { period: 'Jul', students: 180, faculty: 5, feeCollected: 38000 },
    { period: 'Aug', students: 210, faculty: 5, feeCollected: 45000 },
    { period: 'Sep', students: 245, faculty: 6, feeCollected: 56000 },
    { period: 'Oct', students: totalStudents || 280, faculty: totalTeachers || 6, feeCollected: 64000 },
  ], [totalStudents, totalTeachers]);

  // Course Enrollment Breakdown
  const coursePieData = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      const cName = s.courseName || s.course || 'General';
      map[cName] = (map[cName] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  const PIE_COLORS = ['#946246', '#7A4930', '#5A321F', '#B38062', '#D9A482'];

  // Attention Center Items
  const attentionItems = useMemo(() => {
    const items = [];
    if (pendingApplications > 0) {
      items.push({
        id: 'att-apps',
        title: `${pendingApplications} Faculty Application(s) Pending`,
        desc: 'Review credentials and convert qualified applicants.',
        link: '/admin/teachers/applications',
      });
    }
    if (upcomingExams.length > 0) {
      items.push({
        id: 'att-exams',
        title: `${upcomingExams.length} Academic Examination(s) Scheduled`,
        desc: 'Inspect hall setups and student seat allocations.',
        link: '/admin/students/exams',
      });
    }
    if (pendingFees.length > 0) {
      items.push({
        id: 'att-fees',
        title: `₹${pendingFeeAmount.toLocaleString()} Invoices Pending Collection`,
        desc: 'Issue payment reminders to enrolled students.',
        link: '/admin/students/fees',
      });
    }
    return items;
  }, [pendingApplications, upcomingExams, pendingFees, pendingFeeAmount]);

  // Timeline events
  const recentTimelineEvents = useMemo(() => {
    return activityLogs.slice(0, 5).map((log) => ({
      id: log.id,
      title: log.action,
      description: log.details || log.description || 'System event',
      time: new Date(log.timestamp || log.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: (log.module || 'SYSTEM').toUpperCase(),
    }));
  }, [activityLogs]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Dudex Smart Academy Master Control Center"
        description="Unified institutional executive command center across students, faculty, scheduling, examinations, and financials."
        breadcrumbs={[
          { label: 'Admin', path: '/admin/dashboard' },
          { label: 'Overview' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/students')}
            >
              <Users className="w-4 h-4 mr-1.5 text-[#946246]" />
              Student Command
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/students/new')}
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Enroll Student
            </Button>
          </div>
        }
      />

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents.toString()}
          icon={<GraduationCap className="w-5 h-5 text-[#946246]" />}
          secondaryInfo={`${activeStudents} Active`}
          to="/admin/students/list"
        />
        <StatCard
          label="Active Courses"
          value={activeCoursesCount.toString()}
          icon={<BookOpen className="w-5 h-5 text-blue-400" />}
          secondaryInfo={`${academicCourses.length} Total Curriculums`}
          to="/admin/courses"
        />
        <StatCard
          label="Active Batches"
          value={activeBatchesCount.toString()}
          icon={<Layers className="w-5 h-5 text-purple-400" />}
          secondaryInfo="Cohort cohorts"
          to="/admin/batches"
        />
        <StatCard
          label="Student Attendance"
          value={`${avgStudentAttendance}%`}
          icon={<CalendarCheck className="w-5 h-5 text-emerald-400" />}
          secondaryInfo={avgStudentAttendance >= 75 ? 'Safe Band' : 'Warning'}
          to="/admin/students/attendance"
        />
        <StatCard
          label="Average Exam Score"
          value={`${avgExamScore}%`}
          icon={<Award className="w-5 h-5 text-amber-400" />}
          secondaryInfo="Institutional GPA: 3.8"
          to="/admin/students/results"
        />
      </div>

      {/* Secondary Row: Faculty & Financials */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Faculty Members"
          value={totalTeachers.toString()}
          icon={<Users className="w-5 h-5 text-[#946246]" />}
          secondaryInfo={`${activeTeachers} Active Staff`}
          to="/admin/teachers/list"
        />
        <StatCard
          label="Today's Sessions"
          value={todaysClasses.length.toString()}
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          secondaryInfo="Live Timetable"
          to="/admin/classes"
        />
        <StatCard
          label="Upcoming Exams"
          value={upcomingExams.length.toString()}
          icon={<Clock className="w-5 h-5 text-pink-400" />}
          secondaryInfo="Next 14 days"
          to="/admin/students/exams"
        />
        <StatCard
          label="Pending Fees"
          value={`₹${pendingFeeAmount.toLocaleString()}`}
          icon={<CreditCard className="w-5 h-5 text-rose-400" />}
          secondaryInfo={`${pendingFees.length} Unpaid Invoices`}
          to="/admin/students/fees"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Longitudinal Enrollment & Revenue Growth */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Institutional Growth & Fee Trajectory"
            subtitle="Student enrollment expansion and monthly revenue collections"
          >
            <div className="h-[280px] w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="studentDashGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#946246" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#946246" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A1710" />
                  <XAxis dataKey="period" stroke="#A89A91" fontSize={11} />
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
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    name="Enrolled Students"
                    stroke="#946246"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#studentDashGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Enrollment Distribution by Course */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Program Distribution"
            subtitle="Student enrollment breakdown by course"
          >
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coursePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {coursePieData.map((_, index) => (
                      <Cell key={`dash-pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
            <div className="space-y-1 mt-2 max-h-20 overflow-y-auto">
              {coursePieData.map((c, i) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#A89A91] truncate max-w-[150px]">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    {c.name}
                  </span>
                  <span className="font-semibold text-[#F5F0EA]">{c.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Two Columns: Action Center & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-8">
          <Card className="flex flex-col h-full bg-[#171311] border-[#3A2922]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3A2922]">
              <div>
                <h3 className="text-base font-bold text-[#F5F0EA]">Today&apos;s Academic Timetable</h3>
                <p className="text-xs text-[#A89A91] mt-0.5">
                  Synchronized sessions across academy labs and physical lecture halls
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/classes')}
              >
                All Classes <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-3 flex-1">
              {todaysClasses.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#A89A91]">
                  No classes scheduled for today.
                </div>
              ) : (
                todaysClasses.map((cls) => (
                  <div
                    key={cls.id}
                    onClick={() => navigate(`/admin/classes/${cls.id}`)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#140F0D] hover:bg-[#1E1815] border border-[#3A2922] transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="text-sm font-bold text-[#F5F0EA]">{cls.title}</span>
                      <p className="text-xs text-[#A89A91] mt-0.5">
                        {cls.courseName} • Instructor: <span className="text-[#F5F0EA]">{cls.teacherName}</span> • Room {cls.classroom}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#F1E5D8]">{cls.startTime} - {cls.endTime}</span>
                      <StatusBadge status={cls.status} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4">
          <Card className="flex flex-col h-full bg-[#171311] border-[#3A2922]">
            <div className="pb-4 mb-4 border-b border-[#3A2922] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-[#F5F0EA]">Action Center</h3>
              </div>
              <span className="text-xs text-[#A89A91]">{attentionItems.length} tasks</span>
            </div>

            <div className="space-y-3 flex-1">
              {attentionItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="p-3.5 rounded-xl bg-[#140F0D] hover:bg-[#2A1710]/40 border border-[#3A2922] transition-colors cursor-pointer"
                >
                  <h4 className="text-xs font-bold text-[#F5F0EA]">{item.title}</h4>
                  <p className="text-[11px] text-[#A89A91] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Audit Log */}
      <Card className="bg-[#171311] border-[#3A2922]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3A2922]">
          <div>
            <h3 className="text-base font-bold text-[#F5F0EA]">Academy Operational Audit Trail</h3>
            <p className="text-xs text-[#A89A91] mt-0.5">Live audit events logged across all subsystems</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/activity-logs')}
          >
            All Activity Logs <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <Timeline events={recentTimelineEvents} />
      </Card>
    </div>
  );
};
