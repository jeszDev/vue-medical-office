<template>
  <div
    :class="[
      baseClasses,
      sizeClasses,
      roundedClasses,
      { 'cursor-pointer': interactive },
    ]"
    :style="colorStyle"
  >
    <slot name="dot">
      <span
        v-if="dot"
        class="size-1.5 rounded-full bg-current shrink-0 mr-1.5"
      ></span>
    </slot>
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type BadgeColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'pending'
  | 'danger'
  | 'foreground'
  | 'secondary'
  | 'neutral';
export type BadgeRounded = 'full' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PillBadgeProps {
  size?: BadgeSize;
  color?: BadgeColor;
  rounded?: BadgeRounded;
  dot?: boolean;
  label?: string | number;
  interactive?: boolean;
}

const props = withDefaults(defineProps<PillBadgeProps>(), {
  size: 'sm',
  color: 'primary',
  rounded: 'full',
  dot: false,
  label: undefined,
  interactive: false,
});

const baseClasses =
  'inline-flex items-center w-fit border text-xs font-medium bg-(--color)/20 border-(--color)/60 text-(--color)';

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-2 py-px text-xs';
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'lg':
      return 'px-4 py-1.5 text-xs';
    case 'xl':
      return 'px-5 py-2 text-xs';
    case '2xl':
      return 'px-6 py-2.5 text-xs';
    case 'md':
    default:
      return 'px-3 py-1 text-xs';
  }
});

const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'xs':
      return 'rounded-xs';
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-lg';
    case 'xl':
      return 'rounded-xl';
    case 'full':
    default:
      return 'rounded-full';
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
