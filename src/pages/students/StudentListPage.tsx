import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  GraduationCap,
  CalendarCheck,
  Building,
  Layers,
  Download,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  X,
  UserCheck,
  UserX,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  getStudents,
  deleteStudent,
  updateStudentStatus,
} from '../../services/studentService';
import { Student } from '../../types';

export const StudentListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Cascading Filters (Requirement 1)
  const [collegeFilter, setCollegeFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  // Additional Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [feeStatusFilter, setFeeStatusFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState<'name' | 'admissionDate' | 'attendance' | 'course' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Delete Dialog
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const loadData = () => {
    getStudents().then(setStudents);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute helper to get college for a student
  const getStudentCollege = (s: Student): string => {
    return s.collegeName || 'DudeX Institute of Technology';
  };

  // 1. Available Colleges
  const availableColleges = useMemo(() => {
    const set = new Set<string>();
    set.add('DudeX Institute of Technology');
    set.add('DudeX College of Engineering');
    set.add('Apex Institute of Technology');
    set.add('National Institute of Design & Tech');
    students.forEach((s) => {
      if (s.collegeName) set.add(s.collegeName);
    });
    return Array.from(set);
  }, [students]);

  // 2. Available Departments (Cascading based on selected College)
  const availableDepartments = useMemo(() => {
    const relevant = students.filter((s) => {
      if (!collegeFilter) return true;
      return getStudentCollege(s) === collegeFilter;
    });

    const set = new Set<string>();
    relevant.forEach((s) => {
      if (s.department) set.add(s.department);
    });

    if (set.size === 0) {
      set.add('Artificial Intelligence & Data Science');
      set.add('Computer Science & Engineering');
      set.add('Information Technology');
    }

    return Array.from(set);
  }, [students, collegeFilter]);

  // 3. Available Classes / Courses (Cascading based on College & Department)
  const availableClasses = useMemo(() => {
    const relevant = students.filter((s) => {
      if (collegeFilter && getStudentCollege(s) !== collegeFilter) return false;
      if (departmentFilter && s.department !== departmentFilter) return false;
      return true;
    });

    const set = new Set<string>();
    relevant.forEach((s) => {
      const cls = s.course || s.courseName;
      if (cls) set.add(cls);
    });

    if (set.size === 0) {
      set.add('Full Stack AI Engineering');
      set.add('Advanced Data Structures & Algorithms');
      set.add('Applied Network Security & Cryptography');
    }

    return Array.from(set);
  }, [students, collegeFilter, departmentFilter]);

  // 4. Available Sections (Cascading based on College, Department, and Class)
  const availableSections = useMemo(() => {
    const relevant = students.filter((s) => {
      if (collegeFilter && getStudentCollege(s) !== collegeFilter) return false;
      if (departmentFilter && s.department !== departmentFilter) return false;
      if (classFilter && (s.course !== classFilter && s.courseName !== classFilter)) return false;
      return true;
    });

    const set = new Set<string>();
    relevant.forEach((s) => {
      if (s.section) set.add(s.section);
    });

    if (set.size === 0) {
      set.add('Section A');
      set.add('Section B');
      set.add('Sec-1');
      set.add('Sec-A');
    }

    return Array.from(set);
  }, [students, collegeFilter, departmentFilter, classFilter]);

  // Handle College Change
  const handleCollegeChange = (col: string) => {
    setCollegeFilter(col);
    setDepartmentFilter('');
    setClassFilter('');
    setSectionFilter('');
    setCurrentPage(1);
  };

  // Handle Department Change
  const handleDepartmentChange = (dept: string) => {
    setDepartmentFilter(dept);
    setClassFilter('');
    setSectionFilter('');
    setCurrentPage(1);
  };

  // Handle Class Change
  const handleClassChange = (cls: string) => {
    setClassFilter(cls);
    setSectionFilter('');
    setCurrentPage(1);
  };

  // Handle Section Change
  const handleSectionChange = (sec: string) => {
    setSectionFilter(sec);
    setCurrentPage(1);
  };

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // 1. College Filter
      if (collegeFilter && getStudentCollege(s) !== collegeFilter) {
        return false;
      }

      // 2. Department Filter
      if (departmentFilter && s.department !== departmentFilter) {
        return false;
      }

      // 3. Class Filter
      if (classFilter && s.course !== classFilter && s.courseName !== classFilter) {
        return false;
      }

      // 4. Section Filter
      if (sectionFilter && s.section !== sectionFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter && s.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      // Fee Status Filter
      if (feeStatusFilter && s.feeStatus.toLowerCase() !== feeStatusFilter.toLowerCase()) {
        return false;
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          (s.course && s.course.toLowerCase().includes(q)) ||
          (s.courseName && s.courseName.toLowerCase().includes(q)) ||
          (s.batch && s.batch.toLowerCase().includes(q)) ||
          (s.batchName && s.batchName.toLowerCase().includes(q)) ||
          getStudentCollege(s).toLowerCase().includes(q) ||
          (s.department && s.department.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [
    students,
    collegeFilter,
    departmentFilter,
    classFilter,
    sectionFilter,
    statusFilter,
    feeStatusFilter,
    searchQuery,
  ]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'admissionDate') {
        comparison =
          new Date(a.admissionDate || '2024-01-01').getTime() -
          new Date(b.admissionDate || '2024-01-01').getTime();
      } else if (sortBy === 'attendance') {
        comparison = (a.attendancePercentage || 0) - (b.attendancePercentage || 0);
      } else if (sortBy === 'course') {
        comparison = (a.course || '').localeCompare(b.course || '');
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredStudents, sortBy, sortOrder]);

  // Pagination
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteStudent(deleteTarget.id);
      loadData();
      setDeleteTarget(null);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setCollegeFilter('');
    setDepartmentFilter('');
    setClassFilter('');
    setSectionFilter('');
    setStatusFilter('');
    setFeeStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto font-sans animate-fadeIn">
      {/* Top Header & Breadcrumbs (Screenshot 1) */}
      <PageHeader
        title="Student Directory"
        description={`Displaying ${filteredStudents.length} of ${students.length} students across colleges, departments, classes, and sections`}
        breadcrumbs={[
          { label: 'Admin', path: '/admin/dashboard' },
          { label: 'Students', path: '/admin/students' },
          { label: 'Directory' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const headers = ['ID,Name,College,Department,Course,Batch,Section,Attendance,Status\n'];
                const rows = filteredStudents.map(
                  (s) =>
                    `"${s.studentId}","${s.fullName}","${getStudentCollege(s)}","${s.department}","${s.course || s.courseName}","${s.batch || s.batchName}","${s.section}","${s.attendancePercentage}%","${s.status}"`
                ).join('\n');
                const blob = new Blob([...headers, rows], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `students_directory_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV
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

      {/* Cascading Filter & Search Bar Container (Requirement 1 & Screenshot 1) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-4 shadow-sm space-y-3.5">
        {/* Row 1: Search + Statuses */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A89A91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, ID, email, phone, course or batch..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#140F0D] border border-[#3A2922] rounded-xl text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            {/* Fee Status Filter */}
            <select
              value={feeStatusFilter}
              onChange={(e) => {
                setFeeStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Fee Status</option>
              <option value="Paid">Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>

            {(searchQuery || collegeFilter || departmentFilter || classFilter || sectionFilter || statusFilter || feeStatusFilter) && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-xs font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Cascading Selectors (College -> Department -> Classes -> Sections) */}
        <div className="pt-2 border-t border-[#2A1E19] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. College Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
              1. College
            </label>
            <select
              value={collegeFilter}
              onChange={(e) => handleCollegeChange(e.target.value)}
              className="w-full bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Colleges</option>
              {availableColleges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Department Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
              2. Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Departments</option>
              {availableDepartments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Class / Course Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
              3. Class / Course
            </label>
            <select
              value={classFilter}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Classes</option>
              {availableClasses.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Section Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
              4. Section
            </label>
            <select
              value={sectionFilter}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full bg-[#140F0D] border border-[#3A2922] text-[#F5F0EA] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#946246] cursor-pointer"
            >
              <option value="">All Sections</option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table (Screenshot 1) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th
                  className="py-3.5 px-5 cursor-pointer hover:text-[#F5F0EA]"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    Profile & Name
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Contact</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F5F0EA]"
                  onClick={() => toggleSort('course')}
                >
                  <div className="flex items-center gap-1.5">
                    Course & Batch
                    {sortBy === 'course' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F5F0EA]"
                  onClick={() => toggleSort('attendance')}
                >
                  <div className="flex items-center gap-1.5">
                    Attendance
                    {sortBy === 'attendance' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F5F0EA]"
                  onClick={() => toggleSort('status')}
                >
                  <div className="flex items-center gap-1.5">
                    Status
                    {sortBy === 'status' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-[#F5F0EA]"
                  onClick={() => toggleSort('admissionDate')}
                >
                  <div className="flex items-center gap-1.5">
                    Admission Date
                    {sortBy === 'admissionDate' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1E19]/80">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-[#A89A91]">
                    No students found matching your selected college, department, class, or section criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => {
                  const att = s.attendancePercentage || 85.0;
                  const college = getStudentCollege(s);

                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[#1E1815]/70 transition-colors group"
                    >
                      {/* Profile & Name */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          {s.avatar ? (
                            <img
                              src={s.avatar}
                              alt={s.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-[#3A2922]"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#2A1E19] border border-[#5A321F] flex items-center justify-center text-xs font-bold text-[#F5F0EA]">
                              {s.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/students/profile/${s.id}`)
                              }
                              className="font-bold text-[#F5F0EA] hover:text-[#C49B7B] transition-colors text-left block"
                            >
                              {s.fullName}
                            </button>
                            <div className="text-[11px] text-[#A89A91] mt-0.5">
                              {s.gender || 'student'} • DOB: {s.dob || '2004-05-15'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#F5F0EA]">
                        {s.studentId}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 max-w-[180px]">
                        <div className="text-[#F5F0EA] truncate font-mono text-[11px]">
                          {s.email}
                        </div>
                        <div className="text-[11px] text-[#A89A91] font-mono mt-0.5">
                          {s.phone}
                        </div>
                      </td>

                      {/* Course & Batch */}
                      <td className="py-3.5 px-4">
                        <div className="text-[#F5F0EA] font-semibold truncate max-w-[170px]">
                          {s.course || s.courseName || 'Full Stack AI Engineering'}
                        </div>
                        <div className="text-[11px] text-[#A89A91] mt-0.5">
                          Batch: {s.batch || s.batchName || 'Batch 1'} ({s.section || 'Sec-1'})
                        </div>
                      </td>

                      {/* Attendance (Progress Bar matching Screenshot 1) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#231A16] rounded-full overflow-hidden border border-[#3A2922]">
                            <div
                              className={`h-full rounded-full ${
                                att >= 75
                                  ? 'bg-emerald-400'
                                  : att >= 60
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                              style={{ width: `${Math.min(att, 100)}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono text-xs font-bold ${
                              att >= 75
                                ? 'text-emerald-400'
                                : att >= 60
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {att}%
                          </span>
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            s.feeStatus === 'paid' || s.feeStatus === 'Paid'
                              ? 'bg-[#1B2920] border border-emerald-900/60 text-emerald-400'
                              : s.feeStatus === 'partially_paid' || s.feeStatus === 'Partially Paid'
                              ? 'bg-[#29221B] border border-amber-900/60 text-amber-400'
                              : 'bg-[#2E1B1B] border border-rose-900/60 text-rose-400'
                          }`}
                        >
                          {s.feeStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            s.status.toLowerCase() === 'active'
                              ? 'bg-[#1B2920] border border-emerald-900/60 text-emerald-400'
                              : 'bg-[#231A16] border border-[#3A2922] text-[#A89A91]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.status.toLowerCase() === 'active' ? 'bg-emerald-400' : 'bg-neutral-400'
                            }`}
                          />
                          {s.status}
                        </span>
                      </td>

                      {/* Admission Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#A89A91]">
                        {s.admissionDate || '2024-08-10'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/students/profile/${s.id}`)
                            }
                            title="View Profile"
                            className="p-1.5 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/students/profile/${s.id}`)
                            }
                            title="Edit Student"
                            className="p-1.5 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(s)}
                            title="Delete Student"
                            className="p-1.5 rounded-lg bg-[#231A16] hover:bg-rose-950/60 border border-[#3A2922] hover:border-rose-800/60 text-[#A89A91] hover:text-rose-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > pageSize && (
          <div className="p-4 border-t border-[#3A2922] bg-[#140F0D]">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredStudents.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Student Record"
          message={`Are you sure you want to delete ${deleteTarget.fullName} (${deleteTarget.studentId}) from the student registry? This action cannot be undone.`}
          confirmText="Delete Student"
          cancelText="Cancel"
          variant="danger"
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};
