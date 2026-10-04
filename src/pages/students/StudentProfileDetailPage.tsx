import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Upload,
  User,
  GraduationCap,
  Building,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { studentService } from '../../services/studentService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { useToast } from '../../context/ToastContext';
import { Student } from '../../types';

export const StudentProfileDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);

  // Batches
  const allBatches = useMemo(() => {
    const list = getAcademicBatches();
    const batchNames = ['Batch 1', 'Batch 2', 'Batch 3'];
    list.forEach((b) => {
      if (!batchNames.includes(b.name)) {
        batchNames.push(b.name);
      }
    });
    return batchNames;
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    alternatePhone: '',
    address: '',
    githubUrl: '',
    linkedinUrl: '',
    collegeName: '',
    collegeMailId: '',
    registerNumber: '',
    course: '',
    specialization: '',
    section: '',
    batchName: 'Batch 1',
    role: 'AI Placement / Software Engineer',
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load student data
  useEffect(() => {
    let s: Student | undefined;
    if (studentId) {
      s =
        studentService.getStudentById(studentId) ||
        studentService
          .getStudents()
          .find((item) => item.id === studentId || item.studentId === studentId);
    }

    if (!s) {
      // Fallback default student (Naveen J.K.)
      s = studentService.getStudents().find((item) => item.id === 'stu-naveen-01') || {
        id: 'stu-naveen-01',
        studentId: 'STU-2026-000',
        fullName: 'Naveen J.K.',
        email: 'naveen.jk@gmail.com',
        phone: '+91 98765 43210',
        whatsappNumber: '+91 98765 43210',
        alternatePhone: '+91 91234 56789',
        address: 'No. 42, Tech Corridor Avenue, Bengaluru, Karnataka - 560100',
        githubUrl: 'https://github.com/naveen-jk',
        linkedinUrl: 'https://linkedin.com/in/naveen-jk',
        collegeName: 'DudeX Institute of Technology',
        collegeMailId: 'naveen.24ad@dudex.edu.in',
        registerNumber: '24XX001',
        course: 'B.E. / B.Tech',
        specialization: 'Full Stack AI Engineering',
        section: 'Section B',
        batchName: 'Batch 1',
        department: 'Artificial Intelligence & Data Science',
        gender: 'male',
        dob: '2004-05-15',
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
    setFormData({
      fullName: s.fullName || 'Naveen J.K.',
      email: s.email || 'naveen.jk@gmail.com',
      whatsappNumber: s.whatsappNumber || s.phone || '+91 98765 43210',
      alternatePhone: s.alternatePhone || '+91 91234 56789',
      address:
        s.address ||
        'No. 42, Tech Corridor Avenue, Bengaluru, Karnataka - 560100',
      githubUrl: s.githubUrl || 'https://github.com/naveen-jk',
      linkedinUrl: s.linkedinUrl || 'https://linkedin.com/in/naveen-jk',
      collegeName: s.collegeName || 'DudeX Institute of Technology',
      collegeMailId: s.collegeMailId || `${s.email.split('@')[0]}@dudex.edu.in`,
      registerNumber: s.registerNumber || s.studentId || '24XX001',
      course: s.course || s.courseName || 'B.E. / B.Tech',
      specialization:
        s.specialization ||
        (typeof s.careerInterests === 'string'
          ? s.careerInterests
          : 'Full Stack AI Engineering'),
      section: s.section || 'Section B',
      batchName: s.batchName || s.batch || 'Batch 1',
      role: 'AI Placement / Software Engineer',
    });
  }, [studentId]);

  // Handle Save
  const handleSaveAll = () => {
    if (!student) return;
    setIsSaving(true);

    const updated = studentService.updateStudent(student.id, {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.whatsappNumber,
      whatsappNumber: formData.whatsappNumber,
      alternatePhone: formData.alternatePhone,
      address: formData.address,
      githubUrl: formData.githubUrl,
      linkedinUrl: formData.linkedinUrl,
      collegeName: formData.collegeName,
      collegeMailId: formData.collegeMailId,
      registerNumber: formData.registerNumber,
      course: formData.course,
      courseName: formData.course,
      specialization: formData.specialization,
      section: formData.section,
      batch: formData.batchName,
      batchName: formData.batchName,
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsEditingPersonal(false);
      setIsEditingCollege(false);
      if (updated) {
        setStudent(updated);
      }
      showToast(
        `Student profile updated! Moved to ${formData.batchName}`,
        'success'
      );
    }, 300);
  };

  // Get Initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (!student) {
    return (
      <div className="py-20 text-center text-[#A89A91]">
        Loading student profile...
      </div>
    );
  }

  const initials = getInitials(formData.fullName);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fadeIn">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/students/profiles')}
          className="flex items-center gap-2 text-xs font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Profiles
        </button>

        {(isEditingPersonal || isEditingCollege) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditingPersonal(false);
                setIsEditingCollege(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#171311] hover:bg-[#2A1E19] border border-[#3A2922] text-xs font-medium text-[#A89A91] hover:text-[#F5F0EA] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#946246] hover:bg-[#7A4930] text-[#F5F0EA] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* TOP PROFILE HEADER CARD matching Screenshot 2 */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Avatar & Student Name */}
          <div className="flex items-center gap-4">
            {/* Initials Badge / Photo matching Screenshot 2 (Circle NJ) */}
            <div className="w-16 h-16 rounded-full bg-[#C8B8A6] text-[#2C1A12] font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              {initials}
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#F5F0EA] leading-tight">
                {formData.fullName}
              </h1>
              <p className="text-xs text-[#A89A91] mt-0.5 font-medium">
                {formData.role}
              </p>
              <button
                type="button"
                onClick={() =>
                  showToast('Photo upload capability ready', 'info')
                }
                className="mt-2.5 px-3 py-1 rounded-lg bg-[#140F0D] hover:bg-[#2A1E19] border border-[#3A2922] text-[11px] font-semibold text-[#A89A91] hover:text-[#F5F0EA] transition-colors cursor-pointer"
              >
                Change Profile Photo
              </button>
            </div>
          </div>

          {/* Right: Batch Relocation & Edit Button */}
          <div className="flex items-center gap-3">
            {/* Batch Relocation Selection Dropdown */}
            <div className="flex items-center gap-2 bg-[#140F0D] px-3 py-1.5 rounded-xl border border-[#3A2922]">
              <span className="text-xs text-[#A89A91]">Cohort:</span>
              <select
                value={formData.batchName}
                onChange={(e) => {
                  setFormData({ ...formData, batchName: e.target.value });
                  studentService.updateStudent(student.id, {
                    batch: e.target.value,
                    batchName: e.target.value,
                  });
                  showToast(
                    `Student allocated to ${e.target.value}`,
                    'success'
                  );
                }}
                className="bg-transparent text-xs font-bold text-[#F5F0EA] focus:outline-none cursor-pointer"
              >
                {allBatches.map((b) => (
                  <option key={b} value={b} className="bg-[#1C1715] text-[#F5F0EA]">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => {
                if (isEditingPersonal && isEditingCollege) {
                  handleSaveAll();
                } else {
                  setIsEditingPersonal(true);
                  setIsEditingCollege(true);
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#140F0D] hover:bg-[#2A1E19] border border-[#3A2922] text-xs font-semibold text-[#F5F0EA] transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#946246]" />
              {isEditingPersonal || isEditingCollege ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Personal & Contact Details matching Screenshot 2 */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A1E19]">
          <h2 className="text-sm font-bold text-[#F5F0EA]">
            Personal & Contact Details
          </h2>
          <button
            type="button"
            onClick={() => setIsEditingPersonal(!isEditingPersonal)}
            className="text-xs text-[#946246] hover:text-[#F1E5D8] font-medium flex items-center gap-1 cursor-pointer"
          >
            <Edit className="w-3 h-3" />
            {isEditingPersonal ? 'Close' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Row 1: Full Name & Personal Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#A89A91]">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                disabled={!isEditingPersonal}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                  isEditingPersonal
                    ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                    : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#A89A91]">
                Personal Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={!isEditingPersonal}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                  isEditingPersonal
                    ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                    : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                }`}
              />
            </div>
          </div>

          {/* Row 2: WhatsApp Number & Alternate Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#A89A91]">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                disabled={!isEditingPersonal}
                onChange={(e) =>
                  setFormData({ ...formData, whatsappNumber: e.target.value })
                }
                className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                  isEditingPersonal
                    ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                    : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#A89A91]">
                Alternate Phone
              </label>
              <input
                type="text"
                value={formData.alternatePhone}
                disabled={!isEditingPersonal}
                onChange={(e) =>
                  setFormData({ ...formData, alternatePhone: e.target.value })
                }
                className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                  isEditingPersonal
                    ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                    : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                }`}
              />
            </div>
          </div>

          {/* Row 3: Current Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              Current Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              disabled={!isEditingPersonal}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={`w-full p-3 rounded-xl border text-xs text-[#F5F0EA] resize-none transition-all ${
                isEditingPersonal
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* Professional Portfolio Links */}
          <div className="pt-2 space-y-3">
            <h3 className="text-xs font-semibold text-[#A89A91]">
              Professional Portfolio Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#A89A91]">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  disabled={!isEditingPersonal}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                    isEditingPersonal
                      ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                      : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#A89A91]">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  disabled={!isEditingPersonal}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedinUrl: e.target.value })
                  }
                  className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                    isEditingPersonal
                      ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none focus:ring-1 focus:ring-[#946246]'
                      : 'bg-[#140F0D] border-[#3A2922] opacity-90'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: College Information matching Screenshot 3 */}
      <div className="bg-[#171311] border border-[#3A2922] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A1E19]">
          <h2 className="text-sm font-bold text-[#F5F0EA]">
            College Information
          </h2>
          <button
            type="button"
            onClick={() => setIsEditingCollege(!isEditingCollege)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#140F0D] hover:bg-[#2A1E19] border border-[#3A2922] text-xs font-semibold text-[#F5F0EA] transition-colors cursor-pointer"
          >
            <Edit className="w-3 h-3 text-[#946246]" />
            {isEditingCollege ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* College Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              College Name
            </label>
            <input
              type="text"
              value={formData.collegeName}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, collegeName: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* College Mail ID (Locked) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              College Mail ID <span className="text-[10px] text-[#A89A91]">(Locked)</span>
            </label>
            <input
              type="email"
              value={formData.collegeMailId}
              disabled
              className="w-full h-10 px-3.5 rounded-xl border border-[#3A2922] bg-[#140F0D]/60 text-xs text-[#A89A91] cursor-not-allowed"
            />
          </div>

          {/* College Register Number */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              College Register Number
            </label>
            <input
              type="text"
              value={formData.registerNumber}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, registerNumber: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* Course */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              Course
            </label>
            <input
              type="text"
              value={formData.course}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* Specialization */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, specialization: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>

          {/* Section */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A89A91]">
              Section
            </label>
            <input
              type="text"
              value={formData.section}
              disabled={!isEditingCollege}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className={`w-full h-10 px-3.5 rounded-xl border text-xs text-[#F5F0EA] transition-all ${
                isEditingCollege
                  ? 'bg-[#140F0D] border-[#946246]/60 focus:outline-none'
                  : 'bg-[#140F0D] border-[#3A2922] opacity-90'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
