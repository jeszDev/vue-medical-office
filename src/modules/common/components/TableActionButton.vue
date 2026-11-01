<template>
  <RouterLink
    v-if="to"
    :to="to"
    custom
    v-slot="{ href, navigate }"
  >
    <a
      ref="elementRef"
      :href="href"
      :aria-label="tooltipText || label"
      class="flex items-center bg-transparent border-0 p-0 cursor-pointer select-none transition-colors text-xs sm:text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:underline"
      :class="[
        variantClasses,
        customClass,
      ]"
      @click="navigate"
    >
      <component
        :is="icon"
        v-if="icon"
        class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 shrink-0"
        :class="[responsiveText ? 'sm:mr-1' : (label && !iconOnly ? 'mr-1' : '')]"
      />
      <span
        v-if="label && !iconOnly"
        class="whitespace-nowrap"
        :class="{ 'hidden sm:inline': responsiveText }"
      >
        {{ label }}
      </span>
    </a>
  </RouterLink>

  <button
    v-else
    ref="elementRef"
    type="button"
    :disabled="disabled"
    :aria-label="tooltipText || label"
    class="flex items-center bg-transparent border-0 p-0 cursor-pointer select-none transition-colors text-xs sm:text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:underline"
    :class="[
      variantClasses,
      customClass,
    ]"
    @click="onClick"
  >
    <component
      :is="icon"
      v-if="icon"
      class="size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 shrink-0"
      :class="[responsiveText ? 'sm:mr-1' : (label && !iconOnly ? 'mr-1' : '')]"
    />
    <span
      v-if="label && !iconOnly"
      class="whitespace-nowrap"
      :class="{ 'hidden sm:inline': responsiveText }"
    >
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
  type Component,
} from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import type { Instance } from 'tippy.js';
import { createMidoneTooltip } from '@/modules/common/directives/tooltip.directive';

export type TableActionVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface Props {
  variant?: TableActionVariant;
  label?: string;
  tooltip?: string;
  icon?: Component;
  to?: string | RouteLocationRaw;
  title?: string;
  iconOnly?: boolean;
  responsiveText?: boolean;
  disabled?: boolean;
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  label: '',
  tooltip: '',
  icon: undefined,
  to: undefined,
  title: '',
  iconOnly: false,
  responsiveText: false,
  disabled: false,
  customClass: '',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const elementRef = ref<HTMLElement | null>(null);
let tippyInstance: Instance | null = null;

const tooltipText = computed(() => props.tooltip || props.title || '');

const tooltipColorClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return '[--color:var(--color-danger,var(--color-destructive,#ef4444))]';
    case 'success':
      return '[--color:var(--color-success,#10b981)]';
    case 'warning':
      return '[--color:var(--color-warning,#f59e0b)]';
    case 'primary':
      return '[--color:var(--color-primary)]';
    case 'neutral':
    default:
      return '[--color:#475569] dark:[--color:#94a3b8]';
  }
});

const setupTooltip = () => {
  if (tippyInstance) {
    tippyInstance.destroy();
    tippyInstance = null;
  }
  const text = tooltipText.value;
  const el = elementRef.value;
  if (el && text) {
    tippyInstance = createMidoneTooltip(el, {
      content: text,
      placement: 'top',
      color: tooltipColorClass.value,
    });
  }
};

onMounted(() => {
  nextTick(() => {
    setupTooltip();
  });
});

watch([tooltipText, tooltipColorClass], () => {
  setupTooltip();
});

onBeforeUnmount(() => {
  if (tippyInstance) {
    tippyInstance.destroy();
    tippyInstance = null;
  }
});

const onClick = (event: MouseEvent) => {
  if (tippyInstance) {
    tippyInstance.hide();
  }
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
};

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-primary hover:opacity-80';
    case 'success':
      return 'text-success hover:opacity-80';
    case 'warning':
      return 'text-amber-600 dark:text-amber-500 hover:opacity-80';
    case 'danger':
      return 'text-danger hover:opacity-80';
    case 'neutral':
    default:
      return 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100';
  }
});
</script>
