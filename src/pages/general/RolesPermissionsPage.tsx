import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  ShieldCheck,
  Check,
  X,
  Edit2,
  Trash2,
  Lock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { RolePermission } from '../../types';
import { rolePermissionService } from '../../services/rolePermissionService';
import { useToast } from '../../context/ToastContext';

export const RolesPermissionsPage: React.FC = () => {
  const { showToast } = useToast();
  const [roles, setRoles] = useState<RolePermission[]>(() => rolePermissionService.getRoles());
  const [selectedRole, setSelectedRole] = useState<RolePermission>(roles[0] || null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const loadData = () => {
    const updated = rolePermissionService.getRoles();
    setRoles(updated);
    if (selectedRole) {
      const refreshed = updated.find((r) => r.id === selectedRole.id);
      if (refreshed) setSelectedRole(refreshed);
    }
  };

  const handleTogglePermission = (
    moduleName: string,
    permissionKey:
      | 'canView'
      | 'canCreate'
      | 'canEdit'
      | 'canDelete'
      | 'canApprove'
      | 'canPublish'
      | 'canExport'
      | 'canManage'
  ) => {
    if (!selectedRole || selectedRole.roleName === 'Super Admin') {
      showToast('Super Admin permissions are permanently unlocked', 'info');
      return;
    }

    const updatedPermissions = selectedRole.permissions.map((p) => {
      if (p.module === moduleName) {
        return {
          ...p,
          [permissionKey]: !p[permissionKey],
        };
      }
      return p;
    });

    const updated = rolePermissionService.updateRole(selectedRole.id, {
      permissions: updatedPermissions,
    });

    if (updated) {
      setSelectedRole(updated);
      loadData();
      showToast(`Updated ${moduleName} permissions for ${selectedRole.roleName}`, 'success');
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showToast('Please provide a role name', 'error');
      return;
    }

    const defaultModules = [
      'Faculty Management',
      'Student Management',
      'Academic Curriculum',
      'Examinations & Grading',
      'Tuition Fees & Payments',
      'Portal Controls & CMS',
      'Security & System Audit',
    ];

    const newRole = rolePermissionService.createRole({
      roleName: newRoleName,
      description: newRoleDesc || 'Custom institutional access policy',
      permissions: defaultModules.map((m) => ({
        module: m,
        canView: true,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canApprove: false,
        canPublish: false,
        canExport: false,
        canManage: false,
      })),
    });

    setNewRoleName('');
    setNewRoleDesc('');
    setIsCreateOpen(false);
    loadData();
    setSelectedRole(newRole);
    showToast(`Role [${newRole.roleName}] created successfully`, 'success');
  };

  const handleDeleteRole = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete role policy [${name}]?`)) {
      const success = rolePermissionService.deleteRole(id);
      if (success) {
        loadData();
        setSelectedRole(roles[0]);
        showToast(`Role [${name}] deleted`, 'info');
      } else {
        showToast('Super Admin role cannot be deleted', 'error');
      }
    }
  };

  const permColumns: {
    key:
      | 'canView'
      | 'canCreate'
      | 'canEdit'
      | 'canDelete'
      | 'canApprove'
      | 'canPublish'
      | 'canExport'
      | 'canManage';
    label: string;
  }[] = [
    { key: 'canView', label: 'View' },
    { key: 'canCreate', label: 'Create' },
    { key: 'canEdit', label: 'Edit' },
    { key: 'canDelete', label: 'Delete' },
    { key: 'canApprove', label: 'Approve' },
    { key: 'canPublish', label: 'Publish' },
    { key: 'canExport', label: 'Export' },
    { key: 'canManage', label: 'Manage' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-dudex-gold/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-dudex-gold/10 border border-dudex-gold/20 text-dudex-gold">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Roles & Permission Matrix
              </h1>
              <p className="text-sm text-neutral-400 mt-0.5">
                Define access control lists (ACL) and granular CRUD privileges per functional module.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold text-sm transition-all shadow-lg shadow-dudex-gold/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      {/* Role Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {roles.map((r) => {
          const isSelected = selectedRole?.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-dudex-gold/20 to-amber-950/40 border-dudex-gold/50 shadow-xl shadow-dudex-gold/10'
                  : 'bg-neutral-900/70 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck
                  className={`w-4 h-4 ${isSelected ? 'text-dudex-gold' : 'text-neutral-500'}`}
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  {r.usersCount} Users
                </span>
              </div>
              <h4 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                {r.roleName}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Role Matrix Section */}
      {selectedRole && (
        <div className="rounded-3xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-white/5 p-6 lg:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-dudex-gold/10 text-dudex-gold border border-dudex-gold/20">
                  Active Policy Target
                </span>
                {selectedRole.roleName === 'Super Admin' && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                    <Lock className="w-3 h-3" /> Immutable Master Authority
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-1">{selectedRole.roleName}</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{selectedRole.description}</p>
            </div>

            {selectedRole.roleName !== 'Super Admin' && (
              <button
                onClick={() => handleDeleteRole(selectedRole.id, selectedRole.roleName)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 font-semibold self-start md:self-auto transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Role
              </button>
            )}
          </div>

          {/* Matrix Desktop Table & Mobile Cards */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 border-b border-white/10 text-neutral-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Academy Functional Module</th>
                  {permColumns.map((col) => (
                    <th key={col.key} className="py-3 px-3 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {selectedRole.permissions.map((row) => (
                  <tr key={row.module} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-xs">
                      {row.module}
                    </td>
                    {permColumns.map((col) => {
                      const isGranted = !!row[col.key];
                      return (
                        <td key={col.key} className="py-3 px-3 text-center">
                          <button
                            disabled={selectedRole.roleName === 'Super Admin'}
                            onClick={() => handleTogglePermission(row.module, col.key)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isGranted
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                                : 'bg-neutral-950 text-neutral-600 border border-white/5 hover:border-white/20'
                            } ${
                              selectedRole.roleName === 'Super Admin'
                                ? 'cursor-default opacity-80'
                                : 'cursor-pointer active:scale-95'
                            }`}
                            title={`${col.label} ${row.module}`}
                          >
                            {isGranted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-neutral-900 to-neutral-950 border border-dudex-gold/30 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Create Institutional Role</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Define a new permission group to assign to administrators.
            </p>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Examination Registrar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Describe the operational responsibilities of this role..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white focus:outline-none focus:border-dudex-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-dudex-gold to-amber-600 hover:from-dudex-gold/90 text-black font-semibold shadow-lg"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
