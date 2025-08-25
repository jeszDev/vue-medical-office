import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthStatus, type User } from '../interfaces';
import { loginAction } from '../actions/login.action';
import { useLocalStorage } from '@vueuse/core';
import { checkAuthAction } from '../actions/check-auth.action';
import { logoutAction } from '../actions/logout.action';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const authStatus = ref<AuthStatus>(AuthStatus.Checking);
  const user = ref<User | undefined>();
  const token = ref(useLocalStorage('token', ''));

  const login = async (email: string, password: string) => {
    try {
      const loginResp = await loginAction(email, password);
      if (!loginResp.ok) {
        console.log('login');

        return cleanStore();
      }

      user.value = loginResp.user;
      token.value = loginResp.token;
      authStatus.value = AuthStatus.Authenticated;

      localStorage.setItem('token', token.value);

      return true;
    } catch (error) {
      console.log(error);
      console.log('error login');
      return cleanStore();
    }
  };

  const logout = async () => {
    const logoutResp = await logoutAction();

    if (logoutResp.success) {
      cleanStore();
      useRouter().push({ name: 'login' });
    }
  };

  const cleanStore = () => {
    authStatus.value = AuthStatus.Unauthenticated;
    user.value = undefined;
    token.value = '';
    return false;
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const statusResp = await checkAuthAction();

      if (!statusResp.ok) {
        console.log('check status');
        return cleanStore();
      }

      authStatus.value = AuthStatus.Authenticated;
      user.value = statusResp.user;
      token.value = statusResp.token;
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

    // getters
    isChecking: computed(() => authStatus.value === AuthStatus.Checking),
    isAuthenticated: computed(() => authStatus.value === AuthStatus.Authenticated),

    // actions
    login,
    logout,
    checkAuthStatus,
  };
});
