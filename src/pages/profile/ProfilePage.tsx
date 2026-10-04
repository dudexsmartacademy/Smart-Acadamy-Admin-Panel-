import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  Clock,
  Save,
  Key,
  ShieldCheck,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Avatar } from '../../components/common/Avatar';
import { Toggle } from '../../components/common/Toggle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { admin, updateAdmin } = useAuth();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    name: admin?.name || '',
    phone: admin?.phone || '',
    department: admin?.department || '',
    avatar: admin?.avatar || '',
    twoFactorEnabled: admin?.twoFactorEnabled || false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    updateAdmin({
      name: formData.name,
      phone: formData.phone,
      department: formData.department,
      avatar: formData.avatar,
      twoFactorEnabled: formData.twoFactorEnabled,
    });

    setTimeout(() => {
      setIsSaving(false);
      success('Admin Profile Updated', 'Your profile details have been saved.');
    }, 300);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Administrator Profile & Security"
        description="Manage your institutional administration profile, contact lines, and two-factor authentication."
        breadcrumbs={[{ label: 'Admin Profile' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Profile Overview Card */}
        <div className="md:col-span-5">
          <Card className="p-6 text-center space-y-4 bg-gradient-to-b from-[#1A1412] to-[#171311]">
            <div className="flex justify-center">
              <Avatar
                src={formData.avatar}
                name={formData.name || 'Admin'}
                size="xl"
                className="border-2 border-[#5A321F]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#F5F0EA]">{formData.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#5A321F] text-[#F1E5D8] inline-block mt-1">
                {admin?.role || 'Super Admin'}
              </span>
            </div>

            <div className="pt-4 border-t border-[#3A2922] text-left text-xs space-y-2 text-[#A89A91]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#946246]" /> Email:
                </span>
                <span className="text-[#F5F0EA] font-mono">{admin?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#946246]" /> Dept:
                </span>
                <span className="text-[#F5F0EA]">{admin?.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#946246]" /> Status:
                </span>
                <span className="text-emerald-400 font-bold">Active Account</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#946246]" /> Joined:
                </span>
                <span className="text-[#F5F0EA]">{admin?.joinedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#946246]" /> Last Login:
                </span>
                <span className="text-[#F5F0EA]">
                  {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleTimeString() : 'Active Now'}
                </span>
              </div>
            </div>

            {/* Permissions Summary */}
            <div className="pt-4 border-t border-[#3A2922] text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Assigned Authority Matrix
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Full Faculty Management',
                  'Full Student Dossiers',
                  'Curriculum & Batches',
                  'Exams & Grading Engine',
                  'Fee Plans & Receipts',
                  'Portal Governance',
                  'Audit Logs & Security',
                ].map((perm) => (
                  <span
                    key={perm}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#2A1710] text-[#D4AF37] border border-[#5A321F]"
                  >
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Editable Fields */}
        <div className="md:col-span-7">
          <Card className="p-6">
            <h3 className="text-base font-bold text-[#F5F0EA] mb-4">Edit Profile Information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Administrator Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Registered Email (Fixed by Policy)"
                value={admin?.email || ''}
                disabled
                helperText="Primary administrator email is locked by institutional security policy"
              />

              <Input
                label="Direct Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Department Directorate"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <Input
                label="Avatar Image URL"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                helperText="Paste direct image link to update portrait"
              />

              <div className="pt-3 border-t border-[#3A2922]">
                <Toggle
                  label="Two-Factor Authentication (2FA)"
                  description="Require hardware token or OTP code upon admin sign-in"
                  checked={formData.twoFactorEnabled}
                  onChange={(val) => setFormData({ ...formData, twoFactorEnabled: val })}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-[#3A2922]">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
