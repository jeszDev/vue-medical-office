<template>
  <div class="relative">
    <div
      v-if="title || $slots.header || $slots.actions"
      class="mt-8 flex flex-col items-center sm:flex-row"
    >
      <slot name="header">
        <h2 class="mr-auto text-lg font-medium">{{ title }}</h2>
      </slot>
      <div v-if="$slots.actions" class="mt-4 flex w-full sm:mt-0 sm:w-auto items-center gap-2">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="mt-5">
      <slot name="main"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

<style scoped></style>
