<template>
  <TemplateView v-if="!isLoading" title="Calendario de citas">
    <template #main>
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
        @event-click="onEventClick"
      />

      <DialogBasic id="modal-appointment-calendar" size="3xl">
        <AppointmentCalendar :appointment="selectedAppointment" />
      </DialogBasic>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { VueCal } from 'vue-cal';
import 'vue-cal/style';

import { Appointment } from '../interfaces/appointment.interface';
import { CalendarEvent } from '../interfaces/calendar-event.interface';

import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCalendar from '@/modules/appointment/Views/AppointmentCalendar.vue';
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getAppointmentsAction } from '../actions/get-appointments.action';

const fromDate = ref<string | null>('2026-02-01');
const toDate = ref<string | null>('2026-02-28');

const selectedAppointment = ref<null | Appointment>(null);

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
      title: `${appointment.motivo}` ?? 'Cita médica',
      appointment,
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

<style scoped></style>
