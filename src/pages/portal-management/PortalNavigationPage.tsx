import React, { useState, useEffect } from 'react';
import {
  Navigation,
  ArrowUpDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { PortalNavigationItem } from '../../types';
import { portalManagementService } from '../../services/portalManagementService';
import { useToast } from '../../context/ToastContext';

export const PortalNavigationPage: React.FC = () => {
  const { showToast } = useToast();
  const [activePortal, setActivePortal] = useState<'teacher' | 'student'>('teacher');
  const [navItems, setNavItems] = useState<PortalNavigationItem[]>([]);

  const loadNav = async (portal: 'teacher' | 'student') => {
    const list = await portalManagementService.getPortalNavigation(portal);
    setNavItems(list);
  };

  useEffect(() => {
    loadNav(activePortal);
  }, [activePortal]);

  const handleSwitchPortal = (portal: 'teacher' | 'student') => {
    setActivePortal(portal);
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...navItems];
    const temp = items[index - 1];
    items[index - 1] = items[index];
    items[index] = temp;

    // Update orders
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(reordered);
    await portalManagementService.reorderPortalNavigation(reordered);
    showToast('Navigation sequence updated', 'info');
  };

  const handleMoveDown = async (index: number) => {
    if (index === navItems.length - 1) return;
    const items = [...navItems];
    const temp = items[index + 1];
    items[index + 1] = items[index];
    items[index] = temp;

    // Update orders
    const reordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(reordered);
    await portalManagementService.reorderPortalNavigation(reordered);
    showToast('Navigation sequence updated', 'info');
  };

  const handleToggleVisibility = async (id: string) => {
    const item = navItems.find((i) => i.id === id);
    if (!item) return;
    const updated = await portalManagementService.updatePortalNavigation(id, {
      visible: !item.visible,
    });
    if (updated) {
      await loadNav(activePortal);
      showToast(`Sidebar item [${item.label}] visibility toggled`, 'success');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Portal Sidebar Navigation Architecture
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Reorder menus, configure route endpoints, and toggle visibility for Teacher and Student portals.
              </p>
            </div>
          </div>
        </div>

        {/* Portal Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-neutral-900 border border-white/10">
          <button
            onClick={() => handleSwitchPortal('teacher')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'teacher'
                ? 'bg-dudex-gold text-black shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Teacher Portal Navigation
          </button>
          <button
            onClick={() => handleSwitchPortal('student')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'student'
                ? 'bg-dudex-gold text-black shadow-lg'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Student Portal Navigation
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 p-6 lg:p-8 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {activePortal.toUpperCase()} Menu Hierarchy & Order
          </h3>
          <span className="text-xs text-neutral-400">
            {navItems.filter((i) => i.visible).length} visible of {navItems.length} items
          </span>
        </div>

        <div className="space-y-3">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                item.visible
                  ? 'bg-neutral-950 border-white/10 hover:border-dudex-gold/30'
                  : 'bg-neutral-950/40 border-dashed border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-dudex-gold">
                  #{item.order}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {item.section}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500 mt-0.5">{item.route}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/5">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-all"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === navItems.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-all"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Visibility Toggle */}
                <button
                  onClick={() => handleToggleVisibility(item.id)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    item.visible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-neutral-900 text-neutral-500 border-white/5'
                  }`}
                  title={item.visible ? 'Hide from Sidebar' : 'Show in Sidebar'}
                >
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
