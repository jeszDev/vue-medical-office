<template>
  <TemplateView title="Mi Perfil de Usuario">
    <template #main>
      <FullScreenLoader v-if="isLoading" />

      <template v-else-if="profileUser">
        <div class="tabs relative w-full">
          <!-- Hero Box de Midone con foto, identidad, contacto, métricas y barra de tabs integrada -->
          <ProfileHeaderCard
            :user="profileUser"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
            @change-avatar="handleAvatarChangeRequest"
          />

          <!-- Contenido de las Pestañas (Tab Content) -->
          <div class="tab-content mt-6">
            <!-- Tab 1: Visión General (adaptada por rol) -->
            <div v-show="activeTab === 'overview'">
              <!-- Médico / Doctor -->
              <ProfileOverviewDoctor
                v-if="isDoctor"
                :user="profileUser"
              />

              <!-- Recepcionista -->
              <ProfileOverviewReceptionist
                v-else-if="isReceptionist"
                :user="profileUser"
              />

              <!-- Paciente / Titular / Tutor -->
              <ProfileOverviewPatient
                v-else
                :user="profileUser"
                @switch-tab="activeTab = $event"
              />
            </div>

            <!-- Tab 2: Editar Información -->
            <div v-show="activeTab === 'edit'">
              <ProfileEditForm
                :user="profileUser"
                @submit="handleUpdateProfile"
                @cancel="activeTab = 'overview'"
              />
            </div>

            <!-- Tab 3: Seguridad y Contraseña -->
            <div v-show="activeTab === 'security'">
              <ProfileChangePasswordForm
                :is-submitting="isChangingPassword"
                @submit="handleChangePassword"
                @cancel="activeTab = 'overview'"
              />
            </div>

            <!-- Tab 4: Familiares y Tutelados (Para pacientes/tutores) -->
            <div
              v-if="isPatient || profileUser.es_tutor || (profileUser.tutelados && profileUser.tutelados.length > 0)"
              v-show="activeTab === 'dependents'"
            >
              <ProfileDependentsList :dependents="profileUser.tutelados" />
            </div>
          </div>
        </div>
      </template>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'vue-toastification';

import { useAuthStore } from '@/modules/auth/stores/auth.store';
import type {
  ProfileTabType,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../interfaces';
import {
  getProfileAction,
  updateProfileAction,
  changePasswordAction,
} from '../actions';

import TemplateView from '@/modules/template/components/TemplateView.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import ProfileHeaderCard from '../components/ProfileHeaderCard.vue';
import ProfileOverviewDoctor from '../components/ProfileOverviewDoctor.vue';
import ProfileOverviewReceptionist from '../components/ProfileOverviewReceptionist.vue';
import ProfileOverviewPatient from '../components/ProfileOverviewPatient.vue';
import ProfileEditForm from '../components/ProfileEditForm.vue';
import ProfileChangePasswordForm from '../components/ProfileChangePasswordForm.vue';
import ProfileDependentsList from '../components/ProfileDependentsList.vue';

const authStore = useAuthStore();
const toast = useToast();
const queryClient = useQueryClient();

const activeTab = ref<ProfileTabType>('overview');

// Cargar datos de perfil del usuario logueado
const { data: profileUser, isLoading } = useQuery({
  queryKey: ['user-profile', authStore.user?.id],
  queryFn: () => getProfileAction(),
});

// Roles normalizados
const rolesNormalized = computed(() => {
  return (profileUser.value?.roles || authStore.user?.roles || []).map((r) =>
    String(r).toLowerCase(),
  );
});

const isDoctor = computed(() => {
  return rolesNormalized.value.some((r) => ['doctor', 'medico', 'médico'].includes(r));
});

const isReceptionist = computed(() => {
  return rolesNormalized.value.some((r) => ['recepcionista', 'receptionist'].includes(r));
});

const isPatient = computed(() => {
  return rolesNormalized.value.some((r) => ['paciente', 'patient'].includes(r));
});

// Mutación: Actualizar información de perfil
const updateProfileMutation = useMutation({
  mutationFn: (payload: UpdateProfilePayload) => updateProfileAction(payload),
  onSuccess: (result) => {
    toast.success(result.message || 'Datos del perfil actualizados.');
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    // Actualizar nombre en el authStore si cambió
    if (result.data?.name && authStore.user) {
      authStore.user.name = result.data.name;
    }
    activeTab.value = 'overview';
  },
  onError: () => {
    toast.error('Ocurrió un error al actualizar los datos del perfil.');
  },
});

const handleUpdateProfile = (payload: UpdateProfilePayload) => {
  updateProfileMutation.mutate(payload);
};

// Mutación: Cambiar contraseña
const changePasswordMutation = useMutation({
  mutationFn: (payload: ChangePasswordPayload) => changePasswordAction(payload),
  onSuccess: (result) => {
    toast.success(result.message || 'Contraseña actualizada con éxito.');
    activeTab.value = 'overview';
  },
  onError: () => {
    toast.error('No se pudo cambiar la contraseña. Verifica tus datos.');
  },
});

const isChangingPassword = computed(() => changePasswordMutation.isPending.value);

const handleChangePassword = (payload: ChangePasswordPayload) => {
  changePasswordMutation.mutate(payload);
};

const handleAvatarChangeRequest = () => {
  toast.info('Para actualizar tu foto de perfil, selecciona una imagen en formato JPG o PNG.');
};
</script>
