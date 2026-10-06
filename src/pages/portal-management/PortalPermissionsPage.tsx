import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sliders,
  Users,
  GraduationCap,
  Navigation,
  KeyRound,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { portalManagementService } from '../../services/portalManagementService';
import { rolePermissionService } from '../../services/rolePermissionService';
import { PortalPreviewModal } from './PortalPreviewModal';
import { PortalFeatureControl, RolePermission } from '../../types';

export const PortalPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [previewPortal, setPreviewPortal] = useState<'teacher' | 'student' | null>(null);

  const [teacherControls, setTeacherControls] = useState<PortalFeatureControl[]>([]);
  const [studentControls, setStudentControls] = useState<PortalFeatureControl[]>([]);
  const [roles, setRoles] = useState<RolePermission[]>([]);

  useEffect(() => {
    const load = async () => {
      const [tc, sc, r] = await Promise.all([
        portalManagementService.getTeacherPortalControls(),
        portalManagementService.getStudentPortalControls(),
        rolePermissionService.getRoles(),
      ]);
      setTeacherControls(tc);
      setStudentControls(sc);
      setRoles(r);
    };
    load();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Portal Security & Permission Mapping
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Centralized architectural hub connecting role policies, faculty feature overrides, and student privileges.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewPortal('teacher')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 text-xs font-semibold"
          >
            <Eye className="w-4 h-4 text-dudex-gold" /> Preview Faculty Suite
          </button>
          <button
            onClick={() => setPreviewPortal('student')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 text-black text-xs font-bold shadow-lg"
          >
            <Eye className="w-4 h-4" /> Preview Student Portal
          </button>
        </div>
      </div>

      {/* 3 Main Portal Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teacher Portal Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 hover:border-dudex-gold/30 transition-all shadow-xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-dudex-gold transition-colors">
              Teacher Portal Governance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Configure faculty lecture publishing, grading engines, biometric attendance overrides, and CSV export toggles.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between"><span>Active Modules:</span><strong className="text-emerald-400">{teacherControls.filter(c => c.visible).length} / {teacherControls.length}</strong></div>
              <div className="flex justify-between"><span>Faculty Overrides:</span><strong className="text-white">Active</strong></div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/portal-management/teacher')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white border border-white/10 mt-6 group-hover:border-dudex-gold/40 transition-all"
          >
            Manage Teacher Controls <ArrowRight className="w-4 h-4 text-dudex-gold" />
          </button>
        </div>

        {/* Student Portal Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 hover:border-dudex-gold/30 transition-all shadow-xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-dudex-gold transition-colors">
              Student Portal Governance
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Control student access to live lecture streams, submission dropboxes, attendance correction requests, and receipts.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between"><span>Active Modules:</span><strong className="text-emerald-400">{studentControls.filter(c => c.visible).length} / {studentControls.length}</strong></div>
              <div className="flex justify-between"><span>Correction Workflow:</span><strong className="text-white">Enabled</strong></div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/portal-management/student')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white border border-white/10 mt-6 group-hover:border-dudex-gold/40 transition-all"
          >
            Manage Student Controls <ArrowRight className="w-4 h-4 text-dudex-gold" />
          </button>
        </div>

        {/* Navigation & Roles Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 hover:border-dudex-gold/30 transition-all shadow-xl flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold w-fit">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-dudex-gold transition-colors">
              Navigation Hierarchy & Ordering
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Customize the sidebar menu sequence, route targets, and icon visual cues for both portals.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1 text-xs text-neutral-400">
              <div className="flex justify-between"><span>Configured Roles:</span><strong className="text-white">{roles.length} System Policies</strong></div>
              <div className="flex justify-between"><span>Drag Reordering:</span><strong className="text-emerald-400">Enabled</strong></div>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/portal-management/navigation')}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white border border-white/10 mt-6 group-hover:border-dudex-gold/40 transition-all"
          >
            Manage Navigation Trees <ArrowRight className="w-4 h-4 text-dudex-gold" />
          </button>
        </div>
      </div>

      {previewPortal && (
        <PortalPreviewModal portal={previewPortal} onClose={() => setPreviewPortal(null)} />
      )}
    </div>
  );
};
