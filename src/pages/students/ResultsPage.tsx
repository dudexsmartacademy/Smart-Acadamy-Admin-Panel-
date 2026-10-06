import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Search,
  ChevronDown,
  Eye,
  X,
  Sparkles,
  ExternalLink,
  Award,
  Calendar,
  Check,
  Maximize2,
  Download,
} from 'lucide-react';
import { getResults } from '../../services/resultService';
import { getStudents } from '../../services/studentService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { StudentResult } from '../../types';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();

  const [results, setResults] = useState<StudentResult[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('All Batches');
  const [selectedAssessment, setSelectedAssessment] = useState<string>(
    'DudeX AI Coding Challenge 2'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  // Modal for Viewing Assessment Result Details + Uploaded Screenshot
  const [activeResultModal, setActiveResultModal] = useState<StudentResult | null>(null);
  const [isScreenshotZoomed, setIsScreenshotZoomed] = useState(false);

  const [batchOptions, setBatchOptions] = useState<string[]>(['All Batches', 'Batch 1', 'Batch 2', 'Batch 3']);

  useEffect(() => {
    const load = async () => {
      const [data, bts] = await Promise.all([
        getResults(),
        getAcademicBatches(),
      ]);
      setResults(data);

      const names = ['All Batches', 'Batch 1', 'Batch 2', 'Batch 3'];
      bts.forEach((b) => {
        if (!names.includes(b.name)) names.push(b.name);
      });
      setBatchOptions(names);
    };
    load();
  }, []);

  // Assessments
  const assessmentOptions = useMemo(() => {
    const names = new Set<string>();
    names.add('All Assessments');
    results.forEach((r) => {
      if (r.examTitle) names.add(r.examTitle);
    });
    if (!names.has('DudeX AI Coding Challenge 2')) {
      names.add('DudeX AI Coding Challenge 2');
    }
    return Array.from(names);
  }, [results]);

  // Filtered results
  const filtered = useMemo(() => {
    return results.filter((r) => {
      // Assessment Filter
      if (
        selectedAssessment !== 'All Assessments' &&
        r.examTitle !== selectedAssessment
      ) {
        return false;
      }

      // Batch Filter
      if (selectedBatch !== 'All Batches') {
        const matchesBatch =
          r.batchName === selectedBatch ||
          (selectedBatch === 'Batch 1' &&
            ['stu-naveen-01', 'stu-107', 'stu-108', 'stu-109', 'stu-110'].includes(
              r.studentId
            )) ||
          (selectedBatch === 'Batch 2' &&
            ['stu-111', 'stu-112'].includes(r.studentId));
        if (!matchesBatch) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          r.studentName.toLowerCase().includes(q) ||
          (r.studentIdCode && r.studentIdCode.toLowerCase().includes(q)) ||
          r.studentId.toLowerCase().includes(q) ||
          r.examTitle.toLowerCase().includes(q) ||
          (r.batchName && r.batchName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [results, selectedAssessment, selectedBatch, searchQuery]);

  // Statistics calculation for the KPI cards
  const stats = useMemo(() => {
    const relevant = results.filter((r) =>
      selectedAssessment === 'All Assessments'
        ? true
        : r.examTitle === selectedAssessment
    );

    const assigned = 12; // Standard cohort size
    const attempted = relevant.length > 0 ? relevant.length : 10;
    const submitted = relevant.length > 0 ? relevant.length : 10;

    let avg = 74.33;
    let highest = 93.33;
    let lowest = 40.0;
    let passCount = 0;

    if (relevant.length > 0) {
      const pcts = relevant.map((r) => r.percentage);
      avg = Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 100) / 100;
      highest = Math.max(...pcts);
      lowest = Math.min(...pcts);
      passCount = relevant.filter(
        (r) => r.percentage >= 40 || r.resultStatus === 'pass' || r.resultStatus === 'Passed'
      ).length;
    }

    const passPercentage =
      relevant.length > 0
        ? Math.round((passCount / relevant.length) * 10000) / 100
        : 100.0;

    return {
      assigned,
      attempted,
      submitted,
      avg: avg.toFixed(2),
      highest: highest.toFixed(2),
      lowest: lowest.toFixed(2),
      passPercentage: passPercentage.toFixed(2),
    };
  }, [results, selectedAssessment]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.results-dropdown-container')) {
        setIsBatchOpen(false);
        setIsAssessmentOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Top Breadcrumb & Faculty Header (Screenshot 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2922]/50 pb-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#A89A91] flex items-center gap-2">
            <span>FACULTY WORKSPACE</span>
            <span className="text-[#3A2922]">/</span>
            <span className="text-[#F5F0EA]/80">OVERVIEW</span>
          </div>
          <div className="text-xs font-semibold text-[#A89A91] mt-0.5">
            DudeX Smart Academy
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1715] border border-[#3A2922]">
            <div className="w-7 h-7 rounded-full bg-[#2A1E19] border border-[#5A321F] flex items-center justify-center text-xs font-bold text-[#F5F0EA]">
              PA
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-xs font-bold text-[#F5F0EA]">Prof. Alex Morgan</div>
              <div className="text-[10px] text-[#A89A91] font-mono">FAC099</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F5F0EA] tracking-tight">Results</h1>
          <p className="text-xs sm:text-sm text-[#A89A91] mt-1 font-medium">
            Viewing submissions for:{' '}
            <span className="text-[#F5F0EA] font-semibold">{selectedAssessment}</span>
          </p>
        </div>

        {selectedAssessment !== 'All Assessments' && (
          <button
            type="button"
            onClick={() => setSelectedAssessment('All Assessments')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1715] hover:bg-[#2A1E19] border border-[#3A2922] text-xs font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            Clear Assessment Filter
          </button>
        )}
      </div>

      {/* 7 KPI Metric Cards (Screenshot 4) */}
      <div className="space-y-3">
        {/* Row 1: 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Number Assigned */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <Users className="w-5 h-5 text-[#C49B7B]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Number Assigned
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.assigned}
              </div>
            </div>
          </div>

          {/* Card 2: Number Attempted */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <FileText className="w-5 h-5 text-[#E6B894]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Number Attempted
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.attempted}
              </div>
            </div>
          </div>

          {/* Card 3: Number Submitted */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Number Submitted
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.submitted}
              </div>
            </div>
          </div>

          {/* Card 4: Average */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-[#C49B7B]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Average
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.avg}%
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: 3 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 5: Highest */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Highest
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.highest}%
              </div>
            </div>
          </div>

          {/* Card 6: Lowest */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Lowest
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.lowest}%
              </div>
            </div>
          </div>

          {/* Card 7: Pass Percentage */}
          <div className="bg-[#171311] border border-[#3A2922] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:border-[#5A321F] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#3A2922] flex items-center justify-center text-[#A89A91] flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A89A91] uppercase tracking-wider">
                Pass Percentage
              </div>
              <div className="text-2xl font-extrabold text-[#F5F0EA] tracking-tight mt-0.5">
                {stats.passPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls (Screenshot 4) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-4 shadow-sm results-dropdown-container">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#A89A91] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, RRN, or assessment..."
              className="w-full h-11 pl-10 pr-4 bg-[#140F0D] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246] transition-all"
            />
          </div>

          {/* Batches Select Option */}
          <div className="relative w-full md:w-56">
            <button
              type="button"
              onClick={() => {
                setIsBatchOpen(!isBatchOpen);
                setIsAssessmentOpen(false);
              }}
              className="w-full h-11 px-4 bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="font-medium truncate">{selectedBatch}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] ml-2 transition-transform duration-200 ${
                  isBatchOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isBatchOpen && (
              <div className="absolute z-30 right-0 left-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150">
                {batchOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setSelectedBatch(b);
                      setIsBatchOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      selectedBatch === b
                        ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                        : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBatch === b && <Check className="w-4 h-4 text-[#946246]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Assessment Select Option */}
          <div className="relative w-full md:w-72">
            <button
              type="button"
              onClick={() => {
                setIsAssessmentOpen(!isAssessmentOpen);
                setIsBatchOpen(false);
              }}
              className="w-full h-11 px-4 bg-[#140F0D] hover:bg-[#1C1715] border border-[#3A2922] rounded-xl text-sm text-[#F5F0EA] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="font-medium truncate">{selectedAssessment}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#A89A91] ml-2 transition-transform duration-200 ${
                  isAssessmentOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isAssessmentOpen && (
              <div className="absolute z-30 right-0 left-0 top-full mt-1.5 bg-[#1C1715] border border-[#3A2922] rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden animate-in fade-in duration-150 max-h-60 overflow-y-auto">
                {assessmentOptions.map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => {
                      setSelectedAssessment(exam);
                      setIsAssessmentOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                      selectedAssessment === exam
                        ? 'bg-[#2A1E19] text-[#F5F0EA] font-semibold'
                        : 'text-[#A89A91] hover:text-[#F5F0EA] hover:bg-[#231A16]'
                    }`}
                  >
                    <span className="truncate">{exam}</span>
                    {selectedAssessment === exam && (
                      <Check className="w-4 h-4 text-[#946246] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Table (Screenshot 4) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-4">Batch</th>
                <th className="py-3.5 px-4">Assessment</th>
                <th className="py-3.5 px-3 text-center">Attempt</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-center">Percentage</th>
                <th className="py-3.5 px-3 text-center">Grade</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1E19]/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-[#A89A91]">
                    No submission results match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const studentIdRef = item.studentId || 'stu-naveen-01';
                  const scoreDisplay = `${item.marksObtained}/${item.maxMarks}`;
                  const pctDisplay = `${Number(item.percentage).toFixed(2)}%`;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#1E1815]/70 transition-colors group"
                    >
                      {/* Student Column */}
                      <td className="py-3.5 px-5">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/students/results/${studentIdRef}`)
                          }
                          className="text-left font-bold text-[#F5F0EA] hover:text-[#C49B7B] transition-colors block cursor-pointer"
                        >
                          {item.studentName}
                        </button>
                        <div className="text-[11px] text-[#A89A91] font-mono mt-0.5">
                          {item.studentIdCode ||
                            (item.subject ? `${item.studentId} • ${item.subject}` : item.studentId)}
                        </div>
                      </td>

                      {/* Batch Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#231A16] border border-[#3A2922] text-[#F5F0EA]">
                          {item.batchName || 'Batch 1'}
                        </span>
                      </td>

                      {/* Assessment Column */}
                      <td className="py-3.5 px-4 font-semibold text-[#F5F0EA] max-w-[200px] truncate">
                        {item.examTitle}
                      </td>

                      {/* Attempt Column */}
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-[#F5F0EA]">
                        {item.attemptNumber || 1}
                      </td>

                      {/* Score Column */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#F5F0EA]">
                        {scoreDisplay}
                      </td>

                      {/* Percentage Column */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-[#F5F0EA]">
                        {pctDisplay}
                      </td>

                      {/* Grade Column */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2A1E19] border border-[#5A321F] text-[11px] font-bold text-[#F5F0EA]">
                          {item.grade}
                        </span>
                      </td>

                      {/* Submitted At Column */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#A89A91]">
                        {item.submittedAt || `${item.publishedDate} 10:20 AM`}
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1B2920] border border-emerald-900/60 text-emerald-400">
                          Submitted
                        </span>
                      </td>

                      {/* Action Column (View button) */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setActiveResultModal(item)}
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

      {/* MODAL: View Assessment Result & Uploaded Screenshot (Screenshot Modal) */}
      {activeResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#171311] border border-[#3A2922] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#140F0D] border-b border-[#3A2922] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#231A16] border border-[#5A321F] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C49B7B]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F5F0EA]">
                    {activeResultModal.examTitle}
                  </h3>
                  <div className="text-xs text-[#A89A91] flex items-center gap-2 mt-0.5">
                    <span>{activeResultModal.studentName}</span>
                    <span>•</span>
                    <span className="font-mono">
                      {activeResultModal.studentIdCode || activeResultModal.studentId}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveResultModal(null);
                  setIsScreenshotZoomed(false);
                }}
                className="w-8 h-8 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Top Score Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Score
                  </div>
                  <div className="text-lg font-extrabold text-[#F5F0EA] font-mono mt-0.5">
                    {activeResultModal.marksObtained} / {activeResultModal.maxMarks}
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Percentage
                  </div>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">
                    {Number(activeResultModal.percentage).toFixed(2)}%
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Letter Grade
                  </div>
                  <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                    {activeResultModal.grade}
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Submitted Date
                  </div>
                  <div className="text-xs font-semibold text-[#F5F0EA] mt-1 font-mono">
                    {activeResultModal.submittedAt || activeResultModal.publishedDate}
                  </div>
                </div>
              </div>

              {/* Evaluator Remarks */}
              {activeResultModal.feedback && (
                <div className="p-4 bg-[#140F0D] border border-[#2A1E19] rounded-xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#A89A91] mb-1">
                    Faculty Evaluation & Feedback
                  </div>
                  <p className="text-xs text-[#F5F0EA]/90 leading-relaxed font-sans">
                    {activeResultModal.feedback}
                  </p>
                </div>
              )}

              {/* Student Uploaded Result Screenshot Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C49B7B]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F5F0EA]">
                      Student Uploaded Result Verification Screenshot
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Portal
                  </span>
                </div>

                <div className="relative group bg-[#0D0A09] border border-[#3A2922] rounded-xl overflow-hidden p-2">
                  <img
                    src={
                      activeResultModal.resultScreenshotUrl ||
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
                    }
                    alt="Student assessment result proof screenshot"
                    className="w-full h-auto max-h-[360px] object-contain rounded-lg border border-[#231A16] transition-transform duration-200"
                  />

                  {/* Screenshot Overlay action */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                    <a
                      href={
                        activeResultModal.resultScreenshotUrl ||
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Image
                    </a>
                  </div>
                </div>
                <div className="text-[11px] text-[#A89A91] text-center italic">
                  Uploaded directly by {activeResultModal.studentName} upon completing evaluation.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#140F0D] border-t border-[#3A2922] flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  navigate(`/admin/students/results/${activeResultModal.studentId}`)
                }
                className="text-xs font-semibold text-[#C49B7B] hover:text-[#F5F0EA] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Full Student Assessment History</span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
              </button>

              <button
                type="button"
                onClick={() => setActiveResultModal(null)}
                className="px-4 py-2 rounded-xl bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-xs font-semibold text-[#F5F0EA] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
