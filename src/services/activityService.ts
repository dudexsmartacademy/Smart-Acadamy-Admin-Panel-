import { supabase } from '../lib/supabase';
import { ActivityLog } from '../types';

export const activityService = {
  async log(
    action: string,
    module: ActivityLog['module'],
    entity: string,
    description: string
  ): Promise<void> {
    const { error } = await supabase.from('activity_logs').insert({
      action,
      module,
      entity,
      description,
      admin_name: 'Admin',
      created_at: new Date().toISOString(),
    });
    if (error) console.warn('[activityService] log failed:', error.message);
  },

  async getLogs(limit = 100): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) { console.error('[activityService] getLogs:', error.message); return []; }
    return (data || []).map((row) => ({
      id: row.id,
      timestamp: row.created_at,
      adminName: row.admin_name,
      action: row.action,
      module: row.module,
      entity: row.entity,
      description: row.description,
      ipAddress: row.ip_address || '',
    }));
  },

  async clearLogs(): Promise<void> {
    await supabase.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },

  /** Subscribe to live activity log updates */
  subscribeToActivities(callback: (payload: any) => void) {
    return supabase
      .channel('public:activity_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, callback)
      .subscribe();
  },
};

// Named export aliases for convenience  
export const getActivityLogs = (limit = 100) => activityService.getLogs(limit);
export const getLogs = (limit = 100) => activityService.getLogs(limit);
export const subscribeToActivities = (callback: (payload: any) => void) => activityService.subscribeToActivities(callback);

