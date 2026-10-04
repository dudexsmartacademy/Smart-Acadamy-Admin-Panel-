import React, { useRef, useState, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  Save,
  ArrowLeft,
  Plus,
  X,
  Lock,
  FileText,
  MapPin,
  CheckCircle2,
  Camera,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';

import { Button } from '../../components/common/Button';

import { Input } from '../../components/common/Input';

import { Textarea } from '../../components/common/Textarea';

import { Select } from '../../components/common/Select';

import { Card } from '../../components/common/Card';

import { useToast } from '../../context/ToastContext';

import { teacherService } from '../../services/teacherService';

import {
  Teacher,
  TeacherStatus,
  EmploymentType,
  Gender,
} from '../../types';

import {
  DEPARTMENTS,
  DESIGNATIONS,
  SUBJECTS_MAP,
} from '../../constants/storageKeys';

export const TeacherFormPage: React.FC = () => {
  const { teacherId } = useParams<{ teacherId?: string }>();

  const isEditing = Boolean(teacherId);

  const navigate = useNavigate();

  const { success, error: toastError } = useToast();

  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    fullName: '',
    avatar: '',
    email: '',
    phone: '',
    dob: '1988-01-01',
    gender: 'male' as Gender,
    address: '',
    teacherId: '',
    department: DEPARTMENTS[0],
    designation: DESIGNATIONS[2],
    qualification: '',
    experienceYears: 4,
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'full-time' as EmploymentType,
    primarySubject: '',
    skills: [] as string[],
    skillInput: '',
    loginEmail: '',
    temporaryPassword: 'TempPassword123!',
    status: 'active' as TeacherStatus,
    bio: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);

  // ============================================================
  // LOAD EXISTING TEACHER
  // ============================================================

  useEffect(() => {
    if (isEditing && teacherId) {
      teacherService.getTeacherById(teacherId).then((existing) => {
        if (existing) {
          setFormData({
            fullName: existing.fullName,
            avatar: existing.avatar || '',
            email: existing.email,
            phone: existing.phone,
            dob: existing.dob,
            gender: existing.gender,
            address: existing.address,
            teacherId: existing.teacherId,
            department: existing.department,
            designation: existing.designation,
            qualification: existing.qualification,
            experienceYears: existing.experienceYears,
            joiningDate: existing.joiningDate,
            employmentType: existing.employmentType,
            primarySubject: existing.primarySubject,
            skills: existing.skills || [],
            skillInput: '',
            loginEmail: existing.loginEmail,
            temporaryPassword: '••••••••',
            status: existing.status,
            bio: existing.bio || '',
            linkedinUrl: existing.linkedinUrl || '',
            githubUrl: existing.githubUrl || '',
            portfolioUrl: existing.portfolioUrl || '',
            notes: existing.notes || '',
          });
        } else {
          toastError(
            'Record Not Found',
            'Could not locate teacher record.'
          );
          navigate('/admin/teachers/list');
        }
      });
    } else {
      // Auto-generate teacher ID
      setFormData((prev) => ({
        ...prev,
        teacherId: `TCH-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        primarySubject:
          SUBJECTS_MAP[DEPARTMENTS[0]]?.[0] ||
          'Computer Science',
      }));
    }
  }, [isEditing, teacherId, navigate]);

  // ============================================================
  // DEPARTMENT CHANGE
  // ============================================================

  const handleDepartmentChange = (dept: string) => {
    const subjects = SUBJECTS_MAP[dept] || ['General'];

    setFormData((prev) => ({
      ...prev,
      department: dept,
      primarySubject: subjects[0] || '',
    }));
  };

  // ============================================================
  // PROFILE PHOTO UPLOAD
  // ============================================================

  const handleProfilePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toastError(
        'Invalid Image',
        'Please select a JPG, PNG, or WEBP image.'
      );

      e.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toastError(
        'Image Too Large',
        'Profile picture must be smaller than 5 MB.'
      );

      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatar: reader.result as string,
        }));
      }
    };

    reader.onerror = () => {
      toastError(
        'Image Error',
        'Unable to read the selected profile picture.'
      );
    };

    reader.readAsDataURL(file);
  };

  // ============================================================
  // REMOVE PROFILE PHOTO
  // ============================================================

  const handleRemoveProfilePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: '',
    }));

    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = '';
    }
  };

  // ============================================================
  // ADD SKILL
  // ============================================================

  const handleAddSkill = () => {
    if (!formData.skillInput.trim()) return;

    if (!formData.skills.includes(formData.skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          prev.skillInput.trim(),
        ],
        skillInput: '',
      }));
    }
  };

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address format';
    }

    if (!formData.teacherId.trim()) {
      errs.teacherId = 'Faculty ID is required';
    }

    if (!formData.department) {
      errs.department = 'Department must be selected';
    }

    if (!formData.designation) {
      errs.designation = 'Designation is required';
    }

    if (!formData.qualification.trim()) {
      errs.qualification =
        'Academic qualification is required';
    }

    if (formData.experienceYears < 0) {
      errs.experienceYears =
        'Experience must be 0 or more years';
    }

    if (!formData.joiningDate) {
      errs.joiningDate = 'Joining date is required';
    }

    if (!formData.primarySubject.trim()) {
      errs.primarySubject =
        'Primary subject is required';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent,
    addAnother = false
  ) => {
    e.preventDefault();

    if (!validate()) {
      toastError(
        'Validation Incomplete',
        'Please fill in all mandatory fields before proceeding.'
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && teacherId) {
        await teacherService.updateTeacher(teacherId, {
          fullName: formData.fullName,
          avatar: formData.avatar,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address,
          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          experienceYears: Number(formData.experienceYears),
          joiningDate: formData.joiningDate,
          employmentType: formData.employmentType,
          primarySubject: formData.primarySubject,
          skills: formData.skills,
          loginEmail: formData.loginEmail || formData.email,
          status: formData.status,
          bio: formData.bio,
          linkedinUrl: formData.linkedinUrl,
          githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl,
          notes: formData.notes,
        });

        success(
          'Faculty Record Updated',
          `Saved profile details for ${formData.fullName}.`
        );
        navigate(`/admin/teachers/${teacherId}`);
      } else {
        const created = await teacherService.createTeacher({
          teacherId: formData.teacherId,
          fullName: formData.fullName,
          avatar:
            formData.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          email: formData.email,
          phone: formData.phone || '+1 (555) 000-0000',
          dob: formData.dob,
          gender: formData.gender,
          address: formData.address || 'Academic Campus Residence',
          department: formData.department,
          designation: formData.designation,
          qualification: formData.qualification,
          experienceYears: Number(formData.experienceYears),
          joiningDate: formData.joiningDate,
          employmentType: formData.employmentType,
          primarySubject: formData.primarySubject,
          skills:
            formData.skills.length > 0
              ? formData.skills
              : ['Higher Education', 'Curriculum Delivery'],
          bio: formData.bio,
          linkedinUrl: formData.linkedinUrl,
          githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl,
          notes: formData.notes,
          loginEmail: formData.loginEmail || formData.email,
          status: formData.status,
        });

        if (created) {
          success(
            'Faculty Member Registered',
            `Added ${created.fullName} (${created.teacherId}) to directory.`
          );

          if (addAnother) {
            setFormData({
              fullName: '',
              avatar: '',
              email: '',
              phone: '',
              dob: '1988-01-01',
              gender: 'male',
              address: '',
              teacherId: `TCH-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
              department: DEPARTMENTS[0],
              designation: DESIGNATIONS[2],
              qualification: '',
              experienceYears: 3,
              joiningDate: new Date().toISOString().split('T')[0],
              employmentType: 'full-time',
              primarySubject:
                SUBJECTS_MAP[DEPARTMENTS[0]]?.[0] || 'Computer Science',
              skills: [],
              skillInput: '',
              loginEmail: '',
              temporaryPassword: 'TempPassword123!',
              status: 'active',
              bio: '',
              linkedinUrl: '',
              githubUrl: '',
              portfolioUrl: '',
              notes: '',
            });

            setErrors({});

            if (profilePhotoInputRef.current) {
              profilePhotoInputRef.current.value = '';
            }
          } else {
            navigate(`/admin/teachers/${created.id}`);
          }
        }
      }
    } catch (err) {
      toastError(
        'Save Error',
        'An error occurred while saving teacher record.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        title={
          isEditing
            ? `Edit Faculty Record: ${formData.fullName}`
            : 'Register New Faculty Member'
        }
        description={
          isEditing
            ? 'Modify personal identity, academic qualifications, and institutional credentials.'
            : 'Enroll a new faculty instructor with department affiliations and login credentials.'
        }
        breadcrumbs={[
          {
            label: 'Teacher Management',
            path: '/admin/teachers',
          },
          {
            label: 'Faculty Registry',
            path: '/admin/teachers/list',
          },
          {
            label: isEditing
              ? 'Edit Faculty'
              : 'New Faculty',
          },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate('/admin/teachers/list')
            }
            leftIcon={
              <ArrowLeft className="w-4 h-4" />
            }
          >
            Back to Registry
          </Button>
        }
      />

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={(e) =>
          handleSubmit(e, false)
        }
        className="space-y-6"
      >

        {/* ====================================================
            SECTION 1: PERSONAL INFORMATION
        ==================================================== */}

        <Card className="p-6">

          <div className="mb-6 flex items-center gap-2 border-b border-[#3A2922] pb-4">

            <div className="rounded-lg bg-[#2A1710] p-2 text-[#F1E5D8]">
              <User className="h-4 w-4" />
            </div>

            <div>

              <h3 className="text-base font-bold text-[#F5F0EA]">
                Personal Identity & Contact
              </h3>

              <p className="text-xs text-[#A89A91]">
                Core demographic information and direct communication lines
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

            {/* FULL NAME */}

            <Input
              label="Full Legal Name"
              placeholder="e.g. Dr. Arthur Pendelton"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })
              }
              error={errors.fullName}
              required
            />

            {/* EMAIL */}

            <Input
              label="Institutional / Contact Email"
              type="email"
              placeholder="e.g. a.pendelton@dudex.academy"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                  loginEmail: formData.loginEmail
                    ? formData.loginEmail
                    : e.target.value,
                })
              }
              error={errors.email}
              leftIcon={
                <Mail className="h-4 w-4 text-[#946246]" />
              }
              required
            />

            {/* PHONE */}

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              leftIcon={
                <Phone className="h-4 w-4 text-[#946246]" />
              }
            />

            {/* DOB */}

            <Input
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dob: e.target.value,
                })
              }
            />

            {/* GENDER */}

            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value as Gender,
                })
              }
              options={[
                {
                  value: 'male',
                  label: 'Male',
                },
                {
                  value: 'female',
                  label: 'Female',
                },
                {
                  value: 'other',
                  label: 'Other',
                },
                {
                  value: 'prefer-not-to-say',
                  label: 'Prefer Not to Say',
                },
              ]}
            />

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}

            <div className="space-y-3">

              <label className="block text-xs font-medium text-[#A89A91]">
                Profile Picture
              </label>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                {/* PROFILE PREVIEW */}

                <div className="relative shrink-0">

                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#5A321F] bg-[#2A1710]">

                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={`${formData.fullName || 'Teacher'} profile`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            'none';
                        }}
                      />
                    ) : (
                      <User className="h-9 w-9 text-[#A89A91]" />
                    )}

                  </div>

                  {/* CAMERA BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      profilePhotoInputRef.current?.click()
                    }
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#18120F] bg-[#7A4930] text-white shadow-md transition hover:bg-[#946246]"
                    title="Edit profile picture"
                    aria-label="Edit profile picture"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>

                </div>

                {/* PHOTO ACTIONS */}

                <div className="flex flex-1 flex-col gap-2">

                  <div className="flex flex-wrap items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        profilePhotoInputRef.current?.click()
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-[#5A321F] bg-[#2A1710] px-3 py-2 text-xs font-semibold text-[#F1E5D8] transition hover:border-[#7A4930] hover:bg-[#3A2116]"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Edit Photo
                    </button>

                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={
                          handleRemoveProfilePhoto
                        }
                        className="rounded-lg px-3 py-2 text-xs font-medium text-[#A89A91] transition hover:bg-[#2A1710] hover:text-rose-400"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <p className="text-[11px] text-[#A89A91]">
                    JPG, PNG or WEBP • Maximum 5 MB
                  </p>

                  {/* HIDDEN FILE INPUT */}

                  <input
                    ref={profilePhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleProfilePhotoChange
                    }
                    className="sr-only"
                  />

                </div>

              </div>

            </div>

            {/* PROFILE PHOTO URL */}

            <Input
              label="Profile Photo URL"
              placeholder="https://images.unsplash.com/..."
              value={
                formData.avatar.startsWith(
                  'data:image/'
                )
                  ? ''
                  : formData.avatar
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  avatar: e.target.value,
                })
              }
              helperText="Optional: paste a direct image URL instead of uploading a photo"
            />

            {/* ADDRESS */}

            <div className="sm:col-span-2">

              <Textarea
                label="Residential Address"
                placeholder="Campus Faculty Quarters or Residential street address..."
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                rows={2}
              />

            </div>

          </div>

        </Card>

        {/* ======================================================
            SECTION 2: PROFESSIONAL & ACADEMIC INFORMATION
        ====================================================== */}

        <Card className="p-6">

          <div className="mb-6 flex items-center gap-2 border-b border-[#3A2922] pb-4">

            <div className="rounded-lg bg-[#2A1710] p-2 text-[#F1E5D8]">
              <GraduationCap className="h-4 w-4" />
            </div>

            <div>

              <h3 className="text-base font-bold text-[#F5F0EA]">
                Academic & Department Affiliation
              </h3>

              <p className="text-xs text-[#A89A91]">
                Faculty designations, experience records, and primary disciplines
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

            {/* FACULTY ID */}

            <Input
              label="Faculty / Teacher ID"
              placeholder="TCH-2026-001"
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  teacherId: e.target.value,
                })
              }
              error={errors.teacherId}
              required
            />

            {/* DEPARTMENT */}

            <Select
              label="Department"
              value={formData.department}
              onChange={(e) =>
                handleDepartmentChange(e.target.value)
              }
              options={DEPARTMENTS.map((d) => ({
                value: d,
                label: d,
              }))}
              error={errors.department}
              required
            />

            {/* DESIGNATION */}

            <Select
              label="Designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  designation: e.target.value,
                })
              }
              options={DESIGNATIONS.map((d) => ({
                value: d,
                label: d,
              }))}
              error={errors.designation}
              required
            />

            {/* QUALIFICATION */}

            <Input
              label="Highest Academic Qualification"
              placeholder="Ph.D. in Computer Science, Stanford"
              value={formData.qualification}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  qualification: e.target.value,
                })
              }
              error={errors.qualification}
              required
            />

            {/* EXPERIENCE */}

            <Input
              label="Total Experience (Years)"
              type="number"
              min="0"
              max="50"
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceYears: Number(
                    e.target.value
                  ),
                })
              }
              error={errors.experienceYears}
              required
            />

            {/* JOINING DATE */}

            <Input
              label="Joining Date"
              type="date"
              value={formData.joiningDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  joiningDate: e.target.value,
                })
              }
              error={errors.joiningDate}
              required
            />

            {/* EMPLOYMENT TYPE */}

            <Select
              label="Employment Type"
              value={formData.employmentType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  employmentType:
                    e.target.value as EmploymentType,
                })
              }
              options={[
                {
                  value: 'full-time',
                  label: 'Full Time Faculty',
                },
                {
                  value: 'part-time',
                  label: 'Part Time Instructor',
                },
                {
                  value: 'contract',
                  label: 'Contract Researcher',
                },
                {
                  value: 'visiting',
                  label: 'Visiting Guest Faculty',
                },
              ]}
            />

            {/* PRIMARY SUBJECT */}

            <Input
              label="Primary Instructional Subject"
              placeholder="e.g. Distributed Systems"
              value={formData.primarySubject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primarySubject: e.target.value,
                })
              }
              error={errors.primarySubject}
              required
            />

            {/* =================================================
                SKILLS TAG MANAGER
            ================================================= */}

            <div className="sm:col-span-2 space-y-2">

              <label className="text-xs font-medium text-[#A89A91]">
                Specialized Skills & Competencies
              </label>

              <div className="flex gap-2">

                <input
                  type="text"
                  placeholder="Add skill (e.g. PyTorch, Rust, Kubernetes) and press Add..."
                  value={formData.skillInput}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skillInput: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 rounded-lg border border-[#3A2922] bg-[#111111] px-3.5 py-2 text-sm text-[#F5F0EA] placeholder-[#A89A91]/50 focus:border-[#7A4930] focus:outline-none"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>

              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">

                {formData.skills.map((skill) => (

                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#5A321F]/50 bg-[#2A1710] px-3 py-1 text-xs text-[#F1E5D8]"
                  >

                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSkill(skill)
                      }
                      className="cursor-pointer text-[#A89A91] hover:text-rose-400"
                    >
                      <X className="h-3 w-3" />
                    </button>

                  </span>

                ))}

              </div>

            </div>

          </div>

        </Card>

        {/* ======================================================
            SECTION 3: SYSTEM ACCOUNT & STATUS
        ====================================================== */}

        <Card className="p-6">

          <div className="mb-6 flex items-center gap-2 border-b border-[#3A2922] pb-4">

            <div className="rounded-lg bg-[#2A1710] p-2 text-[#F1E5D8]">
              <Lock className="h-4 w-4" />
            </div>

            <div>

              <h3 className="text-base font-bold text-[#F5F0EA]">
                Account Access & Status
              </h3>

              <p className="text-xs text-[#A89A91]">
                Portal login configuration and active authorization state
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">

            {/* LOGIN EMAIL */}

            <Input
              label="Teacher Login Email"
              type="email"
              placeholder="login@dudex.academy"
              value={
                formData.loginEmail ||
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  loginEmail: e.target.value,
                })
              }
            />

            {/* PASSWORD */}

            <Input
              label={
                isEditing
                  ? 'Change Password (Optional)'
                  : 'Initial Temporary Password'
              }
              type="password"
              placeholder="••••••••••••"
              value={formData.temporaryPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  temporaryPassword:
                    e.target.value,
                })
              }
            />

            {/* STATUS */}

            <Select
              label="Account Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status:
                    e.target.value as TeacherStatus,
                })
              }
              options={[
                {
                  value: 'active',
                  label: 'Active / Authorized',
                },
                {
                  value: 'inactive',
                  label: 'Inactive',
                },
                {
                  value: 'suspended',
                  label: 'Suspended',
                },
              ]}
            />

          </div>

        </Card>

        {/* ======================================================
            SECTION 4: BIO, PROFESSIONAL LINKS & NOTES
        ====================================================== */}

        <Card className="p-6">

          <div className="mb-6 flex items-center gap-2 border-b border-[#3A2922] pb-4">

            <div className="rounded-lg bg-[#2A1710] p-2 text-[#F1E5D8]">
              <FileText className="h-4 w-4" />
            </div>

            <div>

              <h3 className="text-base font-bold text-[#F5F0EA]">
                Biography, Portfolio & Notes
              </h3>

              <p className="text-xs text-[#A89A91]">
                Public faculty bio, research links, and administrative notes
              </p>

            </div>

          </div>

          <div className="space-y-4">

            {/* BIO */}

            <Textarea
              label="Academic Biography & Research Summary"
              placeholder="Brief summary of publications, research interests, and teaching background..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value,
                })
              }
              rows={3}
            />

            {/* PROFESSIONAL LINKS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* LINKEDIN */}

              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    linkedinUrl: e.target.value,
                  })
                }
                leftIcon={
                  <LinkIcon className="h-3.5 w-3.5 text-[#946246]" />
                }
              />

              {/* GITHUB */}

              <Input
                label="GitHub Profile URL"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    githubUrl: e.target.value,
                  })
                }
                leftIcon={
                  <LinkIcon className="h-3.5 w-3.5 text-[#946246]" />
                }
              />

              {/* PORTFOLIO */}

              <Input
                label="Portfolio / Google Scholar"
                placeholder="https://scholar.google.com/..."
                value={formData.portfolioUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    portfolioUrl: e.target.value,
                  })
                }
                leftIcon={
                  <LinkIcon className="h-3.5 w-3.5 text-[#946246]" />
                }
              />

            </div>

            {/* NOTES */}

            <Textarea
              label="Internal Administrative Notes"
              placeholder="Confidential notes visible to academy administration only..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
              rows={2}
            />

          </div>

        </Card>

        {/* ======================================================
            ACTION BUTTONS
        ====================================================== */}

        <div className="flex items-center justify-end gap-3 border-t border-[#3A2922] pt-4">

          {/* CANCEL */}

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() =>
              navigate('/admin/teachers/list')
            }
            disabled={isLoading}
          >
            Cancel
          </Button>

          {/* SAVE & REGISTER ANOTHER */}

          {!isEditing && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={(e) =>
                handleSubmit(e, true)
              }
              isLoading={isLoading}
            >
              Save & Register Another
            </Button>
          )}

          {/* SAVE / UPDATE */}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={
              <Save className="h-4 w-4" />
            }
          >
            {isEditing
              ? 'Update Faculty Member'
              : 'Save Faculty Member'}
          </Button>

        </div>

      </form>

    </div>
  );
};