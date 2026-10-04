import { supabase } from '../lib/supabase';
import { StorageFile } from '../types';

function rowToFile(row: Record<string, unknown>): StorageFile {
  return {
    id: row.id as string,
    name: (row.name as string) || '',
    fileType: ((row.file_type as string) || 'Document') as StorageFile['fileType'],
    sizeBytes: (row.size_bytes as number) || 0,
    sizeFormatted: (row.size_formatted as string) || '0 KB',
    ownerName: (row.owner_name as string) || 'Super Admin',
    relatedEntity: (row.related_entity as string) || '',
    createdDate: (row.created_at as string)?.split('T')[0] || '',
    status: ((row.status as string) || 'Active') as StorageFile['status'],
    downloadUrl: (row.download_url as string) || '',
  };
}

export const getStorageFiles = async (): Promise<StorageFile[]> => {
  const { data, error } = await supabase
    .from('storage_files')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).map(rowToFile);
};

export const deleteStorageFile = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('storage_files').delete().eq('id', id);
  return !error;
};

export const storageFileService = {
  getStorageFiles,
  deleteStorageFile,
};
