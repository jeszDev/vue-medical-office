<template>
  <TemplateView>
    <template #header>
      <div class="flex flex-wrap items-center justify-between w-full gap-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-medium">CALENDARIO DE CITAS</h2>
          <span
            v-if="isFetching"
            class="inline-flex items-center gap-1.5 text-xs text-primary font-medium animate-pulse"
          >
            <span class="size-2 rounded-full bg-primary animate-ping"></span>
            Actualizando agenda...
          </span>
        </div>
        <ButtonBase
          text="Agendar nueva cita"
          :icon="PlusIcon"
          color="primary"
          @click="openCreateModal"
        />
      </div>
    </template>
    <template #main>
      <!-- Leyenda de estatus visual -->
      <div class="flex flex-wrap items-center gap-3 text-xs mb-4 text-foreground/80">
        <span class="font-semibold text-foreground/60 uppercase tracking-wider text-[11px]">
          Estatus:
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 font-medium border border-yellow-400/30"
        >
          <span class="size-2 rounded-full bg-yellow-400"></span> Pendiente
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 text-green-700 dark:text-green-400 font-medium border border-green-500/30"
        >
          <span class="size-2 rounded-full bg-green-500"></span> Confirmada / Atendida
        </span>
        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-400/15 text-slate-600 dark:text-slate-400 font-medium border border-slate-400/30"
        >
          <span class="size-2 rounded-full bg-slate-400"></span> Cancelada
        </span>
      </div>

      <!-- Calendario con soporte de cell-click, today-button y slot enriquecido -->
      <div
        class="transition-opacity duration-200"
        :class="{ 'opacity-70 pointer-events-none': isFetching }"
      >
        <vue-cal
          locale="es"
          active-view="week"
          :time-from="8 * 60"
          :time-step="30"
          :time-to="20 * 60"
          :time="true"
          :today-button="true"
          :views="['day', 'week', 'month']"
          :events="calendarEvents"
          :overlaps-per-time-step="true"
          @ready="onViewChange($event)"
          @view-change="onViewChange($event)"
          @event-click="onEventClick"
          @cell-click="onCellClick"
        >
          <template #event="{ event }">
            <div
              class="flex flex-col h-full justify-between p-1.5 text-xs leading-tight overflow-hidden"
            >
              <div class="font-bold truncate text-[11px] sm:text-xs">
                {{ event.title }}
              </div>
              <div class="text-[10px] opacity-90 truncate font-mono">
                {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
              </div>
              <div
                v-if="event.appointment?.motivo && event.appointment?.motivo !== event.title"
                class="text-[10px] opacity-80 truncate italic"
              >
                {{ event.appointment.motivo }}
              </div>
            </div>
          </template>
        </vue-cal>
      </div>

      <DialogBasic id="modal-appointment-calendar" size="3xl">
        <AppointmentCalendar
          :appointment="selectedAppointment"
          @updated="onAppointmentUpdated"
          @consultation="goToConsultation($event)"
          @edit="onEditAppointment($event)"
        />
      </DialogBasic>

      <DialogBasic id="modal-appointment-create-or-edit" size="3xl">
        <AppointmentCreateUpdate
          patient-id="0"
          :appointment-id="appointmentModalId"
          :initial-start-date="initialStartDate"
          :initial-end-date="initialEndDate"
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
import { useQuery, useQueryClient } from '@tanstack/vue-query';

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
const queryClient = useQueryClient();

const dateRange = ref<{ from: string | null; to: string | null }>({
  from: null,
  to: null,
});

const selectedAppointment = ref<null | Appointment>(null);
const appointmentModalId = ref<string>('create');
const initialStartDate = ref<string>('');
const initialEndDate = ref<string>('');

const formatTime = (d: Date | string) => {
  const date = new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatLocalISO = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const openCreateModal = () => {
  appointmentModalId.value = 'create';
  initialStartDate.value = '';
  initialEndDate.value = '';
  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

const onCellClick = (cellData: Date | { date?: Date; [key: string]: unknown }) => {
  const rawDate = cellData instanceof Date ? cellData : cellData?.date;
  if (!rawDate) return;

  const clickedDate = new Date(rawDate);
  const startDate = new Date(clickedDate);
  const endDate = new Date(clickedDate.getTime() + 30 * 60 * 1000);

  initialStartDate.value = formatLocalISO(startDate);
  initialEndDate.value = formatLocalISO(endDate);
  appointmentModalId.value = 'create';

  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

const onEditAppointment = (appointmentId: number | string) => {
  const detailModalEl = document.getElementById('modal-appointment-calendar');
  if (detailModalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(detailModalEl).hide();
  }

  appointmentModalId.value = String(appointmentId);
  initialStartDate.value = '';
  initialEndDate.value = '';

  setTimeout(() => {
    const formModalEl = document.getElementById('modal-appointment-create-or-edit');
    if (formModalEl && window.tailwind) {
      window.tailwind.Modal.getOrCreateInstance(formModalEl).show();
    }
  }, 200);
};

const onAppointmentUpdated = (updatedAppointment: Appointment) => {
  selectedAppointment.value = updatedAppointment;
  queryClient.invalidateQueries({ queryKey: ['appointments'] });
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

const { data: events, isFetching } = useQuery({
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

:deep(.vuecal__event) {
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

:deep(.vuecal__event:hover) {
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.vuecal__today-btn) {
  font-weight: 600;
}
</style>
