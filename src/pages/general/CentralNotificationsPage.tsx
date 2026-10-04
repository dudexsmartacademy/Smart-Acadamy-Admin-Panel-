import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  Send,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  Clock,
  Copy,
  Trash2,
  Eye,
  CheckCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CentralNotification } from '../../types';
import { centralNotificationService } from '../../services/centralNotificationService';
import { academicCourseService } from '../../services/academicCourseService';
import { academicBatchService } from '../../services/academicBatchService';
import { teacherService } from '../../services/teacherService';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';

export const CentralNotificationsPage: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<CentralNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Composer / Modal state
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<CentralNotification | null>(null);

  // Entities for dynamic selector dropdowns
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

  // Composer Form
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as CentralNotification['type'],
    priority: 'Normal' as CentralNotification['priority'],
    audience: 'All Users' as CentralNotification['audience'],
    courseId: '',
    courseName: '',
    batchId: '',
    batchName: '',
    section: '',
    specificTeacherId: '',
    specificStudentId: '',
    scheduledFor: '',
    expiryDate: '',
    actionUrl: '',
    status: 'Sent' as 'Sent' | 'Scheduled' | 'Draft',
  });

  useEffect(() => {
    loadData();
    const c = academicCourseService.getCourses();
    setCourses(c.map((x) => ({ id: x.id, name: x.name })));
    const b = academicBatchService.getBatches();
    setBatches(b.map((x) => ({ id: x.id, name: x.name })));
    const t = teacherService.getTeachers();
    setTeachers(t.map((x) => ({ id: x.id, name: x.name })));
    const s = studentService.getStudents();
    setStudents(s.map((x) => ({ id: x.id, name: x.fullName })));
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(centralNotificationService.getCentralNotifications());
      setLoading(false);
    }, 150);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudience = audienceFilter === 'all' || n.audience === audienceFilter;
      const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
      return matchesSearch && matchesAudience && matchesStatus;
    });
  }, [notifications, searchQuery, audienceFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = notifications.length;
    const totalRecipients = notifications.reduce((sum, n) => sum + n.recipientsCount, 0);
    const unread = notifications.reduce((sum, n) => sum + n.unreadCount, 0);
    return { total, totalRecipients, unread };
  }, [notifications]);

  const calculatedRecipients = useMemo(() => {
    if (formData.audience === 'All Users' || formData.audience === 'Common Both Student + Teacher') {
      return 286;
    }
    if (formData.audience === 'Teachers Only') return 6;
    if (formData.audience === 'Students Only') return 280;
    if (formData.audience === 'Specific Batch') return 72;
    if (formData.audience === 'Specific Course') return 98;
    if (formData.audience === 'Specific Teacher' || formData.audience === 'Specific Student') return 1;
    return 286;
  }, [formData.audience]);

  const handleOpenComposer = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'Normal',
      audience: 'All Users',
      courseId: '',
      courseName: '',
      batchId: '',
      batchName: '',
      section: '',
      specificTeacherId: '',
      specificStudentId: '',
      scheduledFor: '',
      expiryDate: '',
      actionUrl: '',
      status: 'Sent',
    });
    setIsComposerOpen(true);
  };

  const handleOpenPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      showToast('Please provide a title and message', 'error');
      return;
    }
    setPreviewModalOpen(true);
  };

  const handleSendNotification = (actionStatus: 'Sent' | 'Scheduled' | 'Draft') => {
    let finalCourseName = formData.courseName;
    if (formData.courseId && !finalCourseName) {
      const found = courses.find((c) => c.id === formData.courseId);
      if (found) finalCourseName = found.name;
    }

    let finalBatchName = formData.batchName;
    if (formData.batchId && !finalBatchName) {
      const found = batches.find((b) => b.id === formData.batchId);
      if (found) finalBatchName = found.name;
    }

    centralNotificationService.sendCentralNotification({
      title: formData.title,
      message: formData.message,
      type: formData.type,
      priority: formData.priority,
      audience: formData.audience,
      courseId: formData.courseId || undefined,
      courseName: finalCourseName || undefined,
      batchId: formData.batchId || undefined,
      batchName: finalBatchName || undefined,
      section: formData.section || undefined,
      scheduledFor: formData.scheduledFor || undefined,
      expiryDate: formData.expiryDate || undefined,
      actionUrl: formData.actionUrl || undefined,
      status: actionStatus,
      recipientsCount: calculatedRecipients,
    });

    setPreviewModalOpen(false);
    setIsComposerOpen(false);
    loadData();
    showToast(
      actionStatus === 'Scheduled'
        ? 'Notification scheduled for transmission'
        : actionStatus === 'Draft'
        ? 'Notification saved to drafts'
        : `Dispatched notification to ${calculatedRecipients} recipients`,
      'success'
    );
  };

  const handleToggleRead = (notif: CentralNotification) => {
    if (notif.read) {
      centralNotificationService.markNotificationAsUnread(notif.id);
      showToast('Marked as unread', 'info');
    } else {
      centralNotificationService.markNotificationAsRead(notif.id);
      showToast('Marked as read', 'success');
    }
    loadData();
  };

  const handleMarkAllRead = () => {
    centralNotificationService.markAllNotificationsAsRead();
    loadData();
    showToast('All notifications marked as read', 'success');
  };

  const handleDuplicate = (id: string) => {
    centralNotificationService.duplicateCentralNotification(id);
    loadData();
    showToast('Notification duplicated to draft', 'info');
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete notification "${title}"?`)) {
      centralNotificationService.deleteCentralNotification(id);
      loadData();
      showToast('Notification deleted', 'info');
      if (selectedNotif?.id === id) setSelectedNotif(null);
    }
  };

  const getTypeIcon = (type: CentralNotification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Central Notification Management
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Targeted push broadcast engine for faculty, student cohorts, and individual users.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold hover:bg-neutral-800 transition-all"
          >
            <CheckCheck className="w-4 h-4 text-dudex-gold" />
            Mark All Read
          </button>
          <button
            onClick={handleOpenComposer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Compose Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Broadcasts</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">{stats.total}</h3>
          <p className="text-xs text-neutral-500 mt-1">Dispatched to portals</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl">
          <p className="text-xs font-medium text-dudex-gold uppercase tracking-wider">Recipient Deliveries</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-dudex-gold mt-2">{stats.totalRecipients}</h3>
          <p className="text-xs text-neutral-500 mt-1">Total audience reach</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl">
          <p className="text-xs font-medium text-rose-400 uppercase tracking-wider">Unread Alerts</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-rose-400 mt-2">{stats.unread}</h3>
          <p className="text-xs text-neutral-500 mt-1">Pending user opens</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification messages..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-dudex-gold/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
            >
              <option value="all">All Audiences</option>
              <option value="All Users">All Users</option>
              <option value="Teachers Only">Teachers Only</option>
              <option value="Students Only">Students Only</option>
              <option value="Specific Course">Specific Course</option>
              <option value="Specific Batch">Specific Batch</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
          >
            <option value="all">All Statuses</option>
            <option value="Sent">Sent</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Notifications Table / List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dudex-gold mb-3"></div>
          <p className="text-sm text-neutral-400">Loading notifications center...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-neutral-900/40 border border-white/5">
          <Bell className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No notifications match</h3>
          <p className="text-sm text-neutral-400 mt-1">Compose a message to send to teachers or students.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 group ${
                notif.read
                  ? 'bg-neutral-950/60 border-white/5 opacity-85'
                  : 'bg-gradient-to-b from-neutral-900 to-neutral-950 border-dudex-gold/30 shadow-dudex-gold/5'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex-shrink-0 mt-0.5">
                  {getTypeIcon(notif.type)}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-neutral-800 text-dudex-gold border border-white/5">
                      {notif.audience}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        notif.status === 'Sent'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : notif.status === 'Scheduled'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {notif.status}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-dudex-gold transition-colors">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                    <span>Recipients: <strong className="text-white">{notif.recipientsCount}</strong></span>
                    <span>•</span>
                    <span>Read: <strong className="text-emerald-400">{notif.readCount}</strong></span>
                    <span>•</span>
                    <span>Unread: <strong className="text-rose-400">{notif.unreadCount}</strong></span>
                    {notif.actionUrl && (
                      <span className="flex items-center gap-1 text-dudex-gold">
                        • Action Link Attached <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleToggleRead(notif)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                    notif.read
                      ? 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                      : 'bg-dudex-gold/10 border-dudex-gold/30 text-dudex-gold hover:bg-dudex-gold/20'
                  }`}
                  title={notif.read ? 'Mark as Unread' : 'Mark as Read'}
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(notif.id)}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-all"
                  title="Duplicate Notification"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedNotif(notif)}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-all"
                  title="View Full Delivery Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(notif.id, notif.title)}
                  className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-rose-400 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Delivery Details Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10">
                {getTypeIcon(selectedNotif.type)}
              </div>
              <div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-800 text-dudex-gold">
                  {selectedNotif.audience}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedNotif.title}</h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 text-xs text-neutral-300 leading-relaxed mb-6">
              {selectedNotif.message}
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-950 border border-white/5 text-center text-xs mb-6">
              <div>
                <span className="text-neutral-500">Recipients</span>
                <p className="text-base font-extrabold text-white mt-0.5">{selectedNotif.recipientsCount}</p>
              </div>
              <div>
                <span className="text-neutral-500">Read</span>
                <p className="text-base font-extrabold text-emerald-400 mt-0.5">{selectedNotif.readCount}</p>
              </div>
              <div>
                <span className="text-neutral-500">Unread</span>
                <p className="text-base font-extrabold text-rose-400 mt-0.5">{selectedNotif.unreadCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-white font-semibold hover:bg-neutral-700 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsComposerOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Compose Push Notification</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Broadcast high-priority alerts to faculty and student apps.
            </p>

            <form onSubmit={handleOpenPreview} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Midterm Seating Allotment Live"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Target Audience *</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="All Users">COMMON BOTH STUDENT + TEACHER (286)</option>
                    <option value="Teachers Only">TEACHERS ONLY (6)</option>
                    <option value="Students Only">STUDENTS ONLY (280)</option>
                    <option value="Specific Course">SPECIFIC COURSE</option>
                    <option value="Specific Batch">SPECIFIC BATCH</option>
                    <option value="Specific Section">SPECIFIC SECTION</option>
                    <option value="Specific Teacher">SPECIFIC TEACHER</option>
                    <option value="Specific Student">SPECIFIC STUDENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Alert Type & Priority</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-2.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="error">Urgent</option>
                    </select>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-2.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Target Selectors */}
              {formData.audience === 'Specific Course' && (
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Course</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => {
                      const c = courses.find((x) => x.id === e.target.value);
                      setFormData({ ...formData, courseId: e.target.value, courseName: c?.name || '' });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="">Select Course...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.audience === 'Specific Batch' && (
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Batch</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => {
                      const b = batches.find((x) => x.id === e.target.value);
                      setFormData({ ...formData, batchId: e.target.value, batchName: b?.name || '' });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="">Select Batch...</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Message Body *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter alert text to display on recipient screens..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Action Deep Link URL</label>
                  <input
                    type="text"
                    value={formData.actionUrl}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                    placeholder="/admin/students/exams"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => handleSendNotification('Draft')}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Save Draft
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold shadow-lg shadow-dudex-gold/20"
                  >
                    Preview Delivery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/40 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dudex-gold mb-1">
              Delivery Verification
            </h3>
            <h2 className="text-xl font-bold text-white mb-4">Confirm Notification Dispatch</h2>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10 space-y-3 mb-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Target Audience:</span>
                <span className="font-bold text-white">{formData.audience}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Calculated Recipients:</span>
                <span className="font-extrabold text-dudex-gold">{calculatedRecipients} Accounts</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-neutral-400">Priority & Type:</span>
                <span className="font-semibold text-white">{formData.priority} • {formData.type.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-1">Notification Payload:</span>
                <div className="p-3 rounded-xl bg-neutral-900 border border-white/5 text-white font-medium">
                  <h4 className="font-bold text-sm text-dudex-gold">{formData.title}</h4>
                  <p className="text-neutral-300 mt-1">{formData.message}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs"
              >
                Back to Edit
              </button>

              <div className="flex items-center gap-2">
                {formData.scheduledFor && (
                  <button
                    type="button"
                    onClick={() => handleSendNotification('Scheduled')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    <Clock className="w-4 h-4" /> Schedule Broadcast
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSendNotification('Sent')}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-bold text-xs shadow-lg shadow-dudex-gold/20"
                >
                  <Send className="w-4 h-4" /> Send Immediately
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
