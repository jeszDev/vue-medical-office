<template>
  <div ref="containerRef" class="relative w-full">
    <!-- Trigger / Input -->
    <div class="relative flex items-center">
      <input
        ref="inputRef"
        type="text"
        :name="name"
        :disabled="disabled"
        :placeholder="placeholder"
        :value="displayValue"
        class="h-10 w-full rounded-md border bg-background pl-3 pr-16 text-sm transition-colors placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="[
          error
            ? 'border-danger focus-visible:ring-danger'
            : 'border-input focus-visible:ring-primary',
          disabled ? 'bg-muted' : '',
        ]"
        autocomplete="off"
        @focus="onFocus"
        @input="onInput"
        @keydown.down.prevent="onKeyDown"
        @keydown.up.prevent="onKeyUp"
        @keydown.enter.prevent="onKeyEnter"
        @keydown.esc="closeDropdown"
      />

      <!-- Action buttons / icons -->
      <div class="absolute right-2.5 flex items-center gap-1 text-foreground/50">
        <button
          v-if="modelValue && !disabled"
          type="button"
          class="p-1 rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors cursor-pointer"
          title="Limpiar selección"
          @click.stop="clearSelection"
        >
          <X class="size-4" />
        </button>
        <button
          type="button"
          tabindex="-1"
          class="p-1 rounded-full hover:bg-foreground/10 hover:text-foreground transition-colors cursor-pointer"
          @click.stop="toggleDropdown"
        >
          <ChevronDown
            class="size-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </div>
    </div>

    <!-- Dropdown List -->
    <div
      v-if="isOpen"
      class="absolute left-0 z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-foreground/10 bg-background shadow-lg py-1"
    >
      <div
        v-if="filteredOptions.length === 0"
        class="p-3 text-center text-xs text-foreground/60"
      >
        <span v-if="searchQuery">No se encontraron resultados para "{{ searchQuery }}"</span>
        <span v-else>No hay opciones disponibles</span>
      </div>

      <ul v-else class="divide-y divide-foreground/5 text-sm">
        <li
          v-for="(option, idx) in filteredOptions"
          :key="option.value"
          class="flex items-center justify-between px-3 py-2 cursor-pointer transition-colors hover:bg-foreground/5"
          :class="{
            'bg-primary/10 text-primary font-medium': String(option.value) === String(modelValue),
            'bg-foreground/5': idx === highlightedIndex,
          }"
          @mousedown.prevent="selectOption(option)"
          @mouseenter="highlightedIndex = idx"
        >
          <div class="flex flex-col truncate pr-2">
            <span class="truncate">{{ option.label }}</span>
            <span
              v-if="option.sublabel"
              class="text-xs opacity-70 truncate"
              :class="{ 'text-primary/80': String(option.value) === String(modelValue) }"
            >
              {{ option.sublabel }}
            </span>
          </div>

          <Check
            v-if="String(option.value) === String(modelValue)"
            class="size-4 shrink-0 text-primary"
          />
        </li>
      </ul>
    </div>

    <!-- Validation error message -->
    <span v-if="error" class="text-danger mt-1 block text-sm">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronDown, Check, X } from 'lucide-vue-next';

export interface SelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
}

interface Props {
  modelValue?: string | number;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Buscar o seleccionar...',
  error: '',
  disabled: false,
  name: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur'): void;
  (e: 'change', value: string | number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const isOpen = ref(false);
const searchQuery = ref('');
const isTyping = ref(false);
const highlightedIndex = ref(-1);

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      searchQuery.value = '';
      isTyping.value = false;
      isOpen.value = false;
      highlightedIndex.value = -1;
    }
  },
);

const selectedOption = computed(() => {
  return props.options.find((opt) => String(opt.value) === String(props.modelValue));
});

const displayValue = computed(() => {
  if (isTyping.value) {
    return searchQuery.value;
  }
  if (!selectedOption.value) {
    return '';
  }
  return selectedOption.value.sublabel
    ? `${selectedOption.value.label} (${selectedOption.value.sublabel})`
    : selectedOption.value.label;
});

const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return props.options;
  }

  return props.options.filter((opt) => {
    const labelMatch = opt.label.toLowerCase().includes(query);
    const sublabelMatch = opt.sublabel ? opt.sublabel.toLowerCase().includes(query) : false;
    return labelMatch || sublabelMatch;
  });
});

const onFocus = () => {
  if (props.disabled) return;
  isOpen.value = true;
  isTyping.value = true;
  searchQuery.value = '';
  highlightedIndex.value = -1;
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  isTyping.value = true;
  isOpen.value = true;
  highlightedIndex.value = -1;
};

const toggleDropdown = () => {
  if (props.disabled) return;
  if (isOpen.value) {
    closeDropdown();
  } else {
    inputRef.value?.focus();
  }
};

const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value);
  emit('change', option.value);
  emit('blur');
  closeDropdown();
};

const clearSelection = () => {
  emit('update:modelValue', '');
  emit('change', '');
  emit('blur');
  searchQuery.value = '';
  isTyping.value = false;
  closeDropdown();
};

const closeDropdown = () => {
  isOpen.value = false;
  isTyping.value = false;
  searchQuery.value = '';
  highlightedIndex.value = -1;
  emit('blur');
};

const onKeyDown = () => {
  if (!isOpen.value) {
    isOpen.value = true;
    return;
  }
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value += 1;
  }
};

const onKeyUp = () => {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value -= 1;
  }
};

const onKeyEnter = () => {
  if (
    isOpen.value &&
    highlightedIndex.value >= 0 &&
    highlightedIndex.value < filteredOptions.value.length
  ) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
};

onClickOutside(containerRef, () => {
  if (isOpen.value) {
    closeDropdown();
  }
});
</script>

<style scoped></style>
