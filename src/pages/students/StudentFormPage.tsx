import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Users,
  User,
  GraduationCap,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';
import { useToast } from '../../context/ToastContext';
import {
  getStudentById,
  createStudent,
  updateStudent,
} from '../../services/studentService';
import { getAcademicCourses } from '../../services/academicCourseService';
import { getAcademicBatches } from '../../services/academicBatchService';
import { Student } from '../../types';

export const StudentFormPage: React.FC = () => {
  const { studentId } = useParams<{ studentId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(studentId);

  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    // Personal
    fullName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    profileImage: '',

    // Academic
    studentId: `DX-STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    department: 'Software Engineering',
    course: '',
    batch: '',
    section: 'A',
    academicYear: '2025-2026',
    admissionDate: new Date().toISOString().split('T')[0],

    // Guardian
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    emergencyContact: '',

    // Account
    accountEmail: '',
    temporaryPassword: 'DudexStudent@2026',
    status: 'Active' as Student['status'],

    // Additional
    skills: 'JavaScript, React, Python',
    careerInterests: 'Full-Stack Engineer, AI Developer',
    notes: 'Enrolled under regular merit admission.',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load courses and batches
  useEffect(() => {
    getAcademicCourses().then((data) => {
      setCourses(data);
      if (!isEditing && data.length > 0) {
        setFormData((prev) => ({ ...prev, course: prev.course || data[0].name }));
      }
    });
    getAcademicBatches().then((data) => {
      setBatches(data);
      if (!isEditing && data.length > 0) {
        setFormData((prev) => ({ ...prev, batch: prev.batch || data[0].name }));
      }
    });
  }, []);

  // Load existing student data for editing
  useEffect(() => {
    if (studentId) {
      getStudentById(studentId).then((existing) => {
        if (existing) {
          setFormData({
            fullName: existing.fullName,
            dob: existing.dob,
            gender: existing.gender,
            phone: existing.phone,
            email: existing.email,
            address: existing.address,
            profileImage: existing.profileImage || '',
            studentId: existing.studentId,
            department: existing.department,
            course: existing.course,
            batch: existing.batch,
            section: existing.section,
            academicYear: existing.academicYear,
            admissionDate: existing.admissionDate,
            guardianName: existing.guardianName,
            guardianPhone: existing.guardianPhone,
            guardianEmail: existing.guardianEmail || '',
            emergencyContact: existing.emergencyContact,
            accountEmail: existing.accountEmail || existing.email,
            temporaryPassword: '••••••••',
            status: existing.status,
            skills: Array.isArray(existing.skills) ? existing.skills.join(', ') : (existing.skills || ''),
            careerInterests: Array.isArray(existing.careerInterests) ? existing.careerInterests.join(', ') : (existing.careerInterests || ''),
            notes: existing.notes || '',
          });
        } else {
          showToast('Student not found.', 'error');
          navigate('/admin/students/list');
        }
      });
    }
  }, [studentId, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'email' && !isEditing ? { accountEmail: value } : {}),
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.guardianName.trim()) errs.guardianName = 'Guardian name is required';
    if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    const payload: Partial<Student> = {
      fullName: formData.fullName,
      dob: formData.dob,
      gender: formData.gender as any,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      profileImage: formData.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      studentId: formData.studentId,
      department: formData.department,
      course: formData.course,
      batch: formData.batch,
      section: formData.section,
      academicYear: formData.academicYear,
      admissionDate: formData.admissionDate,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      guardianEmail: formData.guardianEmail,
      emergencyContact: formData.emergencyContact,
      accountEmail: formData.accountEmail,
      status: formData.status,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      careerInterests: formData.careerInterests,
      notes: formData.notes,
    };

    if (isEditing && studentId) {
      await updateStudent(studentId, payload);
      showToast(`Student ${payload.fullName} updated successfully!`, 'success');
      navigate(`/admin/students/${studentId}`);
    } else {
      const created = await createStudent(payload);
      showToast(`Student ${created?.fullName || payload.fullName} created successfully!`, 'success');
      navigate(`/admin/students/${created?.id || 'list'}`);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <PageHeader
        title={isEditing ? `Edit Student: ${formData.fullName}` : 'Register New Student'}
        subtitle={
          isEditing
            ? 'Update academic records, personal information, and guardian contacts'
            : 'Fill in the 5-part student dossier to enroll a new academy member'
        }
        breadcrumbs={[
          { label: 'Admin', to: '/admin/dashboard' },
          { label: 'Students', to: '/admin/students/list' },
          { label: isEditing ? 'Edit Student' : 'New Student' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <Card className="p-5 sm:p-6 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#3A2922]">
            <User className="w-5 h-5 text-[#946246]" />
            <h3 className="text-sm font-bold text-[#F5F0EA] uppercase tracking-wider">
              1. Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Full Name *
              </label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                error={errors.fullName}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Date of Birth *
              </label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="alex.m@dudex.academy"
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Phone Number *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 234-5678"
                error={errors.phone}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Profile Photo URL
              </label>
              <Input
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Residential Address
              </label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Street address, City, State, ZIP..."
              />
            </div>
          </div>
        </Card>

        {/* SECTION 2: ACADEMIC DETAILS */}
        <Card className="p-5 sm:p-6 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#3A2922]">
            <GraduationCap className="w-5 h-5 text-[#946246]" />
            <h3 className="text-sm font-bold text-[#F5F0EA] uppercase tracking-wider">
              2. Academic Allocation
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Student ID *
              </label>
              <Input
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Cloud Architecture">Cloud Architecture</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Batch *
              </label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Admission Date
              </label>
              <Input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* SECTION 3: GUARDIAN & EMERGENCY */}
        <Card className="p-5 sm:p-6 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#3A2922]">
            <Phone className="w-5 h-5 text-[#946246]" />
            <h3 className="text-sm font-bold text-[#F5F0EA] uppercase tracking-wider">
              3. Guardian & Emergency Contact
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Guardian Full Name *
              </label>
              <Input
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="e.g. Robert Morgan"
                error={errors.guardianName}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Guardian Phone
              </label>
              <Input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                placeholder="+1 (555) 456-7890"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Guardian Email
              </label>
              <Input
                type="email"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleChange}
                placeholder="robert.m@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Emergency Contact Number *
              </label>
              <Input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="+1 (555) 999-0000"
                error={errors.emergencyContact}
              />
            </div>
          </div>
        </Card>

        {/* SECTION 4: ACCOUNT & STATUS */}
        <Card className="p-5 sm:p-6 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#3A2922]">
            <ShieldCheck className="w-5 h-5 text-[#946246]" />
            <h3 className="text-sm font-bold text-[#F5F0EA] uppercase tracking-wider">
              4. Student Portal Account
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Login Email
              </label>
              <Input
                type="email"
                name="accountEmail"
                value={formData.accountEmail}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Temporary Password
              </label>
              <Input
                type="text"
                name="temporaryPassword"
                value={formData.temporaryPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Enrollment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#1C1714] border border-[#3A2922] text-[#F5F0EA] text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none focus:border-[#946246]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card>

        {/* SECTION 5: SKILLS & NOTES */}
        <Card className="p-5 sm:p-6 bg-[#171311] border-[#3A2922]">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#3A2922]">
            <Sparkles className="w-5 h-5 text-[#946246]" />
            <h3 className="text-sm font-bold text-[#F5F0EA] uppercase tracking-wider">
              5. Skills, Aspirations & Notes
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Technical Skills (comma-separated)
              </label>
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Career Goal / Specialization
              </label>
              <Input
                name="careerInterests"
                value={formData.careerInterests}
                onChange={handleChange}
                placeholder="Senior Cloud Architect, AI Specialist..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#A89A91] mb-1.5">
                Administrative Notes
              </label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Special accommodations, scholarships, transfer details..."
              />
            </div>
          </div>
        </Card>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3A2922]">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="min-w-[140px]">
            <Save className="w-4 h-4 mr-1.5" />
            {isEditing ? 'Save Changes' : 'Register Student'}
          </Button>
        </div>
      </form>
    </div>
  );
};
