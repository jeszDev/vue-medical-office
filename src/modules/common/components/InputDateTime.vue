<template>
  <input
    type="datetime-local"
    class="h-10 w-full rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :name="name"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @blur="$emit('blur')"
    v-bind="attrs"
  />
  <span v-if="error" class="text-danger">{{ error }}</span>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

interface Props {
  modelValue?: string;
  error?: string;
  name: string;
}

defineProps<Props>();
const attrs = useAttrs();
defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped></style>
