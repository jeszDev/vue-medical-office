// useAppState.ts
import { reactive, ref, watch } from 'vue'

// 1. Definimos la interfaz para el estado de la aplicación
interface MenuState {
  compactMenu: boolean
  compactMenuOnHover: boolean
  mobileMenuOpen: boolean
}

export function useMenuReactive() {
  const state = reactive<MenuState>({
    compactMenu: false,
    compactMenuOnHover: false,
    mobileMenuOpen: false,
  })

  const sideMenuRef = ref<HTMLElement | null>(null);
  const contentRef = ref<HTMLElement | null>(null);
  const contentScrollAreaRef = ref<HTMLElement | null>(null);
  const closeMobileMenuRef = ref<HTMLElement | null>(null);

  const initMenu = () => {
    const compactMenu = localStorage.getItem('compactMenu')
    if (compactMenu === null || compactMenu === 'false') {
      state.compactMenu = false
    }

    // Manejar resize del window
    window.addEventListener('resize', handleResize)
  }

  // Manejador de resize
  const handleResize = () => {
    if (window.innerWidth <= 1600) {
      localStorage.setItem('compactMenu', 'true')
      state.compactMenu = true
    }
  }

  const toggleCompactMenu = () => {
    state.compactMenu = !state.compactMenu
    localStorage.setItem('compactMenu', state.compactMenu.toString())
  }

  watch(
    () => [state.compactMenu, state.compactMenuOnHover, state.mobileMenuOpen],
    () => {

      // Side menu
      if (state.compactMenu) {
        sideMenuRef.value?.classList.add("side-menu--collapsed");
      } else {
        sideMenuRef.value?.classList.remove("side-menu--collapsed");
      }

      // Side menu hover
      if (state.compactMenuOnHover) {
        sideMenuRef.value?.classList.add("side-menu--on-hover");
      } else {
        sideMenuRef.value?.classList.remove("side-menu--on-hover");
      }

      // Mobile menu
      if (state.mobileMenuOpen) {
          sideMenuRef.value?.classList.add("side-menu--mobile-menu-open");
          closeMobileMenuRef.value?.classList.add("close-mobile-menu--mobile-menu-open");
          // $(".top-menu").first().addClass("top-menu--mobile-menu-open");
      } else {
          sideMenuRef.value?.classList.remove("side-menu--mobile-menu-open");
          closeMobileMenuRef.value?.classList.remove("close-mobile-menu--mobile-menu-open");
          // $(".top-menu")
          //     .first()
          //     .removeClass("top-menu--mobile-menu-open");
      }

      // content
      if (state.compactMenu && !state.compactMenuOnHover) {
        contentRef.value?.classList.add("content--compact");
      } else {
        contentRef.value?.classList.remove("content--compact");
      }

      // Content scroll area
      if (
          state.compactMenu &&
          state.compactMenuOnHover &&
          !state.mobileMenuOpen
      ) {
          contentScrollAreaRef.value?.classList.add("-ml-[150px]");
      } else {
          contentScrollAreaRef.value?.classList.remove("-ml-[150px]");
      }
    },
    { immediate: true }
  );

  return {
    state,
    sideMenuRef,
    contentRef,
    contentScrollAreaRef,
    closeMobileMenuRef,
    initMenu,
    toggleCompactMenu,
  }
}
