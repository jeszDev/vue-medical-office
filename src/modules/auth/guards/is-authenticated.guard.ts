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
    return next({ name: 'chain-custody.list' });
  }

  return next();
};

export default isAuthenticatedGuard;
