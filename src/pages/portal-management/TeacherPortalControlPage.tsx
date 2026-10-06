import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Eye,
  Sliders,
  RotateCcw,
  Check,
  X,
  Lock,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { PortalFeatureControl, Teacher } from '../../types';
import { portalManagementService } from '../../services/portalManagementService';
import { teacherService } from '../../services/teacherService';
import { useToast } from '../../context/ToastContext';
import { PortalPreviewModal } from './PortalPreviewModal';

export const TeacherPortalControlPage: React.FC = () => {
  const { showToast } = useToast();
  const [controls, setControls] = useState<PortalFeatureControl[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewOpen, setPreviewOpen] = useState(false);

  const loadData = async () => {
    const [ctrls, tList] = await Promise.all([
      portalManagementService.getTeacherPortalControls(),
      teacherService.getTeachers(),
    ]);
    setControls(ctrls);
    setTeachers(tList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['all', 'ACADEMIC', 'LEARNING', 'ACCOUNT'];

  const filteredControls = controls.filter((c) => {
    if (activeCategory === 'all') return true;
    return c.category === activeCategory;
  });

  const handleToggle = async (id: string, field: keyof PortalFeatureControl) => {
    const item = controls.find((c) => c.id === id);
    if (!item) return;

    const newValue = !item[field];
    const updated = await portalManagementService.updateTeacherPortalControl(id, {
      [field]: newValue,
    });

    if (updated) {
      await loadData();
      showToast(`Updated ${item.label} [${String(field)}: ${newValue ? 'ON' : 'OFF'}]`, 'success');
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset Teacher Portal feature matrix to system defaults?')) {
      await portalManagementService.resetTeacherPortalControls();
      await loadData();
      showToast('Teacher Portal permissions restored to default', 'info');
    }
  };

  const actionColumns: { key: keyof PortalFeatureControl; label: string }[] = [
    { key: 'visible', label: 'Visible' },
    { key: 'enabled', label: 'Enabled' },
    { key: 'canView', label: 'View' },
    { key: 'canCreate', label: 'Create' },
    { key: 'canEdit', label: 'Edit' },
    { key: 'canDelete', label: 'Delete' },
    { key: 'canPublish', label: 'Publish' },
    { key: 'canExport', label: 'Export' },
    { key: 'canManage', label: 'Manage' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Teacher Portal Feature Governance
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Toggle faculty modules, grading permissions, lecture publishing rights, and CSV export toggles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset Factory Defaults
          </button>
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
          >
            <Eye className="w-4 h-4" />
            View Portal Live Preview
          </button>
        </div>
      </div>

      {/* Target Faculty Override Selector & Category Filter */}
      <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Users className="w-4 h-4 text-dudex-gold" />
          <span className="text-xs text-neutral-400 font-semibold whitespace-nowrap">
            Scope Target:
          </span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-dudex-gold"
          >
            <option value="all">Global Standard (All Faculty Members)</option>
            <option value="role_hod">Department Chairs & HODs</option>
            <option value="role_adjunct">Adjunct Lecturers</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                Individual Override: {t.fullName} ({t.designation})
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-dudex-gold text-black shadow-md'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Matrix Table */}
      <div className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 border-b border-white/10 text-neutral-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Teacher Portal Module</th>
                <th className="py-3.5 px-4">Group</th>
                {actionColumns.map((col) => (
                  <th key={col.key} className="py-3.5 px-3 text-center">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredControls.map((control) => (
                <tr key={control.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white text-xs">
                    {control.label}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-dudex-gold">
                      {control.category}
                    </span>
                  </td>
                  {actionColumns.map((col) => {
                    const isApplicable = control[col.key] !== undefined;
                    const isChecked = !!control[col.key];
                    return (
                      <td key={col.key} className="py-3.5 px-3 text-center">
                        {isApplicable ? (
                          <button
                            onClick={() => handleToggle(control.id, col.key)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-neutral-950 text-neutral-600 border border-white/5 hover:border-white/20'
                            }`}
                            title={`Toggle ${col.label} for ${control.label}`}
                          >
                            {isChecked ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="text-neutral-700 select-none text-xs">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safe Live Portal Preview Modal */}
      {previewOpen && (
        <PortalPreviewModal portal="teacher" onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
};
