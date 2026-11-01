<template>
  <div
    :id="id"
    class="group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 z-[10050] overflow-y-auto [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    :class="{ show: modelValue }"
    @click.self="handleCancel"
  >
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05] sm:max-w-lg"
    >
      <a
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur cursor-pointer"
        @click="handleCancel"
        href="#"
      >
        <CloseIcon />
      </a>
      <div class="p-5 text-center">
        <!-- slot icon or fallback based on variant -->
        <slot name="icon">
          <i
            v-if="variant === 'danger'"
            data-lucide="x-circle"
            class="[--color:currentColor] stroke-(--color) fill-(--color)/25 text-danger mx-auto mt-3 size-16 stroke-1"
          ></i>
          <div
            v-else
            class="size-16 rounded-2xl mx-auto mt-3 flex items-center justify-center bg-(--color)/10 border border-(--color)/20 text-(--color)"
            :class="variantColors[variant] || variantColors.primary"
          >
            <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </slot>

        <!-- slot title or prop -->
        <div class="mt-5 text-3xl">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- slot description or prop -->
        <div class="mt-2 opacity-70">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>

      <!-- slot actions buttons -->
      <div class="px-5 pb-8 text-center flex items-center justify-center gap-2">
        <slot name="actions">
          <!-- Botón de Confirmación (Lado izquierdo) -->
          <ButtonBase
            :text="confirmText"
            :color="variant"
            variant="soft"
            :loading="isBusy"
            :loading-text="loadingText"
            @click="handleConfirm"
          />

          <!-- Botón de Cancelación (Lado derecho) -->
          <ButtonBase
            :text="cancelText"
            color="secondary"
            variant="outline"
            :disabled="isBusy"
            data-tw-dismiss="modal"
            @click="handleCancel"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';

import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import CloseIcon from '@/icons/CloseIcon.vue';

interface Props {
  modelValue?: boolean;
  id?: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: 'danger' | 'primary' | 'success' | 'warning';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  id: 'default-modal',
  title: 'Confirmación',
  description: '¿Estás seguro de continuar?',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  isLoading: false,
  loading: false,
  loadingText: 'Cargando...',
  variant: 'danger',
});

const isBusy = computed(() => props.isLoading || props.loading);

/**
 * Emits
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

/**
 * Métodos internos
 */
const handleConfirm = () => {
  // props.onConfirm?.();
  emit('confirm');
};

const handleCancel = () => {
  // props.onCancel?.();
  emit('update:modelValue', false);
  emit('cancel');
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false);
  }
};

watch(
  () => props.modelValue,
  (value) => {
    document.body.style.overflow = value ? 'hidden' : '';
  },
);

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped></style>
