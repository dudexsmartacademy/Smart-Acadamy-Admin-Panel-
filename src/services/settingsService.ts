import { supabase } from '../lib/supabase';
import { SystemSettings, AdminProfile } from '../types';

export const settingsService = {
  async getSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .single();

    if (error || !data) {
      // Return sensible defaults if row doesn't exist yet
      return {
        platformName: 'DUDEx Smart Academy',
        supportEmail: 'support@dudex.academy',
        contactPhone: '',
        address: '',
        timezone: 'Asia/Kolkata',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '12h',
        theme: 'dark',
        sidebarDefaultCollapsed: false,
        academicYear: '2026-2027',
        currentSemester: 'Odd Semester',
        defaultCourseDuration: '4 Years',
        defaultClassDuration: 60,
        gradingSystem: 'GPA 10.0 / Percentage Scale',
        attendanceMinThreshold: 75,
        lateThresholdMins: 15,
        correctionWindowDays: 7,
        defaultAttendanceStatus: 'Present',
        attendanceAlertThresholdDays: 3,
        autoApproveLeaveDays: 1,
        defaultExamDurationMins: 90,
        defaultPassingMarkPct: 40,
        emailNotifications: true,
        smsNotifications: false,
        teacherNotificationsEnabled: true,
        studentNotificationsEnabled: true,
        attendanceAlertsEnabled: true,
        assessmentAlertsEnabled: true,
        resultAlertsEnabled: true,
        systemAlertsEnabled: true,
      };
    }

    return {
      platformName: data.platform_name,
      supportEmail: data.support_email,
      contactPhone: data.contact_phone || '',
      address: data.address || '',
      timezone: data.timezone || 'Asia/Kolkata',
      dateFormat: data.date_format || 'YYYY-MM-DD',
      timeFormat: data.time_format || '12h',
      theme: data.theme || 'dark',
      sidebarDefaultCollapsed: data.sidebar_default_collapsed || false,
      academicYear: data.academic_year || '2026-2027',
      currentSemester: data.current_semester || 'Odd Semester',
      defaultCourseDuration: data.default_course_duration || '4 Years',
      defaultClassDuration: data.default_class_duration || 60,
      gradingSystem: data.grading_system || 'GPA 10.0',
      attendanceMinThreshold: data.attendance_min_threshold || 75,
      lateThresholdMins: data.late_threshold_mins || 15,
      correctionWindowDays: data.correction_window_days || 7,
      defaultAttendanceStatus: data.default_attendance_status || 'Present',
      attendanceAlertThresholdDays: data.attendance_alert_threshold_days || 3,
      autoApproveLeaveDays: data.auto_approve_leave_days || 1,
      defaultExamDurationMins: data.default_exam_duration_mins || 90,
      defaultPassingMarkPct: data.default_passing_mark_pct || 40,
      emailNotifications: data.email_notifications ?? true,
      smsNotifications: data.sms_notifications ?? false,
      teacherNotificationsEnabled: data.teacher_notifications_enabled ?? true,
      studentNotificationsEnabled: data.student_notifications_enabled ?? true,
      attendanceAlertsEnabled: data.attendance_alerts_enabled ?? true,
      assessmentAlertsEnabled: data.assessment_alerts_enabled ?? true,
      resultAlertsEnabled: data.result_alerts_enabled ?? true,
      systemAlertsEnabled: data.system_alerts_enabled ?? true,
    };
  },

  async updateSettings(partial: Partial<SystemSettings>): Promise<SystemSettings> {
    const updates: Record<string, unknown> = {};
    if (partial.platformName !== undefined) updates.platform_name = partial.platformName;
    if (partial.supportEmail !== undefined) updates.support_email = partial.supportEmail;
    if (partial.contactPhone !== undefined) updates.contact_phone = partial.contactPhone;
    if (partial.address !== undefined) updates.address = partial.address;
    if (partial.timezone !== undefined) updates.timezone = partial.timezone;
    if (partial.academicYear !== undefined) updates.academic_year = partial.academicYear;
    if (partial.currentSemester !== undefined) updates.current_semester = partial.currentSemester;
    if (partial.attendanceMinThreshold !== undefined) updates.attendance_min_threshold = partial.attendanceMinThreshold;
    if (partial.defaultPassingMarkPct !== undefined) updates.default_passing_mark_pct = partial.defaultPassingMarkPct;
    if (partial.emailNotifications !== undefined) updates.email_notifications = partial.emailNotifications;
    if (partial.smsNotifications !== undefined) updates.sms_notifications = partial.smsNotifications;
    if (partial.theme !== undefined) updates.theme = partial.theme;

    updates.updated_at = new Date().toISOString();

    await supabase.from('platform_settings').upsert({ id: 1, ...updates });

    await supabase.from('activity_logs').insert({
      action: 'System Settings Updated',
      module: 'settings',
      entity: 'Platform Configuration',
      description: 'Updated academy platform configuration',
      admin_name: 'Admin',
    });

    return this.getSettings();
  },

  async getAdminProfile(userId?: string): Promise<AdminProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    const id = userId || user?.id;
    if (!id) return {} as AdminProfile;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return {} as AdminProfile;

    return {
      id: data.id,
      name: data.full_name || 'Admin',
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'Super Admin',
      avatar: data.avatar_url || '',
      department: data.department || 'Administration',
      joinedDate: data.created_at?.split('T')[0] || '',
      lastLogin: data.last_login || new Date().toISOString(),
      twoFactorEnabled: data.two_factor_enabled || false,
    };
  },

  async updateAdminProfile(partial: Partial<AdminProfile>): Promise<AdminProfile> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {} as AdminProfile;

    const updates: Record<string, unknown> = {};
    if (partial.name) updates.full_name = partial.name;
    if (partial.phone) updates.phone = partial.phone;
    if (partial.avatar) updates.avatar_url = partial.avatar;
    if (partial.department) updates.department = partial.department;

    await supabase.from('profiles').update(updates).eq('id', user.id);

    return this.getAdminProfile(user.id);
  },
};
