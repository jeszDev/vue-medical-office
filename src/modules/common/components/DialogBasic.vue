<template>
  <div
    ref="modalRef"
    :data-tw-backdrop="backdrop === 'static' ? 'static' : ''"
    class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 z-[10000] [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    :class="{ show: isOpen }"
    :id="id"
    @click.self="handleBackdropClick"
  >
    <div
      :class="[
        'box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05]',
        sizes[size],
      ]"
    >
      <a
        v-if="showCloseButton"
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur cursor-pointer"
        data-tw-dismiss="modal"
        href="#"
        @click.prevent="onCloseClick"
      >
        <CloseIcon />
      </a>

      <!-- Midone Header Slot / Structure -->
      <slot name="header">
        <div
          v-if="title || description"
          class="flex flex-col space-y-1.5 text-center sm:text-left mb-4"
        >
          <div
            v-if="title"
            class="text-lg font-semibold leading-none tracking-tight text-foreground"
          >
            {{ title }}
          </div>
          <div v-if="description" class="opacity-70 text-sm">
            {{ description }}
          </div>
        </div>
      </slot>

      <!-- Content -->
      <div class="flex flex-col gap-3 overflow-y-auto max-h-[75vh] w-full px-1">
        <slot>Contenido de modal</slot>
      </div>

      <!-- Midone Footer Slot / Structure -->
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import CloseIcon from '@/icons/CloseIcon.vue';

interface Props {
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  modelValue?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  backdrop?: 'static' | 'auto';
}

const props = withDefaults(defineProps<Props>(), {
  id: 'basic-dialog',
  size: 'lg',
  modelValue: undefined,
  title: '',
  description: '',
  showCloseButton: true,
  backdrop: 'auto',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'hidden'): void;
}>();

const modalRef = ref<HTMLElement | null>(null);

const isOpen = computed(() => props.modelValue === true);

const onHidden = () => {
  emit('hidden');
  if (props.modelValue !== undefined) {
    emit('update:modelValue', false);
  }
};

const onCloseClick = () => {
  emit('close');
  if (props.modelValue !== undefined) {
    emit('update:modelValue', false);
  }
};

const handleBackdropClick = () => {
  if (props.backdrop !== 'static') {
    onCloseClick();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    if (props.backdrop !== 'static') {
      onCloseClick();
    }
  }
};

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  },
);

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.addEventListener('hidden.tw.modal', onHidden);
  }
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  if (modalRef.value) {
    modalRef.value.removeEventListener('hidden.tw.modal', onHidden);
  }
  window.removeEventListener('keydown', handleEscape);
  if (props.modelValue) {
    document.body.style.overflow = '';
  }
});

const sizes = {
  sm: 'sm:!max-w-sm',
  md: 'sm:!max-w-md',
  lg: 'sm:!max-w-lg',
  xl: 'sm:!max-w-xl',
  '2xl': 'sm:!max-w-2xl',
  '3xl': 'sm:!max-w-3xl',
};
</script>

<style scoped></style>
