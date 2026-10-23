import { computed } from 'vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

export interface MenuItem {
  title: string;
  routeName: string;
  iconName?: string;
  roles?: string[]; // Allowed roles. If empty/undefined, visible to all authenticated users.
  group?: string;
  params?: Record<string, unknown>;
}

export function useNavigationMenu() {
  const authStore = useAuthStore();

  // Normalized user roles helper
  const userRoles = computed<string[]>(() => {
    const roles = authStore.user?.roles || [];
    return roles.map((r) => String(r).toLowerCase());
  });

  // Check if current user has any of the required roles
  const hasRole = (allowedRoles?: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!authStore.user) return false;
    // Admin has access to all options
    if (userRoles.value.includes('admin') || userRoles.value.includes('administrador')) {
      return true;
    }

    return allowedRoles.some((role) => userRoles.value.includes(role.toLowerCase()));
  };

  // Full Menu Schema
  const allMenuItems: MenuItem[] = [
    {
      title: 'Listado de Pacientes',
      routeName: 'patients.index',
      iconName: 'users',
      group: 'PACIENTES',
      roles: ['admin', 'doctor', 'recepcionista', 'médico', 'medico'],
    },
    {
      title: 'Calendario de Citas',
      routeName: 'appointments.index',
      iconName: 'calendar',
      group: 'CITAS Y AGENDA',
      roles: ['admin', 'doctor', 'recepcionista', 'paciente', 'médico', 'medico'],
    },
    {
      title: 'Solicitudes de Citas',
      routeName: 'appointments.requests',
      iconName: 'calendar-clock',
      group: 'CITAS Y AGENDA',
      roles: ['admin', 'administrador', 'recepcionista', 'doctor', 'medico', 'médico'],
    },
    {
      title: 'Gestión de Roles',
      routeName: 'patients.index', // placeholder route
      iconName: 'shield',
      group: 'ADMINISTRACIÓN',
      roles: ['admin', 'administrador'],
    },
  ];

  // Dynamically filtered menu based on user roles
  const menuItems = computed(() => {
    return allMenuItems.filter((item) => hasRole(item.roles));
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
    menuItems,
    groupedMenuItems,
  };
}
