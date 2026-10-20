<template>
  <TemplateView>
    <template #header>
      <div class="flex flex-wrap items-center justify-between w-full gap-4">
        <h2 class="text-lg font-medium">CALENDARIO DE CITAS</h2>
        <ButtonBase
          text="Agendar nueva cita"
          :icon="PlusIcon"
          color="primary"
          @click="openCreateModal"
        />
      </div>
    </template>
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

      <DialogBasic id="modal-appointment-create-or-edit" size="3xl">
        <AppointmentCreateUpdate
          patient-id="0"
          appointment-id="create"
          :is-inside-modal="true"
        />
      </DialogBasic>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import AppointmentCalendar from '@/modules/appointment/views/AppointmentCalendar.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';

import { ref, computed } from 'vue';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';
import { useQuery } from '@tanstack/vue-query';

import type { Appointment, AppointmentStatusObject } from '../interfaces/appointment.interface';
import type { CalendarEvent } from '../interfaces/calendar-event.interface';
import { getAppointmentStatusName } from '../helpers/get-appointment-status-color.mapper';

import { getAppointmentsAction } from '../actions/get-appointments.action';
import { useRouter } from 'vue-router';

interface CalViewEvent {
  view?: {
    start?: string | Date;
    end?: string | Date;
  };
  start?: string | Date;
  end?: string | Date;
  startDate?: string | Date;
  endDate?: string | Date;
}

const router = useRouter();

const dateRange = ref<{ from: string | null; to: string | null }>({
  from: null,
  to: null,
});

const selectedAppointment = ref<null | Appointment>(null);

const openCreateModal = () => {
  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

const onViewChange = (event: CalViewEvent) => {
  if (!event) return;

  let startRaw: string | Date | null = null;
  let endRaw: string | Date | null = null;

  if (event.view && typeof event.view === 'object' && event.view.start && event.view.end) {
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
  }
};

const getStatusClass = (status: AppointmentStatusObject | string | undefined | null) => {
  const name = getAppointmentStatusName(status);
  switch (name) {
    case 'Pendiente':
      return 'event-pendiente';
    case 'Confirmada':
    case 'Atendida':
      return 'event-confirmada';
    case 'Cancelada':
      return 'event-cancelada';
    default:
      return 'event-default';
  }
};

const { data: events } = useQuery({
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

const goToConsultation = (appointmentId: number | string) => {
  const modalEl = document.getElementById('modal-appointment-calendar');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).hide();
  }

  router.push({
    name: 'appointments.consultations.create',
    params: { appointmentId: String(appointmentId) },
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
