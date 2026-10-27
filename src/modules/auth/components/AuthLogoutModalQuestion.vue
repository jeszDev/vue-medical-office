<template>
  <ModalQuestion
    v-model="isOpen"
    title="¿Quieres cerrar sesión?"
    description="Tendrás que volver a iniciar sesión para acceder a tu cuenta."
    confirm-text="Sí, cerrar sesión"
    cancel-text="Cancelar"
    :loading="isPending"
    loading-text="Cerrando sesión..."
    variant="danger"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import { useAuthStore } from '../stores/auth.store';
import { useLogoutModal } from '../composables/useLogoutModal';

const authStore = useAuthStore();
const { isOpen, close } = useLogoutModal();
const isPending = ref(false);

const handleConfirm = async () => {
  try {
    isPending.value = true;
    await authStore.logout();
    close();
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    isPending.value = false;
  }
};

const handleCancel = () => {
  close();
};
</script>
