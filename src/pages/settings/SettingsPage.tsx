import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Sliders,
  Palette,
  Bell,
  Shield,
  GraduationCap,
  Save,
  CheckCircle2,
  CalendarCheck,
  Award,
  Lock,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Toggle } from '../../components/common/Toggle';
import { Tabs } from '../../components/common/Tabs';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { settingsService } from '../../services/settingsService';
import { SystemSettings } from '../../types';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { success } = useToast();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({
    platformName: 'DUDEx Smart Academy',
    supportEmail: 'support@dudex.academy',
    contactPhone: '',
    timezone: 'Asia/Kolkata (IST)',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12h',
    theme: 'dark',
    sidebarDefaultCollapsed: false,
    academicYear: '2026-2027',
    currentSemester: 'Odd Semester',
    gradingSystem: 'GPA 10.0 / Percentage Scale',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from Supabase
  useEffect(() => {
    settingsService.getSettings().then(setSettings);
  }, []);

  // Security mock form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await settingsService.updateSettings(settings);
    if (settings.theme !== theme) {
      setTheme(settings.theme);
    }

    setIsSaving(false);
    success('System Settings Saved', 'Global academy parameters updated successfully.');
  };

  const tabsList = [
    { id: 'general', label: 'General', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'academic', label: 'Academic', icon: <Sliders className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'assessment', label: 'Assessment', icon: <Award className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security UI', icon: <Shield className="w-4 h-4" /> },
    { id: 'portal', label: 'Portal Management', icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Institutional System Settings"
        description="Configure institutional branding, academic terms, grading rules, attendance thresholds, and portal policies."
        breadcrumbs={[{ label: 'System Settings' }]}
      />

      <Tabs tabs={tabsList} activeTab={activeTab} onChange={setActiveTab} />

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Academy Platform Identity & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Platform Name"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                required
              />
              <Input
                label="Official Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                required
              />
              <Input
                label="Contact Phone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
              <Input
                label="Campus Address"
                value={settings.address || '428 Silicon Boulevard, Tech District, Suite 500'}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
              <Select
                label="System Timezone"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                options={[
                  { value: 'America/New_York (EST)', label: 'Eastern Standard Time (EST / New York)' },
                  { value: 'America/Los_Angeles (PST)', label: 'Pacific Standard Time (PST / San Francisco)' },
                  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                  { value: 'Europe/London (GMT)', label: 'Greenwich Mean Time (GMT / London)' },
                  { value: 'Asia/Kolkata (IST)', label: 'India Standard Time (IST)' },
                ]}
              />
              <Select
                label="Date Format"
                value={settings.dateFormat || 'YYYY-MM-DD'}
                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                options={[
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-09-29)' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 29/09/2026)' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 09/29/2026)' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* TAB 2: APPEARANCE */}
        {activeTab === 'appearance' && (
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Visual Identity & UI Themes
            </h3>

            <div className="space-y-4">
              <Select
                label="Color Theme Mode"
                value={settings.theme}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: e.target.value as 'dark' | 'light' | 'system',
                  })
                }
                options={[
                  { value: 'dark', label: 'Onyx Black & Deep Gold (Dark Mode — Default)' },
                  { value: 'light', label: 'Cream Sand & Earth Brown (Light Mode)' },
                  { value: 'system', label: 'System Match Mode' },
                ]}
              />

              <div className="pt-2">
                <Toggle
                  label="Default Collapsed Sidebar on Desktop"
                  description="Keep sidebar minimized by default for expansive data density"
                  checked={settings.sidebarDefaultCollapsed}
                  onChange={(val) => setSettings({ ...settings, sidebarDefaultCollapsed: val })}
                />
              </div>
            </div>
          </Card>
        )}

        {/* TAB 3: ACADEMIC */}
        {activeTab === 'academic' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Academic Terms & Policies
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Academic Year"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              />
              <Input
                label="Active Semester"
                value={settings.currentSemester}
                onChange={(e) => setSettings({ ...settings, currentSemester: e.target.value })}
              />
              <Input
                label="Default Course Duration (Months)"
                type="number"
                min="1"
                value={settings.defaultCourseDurationMonths || 6}
                onChange={(e) =>
                  setSettings({ ...settings, defaultCourseDurationMonths: Number(e.target.value) })
                }
              />
              <Input
                label="Default Class Duration (Minutes)"
                type="number"
                min="30"
                value={settings.defaultClassDurationMinutes || 90}
                onChange={(e) =>
                  setSettings({ ...settings, defaultClassDurationMinutes: Number(e.target.value) })
                }
              />
              <Select
                label="Grading System"
                value={settings.gradingSystem || 'Letter Grade (A+ to F)'}
                onChange={(e) => setSettings({ ...settings, gradingSystem: e.target.value })}
                options={[
                  { value: 'Letter Grade (A+ to F)', label: 'Letter Grade (A+, A, B, C, F)' },
                  { value: 'GPA 4.0 Scale', label: 'Standard GPA 4.0 Scale' },
                  { value: 'Percentage (0-100%)', label: 'Direct Percentage Score' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* TAB 4: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Attendance Rules & Correction Policy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum Attendance Threshold (%)"
                type="number"
                min="50"
                max="100"
                value={settings.minAttendanceThreshold || 75}
                onChange={(e) =>
                  setSettings({ ...settings, minAttendanceThreshold: Number(e.target.value) })
                }
              />
              <Input
                label="Late Mark Threshold (Minutes)"
                type="number"
                min="5"
                max="60"
                value={settings.lateThresholdMinutes || 15}
                onChange={(e) =>
                  setSettings({ ...settings, lateThresholdMinutes: Number(e.target.value) })
                }
              />
              <Input
                label="Student Correction Request Window (Days)"
                type="number"
                min="1"
                max="30"
                value={settings.correctionWindowDays || 7}
                onChange={(e) =>
                  setSettings({ ...settings, correctionWindowDays: Number(e.target.value) })
                }
              />
              <Select
                label="Default Scanned Attendance Status"
                value={settings.defaultAttendanceStatus || 'present'}
                onChange={(e) => setSettings({ ...settings, defaultAttendanceStatus: e.target.value })}
                options={[
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'late', label: 'Late' },
                ]}
              />
            </div>
          </Card>
        )}

        {/* TAB 5: ASSESSMENT */}
        {activeTab === 'assessment' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Assessment & Examination Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Exam Duration (Minutes)"
                type="number"
                min="30"
                value={settings.defaultExamDurationMinutes || 180}
                onChange={(e) =>
                  setSettings({ ...settings, defaultExamDurationMinutes: Number(e.target.value) })
                }
              />
              <Input
                label="Default Passing Score (%)"
                type="number"
                min="30"
                max="100"
                value={settings.defaultPassingMarks || 50}
                onChange={(e) =>
                  setSettings({ ...settings, defaultPassingMarks: Number(e.target.value) })
                }
              />
            </div>
          </Card>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Alerts & System Push Notifications
            </h3>

            <div className="space-y-4">
              <Toggle
                label="Enable Teacher Notifications"
                description="Allow push broadcasts and schedule reminders to faculty members"
                checked={settings.enableTeacherNotifications ?? true}
                onChange={(val) => setSettings({ ...settings, enableTeacherNotifications: val })}
              />
              <Toggle
                label="Enable Student Notifications"
                description="Allow announcements and exam reminders to student mobile/web apps"
                checked={settings.enableStudentNotifications ?? true}
                onChange={(val) => setSettings({ ...settings, enableStudentNotifications: val })}
              />
              <Toggle
                label="Automated Attendance Alerts"
                description="Notify when a student drops below the safe threshold (&lt; 75%)"
                checked={settings.enableAttendanceAlerts ?? true}
                onChange={(val) => setSettings({ ...settings, enableAttendanceAlerts: val })}
              />
              <Toggle
                label="Assessment & Exam Alerts"
                description="Trigger reminders 24 hours prior to scheduled examinations"
                checked={settings.enableAssessmentAlerts ?? true}
                onChange={(val) => setSettings({ ...settings, enableAssessmentAlerts: val })}
              />
              <Toggle
                label="Exam Result Publication Alerts"
                description="Notify students immediately upon official grade publication"
                checked={settings.enableResultAlerts ?? true}
                onChange={(val) => setSettings({ ...settings, enableResultAlerts: val })}
              />
            </div>
          </Card>
        )}

        {/* TAB 7: SECURITY UI */}
        {activeTab === 'security' && (
          <Card className="p-6 space-y-6">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Administrative Password & Session Guardrails
            </h3>

            <div className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!currentPassword || !newPassword) {
                    return;
                  }
                  success('Password Updated', 'Mock administrator credentials updated.');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Change Admin Password
              </Button>
            </div>

            <div className="pt-4 border-t border-[#3A2922] space-y-3">
              <h4 className="text-sm font-bold text-white">Active Operator Sessions</h4>
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Chrome on Windows 11 (Current Session)</p>
                  <p className="text-neutral-500">IP: 192.168.1.104 • Signed in 2 hours ago</p>
                </div>
                <span className="text-emerald-400 font-bold">Active Now</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => success('Sessions Invalidated', 'All remote operator sessions logged out.')}
              >
                Logout All Other Sessions
              </Button>
            </div>
          </Card>
        )}

        {/* TAB 8: PORTAL MANAGEMENT */}
        {activeTab === 'portal' && (
          <Card className="p-6 space-y-5">
            <h3 className="text-base font-bold text-[#F5F0EA] pb-3 border-b border-[#3A2922]">
              Portal Governance Quick Controls
            </h3>

            <p className="text-xs text-neutral-400">
              Configure default visibility for Teacher and Student portals or jump directly into granular feature governance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Teacher Portal Controls</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage lecture note publishing, grading access, and biometric overrides.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate('/admin/portal-management/teacher')}
                >
                  Configure Teacher Portal
                </Button>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-950 border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Student Portal Controls</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage student courseware downloads, assessment submissions, and fee invoices.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigate('/admin/portal-management/student')}
                >
                  Configure Student Portal
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-[#3A2922]">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
