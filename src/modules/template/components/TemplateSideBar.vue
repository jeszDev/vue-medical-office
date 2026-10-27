<template>
  <!-- Sidebar - Profile user (estático / puramente informativo) -->
  <div class="side-menu__account relative transition-[width] xl:mb-2 xl:mr-8 select-none">
    <div
      class="border-background/20 dark:border-foreground/[.09] flex items-center justify-center border-t px-5 py-3.5 opacity-90 xl:border-b"
    >
      <div
        class="border-background/20 dark:border-foreground/20 relative size-10 flex-none overflow-hidden rounded-full border-4 bg-primary/20 flex items-center justify-center text-primary font-bold"
      >
        <img
          v-if="authStore.user?.avatar"
          :src="authStore.user.avatar"
          class="size-full object-cover"
          alt="Avatar"
        />
        <span v-else>{{ userInitial }}</span>
      </div>
      <div
        class="ms-3 flex w-full items-center overflow-hidden transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:ms-3 group-[.side-menu--collapsed.side-menu--on-hover]:w-full group-[.side-menu--collapsed.side-menu--on-hover]:opacity-100 xl:group-[.side-menu--collapsed]:ms-0 xl:group-[.side-menu--collapsed]:w-0 xl:group-[.side-menu--collapsed]:opacity-0"
      >
        <div class="w-28">
          <div class="w-full truncate font-medium text-white/90">
            {{ authStore.user?.name || 'Usuario' }}
          </div>
          <div class="w-full truncate text-xs opacity-60 capitalize">
            {{ authStore.user?.roles?.[0] || 'Personal' }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <SimpleBar
    class="w-full h-full z-20 pl-4 pr-4 xl:pr-14 overflow-y-auto overflow-x-hidden pb-3 [&:-webkit-scrollbar]:w-0 scroll-smooth [&_.simplebar-scrollbar]:before:!bg-background/70 xl:[&_.simplebar-track.simplebar-vertical]:mr-9 [-webkit-mask-image:_linear-gradient(to_top,_rgba(0,_0,_0,_0),_black_30px),_linear-gradient(to_bottom,_rgba(0,_0,_0,_0),_black_30px)] [-webkit-mask-composite:_destination-in]"
  >
    <ul v-for="(items, groupName) in groupedMenuItems" :key="groupName" class="scrollable">
      <li
        class="side-menu__group-label uppercase text-xs font-semibold tracking-wider opacity-60 mt-3 mb-1 px-3"
      >
        {{ groupName }}
      </li>
      <li v-for="item in items" :key="item.routeName">
        <RouterLink
          class="side-menu__link cursor-pointer"
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
import { computed } from 'vue';
import SimpleBar from 'simplebar-vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useNavigationMenu } from '../composables/useNavigationMenu';
import {
  Users as UsersIcon,
  UserPlus as UserPlusIcon,
  Calendar as CalendarIcon,
  CalendarPlus as CalendarPlusIcon,
  CalendarClock as CalendarClockIcon,
  Shield as ShieldIcon,
  LayoutDashboard as DashboardIcon,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const { groupedMenuItems } = useNavigationMenu();

const userInitial = computed(() => {
  if (authStore.user?.name) {
    return authStore.user.name.trim().charAt(0).toUpperCase();
  }
  return 'U';
});

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
    case 'calendar-clock':
      return CalendarClockIcon;
    case 'shield':
      return ShieldIcon;
    default:
      return DashboardIcon;
  }
};
</script>

<style scoped></style>
