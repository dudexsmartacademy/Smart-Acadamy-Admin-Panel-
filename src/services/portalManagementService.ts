import { supabase } from '../lib/supabase';
import { PortalFeatureControl, PortalNavigationItem } from '../types';

export const getPortalTeacherControls = async (): Promise<PortalFeatureControl[]> => {
  const { data, error } = await supabase
    .from('portal_features')
    .select('*')
    .eq('portal', 'teacher')
    .order('key');

  if (error) {
    console.error('[portalManagementService] getPortalTeacherControls:', error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id as string,
    key: row.key as string,
    label: row.label as string,
    category: row.category as PortalFeatureControl['category'],
    visible: (row.visible as boolean) ?? true,
    enabled: (row.enabled as boolean) ?? true,
    canView: (row.can_view as boolean) ?? true,
    canCreate: row.can_create as boolean,
    canEdit: row.can_edit as boolean,
    canDelete: row.can_delete as boolean,
    canPublish: row.can_publish as boolean,
    canExport: row.can_export as boolean,
  }));
};

export const getPortalStudentControls = async (): Promise<PortalFeatureControl[]> => {
  const { data, error } = await supabase
    .from('portal_features')
    .select('*')
    .eq('portal', 'student')
    .order('key');

  if (error) {
    console.error('[portalManagementService] getPortalStudentControls:', error.message);
    return [];
  }
  return (data || []).map((row) => ({
    id: row.id as string,
    key: row.key as string,
    label: row.label as string,
    category: row.category as PortalFeatureControl['category'],
    visible: (row.visible as boolean) ?? true,
    enabled: (row.enabled as boolean) ?? true,
    canView: (row.can_view as boolean) ?? true,
    canSubmit: row.can_submit as boolean,
    canDownload: row.can_download as boolean,
  }));
};

export const updatePortalFeatureControl = async (id: string, updates: Partial<PortalFeatureControl>): Promise<boolean> => {
  const payload: Record<string, unknown> = {};
  if (updates.visible !== undefined) payload.visible = updates.visible;
  if (updates.enabled !== undefined) payload.enabled = updates.enabled;
  if (updates.canView !== undefined) payload.can_view = updates.canView;
  if (updates.canCreate !== undefined) payload.can_create = updates.canCreate;
  if (updates.canEdit !== undefined) payload.can_edit = updates.canEdit;
  if (updates.canDelete !== undefined) payload.can_delete = updates.canDelete;

  const { error } = await supabase
    .from('portal_features')
    .update(payload)
    .eq('id', id);

  if (!error) {
    await supabase.from('activity_logs').insert({
      action: 'Updated Portal Control',
      module: 'portals',
      entity: id,
      description: `Updated portal feature visibility/permissions in Supabase`,
      admin_name: 'Admin',
    });
  }

  return !error;
};

export const getPortalNavigation = async (portal: 'teacher' | 'student'): Promise<PortalNavigationItem[]> => {
  const { data, error } = await supabase
    .from('portal_navigation')
    .select('*')
    .eq('portal', portal)
    .order('display_order', { ascending: true });

  if (error) return [];
  return (data || []).map((row) => ({
    id: row.id as string,
    portal,
    section: (row.section as string) || 'Main',
    label: row.label as string,
    route: row.route as string,
    iconName: (row.icon_name as string) || 'Layers',
    order: (row.display_order as number) || 0,
    visible: (row.visible as boolean) ?? true,
    enabled: (row.enabled as boolean) ?? true,
  }));
};

export const updatePortalNavigation = async (id: string, updates: Partial<PortalNavigationItem>): Promise<boolean> => {
  const payload: Record<string, unknown> = {};
  if (updates.visible !== undefined) payload.visible = updates.visible;
  if (updates.enabled !== undefined) payload.enabled = updates.enabled;
  if (updates.order !== undefined) payload.display_order = updates.order;
  if (updates.label !== undefined) payload.label = updates.label;

  const { error } = await supabase
    .from('portal_navigation')
    .update(payload)
    .eq('id', id);

  return !error;
};

export const getTeacherPortalControls = getPortalTeacherControls;
export const getStudentPortalControls = getPortalStudentControls;
export const updateTeacherPortalControl = updatePortalFeatureControl;
export const updateStudentPortalControl = updatePortalFeatureControl;
export const updatePortalNavigationItem = updatePortalNavigation;

export const resetTeacherPortalControls = async (): Promise<boolean> => {
  return true;
};

export const resetStudentPortalControls = async (): Promise<boolean> => {
  return true;
};

export const reorderPortalNavigation = async (items: PortalNavigationItem[]): Promise<boolean> => {
  for (let i = 0; i < items.length; i++) {
    await updatePortalNavigation(items[i].id, { order: i + 1 });
  }
  return true;
};

export const portalManagementService = {
  getPortalTeacherControls,
  getPortalStudentControls,
  getTeacherPortalControls,
  getStudentPortalControls,
  updatePortalFeatureControl,
  updateTeacherPortalControl,
  updateStudentPortalControl,
  resetTeacherPortalControls,
  resetStudentPortalControls,
  getPortalNavigation,
  updatePortalNavigation,
  updatePortalNavigationItem,
  reorderPortalNavigation,
};
