<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from 'vue';
// import { ChartNoAxesColumn, ChevronLeft, X, Power as PowerIcon } from 'lucide-vue-next'; // Importa el icono que necesites

import { useMenuReactive } from './composables/useMenuReactive';

// import TemplateContent from './components/TemplateContent.vue';
import TemplateSideBar from './components/TemplateSideBar.vue';
import TemplateBreadcrumb from './components/TemplateBreadcrumb.vue';
import TemplateNotificationDropdown from './components/TemplateNotificationDropdown.vue';
import TemplateProfileDropdown from './components/TemplateProfileDropdown.vue';
import BurguerMenuIcon from '@/icons/BurguerMenuIcon.vue';
import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
import AuthLogoutModalQuestion from '../auth/components/AuthLogoutModalQuestion.vue';

const {
  initMenu,
  state,
  sideMenuRef,
  contentRef,
  contentScrollAreaRef,
  closeMobileMenuRef,
  toggleCompactMenu,
} = useMenuReactive();

onMounted(() => {
  // Page loader animation
  setTimeout(() => {
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
      pageLoader.classList.add('opacity-0');
      setTimeout(() => {
        pageLoader.classList.add('hidden');
      }, 1000);
    }

    initMenu();
  }, 1000);
});
</script>

<template>
  <div
    class="page-loader bg-background fixed inset-0 z-[100] flex items-center justify-center transition-opacity"
  >
    <div class="loader-spinner !w-14"></div>
  </div>
  <div
    class="icewall min-h-screen dark:bg-background before:bg-primary dark:before:bg-foreground/[.01] before:fixed before:inset-0 before:bg-noise after:bg-accent after:bg-contain after:fixed after:inset-0 after:blur-xl dark:after:opacity-20"
  >
    <div
      ref="sideMenuRef"
      class="side-menu text-background dark:text-foreground xl:ml-0 transition-[margin] duration-200 fixed top-0 left-0 z-50 group before:content-[''] before:fixed before:inset-0 before:bg-black/80 dark:before:bg-foreground/5 before:backdrop-blur before:xl:hidden after:content-[''] after:absolute after:inset-0 after:bg-primary after:xl:hidden dark:after:bg-background after:bg-noise [&.side-menu--mobile-menu-open]:ml-0 [&.side-menu--mobile-menu-open]:before:block -ml-[300px] before:hidden"
    >
      <div
        ref="closeMobileMenuRef"
        class="close-mobile-menu fixed ml-[300px] xl:hidden z-50 cursor-pointer [&.close-mobile-menu--mobile-menu-open]:block hidden"
        @click.prevent="state.mobileMenuOpen = false"
      >
        <div class="ml-5 mt-5 flex size-10 items-center justify-center">
          <!-- <X class="[--color:currentColor] stroke-(--color) fill-(--color)/25 size-7 stroke-1" /> -->
        </div>
      </div>
      <div
        class="side-menu__content z-20 relative w-[300px] duration-200 transition-[width] group-[.side-menu--collapsed]:xl:w-[150px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[300px] h-screen flex flex-col-reverse xl:flex-col before:absolute before:inset-y-0 before:w-px before:bg-background/20 dark:before:bg-foreground/10 before:right-0 before:mr-8 before:hidden xl:before:block"
        @mouseover="state.compactMenuOnHover = true"
        @mouseleave="state.compactMenuOnHover = false"
      >
        <!-- Sidebar - App name -->
        <div
          class="relative z-10 hidden h-[70px] w-[300px] flex-none items-center overflow-hidden pl-5 pr-14 duration-200 xl:flex group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[300px] group-[.side-menu--collapsed]:xl:w-[150px]"
        >
          <a
            class="flex items-center transition-[margin] duration-200 xl:ml-1 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-1 group-[.side-menu--collapsed]:xl:ml-7"
            href=""
          >
            <img class="size-5" src="@/assets/images/logo-heart.svg" />
            <div
              class="ml-3.5 text-nowrap transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0"
            >
              <span class="text-xl font-latidos text-white/80">Latidos</span>
              <!-- <span class="text-base font-light opacity-80">Pro</span> -->
            </div>
          </a>
          <a
            class="toggle-compact-menu border-background/20 bg-background/10 dark:bg-foreground/[.02] dark:border-foreground/[.09] ml-auto hidden items-center justify-center rounded-md border py-0.5 pl-0.5 pr-1 opacity-70 transition-[opacity,transform] hover:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 2xl:flex"
            href=""
            @click.prevent="toggleCompactMenu"
          >
            <ArrowLeftIcon class="size-4 text-current" :stroke-width="1.5" fill-opacity="0.25" />
          </a>
        </div>

        <TemplateSideBar />
      </div>
    </div>
    <div
      ref="contentRef"
      class="content h-screen transition-[margin,width] duration-200 pt-26 pb-8 px-7 z-10 relative group before:absolute before:bottom-4 before:top-22 before:-ml-px before:right-4 before:opacity-[.07] before:left-4 xl:before:left-0 before:bg-foreground before:rounded-4xl after:absolute after:bottom-4 after:top-22 after:-ml-px after:right-4 after:left-4 xl:after:left-0 after:bg-[color-mix(in_oklch,_var(--color-background),_var(--color-foreground)_2%)] after:rounded-4xl after:border after:border-foreground/[.15] dark:after:opacity-[.59] xl:ml-[300px] [&.content--compact]:xl:ml-[150px]"
    >
      <div
        class="relative h-full after:absolute after:bottom-4 after:mx-2 after:-mt-8 after:top-0 after:right-4 after:left-4 xl:after:left-0 after:bg-background/30 after:rounded-4xl after:border after:border-foreground/[.15] dark:after:opacity-[.59] [--color-nav-foreground:var(--color-background)] dark:[--color-nav-foreground:var(--color-foreground)]"
      >
        <div class="h-full overflow-x-hidden">
          <div
            ref="contentScrollAreaRef"
            class="content__scroll-area relative z-20 -mr-7 h-full overflow-y-auto pl-4 pr-11 transition-[margin] duration-200 xl:pl-0"
          >
            <div
              class="group fixed inset-x-0 top-0 z-20 px-6 transition-[margin,width] duration-200 xl:ml-[300px] xl:mr-5 group-[.content--compact]:xl:ml-[150px]"
            >
              <div class="flex h-[70px] items-center gap-5">
                <div
                  class="open-mobile-menu bg-(--color-nav-foreground)/10 border-(--color-nav-foreground)/30 mr-auto flex size-9 cursor-pointer items-center justify-center rounded-xl border xl:hidden"
                  @click.prevent="state.mobileMenuOpen = true"
                >
                  <!-- <ChartNoAxesColumn
                    class="size-4 stroke-[1.5] stroke-(--color) fill-(--color)/25 rotate-90 [--color:var(--color-nav-foreground)]"
                  /> -->
                  <BurguerMenuIcon />
                </div>
                <TemplateBreadcrumb />
                <TemplateNotificationDropdown />
                <TemplateProfileDropdown />
              </div>
            </div>
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>

  <AuthLogoutModalQuestion />
</template>

<style scoped></style>
