import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  Filter,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { studentService } from '../../services/studentService';
import { teacherService } from '../../services/teacherService';
import { academicCourseService } from '../../services/academicCourseService';
import { examService } from '../../services/examService';
import { feeService } from '../../services/feeService';

const GOLD = '#D4AF37';
const AMBER = '#F59E0B';
const EMERALD = '#10B981';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const ROSE = '#F43F5E';
const COLORS = [GOLD, BLUE, EMERALD, PURPLE, AMBER, ROSE];

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'institution' | 'students' | 'teachers' | 'courses' | 'attendance' | 'exams' | 'fees'
  >('institution');

  const students = studentService.getStudents();
  const teachers = teacherService.getTeachers();
  const courses = academicCourseService.getCourses();
  const exams = examService.getExams();
  const feeRecords = feeService.getFeeRecords();
  const payments = feeService.getPayments();

  // Summary Metrics
  const totalCollectedFees = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalRemainingFees = feeRecords.reduce((acc, f) => acc + f.remainingAmount, 0);
  const avgStudentAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (students.length || 1)
  );
  const avgStudentGpa = (
    students.reduce((acc, s) => acc + s.averageScore, 0) / (students.length || 1)
  ).toFixed(1);

  // Growth & Trend Mock Series
  const growthData = [
    { month: 'Apr', students: 180, teachers: 4, revenue: 32000 },
    { month: 'May', students: 210, teachers: 4, revenue: 41000 },
    { month: 'Jun', students: 235, teachers: 5, revenue: 48000 },
    { month: 'Jul', students: 250, teachers: 5, revenue: 52000 },
    { month: 'Aug', students: 272, teachers: 6, revenue: 64000 },
    { month: 'Sep', students: 286, teachers: 6, revenue: 78000 },
  ];

  // Course Distribution
  const courseDistData = courses.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 18) + '...' : c.name,
    students: c.enrolledStudentsCount,
  }));

  // Grade Breakdown
  const gradeData = [
    { grade: 'A+ (90-100%)', count: 42 },
    { grade: 'A (80-89%)', count: 78 },
    { grade: 'B (70-79%)', count: 96 },
    { grade: 'C (60-69%)', count: 48 },
    { grade: 'Fail (<50%)', count: 22 },
  ];

  // Fee Payment Methods
  const paymentMethodsData = [
    { name: 'Bank Wire / ACH', value: 45 },
    { name: 'Credit / Debit Card', value: 35 },
    { name: 'UPI Gateway', value: 15 },
    { name: 'Cash Deposit', value: 5 },
  ];

  // Low Attendance Watchlist
  const lowAttendanceStudents = students
    .filter((s) => s.attendancePercentage < 75)
    .sort((a, b) => a.attendancePercentage - b.attendancePercentage);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Institutional Analytics & Telemetry
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Real-time cohort performance, attendance health, grading distributions, and fiscal revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Global Key Figures */}
        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-300">
          <div className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10">
            <span className="text-neutral-500 block text-[10px]">Avg Attendance</span>
            <span className="text-emerald-400 font-bold text-sm">{avgStudentAttendance}%</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-white/10">
            <span className="text-neutral-500 block text-[10px]">Avg Score</span>
            <span className="text-dudex-gold font-bold text-sm">{avgStudentGpa}%</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        {[
          { id: 'institution', label: 'Institutional Overview', icon: Activity },
          { id: 'students', label: 'Student Growth', icon: GraduationCap },
          { id: 'teachers', label: 'Faculty Telemetry', icon: Users },
          { id: 'courses', label: 'Course Enrollment', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Roster', icon: CalendarCheck },
          { id: 'exams', label: 'Exam & Grade Bell', icon: Award },
          { id: 'fees', label: 'Tuition & Fiscal Flow', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-dudex-gold text-black shadow-lg shadow-dudex-gold/20'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Institution Overview */}
      {activeTab === 'institution' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-white/5">
              <p className="text-xs font-medium text-neutral-400 uppercase">Enrolled Students</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">286</h3>
              <p className="text-xs text-emerald-400 mt-1">↑ +14% vs last quarter</p>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-white/5">
              <p className="text-xs font-medium text-neutral-400 uppercase">Active Faculty</p>
              <h3 className="text-3xl font-extrabold text-white mt-2">6</h3>
              <p className="text-xs text-neutral-400 mt-1">100% active retention</p>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-white/5">
              <p className="text-xs font-medium text-neutral-400 uppercase">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">${totalCollectedFees.toLocaleString()}</h3>
              <p className="text-xs text-neutral-400 mt-1">Tuition collected</p>
            </div>
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-white/5">
              <p className="text-xs font-medium text-neutral-400 uppercase">Passing Rate</p>
              <h3 className="text-3xl font-extrabold text-dudex-gold mt-2">91.4%</h3>
              <p className="text-xs text-emerald-400 mt-1">Institutional honors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student & Revenue Growth Area Chart */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Student Enrollment & Inflow Trajectory
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={GOLD} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#888" textAnchor="middle" fontSize={11} />
                    <YAxis stroke="#888" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#140F0D', borderColor: '#D4AF37', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="students" stroke={GOLD} strokeWidth={2} fill="url(#colorStudents)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Course Enrollment Breakdown */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Cohort Distribution by Department Program
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseDistData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#888" fontSize={10} />
                    <YAxis stroke="#888" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#140F0D', borderColor: '#3B82F6', borderRadius: '12px' }}
                    />
                    <Bar dataKey="students" fill={BLUE} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Students Analytics */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Student Enrollment by Specialization
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseDistData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#888" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#888" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#140F0D', borderColor: '#10B981', borderRadius: '12px' }}
                  />
                  <Bar dataKey="students" fill={EMERALD} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Teachers */}
      {activeTab === 'teachers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <div key={t.id} className="p-6 rounded-2xl bg-neutral-900/80 border border-white/5 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover border border-dudex-gold/30" />
                <div>
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-dudex-gold">{t.designation}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between"><span>Classes Handled:</span><strong className="text-white">12 / Wk</strong></div>
                <div className="flex justify-between"><span>Notes Published:</span><strong className="text-white">28 Sets</strong></div>
                <div className="flex justify-between"><span>Faculty Rating:</span><strong className="text-emerald-400">{t.rating} / 5.0</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl bg-neutral-900/80 border border-white/5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-dudex-gold">{c.code}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{c.status}</span>
              </div>
              <h4 className="text-base font-bold text-white">{c.name}</h4>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs">
                <div className="p-2 rounded-xl bg-neutral-950">
                  <span className="text-neutral-500 block text-[10px]">Enrollment</span>
                  <strong className="text-white">{c.enrolledStudentsCount}</strong>
                </div>
                <div className="p-2 rounded-xl bg-neutral-950">
                  <span className="text-neutral-500 block text-[10px]">Credits</span>
                  <strong className="text-white">{c.credits} Cr</strong>
                </div>
                <div className="p-2 rounded-xl bg-neutral-950">
                  <span className="text-neutral-500 block text-[10px]">Fee / Student</span>
                  <strong className="text-dudex-gold">${c.totalFee}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Attendance */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-rose-500/20 shadow-xl">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low Attendance Watchlist (Threshold &lt; 75%)
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Students at risk of examination debarment due to insufficient biometric lecture attendance.
            </p>

            <div className="space-y-2.5">
              {lowAttendanceStudents.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt={s.fullName} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-white text-xs">{s.fullName}</h4>
                      <p className="text-[11px] text-neutral-500">{s.courseName} • {s.studentId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-rose-400">{s.attendancePercentage}%</span>
                    <p className="text-[10px] text-neutral-500">Attendance Standing</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Exams */}
      {activeTab === 'exams' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Academic Grade Distribution (Bell Curve)
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="grade" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#140F0D', borderColor: '#8B5CF6', borderRadius: '12px' }}
                  />
                  <Bar dataKey="count" fill={PURPLE} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Midterm Examination Summary
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex justify-between items-center">
                <span>Total Scheduled Exams</span>
                <strong className="text-white text-base">{exams.length}</strong>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex justify-between items-center">
                <span>Highest Score Recorded</span>
                <strong className="text-emerald-400 text-base">96 / 100 (A+)</strong>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex justify-between items-center">
                <span>Average Class Pass %</span>
                <strong className="text-dudex-gold text-base">91.4%</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Fees */}
      {activeTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Payment Gateway & Method Distribution
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#140F0D', borderColor: '#D4AF37', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-white/5 shadow-xl flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Fiscal Health & Collection Target
            </h3>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/20 flex justify-between items-center">
                <span className="text-neutral-400">Total Cleared Receipts</span>
                <strong className="text-emerald-400 text-lg">${totalCollectedFees.toLocaleString()}</strong>
              </div>
              <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/20 flex justify-between items-center">
                <span className="text-neutral-400">Pending Installments</span>
                <strong className="text-amber-400 text-lg">${totalRemainingFees.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
