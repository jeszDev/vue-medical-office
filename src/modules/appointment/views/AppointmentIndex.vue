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
      <!-- Leyenda de estatus visual, resumen y filtro -->
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs mb-4 text-foreground/80">
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <span class="font-semibold text-foreground/60 uppercase tracking-wider text-[11px]">
            Estatus:
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 font-medium border border-yellow-400/30"
          >
            <span class="size-2 rounded-full bg-yellow-400"></span> Pendiente ({{ appointmentsSummary.pendientes }})
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/15 text-green-700 dark:text-green-400 font-medium border border-green-500/30"
          >
            <span class="size-2 rounded-full bg-green-500"></span> Confirmada / Atendida ({{ appointmentsSummary.confirmadas }})
          </span>
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-400/15 text-slate-600 dark:text-slate-400 font-medium border border-slate-400/30 transition-opacity"
            :class="{ 'opacity-40 line-through': hideCancelled }"
          >
            <span class="size-2 rounded-full bg-slate-400"></span> Cancelada ({{ appointmentsSummary.canceladas }})
          </span>
        </div>

        <!-- Filtro interactivo para ocultar citas canceladas -->
        <label
          class="flex items-center gap-2 cursor-pointer select-none text-xs text-foreground/75 hover:text-foreground transition-colors ml-auto"
        >
          <input
            type="checkbox"
            v-model="hideCancelled"
            class="rounded border-foreground/20 text-primary focus:ring-primary/20 size-4 cursor-pointer"
          />
          <span class="font-medium">Ocultar canceladas</span>
        </label>
      </div>

      <!-- Calendario con soporte de cell-click, today-button y slot enriquecido -->
      <div
        class="transition-opacity duration-200"
        :class="{ 'opacity-70 pointer-events-none': isFetching }"
      >
        <vue-cal
          locale="es"
          v-model:view="currentView"
          v-model:view-date="currentViewDate"
          v-model:selected-date="currentSelectedDate"
          :time-from="8 * 60"
          :time-step="30"
          :time-to="20 * 60"
          :time-cell-height="54"
          :time="true"
          :today-button="true"
          :watch-real-time="true"
          :views="['day', 'week', 'month']"
          :events="calendarEvents"
          :events-on-month-view="true"
          :overlaps-per-time-step="true"
          @ready="onViewChange($event)"
          @view-change="onViewChange($event)"
          @event-click="onEventClick"
          @cell-click="onCellClick"
        >
          <template #event="{ event }">
            <div
              class="flex flex-col h-full justify-center p-1 sm:p-1.5 text-xs overflow-hidden select-none leading-snug gap-0.5"
              :title="`${event.title} (${formatTime(event.start)} - ${formatTime(event.end)})\n${event.appointment?.motivo || ''}`"
            >
              <!-- Fila 1: Nombre de paciente y rango horario compacto -->
              <div class="flex items-center justify-between gap-1 min-w-0">
                <span class="font-bold truncate text-[11px] sm:text-xs tracking-tight">
                  {{ event.title }}
                </span>
                <span class="text-[9px] sm:text-[10px] font-mono shrink-0 opacity-90 font-medium">
                  {{ formatTime(event.start) }}-{{ formatTime(event.end) }}
                </span>
              </div>

              <!-- Fila 2: Motivo de la cita -->
              <div
                v-if="event.appointment?.motivo && event.appointment?.motivo !== event.title"
                class="text-[10px] opacity-90 truncate italic"
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

import { ref, computed, nextTick } from 'vue';
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

interface VueCalCellClickPayload {
  cell?: {
    start?: Date | string;
    end?: Date | string;
    [key: string]: unknown;
  };
  cursor?: {
    date?: Date | string;
    x?: number;
    y?: number;
    [key: string]: unknown;
  };
  date?: Date | string;
  startDate?: Date | string;
  [key: string]: unknown;
}

const router = useRouter();
const queryClient = useQueryClient();

const currentView = ref<'day' | 'week' | 'month'>('week');
const currentViewDate = ref<Date>(new Date());
const currentSelectedDate = ref<Date>(new Date());
const hideCancelled = ref<boolean>(false);

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

const extractDateFromCellClick = (payload: unknown): Date | null => {
  if (!payload) return null;
  if (payload instanceof Date) return isNaN(payload.getTime()) ? null : payload;

  const data = payload as VueCalCellClickPayload;

  // 1. Cursor date (proporciona día y hora exacta en la celda donde se hizo clic)
  if (data.cursor?.date) {
    const d = new Date(data.cursor.date);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Propiedad date directa
  if (data.date) {
    const d = new Date(data.date);
    if (!isNaN(d.getTime())) return d;
  }

  // 3. Propiedad startDate directa
  if (data.startDate) {
    const d = new Date(data.startDate);
    if (!isNaN(d.getTime())) return d;
  }

  // 4. Fallback: fecha de inicio de la celda
  if (data.cell?.start) {
    const d = new Date(data.cell.start);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
};

const onCellClick = (cellData: unknown) => {
  const rawDate = extractDateFromCellClick(cellData);
  if (!rawDate) return;

  const startDate = new Date(rawDate);

  // 🎯 Si estamos en la vista mensual, cambiar a la vista de día para esa fecha (drill-down)
  if (currentView.value === 'month') {
    currentViewDate.value = startDate;
    currentSelectedDate.value = startDate;
    currentView.value = 'day';
    return;
  }

  // Si la hora es 00:00 (por ejemplo al hacer clic desde encabezado de día), asignar hora de apertura por defecto (09:00)
  if (startDate.getHours() === 0 && startDate.getMinutes() === 0) {
    startDate.setHours(9, 0, 0, 0);
  } else {
    // Redondear al intervalo inferior de 30 minutos (cuadrícula habitual de citas)
    const minutes = startDate.getMinutes();
    const snappedMinutes = Math.floor(minutes / 30) * 30;
    startDate.setMinutes(snappedMinutes, 0, 0);
  }

  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  initialStartDate.value = '';
  initialEndDate.value = '';

  nextTick(() => {
    initialStartDate.value = formatLocalISO(startDate);
    initialEndDate.value = formatLocalISO(endDate);
    appointmentModalId.value = 'create';

    const modalEl = document.getElementById('modal-appointment-create-or-edit');
    if (modalEl && window.tailwind) {
      window.tailwind.Modal.getOrCreateInstance(modalEl).show();
    }
  });
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

  const viewObj = event as { id?: string; view?: { id?: string } };
  if (viewObj.id && ['day', 'week', 'month'].includes(viewObj.id)) {
    currentView.value = viewObj.id as 'day' | 'week' | 'month';
  } else if (viewObj.view?.id && ['day', 'week', 'month'].includes(viewObj.view.id)) {
    currentView.value = viewObj.view.id as 'day' | 'week' | 'month';
  }

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

const parseAppointmentDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;
  const isoStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const d = new Date(isoStr);
  return isNaN(d.getTime()) ? null : d;
};

const getStatusClass = (status: AppointmentStatusObject | string | undefined | null) => {
  const name = getAppointmentStatusName(status).toLowerCase();
  switch (name) {
    case 'pendiente':
      return 'event-pendiente';
    case 'confirmada':
    case 'atendida':
      return 'event-confirmada';
    case 'cancelada':
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
    (data || [])
      .filter(
        (appointment: Appointment) =>
          !!appointment?.fecha_hora_inicio && !!appointment?.fecha_hora_termino,
      )
      .map((appointment: Appointment) => {
        const start = parseAppointmentDate(appointment.fecha_hora_inicio);
        const end = parseAppointmentDate(appointment.fecha_hora_termino);
        if (!start || !end) return null;

        const patientName = appointment.pacientes?.[0]?.nombre_completo;
        return {
          start,
          end,
          title: patientName || appointment.motivo || 'Cita médica',
          appointment,
          class: getStatusClass(appointment.estatus),
        };
      })
      .filter((e): e is NonNullable<typeof e> => !!e),
});

const appointmentsSummary = computed(() => {
  const all = events.value ?? [];
  let confirmadas = 0;
  let pendientes = 0;
  let canceladas = 0;

  for (const item of all) {
    const status = getAppointmentStatusName(item.appointment?.estatus).toLowerCase();
    if (status === 'confirmada' || status === 'atendida') {
      confirmadas++;
    } else if (status === 'pendiente') {
      pendientes++;
    } else if (status === 'cancelada') {
      canceladas++;
    }
  }

  return {
    total: all.length,
    confirmadas,
    pendientes,
    canceladas,
  };
});

const calendarEvents = computed(() => {
  let list = events.value ?? [];
  if (hideCancelled.value) {
    list = list.filter((e) => {
      const status = getAppointmentStatusName(e.appointment?.estatus).toLowerCase();
      return status !== 'cancelada';
    });
  }
  return list.map((e) => ({ ...e }));
});

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
:deep(.vuecal__now-line) {
  border-color: #ef4444;
  border-width: 2px;
  z-index: 10;
}

:deep(.vuecal__now-line::before) {
  content: '';
  position: absolute;
  left: -4px;
  top: -4px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 9999px;
}

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

:deep(.vuecal__cell:not(.disabled)) {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

:deep(.vuecal__cell:not(.disabled):hover) {
  background-color: rgba(59, 130, 246, 0.05);
}

:deep(.vuecal__today-btn) {
  font-weight: 600;
}
</style>
