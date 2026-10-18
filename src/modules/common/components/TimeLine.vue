<template>
  <div class="w-full max-w-6xl mx-auto">
    <div class="flex flex-col justify-center">
      <div class="w-full max-w-3xl mx-auto">
        <div v-if="isLoading" class="text-center py-4 text-slate-500">Cargando historial...</div>
        <div v-else-if="!appointments?.length" class="text-center py-4 text-slate-500">
          No hay citas registradas para este paciente.
        </div>
        <template v-else>
          <TimeLineItem
            v-for="(appointment, index) in appointments"
            :key="appointment.id || index"
            :appointment="appointment"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLineItem from './TimeLineItem.vue';
import { getAllAppointmentsByPatientAction } from '@/modules/appointment/actions/get-all-appointments-by-patient.action';
import { useQuery } from '@tanstack/vue-query';

interface Props {
  patientId: string;
}

const props = withDefaults(defineProps<Props>(), {
  patientId: '4',
});

const { data: appointments, isLoading } = useQuery({
  queryKey: ['appointments', { patientId: props.patientId, all: true }],
  queryFn: () => getAllAppointmentsByPatientAction(props.patientId),
});
</script>

<style scoped></style>
