import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  Download,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { getStudents } from '../../services/studentService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { getAcademicBatches } from '../../services/academicBatchService';

import { AcademicBatch, AcademicCourse, Student } from '../../types';

export interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  courseName: string;
  teacherName: string;
  batchName: string;
  assignedDate: string;
  dueDate: string;
  totalStudents: number;
  submittedCount: number;
  pendingCount: number;
  lateCount: number;
  status: 'Draft' | 'Published' | 'Closed' | 'Expired';
}

export const StudentAssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [batches, setBatches] = useState<AcademicBatch[]>([]);

  useEffect(() => {
    const load = async () => {
      const [stus, crs, bts] = await Promise.all([
        getStudents(),
        getAcademicCourses(),
        getAcademicBatches(),
      ]);
      setStudents(stus);
      setCourses(crs);
      setBatches(bts);
      if (crs.length > 0 && bts.length > 0) {
        setFormData((prev) => ({
          ...prev,
          courseName: crs[0].name,
          batchName: bts[0].name,
        }));
      }
    };
    load();
  }, []);

  const [assignments, setAssignments] = useState<AssignmentItem[]>([
    {
      id: 'asg-1',
      title: 'Full-Stack E-Commerce API with PostgreSQL',
      description: 'Implement secure JWT authentication, cart state management, and Stripe checkout integration endpoints.',
      courseName: 'Full-Stack Web Development',
      teacherName: 'Dr. Sarah Jenkins',
      batchName: 'Batch 2026-Alpha',
      assignedDate: '2026-09-10',
      dueDate: '2026-09-25',
      totalStudents: 18,
      submittedCount: 16,
      pendingCount: 2,
      lateCount: 1,
      status: 'Published',
    },
    {
      id: 'asg-2',
      title: 'Neural Network Model from Scratch in PyTorch',
      description: 'Train a convolutional neural network on CIFAR-10 dataset and achieve > 85% validation accuracy.',
      courseName: 'AI & Data Science Masterclass',
      teacherName: 'Prof. Michael Chang',
      batchName: 'Batch 2026-Alpha',
      assignedDate: '2026-09-15',
      dueDate: '2026-10-02',
      totalStudents: 14,
      submittedCount: 8,
      pendingCount: 6,
      lateCount: 0,
      status: 'Published',
    },
    {
      id: 'asg-3',
      title: 'Terraform Infrastructure on AWS EKS',
      description: 'Provision an automated multi-region Kubernetes cluster with ingress controllers and TLS certificates.',
      courseName: 'Cloud & DevOps Architecture',
      teacherName: 'Marcus Vance',
      batchName: 'Batch 2026-Beta',
      assignedDate: '2026-09-01',
      dueDate: '2026-09-15',
      totalStudents: 12,
      submittedCount: 12,
      pendingCount: 0,
      lateCount: 2,
      status: 'Closed',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseName: 'Full-Stack Web Development',
    teacherName: 'Dr. Sarah Jenkins',
    batchName: 'Batch 2026-Alpha',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-10-15',
    status: 'Published' as AssignmentItem['status'],
  });

  const filtered = assignments.filter((a) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        a.title.toLowerCase().includes(q) ||
        a.courseName.toLowerCase().includes(q) ||
        a.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Assignment title is required.', 'error');
      return;
    }

    const newItem: AssignmentItem = {
      id: `asg-${Date.now()}`,
      ...formData,
      totalStudents: 18,
      submittedCount: 0,
      pendingCount: 18,
      lateCount: 0,
    };

    setAssignments([newItem, ...assignments]);
    showToast(`Created assignment "${newItem.title}"!`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Assignments"
        subtitle="Manage coursework tasks, deadlines, grading submissions, and student completion metrics"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students' },
          { label: 'Assignments' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Assignment
          </Button>
        }
      />

      <Card className="p-4 bg-[#140F0D] border-[#3A2922]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#946246] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments by title, course, or instructor..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const completionPct = Math.round((item.submittedCount / (item.totalStudents || 1)) * 100);
          return (
            <Card
              key={item.id}
              className="p-5 bg-[#140F0D] border-[#3A2922] flex flex-col justify-between hover:border-[#5A321F] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono text-[#946246]">{item.courseName}</span>
                  <StatusBadge status={item.status} size="sm" />
                </div>
                <h3 className="font-bold text-sm text-[#F5F0EA] line-clamp-2">{item.title}</h3>
                <p className="text-xs text-[#A89A91] mt-1 line-clamp-2">{item.description}</p>

                <div className="mt-4 pt-3 border-t border-[#2A1710] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#A89A91]">
                    <span>Instructor:</span>
                    <span className="text-[#F5F0EA] font-semibold">{item.teacherName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A89A91]">
                    <span>Due Date:</span>
                    <span className="font-mono text-rose-300 font-semibold">{item.dueDate}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#A89A91]">Submission Rate:</span>
                      <span className="font-bold text-[#F1E5D8]">
                        {item.submittedCount} / {item.totalStudents} ({completionPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#2A1710] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2A1710] flex items-center justify-between">
                <span className="text-[11px] text-[#A89A91] font-mono">{item.batchName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAssignment(item)}
                >
                  Submissions
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submissions Detail Modal */}
      <Modal
        isOpen={Boolean(selectedAssignment)}
        onClose={() => setSelectedAssignment(null)}
        title={selectedAssignment?.title || 'Assignment Submissions'}
      >
        {selectedAssignment && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#140F0D] rounded-lg border border-[#2A1710] flex justify-between items-center">
              <div>
                <div className="font-semibold text-[#F5F0EA]">{selectedAssignment.courseName}</div>
                <div className="text-[#A89A91] text-[11px]">Due: {selectedAssignment.dueDate}</div>
              </div>
              <span className="text-emerald-400 font-bold font-mono">
                {selectedAssignment.submittedCount} Submissions
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {students.slice(0, 5).map((stu) => (
                <div
                  key={stu.id}
                  onClick={() => navigate(`/admin/students/${stu.id}`)}
                  className="p-2.5 bg-[#1C1714] rounded-lg border border-[#2A1710] hover:border-[#5A321F] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-[#946246]" />
                    <div>
                      <span className="font-semibold text-[#F5F0EA]">{stu.fullName}</span>
                      <span className="text-[10px] text-[#A89A91] block font-mono">{stu.studentId}</span>
                    </div>
                  </div>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-semibold">
                    Submitted (95/100)
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedAssignment(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Academic Assignment"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A89A91] mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Distributed Cache Implementation"
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-[#A89A91] mb-1">Course *</label>
            <select
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#A89A91] mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed submission guidelines and rubric..."
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
