import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Printer,
  Calendar,
  Layers,
  Search,
  Users,
  GraduationCap,
  CreditCard,
  BookOpen,
  Sparkles,
  CheckCircle,
  Clock,
  ArrowDownToLine,
  RefreshCw,
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { teacherService } from '../../services/teacherService';
import { studentAttendanceService } from '../../services/studentAttendanceService';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { feeService } from '../../services/feeService';
import { academicCourseService } from '../../services/academicCourseService';
import { academicBatchService } from '../../services/academicBatchService';
import { activityService } from '../../services/activityService';
import { useToast } from '../../context/ToastContext';

type ReportType =
  | 'students'
  | 'teachers'
  | 'attendance'
  | 'exams'
  | 'results'
  | 'fees'
  | 'payments'
  | 'courses'
  | 'batches'
  | 'activity';

export const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportType>('students');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '2026-08-01', end: '2026-09-30' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = [
    { id: 'students', label: 'Student Directory & Dossiers', icon: GraduationCap, desc: 'Complete enrollments, contact details, GPAs, and attendance standing.' },
    { id: 'teachers', label: 'Faculty & Instructors', icon: Users, desc: 'Teaching loads, assigned courses, qualification credentials, and status.' },
    { id: 'attendance', label: 'Attendance & Threshold Records', icon: Calendar, desc: 'Biometric lecture attendance logs, absence counts, and at-risk alerts.' },
    { id: 'exams', label: 'Examination Schedules', icon: Layers, desc: 'Hall tickets, test durations, maximum marks, and room seating.' },
    { id: 'results', label: 'Grades & Academic Transcripts', icon: FileSpreadsheet, desc: 'Student test scores, percentage ranks, passing grades, and evaluator notes.' },
    { id: 'fees', label: 'Tuition Fees & Invoices', icon: CreditCard, desc: 'Outstanding balances, fee plans, due dates, and collection health.' },
    { id: 'payments', label: 'Payment Transactions', icon: CreditCard, desc: 'Settled receipts, bank wire references, and gateway logs.' },
    { id: 'courses', label: 'Academic Courses & Credits', icon: BookOpen, desc: 'Departmental curriculums, credit weights, and lead faculty.' },
    { id: 'batches', label: 'Cohort Batches', icon: Layers, desc: 'Cohort timelines, student capacities, and assigned mentor faculty.' },
    { id: 'activity', label: 'System Audit Logs', icon: Clock, desc: 'Administrative operations, security events, and database mutations.' },
  ];

  // Retrieve data based on selected report
  const reportData = useMemo(() => {
    switch (selectedReport) {
      case 'students':
        return studentService.getStudents().map((s) => ({
          'ID Code': s.studentId,
          'Full Name': s.fullName,
          Email: s.email,
          Phone: s.phone,
          'Department / Course': s.courseName || s.department,
          Batch: s.batchName,
          'Attendance %': `${s.attendancePercentage}%`,
          'Average Score': `${s.averageScore}%`,
          Status: s.status,
          'Enrollment Date': s.enrollmentDate,
        }));
      case 'teachers':
        return teacherService.getTeachers().map((t) => ({
          'Teacher ID': t.id,
          'Faculty Name': t.name,
          Designation: t.designation,
          Department: t.department,
          Email: t.email,
          Experience: t.experience,
          Status: t.status,
          Rating: `${t.rating} / 5.0`,
        }));
      case 'attendance':
        return studentAttendanceService.getAttendanceRecords().map((a) => ({
          'Record ID': a.id,
          'Student Name': a.studentName,
          Date: a.date,
          Course: a.courseName,
          Session: a.session,
          Status: a.status.toUpperCase(),
          'Recorded By': a.recordedBy || 'System Scanner',
        }));
      case 'exams':
        return examService.getExams().map((e) => ({
          'Exam Code': e.examCode,
          Title: e.title,
          Course: e.courseName,
          'Date & Time': `${e.startDate} (${e.startTime})`,
          Room: e.room,
          'Total Marks': e.totalMarks,
          'Passing Marks': e.passingMarks,
          Mode: e.mode.toUpperCase(),
          Status: e.status,
        }));
      case 'results':
        return resultService.getResults().map((r) => ({
          'Result Code': r.resultCode,
          'Student ID': r.studentIdCode,
          'Student Name': r.studentName,
          Course: r.courseName,
          'Marks Obtained': `${r.marksObtained} / ${r.maxMarks}`,
          Percentage: `${r.percentage}%`,
          Grade: r.grade,
          Result: r.resultStatus.toUpperCase(),
          'Evaluated By': r.evaluatorTeacherName,
        }));
      case 'fees':
        return feeService.getFeeRecords().map((f) => ({
          'Invoice #': f.invoiceNumber,
          'Student ID': f.studentIdCode,
          'Student Name': f.studentName,
          Course: f.courseName,
          'Fee Plan': f.feePlan,
          'Total Due': `$${f.totalAmount}`,
          'Paid Amount': `$${f.paidAmount}`,
          'Remaining Balance': `$${f.remainingAmount}`,
          'Due Date': f.dueDate,
          Status: f.status.toUpperCase(),
        }));
      case 'payments':
        return feeService.getPayments().map((p) => ({
          'Receipt #': p.receiptNumber,
          'Student Name': p.studentName,
          'Amount Paid': `$${p.amount}`,
          'Payment Date': new Date(p.paymentDate).toLocaleDateString(),
          Method: p.paymentMethod,
          Reference: p.transactionReference,
          Collector: p.collectedBy,
          Status: p.status.toUpperCase(),
        }));
      case 'courses':
        return academicCourseService.getCourses().map((c) => ({
          Code: c.code,
          'Course Name': c.name,
          Department: c.department,
          Duration: `${c.durationMonths} Months`,
          Credits: c.credits,
          'Tuition Fee': `$${c.totalFee}`,
          'Lead Faculty': c.leadTeacherName,
          Status: c.status,
        }));
      case 'batches':
        return academicBatchService.getBatches().map((b) => ({
          Code: b.batchCode,
          'Batch Name': b.name,
          Course: b.courseName,
          Department: b.department,
          'Timeline Duration': `${b.startDate} to ${b.endDate}`,
          Mentor: b.mentorTeacherName,
          Enrollment: `${b.studentCount} / ${b.studentCapacity}`,
          Status: b.status,
        }));
      case 'activity':
        return activityService.getRecentLogs(50).map((l) => ({
          Timestamp: l.timestamp,
          Actor: l.actor,
          Role: l.role,
          Module: l.module,
          Action: l.action,
          Entity: l.entity,
          Details: l.description,
        }));
      default:
        return [];
    }
  }, [selectedReport]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return reportData;
    return reportData.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [reportData, searchQuery]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      showToast('No data to export', 'error');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of filteredData) {
      const values = headers.map((header) => {
        const val = (row as any)[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Dudex_${selectedReport}_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredData.length} rows to CSV`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const currentCategory = reportCategories.find((r) => r.id === selectedReport);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Institutional Reports Center
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Generate, filter, print, and export CSV spreadsheets across all academy dimensions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all"
          >
            <Printer className="w-4 h-4" /> Print Document
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <ArrowDownToLine className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Category Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {reportCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedReport === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedReport(cat.id as ReportType)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-dudex-gold/15 to-amber-950/30 border-dudex-gold/50 shadow-lg shadow-dudex-gold/5'
                  : 'bg-neutral-950/60 border-white/5 hover:border-white/20 text-neutral-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? 'text-dudex-gold' : 'text-neutral-500'}`} />
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-dudex-gold animate-pulse" />
                )}
              </div>
              <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : ''}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${currentCategory?.label}...`}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-dudex-gold/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs text-neutral-400">
          <span className="font-semibold text-white">
            Displaying: <strong className="text-dudex-gold">{filteredData.length} records</strong>
          </span>
        </div>
      </div>

      {/* Generated Report Data Table Preview */}
      <div className="rounded-2xl bg-neutral-900/60 border border-white/5 p-4 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-dudex-gold" />
              {currentCategory?.label} (Generated Output)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">{currentCategory?.desc}</p>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="p-16 text-center text-neutral-500">
            No rows match the specified query filters.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="sticky top-0 bg-neutral-950 border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[11px] z-10">
                <tr>
                  {Object.keys(filteredData[0]).map((header) => (
                    <th key={header} className="py-3 px-4 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    {Object.values(row).map((val: any, cellIdx) => (
                      <td key={cellIdx} className="py-3 px-4 whitespace-nowrap font-medium text-neutral-200">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
