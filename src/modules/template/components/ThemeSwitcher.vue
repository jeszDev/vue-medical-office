<template>
  <button @click="setThemeLayout('side-menu')" :class="{ active: themeLayout === 'side-menu' }">
    Modo Sidebar
  </button>
  <button @click="setThemeLayout('top-menu')" :class="{ active: themeLayout === 'top-menu' }">
    Modo Topbar
  </button>
</template>

<script setup lang="ts">
import useTheme from '@/composables/useTheme'

const { themeLayout, setThemeLayout } = useTheme()
</script>
