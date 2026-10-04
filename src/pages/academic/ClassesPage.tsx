import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Presentation,
  PlusCircle,
  Search,
  BookOpen,
  User,
  Layers,
  Calendar,
  Clock,
  MapPin,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  getAcademicClasses,
  createAcademicClass,
  updateAcademicClass,
  deleteAcademicClass,
} from '../../services/academicClassService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { getAcademicSubjects } from '../../services/academicSubjectService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { AcademicClass } from '../../types';

export const ClassesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicClass | null>(null);

  const courses = getAcademicCourses();
  const subjects = getAcademicSubjects();
  const batches = getAcademicBatches();

  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.name || 'Full-Stack Web Development',
    subjectId: subjects[0]?.id || '',
    subjectName: subjects[0]?.name || 'React & Frontend Architecture',
    teacherId: 'tch-1',
    teacherName: 'Dr. Sarah Jenkins',
    batchId: batches[0]?.id || '',
    batchName: batches[0]?.name || 'Batch 2026-Alpha',
    classroom: 'Lab 101',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    status: 'Scheduled' as AcademicClass['status'],
  });

  const loadData = () => {
    setClasses(getAcademicClasses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = classes.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.title.toLowerCase().includes(q) ||
        c.courseName.toLowerCase().includes(q) ||
        c.subjectName.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q) ||
        c.classroom.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingClass(null);
    setFormData({
      title: '',
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.name || 'Full-Stack Web Development',
      subjectId: subjects[0]?.id || '',
      subjectName: subjects[0]?.name || 'React & Frontend Architecture',
      teacherId: 'tch-1',
      teacherName: 'Dr. Sarah Jenkins',
      batchId: batches[0]?.id || '',
      batchName: batches[0]?.name || 'Batch 2026-Alpha',
      classroom: 'Lab 201',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00 AM',
      endTime: '11:30 AM',
      status: 'Scheduled',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: AcademicClass) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      courseId: cls.courseId,
      courseName: cls.courseName,
      subjectId: cls.subjectId,
      subjectName: cls.subjectName,
      teacherId: cls.teacherId,
      teacherName: cls.teacherName,
      batchId: cls.batchId,
      batchName: cls.batchName,
      classroom: cls.classroom,
      date: cls.date,
      startTime: cls.startTime,
      endTime: cls.endTime,
      status: cls.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Class title is required.', 'error');
      return;
    }

    const selCourse = courses.find((c) => c.id === formData.courseId);
    const selSub = subjects.find((s) => s.id === formData.subjectId);
    const selBatch = batches.find((b) => b.id === formData.batchId);

    const payload = {
      ...formData,
      courseName: selCourse?.name || formData.courseName,
      subjectName: selSub?.name || formData.subjectName,
      batchName: selBatch?.name || formData.batchName,
    };

    if (editingClass) {
      updateAcademicClass(editingClass.id, payload);
      showToast(`Class "${formData.title}" updated!`, 'success');
    } else {
      createAcademicClass(payload);
      showToast(`Class "${formData.title}" scheduled!`, 'success');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAcademicClass(deleteTarget.id);
      showToast(`Class "${deleteTarget.title}" removed.`, 'warning');
      setDeleteTarget(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Academic Classes & Sessions"
        subtitle="Schedule live lab sessions, interactive lectures, and track faculty room allocations"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Academic', to: '/admin/courses' },
          { label: 'Classes' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Schedule Class
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
            placeholder="Search classes by title, course, subject, or room..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-[#3A2922] bg-[#140F0D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#1A1412] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3 px-4">Class Title</th>
                <th className="py-3 px-4">Program & Subject</th>
                <th className="py-3 px-4">Faculty Lead</th>
                <th className="py-3 px-4">Batch & Classroom</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {filtered.map((cls) => (
                <tr key={cls.id} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/admin/classes/${cls.id}`)}
                      className="font-semibold text-sm text-[#F5F0EA] hover:text-[#946246] transition-colors text-left"
                    >
                      {cls.title}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#F5F0EA]">{cls.subjectName}</div>
                    <div className="text-[11px] text-[#A89A91]">{cls.courseName}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F5F0EA]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      {cls.teacherName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[#F5F0EA]">{cls.batchName}</div>
                    <div className="text-[11px] font-mono text-[#946246]">Room {cls.classroom}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#A89A91]">
                    <div>{cls.date}</div>
                    <div className="text-[10px] text-[#F1E5D8]">{cls.startTime} - {cls.endTime}</div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={cls.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/classes/${cls.id}`)}
                        className="p-1.5 text-[#A89A91] hover:text-[#F1E5D8] hover:bg-[#2A1710] rounded transition-colors"
                        title="View Class"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(cls)}
                        className="p-1.5 text-[#A89A91] hover:text-[#F1E5D8] hover:bg-[#2A1710] rounded transition-colors"
                        title="Edit Class"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cls)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClass ? 'Edit Academic Class' : 'Schedule Academic Class'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A89A91] mb-1">Class Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Advanced State Management & React Query"
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block text-[#A89A91] mb-1">Subject *</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Batch *</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#A89A91] mb-1">Classroom / Lab</label>
              <input
                type="text"
                value={formData.classroom}
                onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                placeholder="Lab 101"
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Start Time</label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">End Time</label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A89A91] mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingClass ? 'Save Changes' : 'Schedule Class'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Academic Class"
        message={`Are you sure you want to delete ${deleteTarget?.title}?`}
        confirmText="Delete Class"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
