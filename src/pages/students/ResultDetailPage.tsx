import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Calendar,
  Eye,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  X,
  GraduationCap,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { getResultsByStudent, getResults } from '../../services/resultService';
import { getStudentById, getStudents } from '../../services/studentService';
import { StudentResult, Student } from '../../types';

export const ResultDetailPage: React.FC = () => {
  const { studentId, resultId } = useParams<{ studentId: string; resultId?: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [assessments, setAssessments] = useState<StudentResult[]>([]);
  const [selectedAssessmentModal, setSelectedAssessmentModal] = useState<StudentResult | null>(null);

  useEffect(() => {
    let s: Student | undefined;
    if (studentId) {
      s =
        getStudentById(studentId) ||
        getStudents().find(
          (item) => item.id === studentId || item.studentId === studentId
        );
    }

    if (!s) {
      // Fallback default student (Naveen J.K.)
      s = getStudents().find((item) => item.id === 'stu-naveen-01') || {
        id: 'stu-naveen-01',
        studentId: 'STU-2026-000',
        fullName: 'Naveen J.K.',
        email: 'naveen.jk@gmail.com',
        phone: '+91 98765 43210',
        dob: '2004-05-15',
        gender: 'male',
        address: 'No. 42, Tech Corridor Avenue, Bengaluru, Karnataka - 560100',
        department: 'Artificial Intelligence & Data Science',
        course: 'B.E. / B.Tech',
        courseName: 'Full Stack AI Engineering',
        batch: 'Batch 1',
        section: 'Section B',
        academicYear: '2026-2027',
        admissionDate: '2024-08-01',
        guardianName: 'Jayakumar',
        guardianPhone: '+91 91234 56789',
        guardianEmail: 'jayakumar@gmail.com',
        emergencyContact: '+91 91234 56789',
        status: 'active',
        feeStatus: 'paid',
        attendancePercentage: 84.6,
      };
    }

    setStudent(s);

    // Fetch assessments for this student
    const studentAssessments = getResultsByStudent(s.id);

    if (studentAssessments.length > 0) {
      setAssessments(studentAssessments);
      if (resultId) {
        const target = studentAssessments.find((r) => r.id === resultId);
        if (target) setSelectedAssessmentModal(target);
      }
    } else {
      // Default assessments matching Screenshot 5
      const mockAssessments: StudentResult[] = [
        {
          id: 'res-nav-01',
          studentId: s.id,
          studentName: s.fullName,
          examId: 'exm-01',
          examTitle: 'Python Basics & Control Flow',
          subjectName: 'Python',
          assessmentType: 'MCQ',
          publishedDate: '02 Sep 2026',
          submittedAt: '02 Sep 2026 11:30 AM',
          marksObtained: 18,
          maxMarks: 20,
          percentage: 90.0,
          grade: 'A+',
          resultStatus: 'pass',
          courseName: 'Full Stack AI Engineering',
          resultScreenshotUrl:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900',
          feedback:
            'Exceptional command of control flow, generators, and standard library data structures.',
        },
        {
          id: 'res-nav-02',
          studentId: s.id,
          studentName: s.fullName,
          examId: 'exm-02',
          examTitle: 'SQL Foundations: Tables & Joins',
          subjectName: 'DBMS',
          assessmentType: 'MCQ',
          publishedDate: '28 Aug 2026',
          submittedAt: '28 Aug 2026 02:15 PM',
          marksObtained: 42,
          maxMarks: 50,
          percentage: 84.0,
          grade: 'A',
          resultStatus: 'pass',
          courseName: 'Full Stack AI Engineering',
          resultScreenshotUrl:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
          feedback:
            'Solid comprehension of normalized schema designs, left/outer joins, and index optimizations.',
        },
        {
          id: 'res-nav-03',
          studentId: s.id,
          studentName: s.fullName,
          examId: 'exm-03',
          examTitle: 'Loops, Logic & Fast Pointers',
          subjectName: 'Data Structures',
          assessmentType: 'Coding',
          publishedDate: '20 Aug 2026',
          submittedAt: '20 Aug 2026 04:45 PM',
          marksObtained: 88,
          maxMarks: 100,
          percentage: 88.0,
          grade: 'A',
          resultStatus: 'pass',
          courseName: 'Full Stack AI Engineering',
          resultScreenshotUrl:
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=900',
          feedback:
            'All hidden test cases passed. Algorithm executed with linear runtime and optimal auxiliary memory.',
        },
        {
          id: 'res-nav-04',
          studentId: s.id,
          studentName: s.fullName,
          examId: 'exm-04',
          examTitle: 'Data Types, Immutability & Scope',
          subjectName: 'Python Foundations',
          assessmentType: 'MCQ',
          publishedDate: '12 Aug 2026',
          submittedAt: '12 Aug 2026 10:00 AM',
          marksObtained: 17,
          maxMarks: 20,
          percentage: 85.0,
          grade: 'A',
          resultStatus: 'pass',
          courseName: 'Full Stack AI Engineering',
          resultScreenshotUrl:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900',
          feedback:
            'Strong understanding of memory allocation and pass-by-object reference semantics.',
        },
        {
          id: 'res-ddx-007',
          studentId: s.id,
          studentName: s.fullName,
          examId: 'exm-ddx-02',
          examTitle: 'DudeX AI Coding Challenge 2',
          subjectName: 'AI & Data Science',
          assessmentType: 'Coding',
          publishedDate: '28 Sep 2026',
          submittedAt: '28 Sep 2026 10:15 AM',
          marksObtained: 28,
          maxMarks: 30,
          percentage: 93.33,
          grade: 'A+',
          resultStatus: 'pass',
          courseName: 'Full Stack AI Engineering',
          resultScreenshotUrl:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900',
          feedback:
            'Cohort leader in dynamic programming challenge with sub-20ms execution.',
        },
      ];
      setAssessments(mockAssessments);
    }
  }, [studentId, resultId]);

  // Overall statistics for Top Card (Screenshot 5)
  const stats = useMemo(() => {
    const total = assessments.length;
    const pcts = assessments.map((a) => a.percentage);
    const avg =
      pcts.length > 0
        ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 10) / 10
        : 84.6;
    const highest = pcts.length > 0 ? Math.max(...pcts) : 90.0;

    return {
      placementIndex: avg.toFixed(1),
      highestScore: `${highest}% • Python`,
      evaluationsCompleted: `${total > 0 ? total : 8} Finalized`,
    };
  }, [assessments]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn font-sans">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/students/results')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Results</span>
        </button>
      </div>

      {/* Header (Screenshot 5) */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#946246]">
          ACADEMIC RECORDS
        </div>
        <h1 className="text-3xl font-extrabold text-[#F5F0EA] tracking-tight">Results</h1>
        <p className="text-xs sm:text-sm text-[#A89A91] font-medium">
          Final scorecards, percentage benchmarks, and faculty remarks.
        </p>
      </div>

      {/* Top Summary Metric Banner (Screenshot 5) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-center divide-y sm:divide-y-0 sm:divide-x divide-[#3A2922]/60">
          {/* Cohort Placement Index */}
          <div className="space-y-1 sm:pr-4">
            <div className="text-xs font-medium text-[#A89A91]">
              Cohort Placement Index
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#C49B7B] tracking-tight">
              {stats.placementIndex}%
            </div>
            <div className="text-xs font-semibold text-[#A89A91]/80">
              Grade A (Distinction Tier)
            </div>
          </div>

          {/* Highest Single Score */}
          <div className="pt-4 sm:pt-0 sm:px-6 space-y-1">
            <div className="text-xs font-medium text-[#A89A91]">Highest Single Score</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F0EA] tracking-tight">
              {stats.highestScore}
            </div>
          </div>

          {/* Evaluations Completed */}
          <div className="pt-4 sm:pt-0 sm:pl-6 space-y-1">
            <div className="text-xs font-medium text-[#A89A91]">
              Evaluations Completed
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#F5F0EA] tracking-tight">
              {stats.evaluationsCompleted}
            </div>
          </div>
        </div>
      </div>

      {/* Completed Assessments Table Card (Screenshot 5) */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#3A2922] bg-[#140F0D]/50">
          <h2 className="text-lg font-bold text-[#F5F0EA]">Completed Assessments</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#140F0D] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-center">Percentage</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1E19]/80">
              {assessments.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#1E1815]/70 transition-colors group"
                >
                  {/* Title */}
                  <td className="py-4 px-6 font-bold text-[#F5F0EA] text-sm">
                    {item.examTitle}
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 font-medium text-[#A89A91]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#231A16] border border-[#3A2922] text-[#F5F0EA]">
                      {item.assessmentType || 'MCQ'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 font-mono text-[#A89A91]">
                    {item.publishedDate || '02 Sep 2026'}
                  </td>

                  {/* Score */}
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#F5F0EA] text-sm">
                    {item.marksObtained} / {item.maxMarks}
                  </td>

                  {/* Percentage */}
                  <td className="py-4 px-4 text-center font-mono font-bold text-[#C49B7B] text-sm">
                    {Math.round(item.percentage)}%
                  </td>

                  {/* Action View Button */}
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAssessmentModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] hover:border-[#5A321F] text-xs font-semibold text-[#F5F0EA] transition-all cursor-pointer shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C49B7B]" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL: Assessment Details & Student's Uploaded Scorecard Screenshot */}
      {selectedAssessmentModal && (
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
                    {selectedAssessmentModal.examTitle}
                  </h3>
                  <div className="text-xs text-[#A89A91] flex items-center gap-2 mt-0.5">
                    <span>
                      {student?.fullName || selectedAssessmentModal.studentName}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      {selectedAssessmentModal.assessmentType || 'MCQ'} Evaluation
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssessmentModal(null)}
                className="w-8 h-8 rounded-lg bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-[#A89A91] hover:text-[#F5F0EA] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Score Breakdown Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Score Secured
                  </div>
                  <div className="text-lg font-extrabold text-[#F5F0EA] font-mono mt-0.5">
                    {selectedAssessmentModal.marksObtained} / {selectedAssessmentModal.maxMarks}
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Percentage
                  </div>
                  <div className="text-lg font-extrabold text-emerald-400 font-mono mt-0.5">
                    {Math.round(selectedAssessmentModal.percentage)}%
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Letter Grade
                  </div>
                  <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                    {selectedAssessmentModal.grade || 'A'}
                  </div>
                </div>

                <div className="p-3.5 bg-[#140F0D] border border-[#2A1E19] rounded-xl text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A89A91]">
                    Assessment Date
                  </div>
                  <div className="text-xs font-semibold text-[#F5F0EA] mt-1 font-mono">
                    {selectedAssessmentModal.publishedDate || '02 Sep 2026'}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedAssessmentModal.feedback && (
                <div className="p-4 bg-[#140F0D] border border-[#2A1E19] rounded-xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#A89A91] mb-1">
                    Evaluation Feedback & Remarks
                  </div>
                  <p className="text-xs text-[#F5F0EA]/90 leading-relaxed font-sans">
                    {selectedAssessmentModal.feedback}
                  </p>
                </div>
              )}

              {/* Student Uploaded Result Screenshot */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C49B7B]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F5F0EA]">
                      Student Uploaded Result Verification Screenshot
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Portal Authenticated
                  </span>
                </div>

                <div className="relative group bg-[#0D0A09] border border-[#3A2922] rounded-xl overflow-hidden p-2">
                  <img
                    src={
                      selectedAssessmentModal.resultScreenshotUrl ||
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
                    }
                    alt="Student completed assessment screenshot submission"
                    className="w-full h-auto max-h-[360px] object-contain rounded-lg border border-[#231A16]"
                  />

                  <div className="absolute top-4 right-4 opacity-90 group-hover:opacity-100 transition-opacity">
                    <a
                      href={
                        selectedAssessmentModal.resultScreenshotUrl ||
                        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg backdrop-blur-md transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Resolution
                    </a>
                  </div>
                </div>
                <div className="text-[11px] text-[#A89A91] text-center italic">
                  Screenshot captured and uploaded directly by student from their testing terminal.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#140F0D] border-t border-[#3A2922] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedAssessmentModal(null)}
                className="px-5 py-2 rounded-xl bg-[#231A16] hover:bg-[#2F211B] border border-[#3A2922] text-xs font-semibold text-[#F5F0EA] transition-colors cursor-pointer"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
