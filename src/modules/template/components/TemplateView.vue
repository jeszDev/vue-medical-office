<template>
  <div class="relative">
    <div class="mt-8 flex items-center">
      <slot name="header">
        <h2 class="mr-auto text-lg font-medium">{{ title }}</h2>
      </slot>
    </div>

    <div class="mt-10 border-t pt-10 px-5 sm:px-20">
      <slot name="main"></slot>
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
