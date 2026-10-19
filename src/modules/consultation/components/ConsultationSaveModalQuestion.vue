<template>
  <ModalQuestion
    v-model="isOpen"
    :title="isEditMode ? '¿Deseas guardar los cambios?' : '¿Deseas finalizar y guardar la consulta?'"
    :confirm-text="isEditMode ? 'Sí, actualizar consulta' : 'Sí, guardar consulta'"
    cancel-text="Revisar datos"
    variant="primary"
    :is-loading="isLoading"
    @confirm="onConfirm"
    @cancel="onClose"
  >
    <template #icon>
      <div
        class="size-16 rounded-2xl mx-auto mt-3 flex items-center justify-center bg-primary/10 border border-primary/20 text-primary"
      >
        <StethoscopeIcon class="size-8" />
      </div>
    </template>

    <template #description>
      <div class="space-y-2">
        <p>
          {{
            isEditMode
              ? 'Se actualizará la información clínica en el expediente del paciente.'
              : 'La información clínica se registrará en el expediente del paciente y la cita se marcará como concluida.'
          }}
        </p>
        <p v-if="patientName" class="text-xs font-medium text-foreground/80">
          Paciente: <span class="text-primary font-bold">{{ patientName }}</span>
        </p>
      </div>
    </template>
  </ModalQuestion>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';

interface Props {
  modelValue: boolean;
  isEditMode?: boolean;
  patientName?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditMode: false,
  patientName: '',
  isLoading: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const onConfirm = () => {
  emit('confirm');
};

const onClose = () => {
  isOpen.value = false;
  emit('cancel');
};
</script>
