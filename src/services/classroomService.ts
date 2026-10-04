import { supabase } from '../lib/supabase';
import { Classroom, ClassroomStatus } from '../types';

function rowToClassroom(row: Record<string, unknown>): Classroom {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    roomNumber: (row.room_number as string) || (row.name as string) || '',
    building: (row.building as string) || 'Main Block',
    floor: (row.floor as string) || '1st Floor',
    capacity: (row.capacity as number) || 60,
    facilities: (row.facilities as string[]) || [],
    status: ((row.status as string) || 'Available') as ClassroomStatus,
    currentClass: (row.current_class as string) || '',
    notes: (row.notes as string) || '',
  };
}

export const getClassrooms = async (): Promise<Classroom[]> => {
  const { data, error } = await supabase
    .from('classrooms')
    .select('*')
    .order('room_number', { ascending: true });

  if (error) {
    console.error('[classroomService] getClassrooms:', error.message);
    return [];
  }
  return (data || []).map(rowToClassroom);
};

export const createClassroom = async (classroomData: Partial<Classroom>): Promise<Classroom | null> => {
  const { data, error } = await supabase
    .from('classrooms')
    .insert({
      name: classroomData.name || classroomData.roomNumber || 'New Classroom',
      room_number: classroomData.roomNumber || classroomData.name || '',
      building: classroomData.building || 'Main Block',
      floor: classroomData.floor || '1st Floor',
      capacity: classroomData.capacity || 60,
      facilities: classroomData.facilities || [],
      status: classroomData.status || 'Available',
      notes: classroomData.notes || '',
    })
    .select()
    .single();

  if (error || !data) return null;

  await supabase.from('activity_logs').insert({
    action: 'Created Classroom',
    module: 'classrooms',
    entity: data.name,
    description: `Created classroom ${data.name}`,
    admin_name: 'Admin',
  });

  return rowToClassroom(data);
};

export const updateClassroom = async (id: string, updates: Partial<Classroom>): Promise<Classroom | null> => {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.roomNumber !== undefined) payload.room_number = updates.roomNumber;
  if (updates.building !== undefined) payload.building = updates.building;
  if (updates.floor !== undefined) payload.floor = updates.floor;
  if (updates.capacity !== undefined) payload.capacity = updates.capacity;
  if (updates.facilities !== undefined) payload.facilities = updates.facilities;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const { data, error } = await supabase
    .from('classrooms')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToClassroom(data);
};

export const deleteClassroom = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('classrooms').delete().eq('id', id);
  return !error;
};

export const classroomService = {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom,
};
