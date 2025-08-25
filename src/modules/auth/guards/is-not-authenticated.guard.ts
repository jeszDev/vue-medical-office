import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const isNotAuthenticatedGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore();

  console.log(authStore.authStatus);

  if (!authStore.isAuthenticated) {
    return next();
  }

  return next({ name: 'chain-custody.list' });
};

export default isNotAuthenticatedGuard;
