import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types';

export const TeacherProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    teacherService.getTeachers().then((allTeachers) => {
      setTeachers(allTeachers.slice(0, 3));
    });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Teacher Profiles"
        description="Select a faculty member to view and manage their profile details."
        breadcrumbs={[
          { label: 'Teacher Management', path: '/admin/teachers' },
          { label: 'Teacher Profiles' },
        ]}
      />

      {teachers.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[#A89A91]">
            No teacher profiles are available.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {teachers.map((teacher) => (
            <Card
              key={teacher.id}
              onClick={() =>
                navigate(`/admin/teachers/profile/${teacher.id}`)
              }
              hoverable
              className="group p-6"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-4">
                <Avatar
                  src={teacher.avatar}
                  name={teacher.fullName}
                  size="xl"
                />

                <ChevronRight
                  className="w-5 h-5 text-[#A89A91] group-hover:text-[#946246] transition-colors"
                />
              </div>

              {/* Teacher Name */}
              <div className="mt-5">
                <h2 className="text-lg font-bold text-[#F5F0EA]">
                  {teacher.fullName}
                </h2>

                <p className="text-sm text-[#A89A91] mt-1">
                  {teacher.designation}
                </p>
              </div>

              {/* Status */}
              <div className="mt-3">
                <StatusBadge status={teacher.status} size="sm" />
              </div>

              {/* Information */}
              <div className="mt-5 pt-5 border-t border-[#3A2922] space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#946246] shrink-0" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                      Faculty ID
                    </p>

                    <p className="text-xs font-semibold text-[#F5F0EA]">
                      {teacher.teacherId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-[#946246] shrink-0" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                      Department
                    </p>

                    <p className="text-xs font-semibold text-[#F5F0EA]">
                      {teacher.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#946246] shrink-0" />

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                      Email
                    </p>

                    <p className="text-xs text-[#F5F0EA] truncate">
                      {teacher.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#946246] shrink-0" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#A89A91]">
                      Phone
                    </p>

                    <p className="text-xs text-[#F5F0EA]">
                      {teacher.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Profile */}
              <div className="mt-5 pt-4 border-t border-[#3A2922]">
                <span className="text-xs font-semibold text-[#946246] group-hover:text-[#F1E5D8] transition-colors">
                  View Profile →
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};