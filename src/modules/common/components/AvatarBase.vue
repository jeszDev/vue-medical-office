<template>
  <span
    class="border-(--color)/5 relative block flex-none overflow-hidden rounded-full shrink-0"
    :class="[sizeClasses, borderClasses]"
    :style="colorStyle"
  >
    <!-- Imagen del avatar (con bg-background si la imagen contiene transparencias) -->
    <img
      v-if="src"
      class="absolute top-0 size-full object-cover bg-background"
      :src="src"
      :alt="name || 'Avatar'"
    />

    <!-- Inicial de respaldo (duotono suave con bg-(--color)/15 y letra visible) -->
    <div
      v-else
      class="flex size-full items-center justify-center font-bold uppercase bg-(--color)/15 text-(--color)"
      :class="textClasses"
    >
      {{ initialLetter }}
    </div>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type AvatarColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'foreground'
  | 'current'
  | 'nav';

export interface AvatarBaseProps {
  src?: string | null;
  name?: string | null;
  fallbackText?: string;
  size?: AvatarSize;
  color?: AvatarColor;
}

const props = withDefaults(defineProps<AvatarBaseProps>(), {
  src: undefined,
  name: undefined,
  fallbackText: 'U',
  size: 'md',
  color: 'primary',
});

const initialLetter = computed(() => {
  if (props.name && props.name.trim().length > 0) {
    return props.name.trim().charAt(0).toUpperCase();
  }
  return props.fallbackText.toUpperCase();
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'size-8';
    case 'sm':
      return 'size-10';
    case 'md':
      return 'size-12';
    case 'lg':
      return 'size-16';
    case 'xl':
      return 'size-20 sm:size-24 lg:size-28';
    case '2xl':
      return 'size-24 sm:size-28 lg:size-32';
    case 'full':
      return 'size-full';
    default:
      return 'size-12';
  }
});

const borderClasses = computed(() => {
  const ringAlpha = props.color === 'nav' || props.color === 'current' ? '40' : '25';
  switch (props.size) {
    case 'xl':
    case '2xl':
      return `border-4 lg:border-5 ring-1 ring-(--color)/${ringAlpha}`;
    case 'xs':
      return `border-2 ring-1 ring-(--color)/${ringAlpha}`;
    default:
      return `border-3 ring-1 ring-(--color)/${ringAlpha}`;
  }
});

const textClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'text-xs';
    case 'sm':
      return 'text-xs font-semibold';
    case 'md':
      return 'text-sm font-bold';
    case 'lg':
      return 'text-lg font-bold';
    case 'xl':
      return 'text-2xl lg:text-3xl font-bold';
    case '2xl':
      return 'text-3xl lg:text-4xl font-bold';
    case 'full':
      return 'text-xs font-semibold';
    default:
      return 'text-sm font-bold';
  }
});

const colorStyle = computed(() => {
  if (props.color === 'current') {
    return { '--color': 'currentColor' };
  }
  if (props.color === 'nav') {
    return { '--color': 'var(--color-nav-foreground, currentColor)' };
  }
  if (props.color === 'foreground') {
    return { '--color': 'var(--color-foreground)' };
  }
  return {
    '--color': `var(--color-${props.color})`,
  };
});
</script>

<style scoped></style>
