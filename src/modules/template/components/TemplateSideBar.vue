<template>
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
import SimpleBar from 'simplebar-vue';
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

const { groupedMenuItems } = useNavigationMenu();

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
