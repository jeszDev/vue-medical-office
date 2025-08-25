// src/composables/useTheme.ts
import { ref } from 'vue'

export default function useTheme() {
  const themeLayout = ref<'side-menu' | 'top-menu'>('side-menu')

  const setThemeLayout = (layout: 'side-menu' | 'top-menu') => {
    // Remueve clases anteriores
    document.documentElement.classList.remove('side-menu', 'top-menu')
    // Añade la nueva clase
    document.documentElement.classList.add(layout)
    themeLayout.value = layout
  }

  return { themeLayout, setThemeLayout }
}
