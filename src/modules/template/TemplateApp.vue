<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'

import { onMounted } from 'vue';
import { ChartNoAxesColumn, ChevronLeft, X, Power as PowerIcon } from 'lucide-vue-next'; // Importa el icono que necesites

import { useMenuReactive } from './composables/useMenuReactive';

// import TemplateContent from './components/TemplateContent.vue';
import TemplateSideBar from './components/TemplateSideBar.vue';
import { useAuthStore } from '../auth/stores/auth.store';

const {
  initMenu,
  state,
  sideMenuRef,
  contentRef,
  contentScrollAreaRef,
  closeMobileMenuRef,
  toggleCompactMenu,
} = useMenuReactive();

const authStore = useAuthStore();

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
          <X class="[--color:currentColor] stroke-(--color) fill-(--color)/25 size-7 stroke-1" />
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
            <img class="size-5" src="@/assets/images/logo.svg" />
            <div
              class="ml-3.5 text-nowrap transition-opacity group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0"
            >
              <span class="text-base font-medium">Midone</span>
              <span class="text-base font-light">Icewall</span>
            </div>
          </a>
          <a
            class="toggle-compact-menu border-background/20 bg-background/10 dark:bg-foreground/[.02] dark:border-foreground/[.09] ml-auto hidden items-center justify-center rounded-md border py-0.5 pl-0.5 pr-1 opacity-70 transition-[opacity,transform] hover:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 2xl:flex"
            href=""
            @click.prevent="toggleCompactMenu"
          >
            <ChevronLeft class="size-4 text-current" :stroke-width="1.5" fill-opacity="0.25" />
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
                  <ChartNoAxesColumn
                    class="size-4 stroke-[1.5] stroke-(--color) fill-(--color)/25 rotate-90 [--color:var(--color-nav-foreground)]"
                  />
                </div>
                <ul
                  class="truncate gap-x-6 mr-auto hidden [--background-image-chevron:var(--background-image-chevron-light)] [--color-base:--alpha(var(--color-nav-foreground)/70%)] [--color-link:var(--color-nav-foreground)] xl:flex"
                >
                  <li
                    class="[&:not(:last-child)&gt;a]:text-(--color-link) text-(--color-base) before:bg-(image:--background-image-chevron) relative before:absolute before:inset-y-0 before:my-auto before:-ml-4 before:size-2 before:-rotate-90 before:bg-center before:bg-no-repeat before:opacity-70 first:before:hidden"
                  >
                    <a href="">Apps</a>
                  </li>
                  <li
                    class="[&:not(:last-child)&gt;a]:text-(--color-link) text-(--color-base) before:bg-(image:--background-image-chevron) relative before:absolute before:inset-y-0 before:my-auto before:-ml-4 before:size-2 before:-rotate-90 before:bg-center before:bg-no-repeat before:opacity-70 first:before:hidden"
                  >
                    <a href="">Dashboards</a>
                  </li>
                  <li
                    class="[&:not(:last-child)&gt;a]:text-(--color-link) text-(--color-base) before:bg-(image:--background-image-chevron) relative before:absolute before:inset-y-0 before:my-auto before:-ml-4 before:size-2 before:-rotate-90 before:bg-center before:bg-no-repeat before:opacity-70 first:before:hidden"
                  >
                    <a href="">Overview</a>
                  </li>
                </ul>
                <div
                  class="quick-search-toggle bg-(--color-nav-foreground)/10 border-(--color-nav-foreground)/30 text-(--color-nav-foreground) hover:ring-foreground/5 flex h-9 cursor-pointer items-center rounded-full border px-4 ring-1 ring-transparent ring-offset-2 ring-offset-transparent"
                >
                  <div class="flex items-center gap-3 opacity-70">
                    <i
                      data-lucide="search"
                      class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                    ></i>
                    ⌘K
                  </div>
                </div>
                <div class="group/notifications relative flex h-9 items-center">
                  <i
                    data-lucide="bell"
                    class="size-4 stroke-[1.5] stroke-(--color) fill-(--color)/25 [--color:var(--color-nav-foreground)]"
                  ></i>
                  <div class="hidden group-hover/notifications:block">
                    <div
                      class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:shadow-foreground/5 absolute right-0 top-0 z-50 -mr-0.5 -mt-0.5 flex w-96 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl"
                    >
                      <div class="flex place-content-between items-center">
                        <div class="font-medium">Notifications</div>
                        <a class="text-primary text-xs" href="">View More</a>
                      </div>
                      <div class="mt-1 flex flex-col gap-2.5">
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-center gap-3.5 rounded-2xl border border-transparent p-2"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-11"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-11.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="flex flex-col gap-1">
                            <div class="flex place-content-between items-center">
                              <div class="font-medium">{{ authStore.user.name }}</div>
                              <div class="text-xs opacity-70">05:09 AM</div>
                            </div>
                            <div class="line-clamp-2 text-xs opacity-70">
                              There are many variations of passages of Lorem Ipsum available, but
                              the majority have suffered alteration in some form, by injected
                              humour, or randomi
                            </div>
                          </div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-center gap-3.5 rounded-2xl border border-transparent p-2"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-11"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-3.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="flex flex-col gap-1">
                            <div class="flex place-content-between items-center">
                              <div class="font-medium">Arnold Schwarzenegger</div>
                              <div class="text-xs opacity-70">01:10 PM</div>
                            </div>
                            <div class="line-clamp-2 text-xs opacity-70">
                              It is a long established fact that a reader will be distracted by the
                              readable content of a page when looking at its layout. The point of
                              using Lorem
                            </div>
                          </div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-center gap-3.5 rounded-2xl border border-transparent p-2"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-11"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-4.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="flex flex-col gap-1">
                            <div class="flex place-content-between items-center">
                              <div class="font-medium">Morgan Freeman</div>
                              <div class="text-xs opacity-70">01:10 PM</div>
                            </div>
                            <div class="line-clamp-2 text-xs opacity-70">
                              It is a long established fact that a reader will be distracted by the
                              readable content of a page when looking at its layout. The point of
                              using Lorem
                            </div>
                          </div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-center gap-3.5 rounded-2xl border border-transparent p-2"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-11"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-9.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="flex flex-col gap-1">
                            <div class="flex place-content-between items-center">
                              <div class="font-medium">Denzel Washington</div>
                              <div class="text-xs opacity-70">01:10 PM</div>
                            </div>
                            <div class="line-clamp-2 text-xs opacity-70">
                              There are many variations of passages of Lorem Ipsum available, but
                              the majority have suffered alteration in some form, by injected
                              humour, or randomi
                            </div>
                          </div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-2 flex items-center gap-3.5 rounded-2xl border border-transparent p-2"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-11"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-12.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="flex flex-col gap-1">
                            <div class="flex place-content-between items-center">
                              <div class="font-medium">Angelina Jolie</div>
                              <div class="text-xs opacity-70">01:10 PM</div>
                            </div>
                            <div class="line-clamp-2 text-xs opacity-70">
                              Contrary to popular belief, Lorem Ipsum is not simply random text. It
                              has roots in a piece of classical Latin literature from 45 BC, making
                              it over 20
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="group/profile relative size-9 flex-none">
                  <span
                    data-content=""
                    class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/40 size-full [--color:var(--color-nav-foreground)]"
                  >
                    <img
                      class="absolute top-0 size-full object-cover"
                      src="@/assets/images/fakers/profile-13.jpg"
                      alt="Midone - Tailwind Admin Dashboard Template"
                    />
                  </span>
                  <div class="hidden group-hover/profile:block">
                    <div
                      class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:shadow-foreground/5 absolute right-0 top-0 z-50 -mr-0.5 -mt-0.5 flex w-64 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl"
                    >
                      <div class="flex flex-col gap-0.5">
                        <div class="font-medium">{{ authStore.user.name }}</div>
                        <div class="mt-0.5 text-xs opacity-70">Frontend Engineer</div>
                      </div>
                      <div class="bg-foreground/5 h-px"></div>
                      <div class="flex flex-col gap-0.5">
                        <a
                          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
                          href=""
                        >
                          <i
                            data-lucide="users"
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          ></i>
                          Profile
                        </a>
                        <a
                          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
                          href=""
                        >
                          <i
                            data-lucide="shield-alert"
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          ></i>
                          Add Account
                        </a>
                        <a
                          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
                          href=""
                        >
                          <i
                            data-lucide="file-lock"
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          ></i>
                          Reset Password
                        </a>
                        <a
                          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
                          href=""
                        >
                          <i
                            data-lucide="file-question"
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          ></i>
                          Help
                        </a>
                      </div>
                      <div class="bg-foreground/5 h-px"></div>
                      <div class="flex flex-col gap-0.5">
                        <a
                          class="hover:bg-foreground/5 -mx-3 flex gap-2.5 rounded-lg px-4 py-1.5"
                          data-tw-toggle="modal"
                          data-tw-target="#delete-dialog"
                          href="#"
                        >
                          <!-- <i
                            data-lucide="power"
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          ></i> -->
                          <PowerIcon
                            class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25"
                          />
                          Logout
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- BEGIN: Quick Search Modal -->
              <div
                data-tw-backdrop=""
                class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
                id="quick-search-modal"
              >
                <div
                  class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05] sm:max-w-2xl"
                >
                  <div class="-mx-5 -mt-5">
                    <div class="relative border-b border-dashed">
                      <i
                        data-lucide="search"
                        class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 absolute inset-y-0 my-auto ml-4"
                      ></i>
                      <input
                        class="rounded-md border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full pl-12 bg-transparent border-none pr-19 h-14 focus:ring-offset-transparent focus-visible:ring-transparent"
                        type="text"
                        placeholder="Quick search..."
                      />
                      <div
                        class="absolute inset-y-0 right-0 flex items-center h-6 px-2 my-auto mr-4 border rounded-lg"
                      >
                        esc
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 px-5 mt-4">
                      <a
                        class="hover:bg-foreground/5 flex items-center gap-x-1.5 rounded-full border px-3 py-0.5"
                        href=""
                      >
                        <i
                          data-lucide="users2"
                          class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                        ></i>
                        Users
                      </a>
                      <a
                        class="hover:bg-foreground/5 flex items-center gap-x-1.5 rounded-full border px-3 py-0.5"
                        href=""
                      >
                        <i
                          data-lucide="building2"
                          class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                        ></i>
                        Departments
                      </a>
                      <a
                        class="hover:bg-foreground/5 flex items-center gap-x-1.5 rounded-full border px-3 py-0.5"
                        href=""
                      >
                        <i
                          data-lucide="kanban-square"
                          class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                        ></i>
                        Products
                      </a>
                      <a
                        class="hover:bg-foreground/5 flex items-center gap-x-1.5 rounded-full border px-3 py-0.5"
                        href=""
                      >
                        <i
                          data-lucide="mail-check"
                          class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                        ></i>
                        Mails
                      </a>
                    </div>
                    <div class="px-5 py-4">
                      <div class="flex items-center">
                        <div class="text-xs uppercase opacity-70">Users</div>
                        <a class="ml-auto text-xs opacity-70" href=""> See All </a>
                      </div>
                      <div class="mt-3.5 flex flex-col gap-1">
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-9.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">Johnny Depp</div>
                          <div class="hidden opacity-70 sm:block">DevOps Engineer</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-10.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">Brad Pitt</div>
                          <div class="hidden opacity-70 sm:block">Software Engineer</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/profile-1.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">Al Pacino</div>
                          <div class="hidden opacity-70 sm:block">Backend Engineer</div>
                        </a>
                      </div>
                    </div>
                    <div class="px-5 py-4 border-t border-dashed">
                      <div class="flex items-center">
                        <div class="text-xs uppercase opacity-70">Departments</div>
                        <a class="ml-auto text-xs opacity-70" href=""> See All </a>
                      </div>
                      <div class="mt-3.5 flex flex-col gap-1">
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <div
                            class="flex items-center justify-center overflow-hidden border rounded-lg border-primary/10 bg-primary/10 text-primary size-8"
                          >
                            <i
                              data-lucide="store"
                              class="size-4 [--color:currentColor] stroke-(--color) fill-(--color)/25 stroke-1"
                            ></i>
                          </div>
                          <div class="font-medium truncate">Oppo Find X2 Pro</div>
                          <div class="hidden opacity-70 sm:block">Smartphone & Tablet</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <div
                            class="flex items-center justify-center overflow-hidden border rounded-lg border-primary/10 bg-primary/10 text-primary size-8"
                          >
                            <i
                              data-lucide="store"
                              class="size-4 [--color:currentColor] stroke-(--color) fill-(--color)/25 stroke-1"
                            ></i>
                          </div>
                          <div class="font-medium truncate">Apple MacBook Pro 13</div>
                          <div class="hidden opacity-70 sm:block">PC & Laptop</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <div
                            class="flex items-center justify-center overflow-hidden border rounded-lg border-primary/10 bg-primary/10 text-primary size-8"
                          >
                            <i
                              data-lucide="store"
                              class="size-4 [--color:currentColor] stroke-(--color) fill-(--color)/25 stroke-1"
                            ></i>
                          </div>
                          <div class="font-medium truncate">Samsung Q90 QLED TV</div>
                          <div class="hidden opacity-70 sm:block">Electronic</div>
                        </a>
                      </div>
                    </div>
                    <div class="px-5 py-4 border-t border-dashed">
                      <div class="flex items-center">
                        <div class="text-xs uppercase opacity-70">Products</div>
                        <a class="ml-auto text-xs opacity-70" href=""> See All </a>
                      </div>
                      <div class="mt-3.5 flex flex-col gap-1">
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/preview-14.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">French Fries</div>
                          <div class="hidden opacity-70 sm:block">Sport & Outdoor</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/preview-2.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">Curry Penne and Cheese</div>
                          <div class="hidden opacity-70 sm:block">Sport & Outdoor</div>
                        </a>
                        <a
                          class="hover:border-foreground/10 hover:bg-foreground/5 -mx-1 flex items-center gap-2.5 rounded-xl border border-transparent p-1"
                          href=""
                        >
                          <span
                            data-content=""
                            class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] size-8"
                          >
                            <img
                              class="absolute top-0 size-full object-cover"
                              src="@/assets/images/fakers/preview-13.jpg"
                              alt="Midone - Tailwind Admin Dashboard Template"
                            />
                          </span>
                          <div class="font-medium truncate">Ultimate Burger</div>
                          <div class="hidden opacity-70 sm:block">Electronic</div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- END: Quick Search Modal -->
            </div>
            <RouterView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
