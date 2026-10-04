import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookMarked,
  PlusCircle,
  Search,
  BookOpen,
  User,
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
  getAcademicSubjects,
  createAcademicSubject,
  updateAcademicSubject,
  deleteAcademicSubject,
} from '../../services/academicSubjectService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { AcademicSubject } from '../../types';

export const SubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [subjects, setSubjects] = useState<AcademicSubject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AcademicSubject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicSubject | null>(null);

  const courses = getAcademicCourses();

  const [formData, setFormData] = useState({
    name: '',
    subjectCode: '',
    courseId: courses[0]?.id || '',
    courseName: courses[0]?.name || 'Full-Stack Web Development',
    teacherId: 'tch-1',
    teacherName: 'Dr. Sarah Jenkins',
    description: '',
    status: 'Active' as AcademicSubject['status'],
  });

  const loadData = () => {
    setSubjects(getAcademicSubjects());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = subjects.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.subjectCode.toLowerCase().includes(q) ||
        s.courseName.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      subjectCode: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      courseId: courses[0]?.id || '',
      courseName: courses[0]?.name || 'Full-Stack Web Development',
      teacherId: 'tch-1',
      teacherName: 'Dr. Sarah Jenkins',
      description: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: AcademicSubject) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      subjectCode: sub.subjectCode,
      courseId: sub.courseId,
      courseName: sub.courseName,
      teacherId: sub.teacherId,
      teacherName: sub.teacherName,
      description: sub.description,
      status: sub.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subjectCode.trim()) {
      showToast('Subject name and code are required.', 'error');
      return;
    }

    const selCourse = courses.find((c) => c.id === formData.courseId);

    if (editingSubject) {
      updateAcademicSubject(editingSubject.id, {
        ...formData,
        courseName: selCourse?.name || formData.courseName,
      });
      showToast(`Subject "${formData.name}" updated!`, 'success');
    } else {
      createAcademicSubject({
        ...formData,
        courseName: selCourse?.name || formData.courseName,
      });
      showToast(`Subject "${formData.name}" created!`, 'success');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAcademicSubject(deleteTarget.id);
      showToast(`Subject "${deleteTarget.name}" deleted.`, 'warning');
      setDeleteTarget(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Academic Subjects & Modules"
        subtitle="Curriculum subjects, lecture requirements, module codes, and assigned faculty leads"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Academic', to: '/admin/courses' },
          { label: 'Subjects' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Add Subject
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
            placeholder="Search subjects by name, code, course, or teacher..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-[#3A2922] bg-[#140F0D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#3A2922] bg-[#1A1412] text-[11px] font-bold uppercase tracking-wider text-[#A89A91]">
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Program Course</th>
                <th className="py-3 px-4">Assigned Instructor</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1710]">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#1E1815]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#F1E5D8]">
                    {sub.subjectCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F5F0EA]">
                    {sub.name}
                  </td>
                  <td className="py-3 px-4 text-[#A89A91]">
                    {sub.courseName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#F5F0EA]">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      {sub.teacherName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A89A91] max-w-[200px] truncate">
                    {sub.description}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={sub.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(sub)}
                        className="p-1.5 text-[#A89A91] hover:text-[#F1E5D8] hover:bg-[#2A1710] rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
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

      {/* Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A89A91] mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Asynchronous Microservices Architecture"
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={formData.subjectCode}
                onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
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

          <div>
            <label className="block text-[#A89A91] mb-1">Assigned Teacher</label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-[#A89A91] mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Academic Subject"
        message={`Are you sure you want to delete ${deleteTarget?.name}?`}
        confirmText="Delete Subject"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
