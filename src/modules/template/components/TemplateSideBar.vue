<template>
  <!-- Sidebar - Profile user -->
  <div class="side-menu__account group/profile relative transition-[width] xl:mb-2 xl:mr-8">
    <div
      class="border-background/20 dark:border-foreground/[.09] flex cursor-pointer items-center justify-center border-t px-5 py-3.5 opacity-80 transition hover:opacity-100 xl:border-b"
    >
      <div
        class="border-background/20 dark:border-foreground/20 relative h-10 w-10 flex-none overflow-hidden rounded-full border-4"
      >
        <img
          class="absolute top-0 h-full w-full object-cover"
          src="@/assets/images/fakers/profile-11.jpg"
          alt="Midone - Admin Dashboard Template"
        />
      </div>
      <div
        class="ms-3 flex w-full items-center overflow-hidden transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:ms-3 group-[.side-menu--collapsed.side-menu--on-hover]:w-full group-[.side-menu--collapsed.side-menu--on-hover]:opacity-100 xl:group-[.side-menu--collapsed]:ms-0 xl:group-[.side-menu--collapsed]:w-0 xl:group-[.side-menu--collapsed]:opacity-0"
      >
        <div class="w-28">
          <div class="w-full truncate font-medium">{{ authStore.user.name }}</div>
          <div class="w-full truncate text-xs opacity-60">{{ authStore.user.roles[0] }}</div>
        </div>
        <!-- <i
                data-lucide="move-right"
                class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 me-4 ms-auto opacity-50"
              ></i> -->

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
          <div class="font-medium">Denzel Washington</div>
          <div class="mt-0.5 text-xs opacity-70">Backend Engineer</div>
        </div>
        <div class="bg-foreground/5 h-px"></div>
        <div class="flex flex-col gap-0.5">
          <a class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5" href="">
            <i
              data-lucide="users"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Profile
          </a>
          <a class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5" href="">
            <i
              data-lucide="shield-alert"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Add Account
          </a>
          <a class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5" href="">
            <i
              data-lucide="file-lock"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Reset Password
          </a>
          <a class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5" href="">
            <i
              data-lucide="file-question"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Help
          </a>
        </div>
        <div class="bg-foreground/5 h-px"></div>
        <div class="flex flex-col gap-0.5">
          <a class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5" href="">
            <i
              data-lucide="power"
              class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
            ></i>
            Logout
          </a>
        </div>
      </div>
    </div>
  </div>

  <SimpleBar
    class="w-full h-full z-20 pl-4 pr-4 xl:pr-14 overflow-y-auto overflow-x-hidden pb-3 [&:-webkit-scrollbar]:w-0 scroll-smooth [&_.simplebar-scrollbar]:before:!bg-background/70 xl:[&_.simplebar-track.simplebar-vertical]:mr-9 [-webkit-mask-image:_linear-gradient(to_top,_rgba(0,_0,_0,_0),_black_30px),_linear-gradient(to_bottom,_rgba(0,_0,_0,_0),_black_30px)] [-webkit-mask-composite:_destination-in]"
  >
    <ul class="scrollable">
      <li class="side-menu__group-label">APPS</li>
      <li>
        <RouterLink
          class="side-menu__link"
          exact-active-class="side-menu__link--active"
          :to="{ name: 'patients.index' }"
        >
          <i
            data-lucide="panel-bottom-close"
            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 side-menu__link__icon"
          ></i>
          <div class="side-menu__link__title">Listado de pacientes</div>
        </RouterLink>
      </li>
      <!-- <li>
        <RouterLink
          class="side-menu__link"
          :to="{ name: 'patients.appointments.index', params: { patientId: 4 } }"
        >
          <i
            data-lucide="panel-bottom-close"
            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 side-menu__link__icon"
          ></i>
          <div class="side-menu__link__title">Citas</div>
        </RouterLink>
      </li>
      <li>
        <RouterLink class="side-menu__link" :to="{ name: 'patients.create' }">
          <i
            data-lucide="panel-bottom-close"
            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 side-menu__link__icon"
          ></i>
          <div class="side-menu__link__title">Registro de paciente</div>
        </RouterLink>
      </li>
      <li>
        <RouterLink class="side-menu__link" :to="{ name: 'appointments.create' }">
          <i
            data-lucide="panel-bottom-close"
            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 side-menu__link__icon"
          ></i>
          <div class="side-menu__link__title">Crear cita</div>
        </RouterLink>
      </li> -->
      <li>
        <RouterLink
          class="side-menu__link"
          exact-active-class="side-menu__link--active"
          :to="{ name: 'appointments.index' }"
        >
          <i
            data-lucide="panel-bottom-close"
            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 side-menu__link__icon"
          ></i>
          <div class="side-menu__link__title">Calendario de citas</div>
        </RouterLink>
      </li>
    </ul>
  </SimpleBar>
</template>

<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next';
import SimpleBar from 'simplebar-vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import ArrowRightIcon from '@/icons/ArrowRightIcon.vue';

const authStore = useAuthStore();
</script>

<style scoped></style>
