import React, { useState, useEffect, useMemo } from 'react';
import {
  HardDrive,
  Upload,
  Search,
  Filter,
  FileText,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Archive,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { StorageFile } from '../../types';
import { storageFileService } from '../../services/storageFileService';
import { useToast } from '../../context/ToastContext';

export const StorageFilesPage: React.FC = () => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    fileType: 'PDF' as StorageFile['fileType'],
    sizeFormatted: '3.4 MB',
    ownerName: 'Dr. Alexander Vance',
    relatedEntity: 'Institutional Document',
    downloadUrl: '#',
    status: 'Active' as StorageFile['status'],
  });

  const loadData = async () => {
    const list = await storageFileService.getStorageFiles();
    setFiles(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || f.fileType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [files, searchQuery, typeFilter]);

  const stats = useMemo(() => {
    const totalFiles = files.length;
    const totalStorageMb = 80.9;
    return { totalFiles, totalStorageMb };
  }, [files]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('File name is required', 'error');
      return;
    }

    await storageFileService.createStorageFile({
      name: formData.name.endsWith('.pdf') || formData.name.includes('.') ? formData.name : `${formData.name}.pdf`,
      fileType: formData.fileType,
      sizeBytes: 3400000,
      sizeFormatted: formData.sizeFormatted,
      ownerName: formData.ownerName,
      relatedEntity: formData.relatedEntity,
      status: formData.status,
      downloadUrl: '#',
    });

    setIsUploadOpen(false);
    await loadData();
    showToast('Asset uploaded to cloud storage repository', 'success');
  };

  const handleDownloadMock = (name: string) => {
    showToast(`Downloading mock asset: ${name}`, 'info');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete cloud file "${name}"?`)) {
      await storageFileService.deleteStorageFile(id);
      await loadData();
      showToast(`Asset "${name}" removed`, 'info');
    }
  };

  const getFileIcon = (type: StorageFile['fileType']) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'Archive':
        return <Archive className="w-5 h-5 text-amber-400" />;
      case 'Spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'Code':
        return <FileCode className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Cloud Storage & File Repository
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Manage syllabus assets, code archive bundles, slide decks, and official certificates.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              fileType: 'PDF',
              sizeFormatted: '3.4 MB',
              ownerName: 'Dr. Alexander Vance',
              relatedEntity: 'Institutional Document',
              downloadUrl: '#',
              status: 'Active',
            });
            setIsUploadOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files by name, entity, owner..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-dudex-gold/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-neutral-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
          >
            <option value="all">All File Formats</option>
            <option value="PDF">PDF Documents</option>
            <option value="Image">Images & Crests</option>
            <option value="Archive">ZIP Archive Bundles</option>
            <option value="Spreadsheet">Spreadsheets</option>
            <option value="Code">Source Code Repos</option>
          </select>
        </div>
      </div>

      {/* Files Table / List */}
      <div className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 border-b border-white/10 text-neutral-400 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Document Asset Name</th>
                <th className="py-3 px-4">Category / Type</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Associated Entity</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredFiles.map((f) => (
                <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-white flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-900 border border-white/10">
                      {getFileIcon(f.fileType)}
                    </div>
                    <span className="truncate max-w-xs">{f.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-white/5">
                      {f.fileType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{f.sizeFormatted}</td>
                  <td className="py-3.5 px-4 text-dudex-gold font-medium">{f.relatedEntity}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{f.ownerName}</td>
                  <td className="py-3.5 px-4 text-neutral-500">{f.createdDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDownloadMock(f.name)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
                        title="Download Asset"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(f.id, f.name)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-all"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Upload Document Asset</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Attach study resources, policy manuals, or syllabus files.
            </p>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">File Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Distributed_Systems_Syllabus_2026.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">File Format</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Image">Image Asset</option>
                    <option value="Archive">ZIP Archive</option>
                    <option value="Spreadsheet">Spreadsheet</option>
                    <option value="Code">Source Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Associated Entity</label>
                  <input
                    type="text"
                    value={formData.relatedEntity}
                    onChange={(e) => setFormData({ ...formData, relatedEntity: e.target.value })}
                    placeholder="Course CSE-401"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold shadow-lg shadow-dudex-gold/20"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
