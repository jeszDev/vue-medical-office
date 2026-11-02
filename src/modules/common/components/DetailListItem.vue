<template>
  <div class="flex items-center justify-between gap-3 text-sm">
    <div class="flex items-center min-w-0">
      <StatusDot
        v-if="showDot"
        :color="dotColor"
        :size="dotSize"
        class="me-3"
      />
      <slot name="label">
        <span class="text-xs uppercase tracking-wider text-muted-foreground font-medium truncate">
          {{ label }}
        </span>
      </slot>
    </div>

    <div class="truncate text-right" :class="valueClasses">
      <slot>
        <span v-if="value !== undefined && value !== null && value !== ''" class="text-xs sm:text-sm font-medium text-foreground">
          {{ value }}
        </span>
        <span v-else class="text-xs opacity-50 italic">
          {{ emptyText }}
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusDot, { type StatusDotColor, type StatusDotSize } from './StatusDot.vue';

export interface DetailListItemProps {
  label?: string;
  value?: string | number | null;
  dotColor?: StatusDotColor;
  dotSize?: StatusDotSize;
  showDot?: boolean;
  emptyText?: string;
  valueClasses?: string;
}

withDefaults(defineProps<DetailListItemProps>(), {
  label: '',
  value: undefined,
  dotColor: 'primary',
  dotSize: 'md',
  showDot: true,
  emptyText: 'Sin registrar',
  valueClasses: '',
});
</script>
