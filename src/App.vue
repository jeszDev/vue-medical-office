<template>
  <RouterView />

  <ModalQuestion
    id="modal-logout"
    title="¿Quieres cerrar sesión?"
    description="Si cierras sesión, tendrás que volver a iniciar sesión."
    confirmText="Sí, cerrar sesión"
    cancelText="Cancelar"
    @confirm="handleLogout"
  />

  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { AuthStatus } from './modules/auth/interfaces';
import { useAuthStore } from './modules/auth/stores/auth.store';
import { useRoute, useRouter } from 'vue-router';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

authStore.$subscribe(
  (_, state) => {
    if (state.authStatus === AuthStatus.Checking) {
      authStore.checkAuthStatus();
      return;
    }

    if (route.path.includes('/auth') && state.authStatus === AuthStatus.Authenticated) {
      router.replace({ name: 'patients.index' });
      return;
    }
  },
  {
    immediate: true,
  },
);

const handleLogout = async () => {
  console.log('cerrar sesion');

  const modalElement = document.querySelector('.modal.show');
  if (modalElement) {
    console.log('entrtas');
    window.tailwind.Modal.getOrCreateInstance(modalElement).hide();
  }
  setTimeout(() => {
    authStore.logout();
  }, 300);
};
</script>

<style scoped></style>
