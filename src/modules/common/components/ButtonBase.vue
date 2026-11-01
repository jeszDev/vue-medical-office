<template>
  <button
    :type="type"
    :disabled="computedIsDisabled"
    :aria-busy="computedIsLoading"
    :class="[
      coreClasses,
      colorVariables[color],
      variantClasses[variant],
      sizeClasses,
      minWidthClass,
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Spinner de carga (reemplaza al icono izquierdo si está en estado loading) -->
    <slot name="loading" v-if="computedIsLoading">
      <div
        class="loader-spinner ![--color:currentColor] shrink-0"
        aria-hidden="true"
      ></div>
    </slot>

    <!-- Slot o componente de Icono (Izquierda) -->
    <slot name="icon" v-else-if="iconPlacement === 'left'">
      <component :is="icon" v-if="icon" />
    </slot>

    <!-- Contenido / Texto del botón -->
    <span v-if="computedIsLoading && loadingText" class="truncate">
      {{ loadingText }}
    </span>
    <span v-else-if="text || $slots.default" class="truncate">
      <slot>{{ text }}</slot>
    </span>

    <!-- Slot o componente de Icono (Derecha) -->
    <slot name="icon-right" v-if="!computedIsLoading && iconPlacement === 'right'">
      <component :is="icon" v-if="icon" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed, useSlots, type Component } from 'vue';

export type ButtonVariant = 'soft' | 'filled' | 'outline';
export type ButtonColor = 'primary' | 'secondary' | 'success' | 'warning' | 'pending' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonBaseProps {
  text?: string;
  icon?: Component;
  iconPlacement?: 'left' | 'right';
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  isRounded?: boolean;
  rounded?: boolean; // alias retrocompatible
  disabled?: boolean;
  loading?: boolean;
  isLoading?: boolean; // alias retrocompatible
  loadingText?: string;
  minWidth?: boolean;
}

const props = withDefaults(defineProps<ButtonBaseProps>(), {
  text: undefined,
  icon: undefined,
  iconPlacement: 'left',
  color: 'primary',
  variant: 'soft',
  size: 'md',
  type: 'button',
  isRounded: false,
  rounded: false,
  disabled: false,
  loading: false,
  isLoading: false,
  loadingText: undefined,
  minWidth: true,
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const slots = useSlots();

const computedIsRounded = computed(() => props.isRounded || props.rounded);
const computedIsLoading = computed(() => props.loading || props.isLoading);
const computedIsDisabled = computed(() => props.disabled || computedIsLoading.value);

const coreClasses =
  'cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

const colorVariables: Record<ButtonColor, string> = {
  primary: '[--color:var(--color-primary)]',
  secondary: '[--color:var(--color-foreground)]',
  success: '[--color:var(--color-success)]',
  warning: '[--color:var(--color-warning)]',
  pending: '[--color:var(--color-pending)]',
  danger: '[--color:var(--color-danger)]',
};

const variantClasses: Record<ButtonVariant, string> = {
  soft: 'bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5',
  filled: 'bg-(--color) border-(--color) text-white hover:bg-(--color)/90',
  outline: 'bg-background border-(--color)/20 text-(--color) hover:bg-(--color)/5',
};

const sizeClasses = computed(() => {
  const radius = computedIsRounded.value ? 'rounded-full' : props.size === 'md' ? 'rounded-lg' : 'rounded-md';

  switch (props.size) {
    case 'sm':
      return `h-9 px-3 text-sm ${radius}`;
    case 'lg':
      return `h-11 px-8 text-sm ${radius}`;
    case 'md':
    default:
      return `h-10 px-4 py-2 text-sm ${radius}`;
  }
});

const minWidthClass = computed(() => {
  if (!props.minWidth) return '';
  // Si no hay texto y no hay slot por defecto, se trata de un botón de solo icono
  if (!props.text && !slots.default) return '';
  return 'min-w-32';
});
</script>
