<template>
  <TemplateView title="SOLICITUDES DE CITAS">
    <template #header>
      <div class="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 class="text-lg font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarClockIcon class="size-5 text-primary" />
            SOLICITUDES DE CITAS PENDIENTES
            <span
              v-if="filteredRequests.length > 0"
              class="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20"
            >
              {{ filteredRequests.length }} pendiente{{ filteredRequests.length === 1 ? '' : 's' }}
            </span>
          </h2>
          <p class="text-xs text-foreground/60 mt-0.5">
            Citas solicitadas por pacientes que requieren revisión, confirmación y asignación de médico y horario.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <ButtonBase
            text="Actualizar"
            :icon="RefreshIcon"
            color="secondary"
            :disabled="isFetching"
            @click="refetch"
          />
        </div>
      </div>
    </template>

    <template #main>
      <FullScreenLoader v-if="isLoading && !requests" />

      <template v-else>
        <!-- Barra de filtros y buscador -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <!-- Filtro por Turno (Píldoras segmentadas con contraste nítido) -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-foreground/60 mr-1 uppercase tracking-wider">
              Turno:
            </span>
            <button
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              :class="[
                selectedShiftFilter === 'all'
                  ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/20'
                  : 'bg-background hover:bg-foreground/5 text-foreground/80 border border-foreground/15',
              ]"
              @click="selectedShiftFilter = 'all'"
            >
              <span>Todos</span>
              <span
                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none"
                :class="selectedShiftFilter === 'all' ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'"
              >
                {{ requests.length }}
              </span>
            </button>

            <button
              v-for="shift in SHIFT_OPTIONS"
              :key="shift.value"
              type="button"
              class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              :class="[
                selectedShiftFilter === shift.value
                  ? 'bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/20'
                  : 'bg-background hover:bg-foreground/5 text-foreground/80 border border-foreground/15',
              ]"
              @click="selectedShiftFilter = shift.value"
            >
              <span
                class="size-2 rounded-full"
                :class="[
                  shift.value === 'matutino'
                    ? 'bg-sky-500'
                    : shift.value === 'vespertino'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500',
                ]"
              ></span>
              <span>{{ shift.badgeLabel }}</span>
              <span
                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none"
                :class="selectedShiftFilter === shift.value ? 'bg-white/25 text-white' : 'bg-foreground/10 text-foreground/70'"
              >
                {{ countByShift(shift.value) }}
              </span>
            </button>
          </div>

          <!-- Buscador compacto alineado a la derecha -->
          <div class="w-full sm:w-64 md:w-72 sm:ml-auto shrink-0">
            <div class="relative w-full">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar solicitud..."
                title="Buscar por paciente, CURP, folio, motivo o fecha"
                class="h-9 w-full rounded-lg border bg-background pl-3 pr-14 text-xs text-foreground placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 border-foreground/15 shadow-xs"
              />
              <span
                v-if="searchTerm"
                class="absolute inset-y-0 right-7 my-auto flex items-center cursor-pointer text-foreground/40 hover:text-foreground"
                title="Limpiar búsqueda"
                @click="searchTerm = ''"
              >
                <CloseIcon class="size-3.5" />
              </span>
              <span class="absolute inset-y-0 right-2.5 my-auto flex items-center text-foreground/40 pointer-events-none">
                <SearchIcon class="size-3.5" />
              </span>
            </div>
          </div>
        </div>


        <!-- Estado vacío si no hay solicitudes -->
        <div
          v-if="filteredRequests.length === 0"
          class="box p-12 text-center flex flex-col items-center justify-center rounded-2xl border border-foreground/10 bg-background/50 shadow-sm mt-2"
        >
          <div class="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <CalendarClockIcon class="size-7" />
          </div>
          <h3 class="text-base font-bold text-foreground">
            {{ searchTerm || selectedShiftFilter !== 'all' ? 'No se encontraron solicitudes con estos filtros' : 'No hay solicitudes pendientes' }}
          </h3>
          <p class="text-xs text-foreground/60 max-w-md mt-1">
            {{
              searchTerm || selectedShiftFilter !== 'all'
                ? 'Intenta ajustar los criterios de búsqueda o seleccionar otro turno preferido.'
                : 'Todas las solicitudes de citas de los pacientes han sido confirmadas y agendadas con éxito.'
            }}
          </p>
          <button
            v-if="searchTerm || selectedShiftFilter !== 'all'"
            type="button"
            class="mt-4 px-3.5 py-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
            @click="clearFilters"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>

        <!-- Tabla con estilo Midone cuando existen registros -->
        <div
          v-else
          class="overflow-auto lg:overflow-visible transition-opacity"
          :class="{ 'opacity-60 pointer-events-none': isFetching }"
        >
          <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom border-separate border-spacing-y-[10px] -mt-2">
              <thead class="[&_tr]:border-b-0 [&_tr_th]:h-10">
                <tr class="border-b-0">
                  <th class="h-10 px-4 text-center font-semibold text-xs text-foreground/60 w-12">
                    #
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    FOLIO
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    PACIENTE
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    FECHA PREFERIDA
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    TURNO PREFERIDO
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    MOTIVO DE LA SOLICITUD
                  </th>
                  <th class="h-10 px-4 text-left font-semibold text-xs text-foreground/60">
                    SOLICITADA EL
                  </th>
                  <th class="h-10 px-4 text-center font-semibold text-xs text-foreground/60">
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0">
                <tr
                  v-for="(request, index) in filteredRequests"
                  :key="request.id"
                  class="transition-colors hover:bg-muted/50 border-b-0 group"
                >
                  <!-- Columna #: Número consecutivo 1, 2, 3... -->
                  <td
                    class="text-center shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r font-medium text-xs text-foreground/60 w-12"
                  >
                    {{ index + 1 }}
                  </td>

                  <!-- Columna FOLIO -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r font-mono text-xs font-semibold text-foreground whitespace-nowrap"
                  >
                    <span class="px-2 py-0.5 rounded bg-foreground/5 border border-foreground/10">
                      {{ request.folio || `#${request.id}` }}
                    </span>
                  </td>

                  <!-- Columna Paciente -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r"
                  >
                    <div class="font-semibold text-sm text-foreground">
                      {{ getPatientDisplayName(request) }}
                    </div>
                    <div
                      v-if="getPatientCurp(request)"
                      class="text-[11px] text-foreground/60 font-mono mt-0.5"
                    >
                      CURP: {{ getPatientCurp(request) }}
                    </div>
                  </td>

                  <!-- Columna Fecha Preferida -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r"
                  >
                    <div class="flex items-center gap-1.5 font-medium text-xs text-foreground">
                      <CalendarIcon class="size-3.5 text-primary shrink-0" />
                      {{ formatDate(request.fecha_preferida) }}
                    </div>
                    <div v-if="!request.fecha_preferida" class="text-[11px] text-foreground/50 italic">
                      Sin fecha específica
                    </div>
                  </td>

                  <!-- Columna Turno Preferido con Badge estilizado de alto contraste -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r"
                  >
                    <div class="flex flex-col gap-1 items-start">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs"
                        :class="getShiftBadgeConfig(request.turno_preferido).badgeClass"
                        :title="getShiftDescription(request.turno_preferido)"
                      >
                        <span
                          class="size-2 rounded-full"
                          :class="getShiftBadgeConfig(request.turno_preferido).dotClass"
                        ></span>
                        {{ getShiftBadgeConfig(request.turno_preferido).label }}
                      </span>
                      <span
                        v-if="getShiftBadgeConfig(request.turno_preferido).description"
                        class="text-[10px] text-foreground/50 ml-1 hidden md:inline-block"
                      >
                        {{ getShiftBadgeConfig(request.turno_preferido).description }}
                      </span>
                    </div>
                  </td>

                  <!-- Columna Motivo -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r max-w-xs"
                  >
                    <div class="font-medium text-xs text-foreground truncate" :title="request.motivo">
                      {{ request.motivo || 'Sin motivo especificado' }}
                    </div>
                    <div
                      v-if="request.observaciones_cita || request.observaciones"
                      class="text-[11px] text-foreground/60 truncate italic mt-0.5"
                      :title="request.observaciones_cita || request.observaciones || ''"
                    >
                      Nota: {{ request.observaciones_cita || request.observaciones }}
                    </div>
                  </td>

                  <!-- Columna Fecha de Creación: usa request.creado_el de la interfaz -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap text-xs text-foreground/80 font-medium"
                  >
                    {{ request.creado_el || formatDateTime(request.created_at) || 'Sin fecha' }}
                  </td>

                  <!-- Columna Acciones -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r text-center"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <ButtonBase
                        text="Asignar Cita"
                        :icon="CalendarCheckIcon"
                        color="primary"
                        class="!px-3 !py-1.5 !text-xs whitespace-nowrap font-medium"
                        @click="openAssignModal(request)"
                      />
                      <button
                        type="button"
                        class="p-1.5 rounded-lg text-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Cancelar / Descartar solicitud"
                        @click="openCancelModal(request)"
                      >
                        <TrashIcon class="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal para Asignar y Confirmar Horario de Cita -->
        <DialogBasic id="modal-appointment-create-or-edit" size="3xl">
          <AppointmentCreateUpdate
            patient-id="0"
            :appointment-id="selectedAppointmentId"
            :is-inside-modal="true"
          />
        </DialogBasic>

        <!-- Modal de confirmación para Cancelar Solicitud -->
        <AppointmentCancelModalQuestion
          v-model="isCancelModalOpen"
          :appointment-id="selectedCancelId"
          @cancelled="onAppointmentCancelled"
        />
      </template>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';

import {
  CalendarClock as CalendarClockIcon,
  Calendar as CalendarIcon,
  CalendarCheck as CalendarCheckIcon,
  RefreshCw as RefreshIcon,
  Search as SearchIcon,
  X as CloseIcon,
  Trash2 as TrashIcon,
} from 'lucide-vue-next';

import type { Appointment } from '../interfaces/appointment.interface';
import { getAppointmentRequestsAction } from '../actions/get-appointment-requests.action';
import {
  getShiftDescription,
  normalizeShift,
  SHIFT_OPTIONS,
  type TurnoPreferido,
} from '../helpers/appointment-shift.mapper';

const queryClient = useQueryClient();

// Estado de filtros
const searchTerm = ref('');
const selectedShiftFilter = ref<TurnoPreferido | 'all'>('all');

// Estado de modales
const selectedAppointmentId = ref<string>('create');
const selectedCancelId = ref<number | null>(null);
const isCancelModalOpen = ref(false);

// Query para obtener las solicitudes de citas
const {
  data: rawRequests,
  isLoading,
  isFetching,
  refetch,
} = useQuery({
  queryKey: ['appointment-requests'],
  queryFn: getAppointmentRequestsAction,
});

const requests = computed<Appointment[]>(() => rawRequests.value ?? []);

// Conteo por turno
const countByShift = (shiftValue: TurnoPreferido): number => {
  return requests.value.filter((r) => normalizeShift(r.turno_preferido) === shiftValue).length;
};

// Limpieza de filtros
const clearFilters = () => {
  searchTerm.value = '';
  selectedShiftFilter.value = 'all';
};

// Configuración visual de badges para turno preferido
const getShiftBadgeConfig = (shift?: string | null) => {
  const norm = normalizeShift(shift);
  if (norm === 'matutino') {
    return {
      label: 'Turno Matutino',
      dotClass: 'bg-sky-500',
      badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
      description: '08:00 - 14:00 hrs',
    };
  }
  if (norm === 'vespertino') {
    return {
      label: 'Turno Vespertino',
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      description: '14:00 - 20:00 hrs',
    };
  }
  if (norm === 'indistinto') {
    return {
      label: 'Horario Indistinto',
      dotClass: 'bg-indigo-500',
      badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
      description: 'Cualquier horario disponible',
    };
  }
  return {
    label: shift || 'Sin turno',
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    description: '',
  };
};

// Obtención amigable del nombre del paciente
const getPatientDisplayName = (appointment: Appointment): string => {
  if (appointment.pacientes && appointment.pacientes.length > 0) {
    return appointment.pacientes[0].nombre_completo;
  }
  if (appointment.paciente) {
    return appointment.paciente.nombre_completo;
  }
  return 'Paciente no asignado';
};

// Obtención del CURP del paciente
const getPatientCurp = (appointment: Appointment): string => {
  if (appointment.pacientes && appointment.pacientes.length > 0) {
    return appointment.pacientes[0].curp || '';
  }
  if (appointment.paciente) {
    return appointment.paciente.curp || '';
  }
  return '';
};

// Formato de fechas
const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return 'Sin fecha específica';
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('es-MX', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const cleanStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

// Filtrado reactivo por turno y término de búsqueda
const filteredRequests = computed(() => {
  let list = requests.value;

  if (selectedShiftFilter.value !== 'all') {
    list = list.filter((r) => normalizeShift(r.turno_preferido) === selectedShiftFilter.value);
  }

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.trim().toLowerCase();
    list = list.filter((r) => {
      const patientName = getPatientDisplayName(r).toLowerCase();
      const patientCurp = getPatientCurp(r).toLowerCase();
      const motivo = (r.motivo || '').toLowerCase();
      const fecha = (r.fecha_preferida || '').toLowerCase();
      const folio = (r.folio || '').toLowerCase();
      const shift = (r.turno_preferido || '').toLowerCase();

      return (
        patientName.includes(term) ||
        patientCurp.includes(term) ||
        motivo.includes(term) ||
        fecha.includes(term) ||
        folio.includes(term) ||
        shift.includes(term)
      );
    });
  }

  return list;
});

// Acciones de asignación y cancelación
const openAssignModal = (appointment: Appointment) => {
  selectedAppointmentId.value = String(appointment.id);
  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

const openCancelModal = (appointment: Appointment) => {
  selectedCancelId.value = appointment.id;
  isCancelModalOpen.value = true;
};

const onAppointmentCancelled = () => {
  isCancelModalOpen.value = false;
  selectedCancelId.value = null;
  queryClient.invalidateQueries({ queryKey: ['appointment-requests'] });
  queryClient.invalidateQueries({ queryKey: ['appointments'] });
};
</script>

<style scoped></style>
