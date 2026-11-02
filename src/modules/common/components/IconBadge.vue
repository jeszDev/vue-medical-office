<template>
  <div
    class="bg-(--color)/20 border-(--color)/60 text-(--color) border flex items-center justify-center shrink-0"
    :class="[sizeClasses, roundedClasses]"
    :style="colorStyle"
  >
    <slot>
      <component :is="icon" v-if="icon" :class="iconSizeClasses" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';

export type IconBadgeColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'pending'
  | 'danger'
  | 'foreground'
  | 'secondary'
  | 'neutral';

export type IconBadgeSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconBadgeRounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface IconBadgeProps {
  color?: IconBadgeColor;
  size?: IconBadgeSize;
  rounded?: IconBadgeRounded;
  icon?: Component;
}

const props = withDefaults(defineProps<IconBadgeProps>(), {
  color: 'primary',
  size: 'md',
  rounded: 'lg',
  icon: undefined,
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-7';
    case 'lg':
      return 'size-10';
    case 'xl':
      return 'size-12';
    case 'md':
    default:
      return 'size-8';
  }
});

const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'size-3.5';
    case 'lg':
      return 'size-5';
    case 'xl':
      return 'size-6';
    case 'md':
    default:
      return 'size-4';
  }
});

const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-md';
    case 'xl':
      return 'rounded-xl';
    case 'full':
      return 'rounded-full';
    case 'lg':
    default:
      return 'rounded-lg';
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

<style scoped></style>
