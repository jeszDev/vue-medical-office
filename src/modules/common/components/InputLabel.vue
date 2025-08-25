<template>
  <div class="mb-1.5">
    <label
      class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >{{ label }} <span v-if="isRequired" class="text-danger font-bold">*</span></label
    >
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  isRequired?: boolean;
}

withDefaults(defineProps<Props>(), {
  isRequired: false,
});
</script>

<style scoped></style>
