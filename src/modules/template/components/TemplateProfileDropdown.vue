<template>
  <div ref="dropdownRef" class="relative flex h-9 items-center">
    <!-- Botón disparador con avatar e inicial del usuario -->
    <button
      type="button"
      class="group/profile relative flex size-9 flex-none items-center justify-center rounded-full border-2 border-(--color-nav-foreground)/30 bg-(--color-nav-foreground)/10 text-(--color-nav-foreground) transition-all hover:ring-2 hover:ring-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer overflow-hidden"
      :class="{ 'ring-2 ring-primary/40 bg-(--color-nav-foreground)/20': isOpen }"
      :title="authStore.user?.name || 'Mi Perfil'"
      aria-label="Menú de usuario"
      @click="toggleDropdown"
    >
      <img
        v-if="authStore.user?.avatar"
        :src="authStore.user.avatar"
        class="size-full object-cover"
        alt="Foto de perfil"
      />
      <span v-else class="text-xs font-bold uppercase">
        {{ userInitial }}
      </span>
    </button>

    <!-- Menú desplegable con información del usuario y opción de cerrar sesión -->
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
        class="box absolute right-0 top-full mt-2.5 z-50 flex w-64 flex-col rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-2xl backdrop-blur-md"
      >
        <!-- Encabezado con información del usuario -->
        <div class="flex items-center gap-3 pb-3 border-b border-foreground/10">
          <div
            class="flex size-10 flex-none items-center justify-center rounded-full bg-primary/15 text-primary font-bold text-sm border border-primary/25 overflow-hidden"
          >
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              class="size-full object-cover"
              alt="Foto de perfil"
            />
            <span v-else>{{ userInitial }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm text-foreground truncate" :title="userName">
              {{ userName }}
            </div>
            <div
              v-if="authStore.user?.email"
              class="text-xs text-foreground/60 truncate mt-0.5"
              :title="authStore.user.email"
            >
              {{ authStore.user.email }}
            </div>
            <div class="mt-1">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-foreground/10 text-foreground/70 capitalize"
              >
                {{ userRole }}
              </span>
            </div>
          </div>
        </div>

        <!-- Acciones del menú -->
        <div class="pt-2 flex flex-col gap-1">
          <button
            type="button"
            class="hover:bg-destructive/10 text-destructive flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold w-full text-left transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <LogOutIcon class="size-4 text-destructive" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { LogOut as LogOutIcon } from 'lucide-vue-next';

import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useLogoutModal } from '@/modules/auth/composables/useLogoutModal';

const authStore = useAuthStore();
const { open: openLogoutModal } = useLogoutModal();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

const userName = computed(() => authStore.user?.name || 'Usuario');

const userInitial = computed(() => {
  if (authStore.user?.name) {
    return authStore.user.name.trim().charAt(0).toUpperCase();
  }
  return 'U';
});

const userRole = computed(() => {
  return authStore.user?.roles?.[0] || 'Personal';
});

const handleLogout = () => {
  isOpen.value = false;
  openLogoutModal();
};
</script>
