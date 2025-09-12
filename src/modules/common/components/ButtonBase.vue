<template>
  <button
    type="button"
    :class="[baseClasses, colorClasses[color], isRounded ? 'rounded-full' : 'rounded-lg' ]"
  >
    <!-- Si viene un slot `icon`, lo usa -->
    <slot name="icon">
      <!-- si no hay slot, pero viene prop `icon`, lo renderiza -->
      <component :is="icon" v-if="icon" />
    </slot>
    {{ text }}
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  text: string
  icon?: Component
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'pending' | 'danger'
  isRounded: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
  rounded: false
})

const baseClasses =
  'cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 min-w-32'

const colorClasses = {
  primary: '[--color:var(--color-primary)]',
  secondary: '[--color:var(--color-foreground)]',
  success: '[--color:var(--color-success)]',
  warning: '[--color:var(--color-warning)]',
  pending: '[--color:var(--color-pending)]',
  danger: '[--color:var(--color-danger)]',
}
</script>

<!--
  formas de usarlo:

    <ButtonPrimaryRounded text="Editar" :icon="EditIcon" />

    <ButtonPrimaryRounded text="Editar">
      <template #icon>
      <EditIcon class="text-red-500" /> aquí puedes personalizar
    </template>
</ButtonPrimaryRounded>
-->
