import { supabase } from '../lib/supabase';
import { CalendarEvent, CalendarEventType } from '../types';

function rowToEvent(row: Record<string, unknown>): CalendarEvent {
  return {
    id: row.id as string,
    title: (row.title as string) || '',
    type: ((row.type as string) || 'Academic Event') as CalendarEventType,
    startDate: (row.start_date as string) || '',
    endDate: (row.end_date as string) || '',
    startTime: (row.start_time as string) || '',
    endTime: (row.end_time as string) || '',
    location: (row.location as string) || '',
    courseName: (row.course_name as string) || '',
    batchName: (row.batch_name as string) || '',
    targetLink: (row.target_link as string) || '',
    description: (row.description as string) || '',
  };
}

export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('[calendarService] getCalendarEvents:', error.message);
    return [];
  }
  return (data || []).map(rowToEvent);
};

export const createCalendarEvent = async (eventData: Partial<CalendarEvent>): Promise<CalendarEvent | null> => {
  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      title: eventData.title || 'New Academic Event',
      type: eventData.type || 'Academic Event',
      start_date: eventData.startDate || new Date().toISOString().split('T')[0],
      end_date: eventData.endDate || null,
      start_time: eventData.startTime || '09:00',
      end_time: eventData.endTime || '10:00',
      location: eventData.location || '',
      course_name: eventData.courseName || '',
      batch_name: eventData.batchName || '',
      target_link: eventData.targetLink || '',
      description: eventData.description || '',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Calendar Event',
    module: 'calendar',
    entity: data.title,
    description: `Created calendar event: ${data.title}`,
    admin_name: 'Admin',
  });

  return rowToEvent(data);
};

export const deleteCalendarEvent = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  return !error;
};

export const calendarService = {
  getCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
};
