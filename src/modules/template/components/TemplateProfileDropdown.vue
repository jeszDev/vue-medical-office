<template>
  <div ref="dropdownRef" class="group/profile relative size-9 flex-none">
    <!-- Botón disparador con halo de doble anillo Midone -->
    <button
      type="button"
      class="size-full cursor-pointer focus:outline-none"
      :title="userName"
      aria-label="Menú de usuario"
      @click="toggleDropdown"
    >
      <AvatarBase
        :src="authStore.user?.avatar"
        :name="authStore.user?.nombre_completo || authStore.user?.name"
        fallback-text="U"
        size="full"
        color="nav"
        class="transition-transform hover:scale-105"
        :class="{ 'ring-(--color)/80': isOpen }"
      />
    </button>

    <!-- Menú desplegable con diseño de doble tarjeta flotante Midone -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isOpen"
        class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:shadow-foreground/5 absolute right-0 top-full z-50 -mr-0.5 mt-2 flex w-64 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl text-foreground"
      >
        <!-- Encabezado con información del usuario -->
        <div class="flex flex-col gap-0.5">
          <div class="font-medium text-foreground truncate" :title="userName">
            {{ userName }}
          </div>
          <div class="text-xs opacity-70 truncate capitalize flex items-center gap-1.5">
            <span>{{ userRoleLabel }}</span>
            <span
              v-if="authStore.isDualUser"
              class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold"
            >
              Dual
            </span>
          </div>
          <div
            v-if="authStore.user?.email"
            class="text-[11px] opacity-50 truncate mt-0.5"
            :title="authStore.user.email"
          >
            {{ authStore.user.email }}
          </div>
        </div>

        <!-- Conmutador de Rol Activo para usuarios bivalentes (Médico y Paciente) -->
        <div
          v-if="authStore.isDualUser"
          class="bg-foreground/5 rounded-xl p-2 flex flex-col gap-1.5 my-0.5"
        >
          <div class="text-[10px] font-bold text-foreground/60 uppercase tracking-wider px-0.5">
            Modo Operativo
          </div>
          <div
            class="grid grid-cols-2 gap-1 bg-background/60 p-0.5 rounded-lg border border-foreground/10"
          >
            <button
              type="button"
              class="text-xs py-1 px-1.5 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              :class="
                currentActiveRole === 'doctor'
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'text-foreground/75 hover:text-foreground hover:bg-foreground/5'
              "
              @click="handleRoleSwitch('doctor')"
            >
              <span>👨‍⚕️</span>
              <span>Médico</span>
            </button>
            <button
              type="button"
              class="text-xs py-1 px-1.5 rounded-md font-medium transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              :class="
                currentActiveRole === 'patient'
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'text-foreground/75 hover:text-foreground hover:bg-foreground/5'
              "
              @click="handleRoleSwitch('patient')"
            >
              <span>👤</span>
              <span>Paciente</span>
            </button>
          </div>
        </div>

        <div class="bg-foreground/5 h-px my-1"></div>

        <!-- Acciones del menú -->
        <div class="flex flex-col gap-0.5">
          <button
            type="button"
            class="hover:bg-foreground/5 text-foreground -mx-3 flex items-center gap-2.5 rounded-lg px-4 py-1.5 text-xs font-semibold w-[calc(100%+1.5rem)] text-left transition-colors cursor-pointer"
            @click="goToProfile"
          >
            <UserIcon class="size-4 stroke-[1.5] stroke-current fill-current/25" />
            <span>Mi Perfil</span>
          </button>

          <button
            type="button"
            class="hover:bg-destructive/10 text-destructive -mx-3 flex items-center gap-2.5 rounded-lg px-4 py-1.5 text-xs font-semibold w-[calc(100%+1.5rem)] text-left transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <LogOutIcon class="size-4 stroke-[1.5] stroke-current fill-current/25" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import { LogOut as LogOutIcon, User as UserIcon } from 'lucide-vue-next';
import { useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'vue-toastification';

import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { usePermissions } from '@/modules/auth/composables/usePermissions';
import { useLogoutModal } from '@/modules/auth/composables/useLogoutModal';
import AvatarBase from '@/modules/common/components/AvatarBase.vue';

const authStore = useAuthStore();
const { hasActiveRole } = usePermissions();
const { open: openLogoutModal } = useLogoutModal();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToast();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const userName = computed(() => {
  return (
    authStore.user?.nombre_completo ||
    authStore.user?.name ||
    authStore.user?.nombre ||
    'Usuario'
  );
});

const currentActiveRole = computed(() => {
  return authStore.activeRole?.toLowerCase().trim() || '';
});

const userRoleLabel = computed(() => {
  const role = currentActiveRole.value || authStore.user?.roles?.[0] || '';
  if (['doctor', 'medico', 'médico'].includes(role)) return 'Médico / Especialista';
  if (['patient', 'paciente'].includes(role)) return 'Paciente Titular';
  if (['admin', 'administrador'].includes(role)) return 'Administrador';
  if (['recepcionista', 'receptionist'].includes(role)) return 'Recepcionista';
  return role || 'Personal';
});

const handleRoleSwitch = async (newRole: string) => {
  if (currentActiveRole.value === newRole) return;
  authStore.switchActiveRole(newRole);
  queryClient.invalidateQueries();
  toast.info(
    newRole === 'doctor'
      ? 'Has cambiado al Modo Médico (Atención Clínica)'
      : 'Has cambiado al Modo Paciente (Portal de Salud)',
  );
  isOpen.value = false;

  // Redirigir inmediatamente si la sección actual no está permitida en el nuevo modo
  const currentRoute = router.currentRoute.value;
  if (currentRoute.meta?.roles && !hasActiveRole(currentRoute.meta.roles as string[])) {
    await router.replace({ name: 'appointments.index' });
  }
};

const handleLogout = () => {
  isOpen.value = false;
  openLogoutModal();
};

const goToProfile = () => {
  isOpen.value = false;
  router.push({ name: 'profile' });
};
</script>

<style scoped></style>
