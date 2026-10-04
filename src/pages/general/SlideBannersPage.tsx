import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Image as ImageIcon,
  Eye,
  Edit2,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Users,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { SlideBanner } from '../../types';
import { slideService } from '../../services/slideService';
import { useToast } from '../../context/ToastContext';

export const SlideBannersPage: React.FC = () => {
  const { showToast } = useToast();
  const [slides, setSlides] = useState<SlideBanner[]>(() => slideService.getSlideBanners());
  const [previewSlide, setPreviewSlide] = useState<SlideBanner | null>(slides[0] || null);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideBanner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    ctaText: 'Explore More',
    ctaRoute: '/admin/announcements',
    audience: 'All Users' as SlideBanner['audience'],
    startDate: '2026-09-29',
    endDate: '2026-10-31',
    displayOrder: 1,
    status: 'Active' as SlideBanner['status'],
  });

  const loadData = () => {
    const data = slideService.getSlideBanners();
    setSlides(data);
    if (previewSlide) {
      const current = data.find((s) => s.id === previewSlide.id);
      if (current) setPreviewSlide(current);
    }
  };

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
      ctaText: 'Register Now',
      ctaRoute: '/admin/announcements',
      audience: 'All Users',
      startDate: '2026-09-29',
      endDate: '2026-10-31',
      displayOrder: slides.length + 1,
      status: 'Active',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (slide: SlideBanner) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText,
      ctaRoute: slide.ctaRoute,
      audience: slide.audience,
      startDate: slide.startDate,
      endDate: slide.endDate,
      displayOrder: slide.displayOrder,
      status: slide.status,
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (editingSlide) {
      slideService.updateSlideBanner(editingSlide.id, formData);
      showToast('Slide banner updated', 'success');
    } else {
      slideService.createSlideBanner(formData);
      showToast('New slide banner published', 'success');
    }

    setIsFormOpen(false);
    loadData();
  };

  const handleToggleStatus = (id: string) => {
    slideService.toggleSlideBannerStatus(id);
    loadData();
    showToast('Banner visibility toggled', 'info');
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete banner "${title}"?`)) {
      slideService.deleteSlideBanner(id);
      loadData();
      showToast('Banner deleted', 'info');
      if (previewSlide?.id === id) {
        setPreviewSlide(slides[0] || null);
      }
    }
  };

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
                Hero Slides & Carousel Banners
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Manage prominent broadcast banners displayed across student and faculty dashboards.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Slide Banner
        </button>
      </div>

      {/* Live Dudex Banner Live Preview Component */}
      {previewSlide && (
        <div className="rounded-3xl bg-neutral-950 border border-dudex-gold/40 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-dudex-gold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Interactive Preview (Selected Banner)
            </span>
            <span className="text-xs text-neutral-400">
              Target: <strong className="text-white">{previewSlide.audience}</strong>
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-end p-6 lg:p-8 border border-white/10 group">
            <img
              src={previewSlide.imageUrl}
              alt={previewSlide.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="relative z-10 max-w-xl space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-dudex-gold/20 text-dudex-gold border border-dudex-gold/30 uppercase tracking-wider">
                Featured Spotlight
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                {previewSlide.title}
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {previewSlide.subtitle}
              </p>

              <div className="pt-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 text-black font-bold text-xs shadow-lg">
                  {previewSlide.ctaText} <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slides List & Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Configured Carousel Banners ({slides.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slides.map((slide) => {
            const isSelected = previewSlide?.id === slide.id;
            return (
              <div
                key={slide.id}
                onClick={() => setPreviewSlide(slide)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                  isSelected
                    ? 'bg-gradient-to-b from-dudex-gold/15 to-neutral-950 border-dudex-gold/50 shadow-dudex-gold/10'
                    : 'bg-neutral-900/70 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-32 rounded-xl overflow-hidden border border-white/10">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white">
                      Order: #{slide.displayOrder}
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          slide.status === 'Active'
                            ? 'bg-emerald-500 text-black'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {slide.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white truncate">{slide.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2 mt-1">{slide.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(slide.id);
                    }}
                    className="text-xs text-neutral-400 hover:text-white font-semibold"
                  >
                    {slide.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(slide);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-dudex-gold"
                      title="Edit Banner"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(slide.id, slide.title);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingSlide ? 'Edit Slide Banner' : 'Create Slide Banner'}
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Design carousel artwork and targeted call-to-action triggers.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Autumn 2026 Conclave Registration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Subtitle / Promo Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Brief 1-2 sentence compelling summary..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Background Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Button CTA Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="Register Now"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">CTA Route</label>
                  <input
                    type="text"
                    value={formData.ctaRoute}
                    onChange={(e) => setFormData({ ...formData, ctaRoute: e.target.value })}
                    placeholder="/admin/announcements"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Target Audience</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Teachers Only">Teachers Only</option>
                    <option value="Students Only">Students Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Display Sequence Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold shadow-lg shadow-dudex-gold/20"
                >
                  {editingSlide ? 'Save Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
