<template>
  <TemplateView title="CALENDARIO DE CITAS">
    <template #main>
      <FullScreenLoader v-if="isLoading" />

      <template v-else>
        <vue-cal
          locale="es"
          active-view="week"
          :time-from="8 * 60"
          :time-step="30"
          :time-to="20 * 60"
          :time="true"
          :today-button="false"
          :views="['day', 'week']"
          :events="calendarEvents"
          :overlaps-per-time-step="true"
          @event-click="onEventClick"
        />

        <DialogBasic id="modal-appointment-calendar" size="3xl">
          <AppointmentCalendar
            :appointment="selectedAppointment"
            @updated="selectedAppointment = $event"
          />
        </DialogBasic>
      </template>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCalendar from '@/modules/appointment/Views/AppointmentCalendar.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';

import { ref, computed } from 'vue';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';
import { useQuery } from '@tanstack/vue-query';

import { Appointment } from '../interfaces/appointment.interface';
import { CalendarEvent } from '../interfaces/calendar-event.interface';

import { getAppointmentsAction } from '../actions/get-appointments.action';

const fromDate = ref<string | null>('2026-02-01');
const toDate = ref<string | null>('2026-02-28');

const selectedAppointment = ref<null | Appointment>(null);

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Pendiente':
      return 'event-pendiente';
    case 'Confirmada':
      return 'event-confirmada';
    case 'Cancelada':
      return 'event-cancelada';
    default:
      return 'event-default';
  }
};

const {
  data: events,
  isLoading,
  error,
} = useQuery({
  queryKey: ['appointments', fromDate.value, toDate.value],
  queryFn: () => getAppointmentsAction(fromDate.value, toDate.value),
  select: (data) =>
    data.map((appointment: Appointment) => ({
      start: new Date(appointment.fecha_hora_inicio),
      end: new Date(appointment.fecha_hora_termino),
      title: `${appointment.pacientes[0].nombre_completo}` ?? 'Cita médica',
      appointment,
      class: getStatusClass(appointment.estatus),
    })),
});

const calendarEvents = computed(() => (events.value ?? []).map((e) => ({ ...e })));

const onEventClick = ({ event }: CalendarEvent) => {
  console.log(event.appointment);

  selectedAppointment.value = event.appointment;

  window.tailwind.Modal.getOrCreateInstance(
    document.getElementById('modal-appointment-calendar'),
  ).show();
};
</script>

<style scoped>
:deep(.vuecal__event.event-pendiente) {
  background-color: #facc15;
  border: none;
  color: #000;
}

:deep(.vuecal__event.event-confirmada) {
  background-color: #22c55e;
  border: none;
  color: white;
}

:deep(.vuecal__event.event-cancelada) {
  background-color: #9ca3af;
  border: none;
  color: white;
  opacity: 0.6;
  text-decoration: line-through;
}

:deep(.vuecal__event.event-default) {
  background-color: #3b82f6;
  border: none;
  color: white;
}
</style>
