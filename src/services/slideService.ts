import { supabase } from '../lib/supabase';
import { SlideBanner, AudienceType } from '../types';

function rowToSlide(row: Record<string, unknown>): SlideBanner {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    subtitle: (row.subtitle as string) || '',
    imageUrl: (row.image_url as string) || '',
    ctaText: (row.cta_text as string) || 'Explore',
    ctaRoute: (row.cta_route as string) || '/',
    audience: ((row.audience as string) || 'All Users') as AudienceType,
    startDate: (row.start_date as string) || '',
    endDate: (row.end_date as string) || '',
    displayOrder: (row.display_order as number) || 0,
    status: ((row.status as string) || 'Active') as SlideBanner['status'],
  };
}

export const getSlideBanners = async (): Promise<SlideBanner[]> => {
  const { data, error } = await supabase
    .from('slide_banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data || []).map(rowToSlide);
};

export const createSlideBanner = async (slideData: Partial<SlideBanner>): Promise<SlideBanner | null> => {
  const { data, error } = await supabase
    .from('slide_banners')
    .insert({
      title: slideData.title || 'New Slide Banner',
      subtitle: slideData.subtitle || '',
      image_url: slideData.imageUrl || '',
      cta_text: slideData.ctaText || 'Explore',
      cta_route: slideData.ctaRoute || '/',
      audience: slideData.audience || 'All Users',
      start_date: slideData.startDate || new Date().toISOString().split('T')[0],
      end_date: slideData.endDate || null,
      display_order: slideData.displayOrder || 0,
      status: slideData.status || 'Active',
    })
    .select()
    .single();

  if (error || !data) return null;
  return rowToSlide(data);
};

export const updateSlideBanner = async (id: string, updates: Partial<SlideBanner>): Promise<SlideBanner | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.ctaText !== undefined) payload.cta_text = updates.ctaText;
  if (updates.ctaRoute !== undefined) payload.cta_route = updates.ctaRoute;
  if (updates.audience !== undefined) payload.audience = updates.audience;
  if (updates.startDate !== undefined) payload.start_date = updates.startDate;
  if (updates.endDate !== undefined) payload.end_date = updates.endDate;
  if (updates.displayOrder !== undefined) payload.display_order = updates.displayOrder;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await supabase
    .from('slide_banners')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToSlide(data);
};

export const deleteSlideBanner = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('slide_banners').delete().eq('id', id);
  return !error;
};

export const toggleSlideBannerStatus = async (id: string): Promise<boolean> => {
  const { data } = await supabase.from('slide_banners').select('status').eq('id', id).single();
  if (!data) return false;
  const newStatus = data.status === 'Active' ? 'Inactive' : 'Active';
  const { error } = await supabase.from('slide_banners').update({ status: newStatus }).eq('id', id);
  return !error;
};

export const slideService = {
  getSlideBanners,
  createSlideBanner,
  updateSlideBanner,
  deleteSlideBanner,
  toggleSlideBannerStatus,
};
