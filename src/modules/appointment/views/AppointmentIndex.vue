<template>
  <TemplateView title="CALENDARIO DE CITAS">
    <template #main>
      <!-- Eliminamos el v-if que destruía a vue-cal y dejamos el calendario fijo -->
      <vue-cal
        locale="es"
        active-view="week"
        :time-from="8 * 60"
        :time-step="30"
        :time-to="20 * 60"
        :time="true"
        :today-button="false"
        :views="['day', 'week', 'month']"
        :events="calendarEvents"
        :overlaps-per-time-step="true"
        @ready="onViewChange($event)"
        @view-change="onViewChange($event)"
        @event-click="onEventClick"
      />

      <DialogBasic id="modal-appointment-calendar" size="3xl">
        <AppointmentCalendar
          :appointment="selectedAppointment"
          @updated="selectedAppointment = $event"
          @consultation="goToConsultation($event)"
        />
      </DialogBasic>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCalendar from '@/modules/appointment/views/AppointmentCalendar.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';

import { ref, computed } from 'vue';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';
import { useQuery } from '@tanstack/vue-query';

import type { Appointment } from '../interfaces/appointment.interface';
import type { CalendarEvent } from '../interfaces/calendar-event.interface';

import { getAppointmentsAction } from '../actions/get-appointments.action';
import { useRouter } from 'vue-router';

const router = useRouter();

const dateRange = ref<{ from: string | null; to: string | null }>({
  from: null,
  to: null,
});

const selectedAppointment = ref<null | Appointment>(null);

const onViewChange = (event: any) => {
  if (!event) return;

  let startRaw: any = null;
  let endRaw: any = null;

  if (event.view && typeof event.view === 'object' && event.view.start) {
    startRaw = event.view.start;
    endRaw = event.view.end;
  } else if (event.start && event.end) {
    startRaw = event.start;
    endRaw = event.end;
  } else if (event.startDate && event.endDate) {
    startRaw = event.startDate;
    endRaw = event.endDate;
  }

  if (startRaw && endRaw) {
    const newFrom = new Date(startRaw).toISOString().split('T')[0];
    const newTo = new Date(endRaw).toISOString().split('T')[0];

    // 🛡️ Ignorar si son exactamente las mismas fechas que ya tenemos en pantalla
    if (dateRange.value.from === newFrom && dateRange.value.to === newTo) {
      return;
    }

    // 🚀 Actualización atómica en un solo paso reactivo
    dateRange.value = {
      from: newFrom,
      to: newTo,
    };

    console.log('🚀 Petición única a la API:', dateRange.value);
  }
};

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
  queryKey: ['appointments', dateRange],
  queryFn: () => getAppointmentsAction(dateRange.value.from, dateRange.value.to),
  enabled: computed(() => !!dateRange.value.from && !!dateRange.value.to),
  select: (data) =>
    (data || []).map((appointment: Appointment) => ({
      start: new Date(appointment.fecha_hora_inicio),
      end: new Date(appointment.fecha_hora_termino),
      title: appointment.pacientes?.[0]?.nombre_completo || appointment.motivo || 'Cita médica',
      appointment,
      class: getStatusClass(appointment.estatus),
    })),
});

const calendarEvents = computed(() => (events.value ?? []).map((e) => ({ ...e })));

const onEventClick = ({ event }: CalendarEvent) => {
  window.tailwind.Modal.getOrCreateInstance(
    document.getElementById('modal-appointment-calendar'),
  ).show();
  selectedAppointment.value = event.appointment;
};

const goToConsultation = (appointmentId) => {
  window.tailwind.Modal.getOrCreateInstance(
    document.getElementById('modal-appointment-calendar'),
  ).hide();

  router.push({
    name: 'appointments.consultations.create',
    params: { appointmentId: appointmentId },
  });
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
