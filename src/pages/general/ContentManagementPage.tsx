import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Save,
  Image as ImageIcon,
  HelpCircle,
  Phone,
  Sparkles,
  ArrowRight,
  Globe,
  FileText,
  Sliders,
} from 'lucide-react';
import { ContentSection } from '../../types';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';

export const ContentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>(() =>
    contentService.getContentSections()
  );
  const [activeKey, setActiveKey] = useState<string>('homepage_hero');

  const currentSection = sections.find((s) => s.sectionKey === activeKey) || sections[0];

  const [formData, setFormData] = useState({
    title: currentSection?.title || '',
    subtitle: currentSection?.subtitle || '',
    content: currentSection?.content || '',
  });

  const handleSelectSection = (key: string) => {
    setActiveKey(key);
    const target = sections.find((s) => s.sectionKey === key);
    if (target) {
      setFormData({
        title: target.title,
        subtitle: target.subtitle || '',
        content: target.content,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSection) return;

    const updated = contentService.updateContentSection(currentSection.sectionKey, {
      title: formData.title,
      subtitle: formData.subtitle,
      content: formData.content,
    });

    if (updated) {
      setSections(contentService.getContentSections());
      showToast(`Content for [${updated.title}] updated successfully`, 'success');
    }
  };

  const sectionMenuItems = [
    { key: 'homepage_hero', label: 'Homepage Hero & Tagline', icon: Globe },
    { key: 'feature_cards', label: 'Pillars of Excellence', icon: Sparkles },
    { key: 'faq', label: 'Admissions & Academic FAQs', icon: HelpCircle },
    { key: 'contact_info', label: 'Headquarters & Hotline', icon: Phone },
    { key: 'footer_text', label: 'Accreditation & Footer', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Public Content Management (CMS)
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Customize homepage messaging, portal mission statements, FAQs, and institutional branding.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/content/slides')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-dudex-gold/30 text-dudex-gold text-xs font-bold transition-all shadow-lg"
        >
          <Sliders className="w-4 h-4" />
          Manage Slides & Hero Banners <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu Navigation Sidebar */}
        <div className="space-y-2">
          {sectionMenuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSelectSection(item.key)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-dudex-gold/20 to-neutral-900 border-dudex-gold/50 text-white font-bold shadow-lg'
                    : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-dudex-gold' : 'text-neutral-500'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Editor Form */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div>
              <span className="text-xs font-mono text-dudex-gold uppercase font-bold">
                Section: {currentSection?.sectionKey}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{currentSection?.title}</h2>
            </div>
            <span className="text-xs text-neutral-500">
              Last saved: {currentSection?.lastUpdated}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">Header / Section Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
              />
            </div>

            {currentSection?.subtitle !== undefined && (
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Subtitle / Subheading</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>
            )}

            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">
                Body Copy & Formatting (Markdown supported) *
              </label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-white/10 text-white leading-relaxed focus:outline-none focus:border-dudex-gold font-mono text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-bold shadow-lg shadow-dudex-gold/20"
              >
                <Save className="w-4 h-4" /> Save Content Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
