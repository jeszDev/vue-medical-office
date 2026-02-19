<template>
  <div :class="[baseClasses, sizeClasses]" :style="colorStyle">
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeColor = 'pending' | 'warning' | 'primary' | 'success' | 'danger';

const props = defineProps<{
  size?: BadgeSize;
  color?: BadgeColor;
  label?: string;
}>();

const baseClasses =
  'flex items-center rounded-full border text-xs bg-(--color)/20 border-(--color)/60 text-(--color)';

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-px';
    case 'lg':
      return 'px-5 py-2';
    default:
      return 'px-3 py-1'; // md por defecto
  }
});

const colorStyle = computed(() => ({
  '--color': `var(--color-${props.color ?? 'primary'})`,
}));
</script>
