import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthStatus, type User } from '../interfaces';
import { loginAction } from '../actions/login.action';
import { useLocalStorage } from '@vueuse/core';
import { checkAuthAction } from '../actions/check-auth.action';
import { logoutAction } from '../actions/logout.action';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));
  const activeRole = ref(useLocalStorage<string>('active_role', ''));

  const resolveDefaultRole = (userObj?: User): string => {
    if (!userObj?.roles || userObj.roles.length === 0) return '';
    const normalizedRoles = userObj.roles.map((r) => String(r).toLowerCase().trim());

    // Si ya existe un activeRole guardado y es válido para este usuario, conservarlo
    if (activeRole.value && normalizedRoles.includes(activeRole.value.toLowerCase().trim())) {
      return activeRole.value.toLowerCase().trim();
    }

    // Jerarquía de inicialización por defecto: admin -> doctor -> recepcionista -> patient
    if (normalizedRoles.includes('admin') || normalizedRoles.includes('administrador')) return 'admin';
    if (
      normalizedRoles.includes('doctor') ||
      normalizedRoles.includes('medico') ||
      normalizedRoles.includes('médico')
    ) {
      return 'doctor';
    }
    if (normalizedRoles.includes('recepcionista') || normalizedRoles.includes('receptionist')) {
      return 'recepcionista';
    }
    if (normalizedRoles.includes('patient') || normalizedRoles.includes('paciente')) {
      return 'patient';
    }
    return normalizedRoles[0] || '';
  };

  const switchActiveRole = (newRole: string) => {
    const normalized = newRole.toLowerCase().trim();
    const userRoles = (user.value?.roles || []).map((r) => String(r).toLowerCase().trim());
    if (userRoles.includes(normalized)) {
      activeRole.value = normalized;
      localStorage.setItem('active_role', normalized);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        console.log('login');

        return cleanStore();
      }

      const defaultRole = resolveDefaultRole(loginResp.user);
      user.value = loginResp.user;
      token.value = loginResp.token;
      activeRole.value = defaultRole;

      localStorage.setItem('token', token.value);
      localStorage.setItem('active_role', defaultRole);

      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      console.log(error);
      console.log('error login');
      return cleanStore();
    }
  };

  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      cleanStore();
      await router.replace({ name: 'login' });
    }
  };

  const cleanStore = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    activeRole.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('active_role');
    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      if (!statusResp.ok) {
        console.log('check status');
        return cleanStore();
      }

      const defaultRole = resolveDefaultRole(statusResp.user);
      user.value = statusResp.user;
      token.value = statusResp.token;
      activeRole.value = defaultRole;

      localStorage.setItem('token', token.value);
      localStorage.setItem('active_role', defaultRole);

      authStatus.value = AuthStatus.Authenticated;

      return true;
    } catch (error) {
      console.log(error);
      console.log('check status error');
      return cleanStore();
    }
  };

  return {
    user,
    token,
    authStatus,
    activeRole,

    // getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),
    isPatientMode: computed(() => {
      const current = activeRole.value?.toLowerCase().trim();
      if (current === 'patient' || current === 'paciente') return true;
      if (!current) {
        const roles = (user.value?.roles || []).map((r) => String(r).toLowerCase().trim());
        return (
          roles.includes('patient') &&
          !roles.some((r) =>
            ['doctor', 'medico', 'médico', 'admin', 'administrador', 'recepcionista'].includes(r),
          )
        );
      }
      return false;
    }),
    isDualUser: computed(() => {
      const roles = (user.value?.roles || []).map((r) => String(r).toLowerCase().trim());
      const hasDoc =
        roles.includes('doctor') ||
        roles.includes('medico') ||
        roles.includes('médico') ||
        !!user.value?.doctor;
      const hasPat =
        roles.includes('patient') ||
        roles.includes('paciente') ||
        !!user.value?.patient;
      return hasDoc && hasPat;
    }),
    activeDoctorProfile: computed(() => user.value?.doctor ?? null),
    activePatientProfile: computed(() => user.value?.patient ?? null),

    // actions
    login,
    logout,
    checkAuthStatus,
    switchActiveRole,
  };
});
