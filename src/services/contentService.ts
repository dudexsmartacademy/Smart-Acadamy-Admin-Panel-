import { supabase } from '../lib/supabase';
import { ContentSection } from '../types';

export const getContentSections = async (): Promise<ContentSection[]> => {
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .order('section_key');

  if (error) return [];
  return (data || []).map((row) => ({
    id: row.id as string,
    sectionKey: row.section_key as string,
    title: (row.title as string) || '',
    subtitle: (row.subtitle as string) || '',
    content: (row.content as string) || '',
    lastUpdated: (row.updated_at as string) || (row.created_at as string) || '',
  }));
};

export const updateContentSection = async (id: string, updates: Partial<ContentSection>): Promise<boolean> => {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
  if (updates.content !== undefined) payload.content = updates.content;

  const { error } = await supabase
    .from('content_sections')
    .update(payload)
    .eq('id', id);

  return !error;
};

export const contentService = {
  getContentSections,
  updateContentSection,
};
