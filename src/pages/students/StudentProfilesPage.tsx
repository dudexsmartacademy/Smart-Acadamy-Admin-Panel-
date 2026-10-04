import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Search,
  ChevronDown,
  Check,
  GraduationCap,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Edit,
  Building,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { getStudents } from '../../services/studentService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { Student } from '../../types';

export const StudentProfilesPage: React.FC = () => {
  const navigate = useNavigate();

  // Batches
  const allBatches = useMemo(() => {
    const list = getAcademicBatches();
    const batchNames = ['All Batches', 'Batch 1', 'Batch 2', 'Batch 3'];
    list.forEach((b) => {
      if (!batchNames.includes(b.name)) {
        batchNames.push(b.name);
      }
    });
    return batchNames;
  }, []);

  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Batch filter
      if (selectedBatch !== 'All Batches') {
        const matchesBatch =
          s.batch === selectedBatch ||
          s.batchName === selectedBatch ||
          (selectedBatch === 'Batch 1' &&
            [
              'stu-naveen-01',
              'stu-107',
              'stu-108',
              'stu-109',
              'stu-110',
              'stu-111',
              'stu-112',
            ].includes(s.id));
        if (!matchesBatch) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          s.fullName.toLowerCase().includes(q) ||
          (s.registerNumber && s.registerNumber.toLowerCase().includes(q)) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.specialization && s.specialization.toLowerCase().includes(q)) ||
          (s.courseName && s.courseName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [students, selectedBatch, searchQuery]);

  // Dropdown click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.student-profile-batch-dropdown')) {
        setIsBatchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get initials helper
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Student Profiles Registry"
        description="Inspect student academic profiles, manage institutional college enrollments, portfolio URLs, and migrate learners between active cohorts."
        breadcrumbs={[
          { label: 'Student Management', path: '/admin/students' },
          { label: 'Student Profiles' },
        ]}
      />

      {/* Filter and Search Bar Card */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batch Selector */}
          <div className="space-y-1.5 relative student-profile-batch-dropdown">
            <label className="block text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
              Filter by Batch
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

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A89A91] uppercase tracking-wider">
              Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#A89A91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, RRN, register number, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#140F0D] border border-[#3A2922] text-sm text-[#F5F0EA] placeholder-[#A89A91] focus:outline-none focus:ring-2 focus:ring-[#946246]/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#171311] border border-[#3A2922] rounded-2xl p-8">
            <p className="text-sm text-[#A89A91]">
              No student profiles found matching your filters.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => {
            const initials = getInitials(student.fullName);
            const role =
              student.specialization ||
              student.careerInterests ||
              'Software Engineering Candidate';
            const batchName = student.batchName || student.batch || 'Batch 1';

            return (
              <div
                key={student.id}
                onClick={() => navigate(`/admin/students/profile/${student.id}`)}
                className="bg-[#171311] hover:bg-[#1E1815] border border-[#3A2922] hover:border-[#946246]/50 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Top Row: Avatar & Batch Pill */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-[#3A2922]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#C8B8A6] text-[#2C1A12] font-bold text-base flex items-center justify-center flex-shrink-0">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-[#F5F0EA] group-hover:text-[#F1E5D8] transition-colors leading-snug">
                          {student.fullName}
                        </h3>
                        <p className="text-xs text-[#A89A91] line-clamp-1 mt-0.5">
                          {typeof role === 'string' ? role : role[0]}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2A1E19] text-[#946246] border border-[#3A2922] whitespace-nowrap">
                      {batchName}
                    </span>
                  </div>

                  {/* Student Details Info */}
                  <div className="space-y-2 py-3 border-t border-[#2A1E19] text-xs">
                    <div className="flex items-center justify-between text-[#A89A91]">
                      <span>Register / RRN:</span>
                      <span className="font-mono text-[#F5F0EA]">
                        {student.registerNumber || student.studentId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#A89A91]">
                      <span>Email:</span>
                      <span className="text-[#F5F0EA] truncate max-w-[180px]">
                        {student.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#A89A91]">
                      <span>Course:</span>
                      <span className="text-[#F5F0EA] truncate max-w-[180px]">
                        {student.courseName || student.course || 'B.E. / B.Tech'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom View & Edit Button */}
                <div className="pt-3 border-t border-[#2A1E19] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#946246] group-hover:text-[#F1E5D8] flex items-center gap-1">
                    Manage Profile <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-[#A89A91] bg-[#140F0D] px-2 py-0.5 rounded border border-[#3A2922]">
                    Edit & Relocate
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
