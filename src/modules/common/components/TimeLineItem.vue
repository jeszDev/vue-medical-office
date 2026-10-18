<template>
  <div class="relative pl-8 sm:pl-32 py-6 border-b group">
    <!-- Vertical line (::before) ~ Date ~ Title ~ Circle marker (::after) -->
    <div
      class="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-blue-900 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5"
    >
      <span
        :class="[
          'sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0',
          getStatusClass(appointment.estatus),
          'bg-(--color)/10 border-(--color)/60 text-(--color) rounded-full',
        ]"
      >
        {{ getStatusLabel(appointment.estatus) }}
      </span>
      <div class="text-base font-bold text-blue-900">{{ appointment.motivo }}</div>
    </div>
    <!-- Content -->
    <div class="mb-1.5">
      <div class="text-slate-500 font-medium">Fecha de la cita:</div>
      <div class="text-black">
        {{ appointment.fecha_inicio }} a las {{ appointment.hora_inicio }} horas.
      </div>
    </div>
    <div class="mb-5">
      <div class="text-slate-500 font-medium">Observaciones de la cita:</div>
      <div class="text-black">
        {{
          appointment.observaciones ||
          appointment.observaciones_cita ||
          'Sin observaciones registradas.'
        }}
      </div>
    </div>

    <div>
      <div class="text-gray-500 font-medium">
        Médico: {{ getAppointmentDoctorName(appointment) || 'No asignado' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Appointment,
  AppointmentStatusObject,
} from '@/modules/appointment/interfaces/appointment.interface';
import {
  getAppointmentDoctorName,
  getAppointmentStatusName,
} from '@/modules/appointment/helpers/get-appointment-status-color.mapper';

interface Props {
  appointment: Appointment;
}

defineProps<Props>();

const getStatusLabel = (estatus: AppointmentStatusObject | string | undefined | null) => {
  return getAppointmentStatusName(estatus);
};

const getStatusClass = (estatus: AppointmentStatusObject | string | undefined | null) => {
  const name = getAppointmentStatusName(estatus).toLowerCase();
  const map: Record<string, string> = {
    pendiente: '[--color:var(--color-warning)]',
    confirmada: '[--color:var(--color-success)]',
    cancelada: '[--color:var(--color-danger)]',
    atendida: '[--color:var(--color-success)]',
  };

  return map[name] ?? '[--color:var(--color-secondary)]';
};
</script>

<style scoped></style>
