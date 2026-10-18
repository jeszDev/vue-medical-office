<template>
  <!-- Sidebar - Profile user -->
  <div class="side-menu__account group/profile relative transition-[width] xl:mb-2 xl:mr-8">
    <div
      class="border-background/20 dark:border-foreground/[.09] flex cursor-pointer items-center justify-center border-t px-5 py-3.5 opacity-80 transition hover:opacity-100 xl:border-b"
    >
      <div
        class="border-background/20 dark:border-foreground/20 relative h-10 w-10 flex-none overflow-hidden rounded-full border-4 bg-primary/20 flex items-center justify-center text-primary font-bold"
      >
        <span v-if="authStore.user?.name">{{ authStore.user.name.charAt(0).toUpperCase() }}</span>
        <span v-else>U</span>
      </div>
      <div
        class="ms-3 flex w-full items-center overflow-hidden transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:ms-3 group-[.side-menu--collapsed.side-menu--on-hover]:w-full group-[.side-menu--collapsed.side-menu--on-hover]:opacity-100 xl:group-[.side-menu--collapsed]:ms-0 xl:group-[.side-menu--collapsed]:w-0 xl:group-[.side-menu--collapsed]:opacity-0"
      >
        <div class="w-28">
          <div class="w-full truncate font-medium">{{ authStore.user?.name || 'Usuario' }}</div>
          <div class="w-full truncate text-xs opacity-60 capitalize">
            {{ authStore.user?.roles?.[0] || 'Personal' }}
          </div>
        </div>

        <ArrowRightIcon
          class="size-4 text-current me-4 ms-auto"
          :stroke-width="1.5"
          fill-opacity="0.25"
        />
      </div>
    </div>
    <div class="hidden group-hover/profile:block">
      <div
        class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md text-foreground before:shadow-foreground/5 absolute bottom-0 left-[100%] z-50 ml-2 flex w-64 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl xl:bottom-auto xl:top-0"
      >
        <div class="flex flex-col gap-0.5">
          <div class="font-medium">{{ authStore.user?.name || 'Usuario' }}</div>
          <div class="mt-0.5 text-xs opacity-70 capitalize">
            {{ authStore.user?.email || 'Sin correo' }}
          </div>
        </div>
        <div class="bg-foreground/5 h-px"></div>
        <div class="flex flex-col gap-0.5">
          <RouterLink
            :to="{ name: 'patients.index' }"
            class="hover:bg-foreground/5 -mx-3 flex items-center gap-2.5 rounded-lg px-4 py-1.5 text-sm"
          >
            <UserIcon class="size-4 text-current" />
            Mi Cuenta
          </RouterLink>
        </div>
        <div class="bg-foreground/5 h-px"></div>
        <div class="flex flex-col gap-0.5">
          <button
            @click.prevent="onLogout"
            class="hover:bg-destructive/10 text-destructive -mx-3 flex items-center gap-2.5 rounded-lg px-4 py-1.5 text-sm w-full text-left transition-colors"
          >
            <LogOutIcon class="size-4 text-destructive" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>

  <SimpleBar
    class="w-full h-full z-20 pl-4 pr-4 xl:pr-14 overflow-y-auto overflow-x-hidden pb-3 [&:-webkit-scrollbar]:w-0 scroll-smooth [&_.simplebar-scrollbar]:before:!bg-background/70 xl:[&_.simplebar-track.simplebar-vertical]:mr-9 [-webkit-mask-image:_linear-gradient(to_top,_rgba(0,_0,_0,_0),_black_30px),_linear-gradient(to_bottom,_rgba(0,_0,_0,_0),_black_30px)] [-webkit-mask-composite:_destination-in]"
  >
    <ul class="scrollable" v-for="(items, groupName) in groupedMenuItems" :key="groupName">
      <li
        class="side-menu__group-label uppercase text-xs font-semibold tracking-wider opacity-60 mt-3 mb-1 px-3"
      >
        {{ groupName }}
      </li>
      <li v-for="item in items" :key="item.routeName">
        <RouterLink
          class="side-menu__link"
          exact-active-class="side-menu__link--active"
          :to="{ name: item.routeName, params: item.params }"
        >
          <component
            :is="getIconComponent(item.iconName)"
            class="size-4 stroke-[1.5] side-menu__link__icon"
          />
          <div class="side-menu__link__title">{{ item.title }}</div>
        </RouterLink>
      </li>
    </ul>
  </SimpleBar>
</template>

<script setup lang="ts">
import SimpleBar from 'simplebar-vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useNavigationMenu } from '../composables/useNavigationMenu';
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';
import {
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  Calendar as CalendarIcon,
  CalendarPlus as CalendarPlusIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  LayoutDashboard as DashboardIcon,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const { groupedMenuItems } = useNavigationMenu();

const onLogout = async () => {
  await authStore.logout();
};

const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'users':
      return UsersIcon;
    case 'user-plus':
      return UserPlusIcon;
    case 'calendar':
      return CalendarIcon;
    case 'calendar-plus':
      return CalendarPlusIcon;
    case 'shield':
      return ShieldIcon;
    default:
      return DashboardIcon;
  }
};
</script>

<style scoped></style>
