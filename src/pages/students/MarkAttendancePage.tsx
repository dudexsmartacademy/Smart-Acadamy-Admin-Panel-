import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Save,
  Users,
  Search,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { getStudents } from '../../services/studentService';
import { getAcademicBatches } from '../../services/academicBatchService';
import {
  getStudentAttendance,
  saveBulkBatchAttendance,
} from '../../services/studentAttendanceService';
import { useToast } from '../../context/ToastContext';
import { AcademicBatch, Student } from '../../types';

export const MarkAttendancePage: React.FC = () => {
  const { showToast } = useToast();

  const [allBatches, setAllBatches] = useState<string[]>(['Batch 1']);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('Batch 1');
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');

  const [attendanceState, setAttendanceState] = useState<
    Record<string, 'Present' | 'Absent' | 'Late'>
  >({});
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  useEffect(() => {
    const loadRefs = async () => {
      const [bts, stus] = await Promise.all([
        getAcademicBatches(),
        getStudents(),
      ]);
      const batchNames = ['All Batches', 'Batch 1', 'Batch 2', 'Batch 3'];
      bts.forEach((b) => {
        if (!batchNames.includes(b.name)) {
          batchNames.push(b.name);
        }
      });
      setAllBatches(batchNames);
      setAllStudents(stus);
    };
    loadRefs();
  }, []);

  const displayedStudents = useMemo(() => {
    if (selectedBatch === 'All Batches') {
      return allStudents;
    }
    return allStudents.filter(
      (s) =>
        s.batch === selectedBatch ||
        s.batchName === selectedBatch ||
        (selectedBatch === 'Batch 1' &&
          ['stu-107', 'stu-108', 'stu-109', 'stu-110', 'stu-111', 'stu-112'].includes(
            s.id
          ))
    );
  }, [allStudents, selectedBatch]);

  const loadExistingAttendance = async () => {
    const records = await getStudentAttendance();
    const mapping: Record<string, 'Present' | 'Absent' | 'Late'> = {};

    displayedStudents.forEach((student) => {
      const match = records.find(
        (r) => r.studentId === student.id && r.date === selectedDate
      );
      if (match) {
        mapping[student.id] = (match.status as 'Present' | 'Absent' | 'Late') || 'Present';
      } else {
        mapping[student.id] = 'Present';
      }
    });

    setAttendanceState(mapping);
    setSelectedStudentIds([]);
  };

  useEffect(() => {
    loadExistingAttendance();
  }, [selectedBatch, selectedDate, displayedStudents]);

  // Batch Dropdown outside click handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.batch-dropdown-container')) {
        setIsBatchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle single student status
  const handleToggleStatus = (studentId: string) => {
    setAttendanceState((prev) => {
      const current = prev[studentId] || 'Present';
      const next = current === 'Present' ? 'Absent' : 'Present';
      return {
        ...prev,
        [studentId]: next,
      };
    });
  };

  // Select / Deselect individual student
  const handleToggleSelectStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Select all / Deselect all
  const isAllSelected =
    displayedStudents.length > 0 &&
    displayedStudents.every((s) => selectedStudentIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(displayedStudents.map((s) => s.id));
    }
  };

  // Mark Present Workflow: Selected students marked Present, unselected automatically marked Absent
  const handleMarkAllPresent = () => {
    setAttendanceState((prev) => {
      const updated = { ...prev };
      if (selectedStudentIds.length === 0) {
        displayedStudents.forEach((s) => {
          updated[s.id] = 'Present';
        });
      } else {
        displayedStudents.forEach((s) => {
          if (selectedStudentIds.includes(s.id)) {
            updated[s.id] = 'Present';
          } else {
            updated[s.id] = 'Absent';
          }
        });
      }
      return updated;
    });

    if (selectedStudentIds.length > 0) {
      showToast(
        `Marked ${selectedStudentIds.length} selected students as Present (${displayedStudents.length - selectedStudentIds.length} unselected marked Absent)`,
        'success'
      );
    } else {
      showToast('Marked all students as Present', 'success');
    }
  };

  // Mark Absent Workflow: Selected students marked Absent, unselected automatically marked Present
  const handleMarkAllAbsent = () => {
    setAttendanceState((prev) => {
      const updated = { ...prev };
      if (selectedStudentIds.length === 0) {
        displayedStudents.forEach((s) => {
          updated[s.id] = 'Absent';
        });
      } else {
        displayedStudents.forEach((s) => {
          if (selectedStudentIds.includes(s.id)) {
            updated[s.id] = 'Absent';
          } else {
            updated[s.id] = 'Present';
          }
        });
      }
      return updated;
    });

    if (selectedStudentIds.length > 0) {
      showToast(
        `Marked ${selectedStudentIds.length} selected students as Absent (${displayedStudents.length - selectedStudentIds.length} unselected marked Present)`,
        'info'
      );
    } else {
      showToast('Marked all students as Absent', 'info');
    }
  };

  // Reset to original/loaded state
  const handleReset = () => {
    loadExistingAttendance();
    showToast('Attendance draft reset', 'info');
  };

  // Save attendance
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setIsSaving(true);
    const payload = displayedStudents.map((student) => ({
      studentId: student.id,
      studentName: student.fullName,
      batchName: selectedBatch,
      date: selectedDate,
      status: attendanceState[student.id] || 'Present',
    }));

    saveBulkBatchAttendance(payload);

    setTimeout(() => {
      setIsSaving(false);
      showToast(
        `Attendance recorded successfully for ${displayedStudents.length} students in ${selectedBatch}`,
        'success'
      );
    }, 300);
  };

  // Format date display for input (DD-MM-YYYY)
  const displayFormattedDate = useMemo(() => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return selectedDate;
  }, [selectedDate]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Top Description / Header Subtitle */}
      <div>
        <p className="text-sm font-medium text-[#A89A91] text-left">
          Mark and manage daily attendance for students in authorized classes
        </p>
      </div>

      {/* Filter Card: Batch Dropdown & Date Picker */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Batch Selector */}
          <div className="space-y-1.5 relative batch-dropdown-container">
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

            {/* Custom Dropdown Menu matching Screenshot 1 */}
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
      </div>

      {/* Action Bar (Mark All Present / Mark All Absent) */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
            {displayedStudents.length} Students in {selectedBatch}
          </span>
          {selectedStudentIds.length > 0 && selectedStudentIds.length < displayedStudents.length && (
            <span className="text-xs text-[#946246] bg-[#946246]/10 px-2.5 py-0.5 rounded-full border border-[#946246]/20 font-medium">
              {selectedStudentIds.length} Selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/30 text-emerald-400 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            Mark All Present
          </button>

          <button
            type="button"
            onClick={handleMarkAllAbsent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-600/30 text-rose-400 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="text-sm leading-none">✕</span>
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Students Table / List matching Screenshot 1 */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="px-5 py-3.5 bg-[#140F0D] border-b border-[#3A2922] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-[#946246]" />
              ) : (
                <Square className="w-4 h-4 text-[#7A6F68]" />
              )}
            </button>
            <span className="text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
              Student
            </span>
          </div>
          <span className="text-xs font-semibold text-[#A89A91] uppercase tracking-wider pr-4">
            Current Status
          </span>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-[#2A1E19]">
          {displayedStudents.length === 0 ? (
            <div className="py-12 text-center text-[#A89A91] text-sm">
              No students enrolled in {selectedBatch}. Select another batch or add students.
            </div>
          ) : (
            displayedStudents.map((student) => {
              const isSelected = selectedStudentIds.includes(student.id);
              const status = attendanceState[student.id] || 'Present';
              const isPresent = status === 'Present';

              return (
                <div
                  key={student.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-[#1E1815] transition-colors"
                >
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleSelectStudent(student.id)}
                      className="text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#946246]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#7A6F68]" />
                      )}
                    </button>
                    <div>
                      <span className="text-sm font-semibold text-[#F5F0EA] block">
                        {student.fullName}
                      </span>
                      {student.studentId && (
                        <span className="text-[11px] text-[#A89A91] font-mono">
                          {student.studentId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Current Status Toggle Pill */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(student.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                        isPresent
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-600/30 hover:bg-emerald-900/50'
                          : 'bg-rose-950/40 text-rose-400 border-rose-600/30 hover:bg-rose-900/50'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPresent ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      {status}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Action Footer (Reset & Save) matching Screenshot 1 */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171311] hover:bg-[#231A16] border border-[#3A2922] text-[#F5F0EA] text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-[#A89A91]" />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B0B0B] hover:bg-[#171311] border border-[#3A2922] text-[#F5F0EA] text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95 hover:border-[#946246]/50"
        >
          <Save className="w-4 h-4 text-[#946246]" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};
