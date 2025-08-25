<template>
  <div
    class="accordion relative mx-auto w-full divide-y overflow-hidden rounded-lg border border-none"
  >
    <div class="accordion-item group cursor-pointer">
      <div class="accordion-header">
        <button
          class="accordion-button flex w-full select-none items-center justify-between p-4 text-left font-medium group-hover:underline"
        >
          <span>
            <!-- Usa el slot si está definido, si no, usa la prop -->
            <slot name="title">{{ title }}</slot>
          </span>
          <span
            class="duration-200 ease-out group-[.accordion-item.show]:rotate-180 cursor-pointer"
          >
            <ChevronDown
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </span>
        </button>
      </div>
      <div class="accordion-collapse p-4 pt-0 opacity-70 hidden group-[.show]:block">
        <!-- Slot para contenido (si se usa), si no, muestra la prop `content` -->
        <slot name="content">{{ content }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  title?: string;
  content?: string;
}

withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
});
</script>
