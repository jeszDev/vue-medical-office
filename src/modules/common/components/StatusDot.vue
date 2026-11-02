<template>
  <span
    class="inline-block rounded-full border shrink-0 bg-(--color)/20 border-(--color)/60"
    :class="[sizeClasses, { 'animate-pulse': pulse }]"
    :style="colorStyle"
    aria-hidden="true"
  ></span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type StatusDotColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'pending'
  | 'danger'
  | 'foreground'
  | 'secondary'
  | 'neutral';

export type StatusDotSize = 'xs' | 'sm' | 'md' | 'lg';

export interface StatusDotProps {
  color?: StatusDotColor;
  size?: StatusDotSize;
  pulse?: boolean;
}

const props = withDefaults(defineProps<StatusDotProps>(), {
  color: 'primary',
  size: 'md',
  pulse: false,
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'size-1.5';
    case 'sm':
      return 'size-2';
    case 'lg':
      return 'size-3';
    case 'md':
    default:
      return 'size-2.5';
  }
});

const colorStyle = computed(() => {
  const c = props.color ?? 'primary';
  const colorVar =
    c === 'secondary' || c === 'neutral' || c === 'foreground'
      ? 'var(--color-foreground)'
      : `var(--color-${c})`;
  return {
    '--color': colorVar,
  };
});
</script>
