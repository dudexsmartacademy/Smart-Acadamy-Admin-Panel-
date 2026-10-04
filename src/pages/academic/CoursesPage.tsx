import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Library,
  PlusCircle,
  Search,
  BookOpen,
  Users,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import {
  getAcademicCourses,
  createAcademicCourse,
  updateAcademicCourse,
  deleteAcademicCourse,
} from '../../services/academicCourseService';
import { AcademicCourse } from '../../types';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AcademicCourse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AcademicCourse | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    description: '',
    category: 'Full-Stack',
    duration: '24 Weeks (6 Months)',
    fee: 4000,
    status: 'Active' as AcademicCourse['status'],
  });

  const loadData = () => {
    getAcademicCourses().then(setCourses);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = courses.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      name: '',
      courseCode: `CRS-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      category: 'Software Engineering',
      duration: '24 Weeks',
      fee: 3500,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: AcademicCourse) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      courseCode: course.courseCode,
      description: course.description,
      category: course.category,
      duration: course.duration,
      fee: course.fee,
      status: course.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.courseCode.trim()) {
      showToast('Course name and code are required.', 'error');
      return;
    }

    if (editingCourse) {
      await updateAcademicCourse(editingCourse.id, formData);
      showToast(`Course "${formData.name}" updated!`, 'success');
    } else {
      await createAcademicCourse(formData);
      showToast(`Course "${formData.name}" created!`, 'success');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteAcademicCourse(deleteTarget.id);
      showToast(`Course "${deleteTarget.name}" deleted.`, 'warning');
      setDeleteTarget(null);
      loadData();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Academic Courses Management"
        subtitle="Create academic programs, define durations, establish fee structures, and manage curriculum tracks"
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Academic', to: '/admin/courses' },
          { label: 'Courses' },
        ]}
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenCreate}>
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Create Course
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
            placeholder="Search courses by name, code, or category..."
            className="w-full pl-9 pr-4 py-2 bg-[#1C1714] border border-[#3A2922] rounded-lg text-xs sm:text-sm text-[#F5F0EA] placeholder-[#A89A91]/60 focus:outline-none focus:border-[#946246]"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => (
          <Card
            key={course.id}
            className="p-5 bg-[#140F0D] border-[#3A2922] flex flex-col justify-between hover:border-[#5A321F] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2A1710] text-[#946246] font-bold">
                  {course.courseCode}
                </span>
                <StatusBadge status={course.status} size="sm" />
              </div>
              <h3 className="font-bold text-base text-[#F5F0EA]">{course.name}</h3>
              <p className="text-xs text-[#A89A91] mt-1 line-clamp-2">{course.description}</p>

              <div className="mt-4 pt-3 border-t border-[#2A1710] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Category:</span>
                  <span className="text-[#F5F0EA] font-semibold">{course.category}</span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Duration:</span>
                  <span className="font-mono text-[#F1E5D8]">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Tuition Fee:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ${course.fee}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#A89A91]">
                  <span>Enrolled Students:</span>
                  <span className="font-semibold text-[#F5F0EA]">{course.enrolledStudentsCount || 24}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#2A1710] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/courses/${course.id}`)}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View Course
              </Button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(course)}
                  className="p-1.5 text-[#A89A91] hover:text-[#F1E5D8] hover:bg-[#2A1710] rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(course)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCourse ? 'Edit Academic Course' : 'Create New Academic Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A89A91] mb-1">Course Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Distributed Systems & Cloud Engineering"
              className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Course Code *</label>
              <input
                type="text"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A89A91] mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="24 Weeks"
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-[#A89A91] mb-1">Tuition Fee ($)</label>
              <input
                type="number"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A89A91] mb-1">Description</label>
            <textarea
              rows={3}
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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Course Program"
        message={`Are you sure you want to delete ${deleteTarget?.name}? All associated subject structures and student associations will be affected.`}
        confirmText="Delete Course"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
