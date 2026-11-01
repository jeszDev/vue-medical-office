<script setup lang="ts">
import { Search as SearchIcon, X as CloseIcon } from 'lucide-vue-next';

interface Props {
  modelValue?: string;
  placeholder?: string;
  title?: string;
  widthClass?: string;
  clearable?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar...',
  title: '',
  widthClass: 'w-56 sm:w-64',
  clearable: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
  (e: 'clear'): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};

const handleSearch = () => {
  emit('search');
};
</script>

<template>
  <div class="relative" :class="widthClass">
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :title="title || placeholder"
      :disabled="disabled"
      class="h-10 rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box w-full text-sm"
      :class="[clearable && modelValue ? 'pr-16' : 'pr-10']"
      @input="onInput"
      @keyup.enter="handleSearch"
    />

    <!-- Botón limpiar búsqueda cuando hay texto -->
    <button
      v-if="clearable && modelValue"
      type="button"
      class="absolute inset-y-0 right-8 my-auto flex items-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
      title="Limpiar búsqueda"
      @click="handleClear"
    >
      <CloseIcon class="size-4" />
    </button>

    <!-- Icono de búsqueda con especificación Midone -->
    <span
      class="absolute inset-y-0 right-0 my-auto mr-3 flex items-center text-foreground/70 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
      title="Buscar"
      @click="handleSearch"
    >
      <SearchIcon
        class="size-4 stroke-[1.5] stroke-current fill-current/25"
        fill="currentColor"
        fill-opacity="0.25"
      />
    </span>
  </div>
</template>
