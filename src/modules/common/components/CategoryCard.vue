<template>
  <div
    class="box relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 select-none [&.active]:text-(--color) [&.active]:before:bg-(--color)/5 [&.active]:before:border-(--color)/20 [&.active]:after:bg-(--color)/5 [&.active]:after:border-(--color)/20"
    :class="[
      { active },
      customClass,
    ]"
    :style="{ '--color': color }"
    role="button"
    :tabindex="tabindex"
    @click="onClick"
    @keydown.enter.prevent="onClick"
    @keydown.space.prevent="onClick"
  >
    <slot>
      <!-- Cabecera: Título e Icono opcional -->
      <div v-if="title || icon || $slots.header" class="flex items-center justify-between gap-2">
        <slot name="header">
          <div v-if="title" class="text-base font-medium truncate">
            {{ title }}
          </div>
          <div
            v-if="icon"
            class="flex size-7 items-center justify-center rounded-lg transition-colors shrink-0"
            :class="[
              active
                ? 'bg-primary/20 text-primary'
                : iconContainerClass || 'bg-foreground/5 text-foreground/70',
            ]"
          >
            <component :is="icon" class="size-4" />
          </div>
        </slot>
      </div>

      <!-- Cuerpo: Conteo principal -->
      <div v-if="count !== undefined || $slots.body" class="mt-2 flex items-baseline gap-1.5">
        <slot name="body">
          <span class="text-2xl font-bold tracking-tight">{{ count }}</span>
          <span v-if="countLabel" class="text-xs opacity-70">
            {{ countLabel }}
          </span>
        </slot>
      </div>

      <!-- Pie: Subtítulo o descripción -->
      <div v-if="subtitle || $slots.footer" class="mt-1 text-xs opacity-60 truncate">
        <slot name="footer">
          {{ subtitle }}
        </slot>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

interface Props {
  active?: boolean;
  title?: string;
  count?: number | string;
  countLabel?: string;
  subtitle?: string;
  icon?: Component;
  iconContainerClass?: string;
  color?: string;
  customClass?: string;
  tabindex?: number;
}

withDefaults(defineProps<Props>(), {
  active: false,
  title: '',
  count: undefined,
  countLabel: '',
  subtitle: '',
  icon: undefined,
  iconContainerClass: '',
  color: 'var(--color-primary)',
  customClass: '',
  tabindex: 0,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent | KeyboardEvent): void;
}>();

const onClick = (event: MouseEvent | KeyboardEvent) => {
  emit('click', event);
};
</script>
