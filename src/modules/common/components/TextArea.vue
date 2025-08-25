<template>
  <div>
    <textarea
      class="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      :placeholder="placeholder ?? ''"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      :disabled="isDisabled ? true : false"
      v-bind="attrs"
    >
    </textarea>
    <span v-if="error" class="text-danger">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

interface Props {
  modelValue?: string;
  error?: string;
  name: string;
  placeholder?: string;
  isDisabled?: boolean;
}

defineProps<Props>();
const attrs = useAttrs();
defineEmits(['update:modelValue', 'blur']);
</script>

<style scoped></style>
