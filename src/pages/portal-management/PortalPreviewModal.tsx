import React, { useState } from 'react';
import {
  ShieldAlert,
  Eye,
  X,
  LayoutDashboard,
  Presentation,
  Users,
  CalendarCheck,
  FileText,
  FileSpreadsheet,
  BookOpen,
  Video,
  User,
  CreditCard,
  Award,
  Bell,
  Search,
  Sparkles,
  Lock,
} from 'lucide-react';
import { portalManagementService } from '../../services/portalManagementService';

interface PortalPreviewModalProps {
  portal: 'teacher' | 'student';
  onClose: () => void;
}

export const PortalPreviewModal: React.FC<PortalPreviewModalProps> = ({ portal, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navItems = portalManagementService
    .getPortalNavigation(portal)
    .filter((i) => i.visible && i.enabled);
  const controls =
    portal === 'teacher'
      ? portalManagementService.getTeacherPortalControls()
      : portalManagementService.getStudentPortalControls();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'Presentation':
        return <Presentation className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4" />;
      case 'Award':
        return <Award className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 lg:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-6xl h-[88vh] bg-neutral-950 border border-dudex-gold/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-amber-600/90 to-dudex-gold text-black px-6 py-2.5 flex items-center justify-between font-bold text-xs shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="tracking-wider uppercase">
              ADMIN PREVIEW MODE • READ ONLY SIMULATION ({portal.toUpperCase()} PORTAL)
            </span>
          </div>
          <span className="text-[11px] font-semibold opacity-90 hidden sm:inline">
            Reflecting active feature toggles & navigation ordering
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/40 text-black font-extrabold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mock Portal Shell */}
        <div className="flex-1 flex overflow-hidden">
          {/* Mock Sidebar */}
          <div className="w-64 bg-neutral-900 border-r border-white/5 p-4 flex flex-col justify-between hidden md:flex">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-xl bg-dudex-gold/20 border border-dudex-gold/40 flex items-center justify-center text-dudex-gold font-black">
                  D
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white tracking-tight">DUDEx SMART</h3>
                  <p className="text-[10px] text-dudex-gold uppercase font-bold tracking-wider">
                    {portal === 'teacher' ? 'Faculty Suite' : 'Student Portal'}
                  </p>
                </div>
              </div>

              {/* Sidebar items */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isSelected = activeTab === item.label.toLowerCase();
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.label.toLowerCase())}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-dudex-gold/15 text-dudex-gold border border-dudex-gold/30'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {getIcon(item.iconName)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Read-Only Disclaimer */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-white/5 text-[11px] text-neutral-400 text-center">
              <Lock className="w-3.5 h-3.5 text-dudex-gold mx-auto mb-1" />
              Simulated Sandbox View
            </div>
          </div>

          {/* Mock Main Content Area */}
          <div className="flex-1 flex flex-col bg-neutral-950 overflow-y-auto p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white capitalize">
                  {portal === 'teacher' ? 'Faculty Command Center' : 'Student Learning Dashboard'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Welcome to the {portal} portal interface.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-dudex-gold/20 border border-dudex-gold/40 flex items-center justify-center text-xs font-bold text-dudex-gold">
                  {portal === 'teacher' ? 'DR' : 'ST'}
                </div>
              </div>
            </div>

            {/* Simulated Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {controls
                .filter((c) => c.visible && c.enabled)
                .slice(0, 6)
                .map((feature) => (
                  <div
                    key={feature.id}
                    className="p-5 rounded-2xl bg-neutral-900/80 border border-white/5 shadow-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-dudex-gold uppercase">
                        {feature.category}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{feature.label}</h4>
                    <p className="text-xs text-neutral-400">
                      Module active and operational with granted permissions.
                    </p>
                  </div>
                ))}
            </div>

            {/* Note on Disabled Modules */}
            {controls.some((c) => !c.visible || !c.enabled) && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <strong className="block font-bold mb-1">
                  Hidden / Disabled Modules (Enforced by Admin Policy):
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                  {controls
                    .filter((c) => !c.visible || !c.enabled)
                    .map((c) => (
                      <li key={c.id}>
                        {c.label} ({c.category}) — Access Restricted
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
