import React, { useState, useMemo } from 'react';
import {
  Shield,
  Plus,
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  Lock,
  KeyRound,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { AdminUser } from '../../types';
import { adminUserService } from '../../services/adminUserService';
import { rolePermissionService } from '../../services/rolePermissionService';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(() => adminUserService.getAdminUsers());
  const [roles] = useState(() => rolePermissionService.getRoles());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Academic Manager',
    status: 'Active' as AdminUser['status'],
    avatar: '',
  });

  const loadData = () => {
    setUsers(adminUserService.getAdminUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '+1 (555) 000-0000',
      role: 'Academic Manager',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      avatar: user.avatar || '',
    });
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    if (editingUser) {
      adminUserService.updateAdminUser(editingUser.id, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar,
      });
      showToast('Administrator profile updated', 'success');
    } else {
      adminUserService.createAdminUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        avatar:
          formData.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      });
      showToast('New administrator account created', 'success');
    }

    setIsFormOpen(false);
    loadData();
  };

  const handleToggleStatus = (id: string, name: string) => {
    adminUserService.toggleAdminUserStatus(id);
    loadData();
    showToast(`Account status updated for ${name}`, 'info');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove administrator user "${name}"?`)) {
      const deleted = adminUserService.deleteAdminUser(id);
      if (deleted) {
        showToast(`Administrator account "${name}" deleted`, 'info');
        loadData();
      } else {
        showToast('Super Admin primary account cannot be deleted', 'error');
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
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Administrator User Management
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Manage privileged operator accounts, credentials, and organizational roles.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Administrator
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
            placeholder="Search by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-dudex-gold/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 text-sm focus:outline-none focus:border-dudex-gold/50"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Deactivated">Deactivated</option>
          </select>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 hover:border-dudex-gold/30 transition-all shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-dudex-gold/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-dudex-gold transition-colors">
                      {user.fullName}
                    </h3>
                    <span className="text-xs font-semibold text-dudex-gold">{user.role}</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    user.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-neutral-400 py-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Last Login: <strong className="text-white">{user.lastLogin}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => handleToggleStatus(user.id, user.fullName)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  user.status === 'Active'
                    ? 'bg-neutral-900 text-neutral-400 hover:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {user.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-dudex-gold transition-all"
                  title="Edit Account"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.fullName)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 transition-all"
                  title="Delete Account"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Form Modal */}
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
              {editingUser ? 'Edit Administrator User' : 'Create Administrator Account'}
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Configure system credentials and assigned access role.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Beatrice Sterling"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="b.sterling@dudex.academy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 772-9104"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Assigned Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.roleName}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Profile Photo URL</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
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
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
