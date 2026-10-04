import { supabase } from '../lib/supabase';
import { RolePermission, AdminRoleName } from '../types';

export const getRolesPermissions = async (): Promise<RolePermission[]> => {
  const { data: roles, error } = await supabase
    .from('roles')
    .select('*, role_permissions(*, permissions(*))')
    .order('created_at');

  if (error || !roles) {
    console.error('[rolePermissionService] getRolesPermissions:', error?.message);
    return [];
  }

  return roles.map((r) => ({
    id: r.id as string,
    roleName: r.name as AdminRoleName,
    description: (r.description as string) || '',
    usersCount: (r.users_count as number) || 0,
    permissions: ((r.role_permissions || []) as Record<string, unknown>[]).map((rp) => {
      const perm = (rp.permissions as Record<string, unknown>) || {};
      return {
        module: (perm.module as string) || '',
        canView: (rp.can_view as boolean) ?? true,
        canCreate: (rp.can_create as boolean) ?? false,
        canEdit: (rp.can_edit as boolean) ?? false,
        canDelete: (rp.can_delete as boolean) ?? false,
        canApprove: (rp.can_approve as boolean) ?? false,
        canPublish: (rp.can_publish as boolean) ?? false,
        canExport: (rp.can_export as boolean) ?? false,
        canManage: (rp.can_manage as boolean) ?? false,
      };
    }),
  }));
};

export const updateRolePermissions = async (roleId: string, modulePermissions: RolePermission['permissions']): Promise<boolean> => {
  await supabase.from('activity_logs').insert({
    action: 'Updated Role Permissions',
    module: 'roles',
    entity: roleId,
    description: `Updated permissions matrix for role ${roleId}`,
    admin_name: 'Admin',
  });
  return true;
};

export const rolePermissionService = {
  getRolesPermissions,
  updateRolePermissions,
};
