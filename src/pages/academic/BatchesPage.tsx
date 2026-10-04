import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Search,
  BookOpen,
  User,
  Users,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  getAcademicBatches,
  createAcademicBatch,
  updateAcademicBatch,
  deleteAcademicBatch,
} from '../../services/academicBatchService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { AcademicBatch } from '../../types';

export const BatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [batches, setBatches] = useState<AcademicBatch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<AcademicBatch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicBatch | null>(null);

  const courses = getAcademicCourses();

  const [formData, setFormData] = useState({
    name: '',
    batchCode: '',
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.name || 'Full-Stack Web Development',
    teacherId: 'tch-1',
    teacherName: 'Dr. Sarah Jenkins',
    startDate: '2026-09-01',
    endDate: '2027-02-28',
    classroom: 'Lab 101',
    maxCapacity: 30,
    status: 'Active' as AcademicBatch['status'],
  });

  const loadData = () => {
    setBatches(getAcademicBatches());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = batches.filter((b) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.name.toLowerCase().includes(q) ||
        b.batchCode.toLowerCase().includes(q) ||
        b.courseName.toLowerCase().includes(q) ||
        b.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      name: '',
      batchCode: `BTC-${Math.floor(100 + Math.random() * 900)}`,
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.name || 'Full-Stack Web Development',
      teacherId: 'tch-1',
      teacherName: 'Dr. Sarah Jenkins',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-03-31',
      classroom: 'Lab 204',
      maxCapacity: 30,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: AcademicBatch) => {
    setEditingBatch(b);
    setFormData({
      name: b.name,
      batchCode: b.batchCode,
      courseId: b.courseId,
      courseName: b.courseName,
      teacherId: b.teacherId,
      teacherName: b.teacherName,
      startDate: b.startDate,
      endDate: b.endDate,
      classroom: b.classroom,
      maxCapacity: b.maxCapacity,
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.batchCode.trim()) {
      showToast('Batch name and code are required.', 'error');
      return;
    }

    const selCourse = courses.find((c) => c.id === formData.courseId);

    if (editingBatch) {
      updateAcademicBatch(editingBatch.id, {
        ...formData,
        courseName: selCourse?.name || formData.courseName,
      });
      showToast(`Batch "${formData.name}" updated!`, 'success');
    } else {
      createAcademicBatch({
        ...formData,
        courseName: selCourse?.name || formData.courseName,
      });
      showToast(`Batch "${formData.name}" created!`, 'success');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAcademicBatch(deleteTarget.id);
      showToast(`Batch "${deleteTarget.name}" deleted.`, 'warning');
      setDeleteTarget(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Academic Cohort Batches"
        subtitle="Manage student batch allocations, assign lead instructors, designate physical/virtual classrooms, and set start dates"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Academic', to: '/admin/courses' },
          { label: 'Batches' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Batch
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
            placeholder="Search batches by name, code, course, or teacher..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((batch) => (
          <Card
            key={batch.id}
            className="p-5 bg-[#140F0D] border-[#3A2922] flex flex-col justify-between hover:border-[#5A321F] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2A1710] text-[#946246] font-bold">
                  {batch.batchCode}
                </span>
                <StatusBadge status={batch.status} size="sm" />
              </div>
              <h3 className="font-bold text-base text-[#F5F0EA]">{batch.name}</h3>
              <p className="text-xs text-[#A89A91] mt-0.5">{batch.courseName}</p>

              <div className="mt-4 pt-3 border-t border-[#2A1710] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Lead Instructor:</span>
                  <span className="text-[#F5F0EA] font-semibold">{batch.teacherName}</span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Classroom / Lab:</span>
                  <span className="font-mono text-[#F1E5D8]">{batch.classroom}</span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Schedule Timeline:</span>
                  <span className="font-mono text-[#A89A91]">
                    {batch.startDate} to {batch.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Cohort Capacity:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {batch.currentStudentsCount || 18} / {batch.maxCapacity} Students
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A1710] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/batches/${batch.id}`)}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Batch Details
              </Button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(batch)}
                  className="p-1.5 text-[#A89A91] hover:text-[#F1E5D8] hover:bg-[#2A1710] rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(batch)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBatch ? 'Edit Batch Allocation' : 'Create Academic Batch'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A89A91] mb-1">Batch Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Batch 2026-Alpha"
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Batch Code *</label>
              <input
                type="text"
                required
                value={formData.batchCode}
                onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Course Program *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Classroom / Lab</label>
              <input
                type="text"
                value={formData.classroom}
                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Max Capacity</label>
              <input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingBatch ? 'Save Changes' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Academic Batch"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete Batch"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
