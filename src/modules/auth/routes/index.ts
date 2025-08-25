import type { RouteRecordRaw } from 'vue-router';
import AuthLayout from '@/modules/auth/layouts/AuthLayouth.vue';
import LoginView from '@/modules/auth/views/LoginView.vue';
import isAuthenticatedGuard from '../guards/is-authenticated.guard';

export const authRoutes: RouteRecordRaw = {
  path: '/auth',
  name: 'auth',
  component: AuthLayout,
  children: [
    {
      path: 'login',
      name: 'login',
      component: LoginView,
      beforeEnter: isAuthenticatedGuard,
    },
    {
      path: 'register',
      name: 'register',
      component: () => import('@/modules/auth/views/RegisterView.vue'),
    },
  ],
};
