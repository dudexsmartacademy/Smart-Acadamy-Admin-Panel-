import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  User,
  GraduationCap,
  Building,
  Mail,
  Phone,
  MessageSquare,
  Send,
  X,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import {
  getStudentQueries,
  updateStudentQuery,
} from '../../services/studentQueryService';
import { getStudentById, getStudents } from '../../services/studentService';
import { StudentQuery, Student } from '../../types';

export const StudentQueriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [queries, setQueries] = useState<StudentQuery[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [batchFilter, setBatchFilter] = useState('All Batches');

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // Active Query Modal
  const [selectedQuery, setSelectedQuery] = useState<StudentQuery | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<'pending' | 'in_review' | 'resolved'>('in_review');
  const [adminResponseText, setAdminResponseText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    setQueries(getStudentQueries());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter options
  const categories = [
    'All Categories',
    'Attendance Correction',
    'Technical Issues',
    'Exam / Assessment Query',
    'Course Content & Notes',
    'Live Session Access',
    'General Inquiry',
  ];

  const statuses = ['All Statuses', 'pending', 'in_review', 'resolved'];
  const batches = ['All Batches', 'Batch 1', 'Batch 2', 'Batch 3'];

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      // Category
      if (categoryFilter !== 'All Categories' && q.category !== categoryFilter) {
        return false;
      }

      // Status
      if (
        statusFilter !== 'All Statuses' &&
        q.status.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      // Batch
      if (batchFilter !== 'All Batches' && q.batch !== batchFilter) {
        return false;
      }

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matches =
          q.studentName.toLowerCase().includes(query) ||
          q.queryCode.toLowerCase().includes(query) ||
          q.studentId.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query) ||
          (q.subject && q.subject.toLowerCase().includes(query)) ||
          q.batch.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [queries, categoryFilter, statusFilter, batchFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = queries.length;
    const pending = queries.filter(
      (q) => q.status.toLowerCase() === 'pending'
    ).length;
    const inReview = queries.filter(
      (q) => q.status.toLowerCase() === 'in_review'
    ).length;
    const resolved = queries.filter(
      (q) => q.status.toLowerCase() === 'resolved'
    ).length;

    return { total, pending, inReview, resolved };
  }, [queries]);

  // Handle open modal
  const handleOpenQuery = (query: StudentQuery) => {
    setSelectedQuery(query);
    setResolutionStatus((query.status.toLowerCase() as any) || 'in_review');
    setAdminResponseText(query.adminResponse || '');

    // Retrieve rich student data
    let student = getStudentById(query.studentId);
    if (!student) {
      student = getStudents().find(
        (s) => s.id === query.studentId || s.studentId === query.studentId
      );
    }
    setSelectedStudent(student || null);
  };

  // Handle Save Resolution
  const handleSaveResolution = () => {
    if (!selectedQuery) return;
    setIsSaving(true);

    updateStudentQuery(selectedQuery.id, {
      status: resolutionStatus,
      adminResponse: adminResponseText.trim(),
    });

    setTimeout(() => {
      setIsSaving(false);
      showToast(
        `Query [${selectedQuery.queryCode}] updated to "${resolutionStatus}"!`,
        'success'
      );
      loadData();
      setSelectedQuery(null);
    }, 400);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.queries-dropdown-container')) {
        setIsCategoryOpen(false);
        setIsStatusOpen(false);
        setIsBatchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Page Header */}
      <PageHeader
        title="Student Queries & Support Desk"
        subtitle="Manage inquiries, technical tickets, and attendance correction requests submitted by students from the help portal."
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students' },
          { label: 'Student Queries' },
        ]}
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91]">
            <HelpCircle className="w-5 h-5 text-[#C49B7B]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
              Total Queries
            </div>
            <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
              {stats.total}
            </div>
          </div>
        </div>

        <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
              Pending Review
            </div>
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight mt-0.5">
              {stats.pending}
            </div>
          </div>
        </div>

        <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-blue-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
              In Review
            </div>
            <div className="text-2xl font-extrabold text-blue-400 tracking-tight mt-0.5">
              {stats.inReview}
            </div>
          </div>
        </div>

        <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
              Resolved Tickets
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-0.5">
              {stats.resolved}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-4 shadow-sm queries-dropdown-container">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A89A91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, query code, batch, subject, or keyword..."
              className="w-full h-11 pl-10 pr-4 bg-[#140F0D] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-56">
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsStatusOpen(false);
                setIsBatchOpen(false);
              }}
              className="w-full h-11 px-4 bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="font-medium truncate">{categoryFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] ml-2 transition-transform duration-200 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute z-30 left-0 right-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategoryFilter(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                        : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                    }`}
                  >
                    <span>{cat}</span>
                    {categoryFilter === cat && <Check className="w-4 h-4 text-[#946246]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full md:w-44">
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                setIsCategoryOpen(false);
                setIsBatchOpen(false);
              }}
              className="w-full h-11 px-4 bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] flex items-center justify-between transition-colors cursor-pointer capitalize"
            >
              <span className="font-medium truncate">
                {statusFilter.replace('_', ' ')}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] ml-2 transition-transform duration-200 ${
                  isStatusOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute z-30 left-0 right-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
                {statuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setStatusFilter(st);
                      setIsStatusOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer capitalize ${
                      statusFilter === st
                        ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                        : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                    }`}
                  >
                    <span>{st.replace('_', ' ')}</span>
                    {statusFilter === st && <Check className="w-4 h-4 text-[#946246]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Batch Dropdown */}
          <div className="relative w-full md:w-40">
            <button
              type="button"
              onClick={() => {
                setIsBatchOpen(!isBatchOpen);
                setIsCategoryOpen(false);
                setIsStatusOpen(false);
              }}
              className="w-full h-11 px-4 bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="font-medium truncate">{batchFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] ml-2 transition-transform duration-200 ${
                  isBatchOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isBatchOpen && (
              <div className="absolute z-30 right-0 left-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
                {batches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setBatchFilter(b);
                      setIsBatchOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      batchFilter === b
                        ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                        : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                    }`}
                  >
                    <span>{b}</span>
                    {batchFilter === b && <Check className="w-4 h-4 text-[#946246]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3.5 px-5">Student & Batch</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Query Details</th>
                <th className="py-3.5 px-3 text-center">Priority</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1E19]/80">
              {filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#A89A91]">
                    No student queries match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredQueries.map((q) => {
                  const statusKey = q.status.toLowerCase();
                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-[#1E1815]/70 transition-colors group"
                    >
                      {/* Student & Batch */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#2A1E19] border border-[#5A321F] flex items-center justify-center text-xs font-bold text-[#F5F0EA] flex-shrink-0">
                            {q.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#F5F0EA] text-sm group-hover:text-[#C49B7B] transition-colors">
                              {q.studentName}
                            </div>
                            <div className="text-[11px] text-[#A89A91] flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono">{q.batch}</span>
                              {q.section && <span>• {q.section}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#231A16] border border-[#3A2922] text-[#F5F0EA]">
                          {q.category}
                        </span>
                      </td>

                      {/* Query Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-[#F5F0EA] truncate">
                          {q.subject || q.category}
                        </div>
                        <p className="text-[11px] text-[#A89A91] line-clamp-1 mt-0.5">
                          {q.description}
                        </p>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            q.priority === 'urgent' || q.priority === 'high'
                              ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                              : q.priority === 'medium'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                              : 'bg-[#231A16] text-[#A89A91] border border-[#3A2922]'
                          }`}
                        >
                          {q.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            statusKey === 'resolved'
                              ? 'bg-[#1B2920] border border-emerald-900/60 text-emerald-400'
                              : statusKey === 'in_review'
                              ? 'bg-[#1B232E] border border-blue-900/60 text-blue-400'
                              : 'bg-[#29221B] border border-amber-900/60 text-amber-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              statusKey === 'resolved'
                                ? 'bg-emerald-400'
                                : statusKey === 'in_review'
                                ? 'bg-blue-400'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span className="capitalize">{statusKey.replace('_', ' ')}</span>
                        </span>
                      </td>

                      {/* Submitted At */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#A89A91]">
                        {q.submittedAt}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenQuery(q)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] hover:border-[#5A321F] text-xs font-semibold text-[#F5F0EA] transition-all cursor-pointer shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C49B7B]" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View Full Student Details + Query Given by Student */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#171311] border border-[#3A2922] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#140F0D] border-b border-[#3A2922] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#5A321F] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-[#C49B7B]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F5F0EA]">
                    Student Support Inquiry & Ticket Details
                  </h3>
                  <div className="text-xs text-[#A89A91] font-mono mt-0.5">
                    Ticket ID: {selectedQuery.queryCode} • Submitted {selectedQuery.submittedAt}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="w-8 h-8 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* SECTION 1: Student Details Fully */}
              <div className="bg-[#140F0D] border border-[#2A1E19] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#2A1E19]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A89A91] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#C49B7B]" />
                    <span>Student Profile & Cohort Information</span>
                  </div>
                  {selectedStudent && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/students/profile/${selectedStudent.id}`)
                      }
                      className="text-xs text-[#C49B7B] hover:text-[#F5F0EA] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                    >
                      <span>Full Student Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="text-[#A89A91] text-[11px]">Full Name</div>
                    <div className="font-bold text-[#F5F0EA] text-sm mt-0.5">
                      {selectedQuery.studentName}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#A89A91] text-[11px]">Student ID / Code</div>
                    <div className="font-mono font-bold text-[#F5F0EA] mt-0.5">
                      {selectedStudent?.studentId || selectedQuery.studentId}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#A89A91] text-[11px]">Assigned Batch & Section</div>
                    <div className="font-semibold text-[#F5F0EA] mt-0.5">
                      {selectedQuery.batch} {selectedQuery.section ? `• ${selectedQuery.section}` : ''}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#A89A91] text-[11px]">College</div>
                    <div className="font-medium text-[#F5F0EA] mt-0.5">
                      {selectedStudent?.collegeName || selectedQuery.collegeName || 'DudeX Institute of Technology'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#A89A91] text-[11px]">Department</div>
                    <div className="font-medium text-[#F5F0EA] mt-0.5">
                      {selectedStudent?.department || selectedQuery.department || 'Artificial Intelligence & Data Science'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#A89A91] text-[11px]">Contact Details</div>
                    <div className="text-[#F5F0EA] font-mono mt-0.5">
                      {selectedQuery.studentPhone || selectedQuery.whatsappNumber || '+91 98765 43210'}
                    </div>
                    <div className="text-[10px] text-[#A89A91] truncate font-mono">
                      {selectedQuery.studentEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Query Given by Student */}
              <div className="bg-[#140F0D] border border-[#2A1E19] rounded-xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#2A1E19]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A89A91] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C49B7B]" />
                    <span>Query / Issue Submitted by Student</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#231A16] border border-[#3A2922] text-[#F5F0EA]">
                      {selectedQuery.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        selectedQuery.priority === 'urgent' || selectedQuery.priority === 'high'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {selectedQuery.priority} Priority
                    </span>
                  </div>
                </div>

                {selectedQuery.subject && (
                  <div>
                    <div className="text-[11px] text-[#A89A91] font-semibold uppercase tracking-wider">
                      Subject / Topic
                    </div>
                    <div className="text-sm font-bold text-[#F5F0EA] mt-0.5">
                      {selectedQuery.subject}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-[11px] text-[#A89A91] font-semibold uppercase tracking-wider">
                    Full Description / Problem Details
                  </div>
                  <div className="p-3.5 bg-[#0D0A09] border border-[#231A16] rounded-xl text-xs text-[#F5F0EA] leading-relaxed mt-1 whitespace-pre-wrap font-sans">
                    {selectedQuery.description}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Faculty Response & Resolution Action */}
              <div className="bg-[#140F0D] border border-[#2A1E19] rounded-xl p-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A89A91] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C49B7B]" />
                  <span>Faculty & Support Resolution</span>
                </div>

                {/* Status Toggle buttons */}
                <div>
                  <label className="block text-xs font-semibold text-[#A89A91] mb-2">
                    Update Ticket Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setResolutionStatus('pending')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        resolutionStatus === 'pending'
                          ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-[#1C1715] border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA]'
                      }`}
                    >
                      Pending Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionStatus('in_review')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        resolutionStatus === 'in_review'
                          ? 'bg-blue-950/70 border-blue-500 text-blue-300 shadow-sm'
                          : 'bg-[#1C1715] border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA]'
                      }`}
                    >
                      In Review / In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolutionStatus('resolved')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        resolutionStatus === 'resolved'
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm'
                          : 'bg-[#1C1715] border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA]'
                      }`}
                    >
                      Resolved & Closed
                    </button>
                  </div>
                </div>

                {/* Response Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                    Faculty Remarks / Response Sent to Student Portal
                  </label>
                  <textarea
                    rows={3}
                    value={adminResponseText}
                    onChange={(e) => setAdminResponseText(e.target.value)}
                    placeholder="Enter resolution details, correction confirmation, or instructions for the student..."
                    className="w-full p-3 bg-[#1C1715] border border-[#3A2922] rounded-xl text-xs text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246] transition-all font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#140F0D] border-t border-[#3A2922] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedQuery(null)}
                className="px-4 py-2 rounded-xl bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-xs font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveResolution}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#946246] hover:bg-[#7D533B] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Updating...' : 'Save & Update Ticket'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
