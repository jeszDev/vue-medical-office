import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  console.log(authStore.authStatus);

  if (authStore.isAuthenticated) {
    return next({ name: authStore.isPatientMode ? 'appointments.index' : 'patients.index' });
  }

  return next();
};

export default isAuthenticatedGuard;
