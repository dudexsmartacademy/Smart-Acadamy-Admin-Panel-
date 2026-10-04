import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen,
  Plus,
  Search,
  Filter,
  Users,
  Building,
  Layers,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Classroom } from '../../types';
import { classroomService } from '../../services/classroomService';
import { useToast } from '../../context/ToastContext';

export const ClassroomsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');

  // Modal / Drawer state
  const [selectedRoom, setSelectedRoom] = useState<Classroom | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Classroom | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    building: '',
    floor: '',
    capacity: 40,
    facilities: '',
    status: 'Available' as Classroom['status'],
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = classroomService.getClassrooms();
      setClassrooms(data);
      setLoading(false);
    }, 150);
  };

  const buildings = useMemo(() => {
    const set = new Set(classrooms.map((c) => c.building));
    return Array.from(set);
  }, [classrooms]);

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.building.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesBuilding = buildingFilter === 'all' || r.building === buildingFilter;
      return matchesSearch && matchesStatus && matchesBuilding;
    });
  }, [classrooms, searchQuery, statusFilter, buildingFilter]);

  const stats = useMemo(() => {
    const total = classrooms.length;
    const available = classrooms.filter((c) => c.status === 'Available').length;
    const occupied = classrooms.filter((c) => c.status === 'Occupied').length;
    const maintenance = classrooms.filter((c) => c.status === 'Maintenance').length;
    const totalCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);
    return { total, available, occupied, maintenance, totalCapacity };
  }, [classrooms]);

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      roomNumber: '',
      building: 'Turing Hall of Engineering',
      floor: '1st Floor',
      capacity: 45,
      facilities: 'Dual 4K Projectors, Gigabit Ethernet, Soundproofing',
      status: 'Available',
      notes: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (room: Classroom) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      roomNumber: room.roomNumber,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      facilities: room.facilities.join(', '),
      status: room.status,
      notes: room.notes || '',
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomNumber.trim()) {
      showToast('Please provide room name and number', 'error');
      return;
    }

    const facilitiesArray = formData.facilities
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingRoom) {
      classroomService.updateClassroom(editingRoom.id, {
        name: formData.name,
        roomNumber: formData.roomNumber,
        building: formData.building,
        floor: formData.floor,
        capacity: Number(formData.capacity),
        facilities: facilitiesArray,
        status: formData.status,
        notes: formData.notes,
      });
      showToast('Classroom updated successfully', 'success');
    } else {
      classroomService.createClassroom({
        name: formData.name,
        roomNumber: formData.roomNumber,
        building: formData.building,
        floor: formData.floor,
        capacity: Number(formData.capacity),
        facilities: facilitiesArray,
        status: formData.status,
        notes: formData.notes,
      });
      showToast('New classroom created successfully', 'success');
    }

    setIsFormOpen(false);
    loadData();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete classroom "${name}"?`)) {
      classroomService.deleteClassroom(id);
      showToast(`Classroom "${name}" deleted`, 'success');
      loadData();
      if (selectedRoom?.id === id) {
        setIsDetailOpen(false);
      }
    }
  };

  const getStatusBadge = (status: Classroom['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Available
          </span>
        );
      case 'Occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="w-3.5 h-3.5" /> Occupied
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Wrench className="w-3.5 h-3.5" /> Maintenance
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">
            <AlertCircle className="w-3.5 h-3.5" /> Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Classroom Facilities & Labs
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Manage physical auditoriums, research clusters, and live studio lecture halls.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white transition-all shadow-sm"
            title="Refresh Facilities"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 hover:to-amber-500 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Classroom
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-dudex-gold/5 rounded-full blur-2xl group-hover:bg-dudex-gold/10 transition-all" />
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Rooms</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">{stats.total}</h3>
          <p className="text-xs text-neutral-500 mt-1">Across all academy wings</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Available Now</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-emerald-400 mt-2">{stats.available}</h3>
          <p className="text-xs text-neutral-500 mt-1">Ready for assignment</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Occupied</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-amber-400 mt-2">{stats.occupied}</h3>
          <p className="text-xs text-neutral-500 mt-1">Live lectures in session</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
          <p className="text-xs font-medium text-purple-400 uppercase tracking-wider">Total Seating</p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-2">{stats.totalCapacity}</h3>
          <p className="text-xs text-neutral-500 mt-1">Max simultaneous capacity</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search room name, code, building..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-dudex-gold/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
          >
            <option value="all">All Buildings</option>
            {buildings.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Classroom Cards Grid */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-dudex-gold mb-3"></div>
          <p className="text-sm text-neutral-400">Loading classroom facilities...</p>
        </div>
      ) : filteredClassrooms.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-neutral-900/40 border border-white/5">
          <DoorOpen className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No classrooms match your query</h3>
          <p className="text-sm text-neutral-400 mt-1">Try adjusting search keywords or active filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map((room) => (
            <div
              key={room.id}
              className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 hover:border-dudex-gold/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-dudex-gold/5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-dudex-gold/10 text-dudex-gold border border-dudex-gold/20">
                      {room.roomNumber}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-dudex-gold transition-colors mt-2">
                      {room.name}
                    </h3>
                  </div>
                  {getStatusBadge(room.status)}
                </div>

                <div className="space-y-2 text-xs text-neutral-400 my-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{room.building}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{room.floor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Capacity: <strong className="text-white">{room.capacity} seats</strong></span>
                  </div>
                  {room.currentClass && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 mt-3">
                      <div className="flex items-center gap-1.5 font-semibold text-[11px]">
                        <Calendar className="w-3 h-3" /> Live Lecture:
                      </div>
                      <p className="text-xs font-medium text-white truncate mt-0.5">{room.currentClass}</p>
                    </div>
                  )}
                </div>

                {/* Facilities Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                  {room.facilities.slice(0, 3).map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-white/5"
                    >
                      {f}
                    </span>
                  ))}
                  {room.facilities.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                      +{room.facilities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsDetailOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(room)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-dudex-gold hover:bg-white/5 transition-all"
                    title="Edit Room"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id, room.name)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-white/5 transition-all"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classroom Detail Drawer / Modal */}
      {isDetailOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsDetailOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
                <DoorOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-dudex-gold">{selectedRoom.roomNumber}</span>
                <h2 className="text-xl font-bold text-white">{selectedRoom.name}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-950 border border-white/5 text-xs">
                <div>
                  <span className="text-neutral-500">Building Wing:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedRoom.building}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Floor:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedRoom.floor}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Max Seating Capacity:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedRoom.capacity} Students</p>
                </div>
                <div>
                  <span className="text-neutral-500">Operational Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedRoom.status)}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Installed Facilities & Hardware
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.facilities.map((f, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl bg-neutral-800/80 border border-white/10 text-xs text-neutral-200"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRoom.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Facility Notes & Policy
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-xl border border-white/5">
                    {selectedRoom.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    navigate('/admin/classes');
                  }}
                  className="flex items-center gap-1.5 text-xs text-dudex-gold hover:underline font-semibold"
                >
                  View Scheduled Classes <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleOpenEdit(selectedRoom);
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-all"
                >
                  Edit Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingRoom ? 'Edit Classroom Facility' : 'Create New Classroom'}
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Configure room parameters, equipment list, and availability.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Room Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Advanced AI Lab"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. A-101"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Building Wing</label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="e.g. Turing Hall of Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Floor Level</label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g. 1st Floor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Capacity (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Facilities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="e.g. Dual 4K Projectors, Gigabit Ethernet, Soundproofing"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Facility Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Access requirements, scheduling notes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
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
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
