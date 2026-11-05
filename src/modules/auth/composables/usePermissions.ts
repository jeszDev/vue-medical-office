import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import type { Permission } from '../constants/permissions.constant';

export function usePermissions() {
  const authStore = useAuthStore();

  const userRoles = computed<string[]>(() => {
    const roles = authStore.user?.roles || [];
    return roles.map((r) => String(r).toLowerCase().trim());
  });

  const userPermissions = computed<string[]>(() => {
    const permissions = authStore.user?.permissions || [];
    return permissions.map((p) => String(p).toLowerCase().trim());
  });

  const isAdmin = computed<boolean>(() => {
    return userRoles.value.includes('admin') || userRoles.value.includes('administrador');
  });

  const activeRole = computed<string>(() => {
    return authStore.activeRole?.toLowerCase().trim() || '';
  });

  const hasRole = (roles?: string | string[]): boolean => {
    if (!roles) return true;
    const targetRoles = Array.isArray(roles) ? roles : [roles];
    if (targetRoles.length === 0) return true;
    if (!authStore.user) return false;
    if (isAdmin.value) return true;

    return targetRoles.some((role) => userRoles.value.includes(role.toLowerCase().trim()));
  };

  const hasActiveRole = (roles?: string | string[]): boolean => {
    if (!roles) return true;
    if (isAdmin.value) return true;
    const targetRoles = Array.isArray(roles) ? roles : [roles];
    if (targetRoles.length === 0) return true;
    if (!authStore.user) return false;

    const current = activeRole.value;
    if (current) {
      const isDoctorRole = ['doctor', 'medico', 'médico'].includes(current);
      const isPatientRole = ['patient', 'paciente'].includes(current);

      return targetRoles.some((r) => {
        const norm = r.toLowerCase().trim();
        if (isDoctorRole && ['doctor', 'medico', 'médico'].includes(norm)) return true;
        if (isPatientRole && ['patient', 'paciente'].includes(norm)) return true;
        return norm === current;
      });
    }

    return hasRole(roles);
  };

  const can = (permission?: Permission): boolean => {
    if (!permission) return true;
    if (!authStore.user) return false;
    if (isAdmin.value) return true;

    const normalized = String(permission).toLowerCase().trim();
    return userPermissions.value.includes(normalized);
  };

  const canAny = (permissions?: Permission[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    if (!authStore.user) return false;
    if (isAdmin.value) return true;

    return permissions.some((p) => can(p));
  };

  const canAll = (permissions?: Permission[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    if (!authStore.user) return false;
    if (isAdmin.value) return true;

    return permissions.every((p) => can(p));
  };

  return {
    isAdmin,
    userRoles,
    userPermissions,
    activeRole,
    hasRole,
    hasActiveRole,
    can,
    canAny,
    canAll,
  };
}
