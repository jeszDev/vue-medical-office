<template>
  <ModalQuestion
    v-model="isOpen"
    title="¿Quieres cancelar la cita?"
    description="Esta acción es irreversible."
    confirmText="Sí, cancelar cita"
    cancelText="Cerrar"
    :loading="isPending"
    @confirm="onConfirm"
    @cancel="onClose"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import { useCancelAppointment } from '@/modules/appointment/composables/useCancelAppointment';
import type { Appointment } from '@/types/Appointment';

interface Props {
  modelValue: boolean;
  appointmentId: null | number;
}

const props = defineProps<Props>();

console.log(props.modelValue, props.appointmentId);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancelled', appointment: Appointment): void;
}>();

const { mutateAsync, isPending } = useCancelAppointment();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const onConfirm = async () => {
  if (!props.appointmentId || isPending.value) return;

  try {
    const updated = await mutateAsync(props.appointmentId.toString());

    emit('cancelled', updated);

    isOpen.value = false;
  } catch (error) {
    // El composable debe manejar el toast
  }
};

const onClose = () => {
  isOpen.value = false;
};
</script>
