import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Edit2,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  ShieldCheck,
  BriefcaseBusiness,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';

import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';

export const TeacherProfileDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams<{ teacherId: string }>();

  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!teacherId) return;
      const foundTeacher = await teacherService.getTeacherById(teacherId);
      if (foundTeacher) {
        setTeacher(foundTeacher);
      }
    };
    load();
  }, [teacherId]);

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!teacher || !event.target.files?.[0]) return;

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      const avatar = reader.result as string;

      const updatedTeacher = await teacherService.updateTeacher(teacher.id, {
        avatar,
      });

      if (updatedTeacher) {
        setTeacher(updatedTeacher);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!teacher) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-[#A89A91]">
          Teacher profile not found.
        </p>

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/teachers/profile')}
          >
            Back to Teacher Profiles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <PageHeader
        title="Teacher Profile"
        description="View and manage your faculty profile details, photo, and contact information."
        breadcrumbs={[
          {
            label: 'Teacher Management',
            path: '/admin/teachers',
          },
          {
            label: 'Teacher Profiles',
            path: '/admin/teachers/profile',
          },
          {
            label: teacher.fullName,
          },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Edit2 className="w-4 h-4" />}
            onClick={() =>
              navigate(`/admin/teachers/${teacher.id}/edit`)
            }
          >
            Edit Profile
          </Button>
        }
      />

      {/* Main Profile Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT PROFILE CARD */}
        <Card className="lg:col-span-4 p-6">

          <div className="flex flex-col items-center text-center">

            {/* Profile Image */}
            <div className="relative">

              <Avatar
                src={teacher.avatar}
                name={teacher.fullName}
                size="xl"
                className="!w-24 !h-24 !text-2xl"
              />

              {/* Camera Button */}
              <label
                htmlFor="teacher-profile-photo"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#171311] border border-[#3A2922] flex items-center justify-center cursor-pointer hover:bg-[#2A1710] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#F5F0EA]" />

                <input
                  id="teacher-profile-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>

            {/* Name */}
            <h2 className="mt-5 text-xl font-bold text-[#F5F0EA]">
              {teacher.fullName}
            </h2>

            {/* Designation */}
            <p className="mt-1 text-sm text-[#A89A91]">
              {teacher.designation}
            </p>

            {/* Status */}
            <div className="mt-3">
              <StatusBadge
                status={teacher.status}
                size="sm"
              />
            </div>
          </div>

          {/* Left Information */}
          <div className="mt-6 pt-5 border-t border-[#3A2922] space-y-4">

            {/* Faculty ID */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2A1710] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-[#946246]" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                  Faculty ID
                </p>

                <p className="text-sm font-semibold text-[#F5F0EA]">
                  {teacher.teacherId}
                </p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2A1710] flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 text-[#946246]" />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                  Department
                </p>

                <p className="text-sm font-semibold text-[#F5F0EA]">
                  {teacher.department}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* RIGHT PERSONAL INFORMATION */}
        <Card className="lg:col-span-8 p-6">

          {/* Section Header */}
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#3A2922]">

            <div>
              <h2 className="text-lg font-bold text-[#F5F0EA]">
                Personal Information
              </h2>

              <p className="text-xs text-[#A89A91] mt-1">
                Official teacher details and verified contact information
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/admin/teachers/${teacher.id}/edit`)
              }
              className="flex items-center gap-1.5 text-xs font-semibold text-[#946246] hover:text-[#F1E5D8] transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit Details
            </button>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 pt-6">

            {/* Full Name */}
            <ProfileField
              icon={<User className="w-4 h-4" />}
              label="Full Name"
              value={teacher.fullName}
            />

            {/* Faculty ID */}
            <ProfileField
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Faculty ID"
              value={teacher.teacherId}
            />

            {/* Email */}
            <ProfileField
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              value={teacher.email}
            />

            {/* Phone */}
            <ProfileField
              icon={<Phone className="w-4 h-4" />}
              label="Phone Number"
              value={teacher.phone}
            />

            {/* Department */}
            <ProfileField
              icon={<Building2 className="w-4 h-4" />}
              label="Department"
              value={teacher.department}
            />

            {/* Designation */}
            <ProfileField
              icon={<BriefcaseBusiness className="w-4 h-4" />}
              label="Designation"
              value={teacher.designation}
            />

            {/* Qualification */}
            <div className="md:col-span-2">
              <ProfileField
                icon={<GraduationCap className="w-4 h-4" />}
                label="Qualification & Degree"
                value={teacher.qualification}
              />
            </div>

          </div>
        </Card>
      </div>

      {/* Bottom Back Button */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/admin/teachers/profile')}
        >
          Back to Teacher Profiles
        </Button>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/* Reusable profile field                                                     */
/* -------------------------------------------------------------------------- */

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">

      <div className="w-9 h-9 rounded-lg bg-[#2A1710] flex items-center justify-center shrink-0">
        <span className="text-[#946246]">
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
          {label}
        </p>

        <p className="text-sm font-semibold text-[#F5F0EA] mt-0.5 break-words">
          {value || 'Not provided'}
        </p>
      </div>

    </div>
  );
};