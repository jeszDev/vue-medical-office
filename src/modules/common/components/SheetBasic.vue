<template>
  <Teleport to="body" :disabled="!teleport">
    <div
      ref="sheetRef"
      :data-tw-backdrop="backdrop === 'static' ? 'static' : ''"
      class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 z-[10000] [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
      :class="{ show: isOpen }"
      :id="id"
      role="dialog"
      aria-modal="true"
      @click.self="handleBackdropClick"
    >
      <div class="fixed inset-y-0 right-0 flex max-w-full px-2.5 pb-6 pt-2.5">
        <div
          :class="[
            'box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md w-screen before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 -mr-16 p-6 duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mr-0 group-[.modal-static]:scale-[1.05] h-full transition-[margin-right,margin-top,transform] flex flex-col',
            sizes[size],
          ]"
        >
          <!-- Botón de cierre flotante exterior estilo Midone custom-close-sheet -->
          <a
            v-if="showCloseButton && closeButtonPosition === 'outside-left'"
            class="bg-background/80 hover:bg-background absolute inset-y-0 left-0 my-auto -ml-16 flex size-9 items-center justify-center rounded-full border border-foreground/10 shadow backdrop-blur cursor-pointer text-foreground/70 hover:text-foreground transition-colors"
            data-tw-dismiss="modal"
            href="#"
            aria-label="Cerrar panel"
            @click.prevent="onCloseClick"
          >
            <CloseIcon />
          </a>

          <!-- Botón de cierre superior derecho (solo cuando se configure inside-right) -->
          <a
            v-if="showCloseButton && closeButtonPosition === 'inside-right'"
            class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border border-foreground/10 shadow backdrop-blur cursor-pointer text-foreground/70 hover:text-foreground transition-colors z-20"
            data-tw-dismiss="modal"
            href="#"
            aria-label="Cerrar panel"
            @click.prevent="onCloseClick"
          >
            <CloseIcon />
          </a>

          <!-- Header slot / Cabecera por defecto -->
          <slot name="header">
            <div
              v-if="title || description"
              class="flex flex-col space-y-1.5 text-center sm:text-left pb-4 border-b border-foreground/10"
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

          <!-- Cuerpo con scroll interno independiente -->
          <div class="flex-1 overflow-y-auto px-1 py-4 flex flex-col gap-4">
            <slot />
          </div>

          <!-- Footer slot -->
          <div v-if="$slots.footer" class="mt-auto pt-4 border-t border-foreground/10">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import CloseIcon from '@/icons/CloseIcon.vue';

interface Props {
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  modelValue?: boolean;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeButtonPosition?: 'outside-left' | 'inside-right';
  backdrop?: 'static' | 'auto';
  teleport?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: 'basic-sheet',
  size: '2xl',
  modelValue: undefined,
  title: '',
  description: '',
  showCloseButton: true,
  closeButtonPosition: 'outside-left',
  backdrop: 'auto',
  teleport: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
  (e: 'hidden'): void;
}>();

const sheetRef = ref<HTMLElement | null>(null);

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
  if (sheetRef.value) {
    sheetRef.value.addEventListener('hidden.tw.modal', onHidden);
  }
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  if (sheetRef.value) {
    sheetRef.value.removeEventListener('hidden.tw.modal', onHidden);
  }
  window.removeEventListener('keydown', handleEscape);
  if (props.modelValue) {
    document.body.style.overflow = '';
  }
});

const sizes: Record<NonNullable<Props['size']>, string> = {
  sm: 'sm:!max-w-sm',
  md: 'sm:!max-w-md',
  lg: 'sm:!max-w-lg',
  xl: 'sm:!max-w-xl',
  '2xl': 'sm:!max-w-2xl',
  '3xl': 'sm:!max-w-3xl',
  '4xl': 'sm:!max-w-4xl',
  full: 'sm:!max-w-full',
};
</script>

<style scoped></style>
