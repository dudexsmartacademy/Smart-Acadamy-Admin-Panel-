import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Check,
  Search,
  Users,
  CalendarCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { getStudents } from '../../services/studentService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { getStudentAttendance } from '../../services/studentAttendanceService';
import { AcademicBatch, Student, StudentAttendance } from '../../types';

export const StudentAttendancePage: React.FC = () => {
  const navigate = useNavigate();

  const [allBatches, setAllBatches] = useState<string[]>(['All Batches', 'Batch 1', 'Batch 2', 'Batch 3']);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allAttendanceRecords, setAllAttendanceRecords] = useState<StudentAttendance[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const [stus, recs, bts] = await Promise.all([
        getStudents(),
        getStudentAttendance(),
        getAcademicBatches(),
      ]);
      setAllStudents(stus);
      setAllAttendanceRecords(recs);

      const batchNames = ['All Batches', 'Batch 1', 'Batch 2', 'Batch 3'];
      bts.forEach((b) => {
        if (!batchNames.includes(b.name)) {
          batchNames.push(b.name);
        }
      });
      setAllBatches(batchNames);
    };
    load();
  }, []);

  // Filtered students by batch and search
  const filteredStudents = useMemo(() => {
    return allStudents.filter((s) => {
      // Batch filter
      if (selectedBatch !== 'All Batches') {
        const matchesBatch =
          s.batch === selectedBatch ||
          s.batchName === selectedBatch ||
          (selectedBatch === 'Batch 1' &&
            ['stu-107', 'stu-108', 'stu-109', 'stu-110', 'stu-111', 'stu-112'].includes(
              s.id
            ));
        if (!matchesBatch) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          (s.courseName && s.courseName.toLowerCase().includes(q)) ||
          (s.batchName && s.batchName.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [allStudents, selectedBatch, searchQuery]);

  // Batch Dropdown outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.attendance-batch-dropdown')) {
        setIsBatchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Stats
  const totalStudentsCount = filteredStudents.length;
  const avgAttendance =
    filteredStudents.length > 0
      ? Math.round(
          filteredStudents.reduce(
            (acc, s) => acc + (s.attendancePercentage || 85),
            0
          ) / filteredStudents.length
        )
      : 85;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Student Attendance Records"
        description="Select batch and date to view student attendance registry. Click on any student to inspect detailed subject-wise attendance analytics."
        breadcrumbs={[
          { label: 'Student Management', path: '/admin/students' },
          { label: 'Student Attendance' },
        ]}
        actions={
          <button
            type="button"
            onClick={() => navigate('/admin/students/mark-attendance')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#946246] hover:bg-[#7A4930] text-[#F5F0EA] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <CalendarCheck className="w-4 h-4" />
            Mark Attendance
          </button>
        }
      />

      {/* Filter Card matching Screenshot 1 (Batch & Date) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Batch Selector */}
          <div className="space-y-1.5 relative attendance-batch-dropdown">
            <label className="block text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
              Batch
            </label>
            <button
              type="button"
              onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
              className="w-full h-11 px-4 rounded-xl bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] text-[#F5F0EA] flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-[#946246]/40 cursor-pointer"
            >
              <span className="text-sm font-medium">{selectedBatch}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] transition-transform duration-200 ${
                  isBatchDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {isBatchDropdownOpen && (
              <div className="absolute z-30 left-0 right-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
                {allBatches.map((batchName) => {
                  const isSelected = selectedBatch === batchName;
                  return (
                    <button
                      key={batchName}
                      type="button"
                      onClick={() => {
                        setSelectedBatch(batchName);
                        setIsBatchDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                          : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                      }`}
                    >
                      <span>{batchName}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#946246]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-xl bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#946246]/40 transition-all cursor-pointer"
              />
              <CalendarIcon className="w-4 h-4 text-[#A89A91] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-[#A89A91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students by name, ID, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#140F0D] border border-[#3A2922] text-xs text-[#F5F0EA] placeholder-[#A89A91] focus:outline-none focus:ring-2 focus:ring-[#946246]/40"
            />
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 bg-[#140F0D] border-b border-[#3A2922] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
            Student Registry ({filteredStudents.length} Found)
          </span>
          <span className="text-xs text-[#A89A91]">
            Click any student to view complete attendance breakdown
          </span>
        </div>

        <div className="divide-y divide-[#2A1E19]">
          {filteredStudents.length === 0 ? (
            <div className="py-14 text-center text-[#A89A91] text-sm">
              No students found for the selected batch or search criteria.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const attendanceRate = student.attendancePercentage || 85;
              const isSafe = attendanceRate >= 75;

              // Find attendance on selected date if recorded
              const dateMatch = allAttendanceRecords.find(
                (r) => r.studentId === student.id && r.date === selectedDate
              );
              const dateStatus = dateMatch ? dateMatch.status : 'Present';
              const isPresentOnDate = dateStatus === 'Present' || dateStatus === 'present';

              return (
                <div
                  key={student.id}
                  onClick={() => navigate(`/admin/students/attendance/${student.id}`)}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#1E1815] transition-colors cursor-pointer group"
                >
                  {/* Left: Avatar & Student Details */}
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        student.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                      }
                      alt={student.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-[#3A2922]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#F5F0EA] group-hover:text-[#F1E5D8] transition-colors">
                          {student.fullName}
                        </span>
                        <span className="text-[11px] font-mono text-[#A89A91] bg-[#140F0D] px-2 py-0.5 rounded border border-[#3A2922]">
                          {student.studentId}
                        </span>
                      </div>
                      <p className="text-xs text-[#A89A91] mt-0.5">
                        {student.batchName || student.batch || 'Batch 1'} •{' '}
                        {student.courseName || student.course || 'Advanced Computer Science'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Action */}
                  <div className="flex items-center gap-4">
                    {/* Attendance on Selected Date */}
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-[#A89A91] uppercase block">
                        Status on {selectedDate}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-0.5 ${
                          isPresentOnDate
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/30'
                            : 'bg-rose-950/40 text-rose-400 border-rose-600/30'
                        }`}
                      >
                        {dateStatus}
                      </span>
                    </div>

                    {/* Overall Compliance */}
                    <div className="text-right">
                      <span className="text-[10px] text-[#A89A91] uppercase block">
                        Overall Rate
                      </span>
                      <span
                        className={`text-sm font-bold block ${
                          isSafe ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {attendanceRate}%
                      </span>
                    </div>

                    {/* Arrow Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/students/attendance/${student.id}`);
                      }}
                      className="p-2 rounded-xl bg-[#140F0D] hover:bg-[#2A1E19] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer group-hover:border-[#946246]/50"
                      title="View Attendance Breakdown"
                    >
                      <ArrowRight className="w-4 h-4 text-[#946246]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
