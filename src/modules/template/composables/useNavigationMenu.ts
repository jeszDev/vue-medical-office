import { computed, type Ref } from 'vue';
import { usePermissions } from '@/modules/auth/composables/usePermissions';
import { PERMISSIONS, type Permission } from '@/modules/auth/constants/permissions.constant';
import { useAppointmentRequestsCount } from '@/modules/appointment/composables/useAppointmentRequestsCount';

export type MenuBadgeValue = number | string | null | undefined;
export type MenuBadge = MenuBadgeValue | (() => MenuBadgeValue) | Ref<MenuBadgeValue>;

export interface MenuItem {
  title: string;
  routeName: string;
  iconName?: string;
  roles?: string[]; // Allowed roles. If empty/undefined, visible to all authenticated users.
  permission?: Permission; // Required permission to view this item.
  permissions?: Permission[]; // Required permissions to view this item.
  matchMode?: 'any' | 'all';
  group?: string;
  params?: Record<string, unknown>;
  badge?: MenuBadge;
  badgeClass?: string;
}

export function useNavigationMenu() {
  const { can, canAny, canAll, hasRole, hasActiveRole, isAdmin, userRoles } = usePermissions();

  const isItemAuthorized = (item: MenuItem): boolean => {
    if (isAdmin.value) return true;

    // Check roles against active role if defined
    if (item.roles && item.roles.length > 0 && !hasActiveRole(item.roles)) {
      return false;
    }

    // Check single permission if defined
    if (item.permission && !can(item.permission)) {
      return false;
    }

    // Check multiple permissions if defined
    if (item.permissions && item.permissions.length > 0) {
      const allowed =
        item.matchMode === 'all' ? canAll(item.permissions) : canAny(item.permissions);
      if (!allowed) {
        return false;
      }
    }

    return true;
  };

  // Pending appointment requests count for authorized roles/permissions
  const canManageRequests = computed(
    () => isAdmin.value || can(PERMISSIONS.APPOINTMENTS_CONFIRM),
  );

  const { count: pendingRequestsCount } = useAppointmentRequestsCount({
    enabled: canManageRequests,
  });

  // Full Menu Schema
  const allMenuItems: MenuItem[] = [
    {
      title: 'Listado de Pacientes',
      routeName: 'patients.index',
      iconName: 'users',
      group: 'PACIENTES',
      roles: ['admin', 'doctor', 'recepcionista', 'médico', 'medico'],
      permission: PERMISSIONS.PATIENTS_VIEW,
    },
    {
      title: 'Calendario de Citas',
      routeName: 'appointments.index',
      iconName: 'calendar',
      group: 'CITAS Y AGENDA',
      roles: ['admin', 'doctor', 'recepcionista', 'paciente', 'médico', 'medico'],
      permission: PERMISSIONS.APPOINTMENTS_VIEW,
    },
    {
      title: 'Solicitudes de Citas',
      routeName: 'appointments.requests',
      iconName: 'calendar-clock',
      group: 'CITAS Y AGENDA',
      roles: ['admin', 'administrador', 'recepcionista', 'doctor', 'medico', 'médico'],
      permission: PERMISSIONS.APPOINTMENTS_CONFIRM,
      badge: pendingRequestsCount,
    },
    {
      title: 'Gestión de Roles',
      routeName: 'patients.index', // placeholder route
      iconName: 'shield',
      group: 'ADMINISTRACIÓN',
      roles: ['admin', 'administrador'],
      permission: PERMISSIONS.ROLES_VIEW,
    },
  ];

  // Dynamically filtered menu based on user roles and permissions
  const menuItems = computed(() => {
    return allMenuItems.filter(isItemAuthorized);
  });

  // Grouped menu items for structured navigation rendering
  const groupedMenuItems = computed(() => {
    const groups: Record<string, MenuItem[]> = {};
    for (const item of menuItems.value) {
      const groupName = item.group || 'GENERAL';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    }
    return groups;
  });

  return {
    userRoles,
    hasRole,
    can,
    menuItems,
    groupedMenuItems,
    pendingRequestsCount,
  };
}
