<template>
  <div
    :id="id"
    :data-tw-backdrop="backdrop === 'static' ? 'static' : ''"
    class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 z-[10050] overflow-y-auto [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    :class="{ show: modelValue }"
    @click.self="handleBackdropClick"
  >
    <div
      :class="[
        'box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05]',
        sizes[size],
      ]"
    >
      <!-- Botón flotante de cierre superior derecho (Custom Close estilo Midone) -->
      <a
        v-if="showCloseButton"
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur cursor-pointer"
        data-tw-dismiss="modal"
        href="#"
        @click.prevent="handleCancel"
      >
        <CloseIcon />
      </a>

      <!-- Cuerpo / Icono, Título y Descripción -->
      <div class="p-5 text-center">
        <!-- Slot de Icono (o ícono nativo de Midone con fill translúcido según variante) -->
        <slot name="icon">
          <XCircle
            v-if="variant === 'danger'"
            class="size-16 stroke-1 mx-auto mt-3 [--color:currentColor] stroke-(--color) fill-(--color)/25 text-danger"
          />
          <AlertTriangle
            v-else-if="variant === 'warning'"
            class="size-16 stroke-1 mx-auto mt-3 [--color:currentColor] stroke-(--color) fill-(--color)/25 text-warning"
          />
          <CheckCircle
            v-else-if="variant === 'success'"
            class="size-16 stroke-1 mx-auto mt-3 [--color:currentColor] stroke-(--color) fill-(--color)/25 text-success"
          />
          <HelpCircle
            v-else
            class="size-16 stroke-1 mx-auto mt-3 [--color:currentColor] stroke-(--color) fill-(--color)/25 text-primary"
          />
        </slot>

        <!-- Slot de Título o prop -->
        <div class="mt-5 text-3xl font-medium">
          <slot name="title">{{ title }}</slot>
        </div>

        <!-- Slot de Descripción o prop -->
        <div class="mt-2 opacity-70 text-sm sm:text-base">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>

      <!-- Acciones / Botones en orden oficial Midone (Cancelar izquierda, Confirmar derecha) -->
      <div class="px-5 pb-8 text-center flex items-center justify-center gap-2">
        <slot name="actions">
          <!-- Botón de Cancelación (Izquierda) -->
          <ButtonBase
            v-if="showCancelButton"
            :text="cancelText"
            color="secondary"
            variant="outline"
            :disabled="isBusy"
            class="min-w-24"
            data-tw-dismiss="modal"
            @click="handleCancel"
          />

          <!-- Botón de Confirmación (Derecha) -->
          <ButtonBase
            :text="confirmText"
            :color="variant"
            variant="soft"
            :loading="isBusy"
            :loading-text="loadingText"
            class="min-w-24"
            @click="handleConfirm"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { XCircle, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-vue-next';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import CloseIcon from '@/icons/CloseIcon.vue';

interface Props {
  modelValue?: boolean;
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  isBusy?: boolean;
  loadingText?: string;
  variant?: 'danger' | 'primary' | 'success' | 'warning';
  backdrop?: 'static' | 'auto';
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  id: 'default-modal',
  size: 'lg',
  title: 'Confirmación',
  description: '¿Estás seguro de continuar?',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  showCancelButton: true,
  showCloseButton: true,
  isLoading: false,
  loading: false,
  isBusy: false,
  loadingText: 'Cargando...',
  variant: 'danger',
  backdrop: 'auto',
});

const isBusy = computed(() => props.isLoading || props.loading || Boolean(props.isBusy));

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const handleBackdropClick = () => {
  if (props.backdrop !== 'static') {
    handleCancel();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    if (props.backdrop !== 'static') {
      handleCancel();
    }
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
