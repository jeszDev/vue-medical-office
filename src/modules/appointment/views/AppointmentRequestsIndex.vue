<template>
  <TemplateView title="SOLICITUDES DE CITAS">
    <template #header>
      <div class="flex flex-wrap items-center justify-between w-full gap-4">
        <div>
          <h2 class="text-lg font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarClockIcon class="size-5 text-primary" />
            SOLICITUDES DE CITAS PENDIENTES
            <PillBadge
              v-if="filteredRequests.length > 0"
              size="xs"
              color="primary"
              class="ml-1"
              :label="`${filteredRequests.length} pendiente${filteredRequests.length === 1 ? '' : 's'}`"
            />
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
        <!-- Tarjetas de filtro por turno estilo Punto de Venta (Midone) -->
        <AppointmentRequestsShiftCards
          v-model="selectedShiftFilter"
          :requests="requests"
        />

        <!-- Barra secundaria: Resumen de resultados filtrados y buscador -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-2 text-xs text-foreground/70">
            <span>
              Mostrando <strong class="text-foreground">{{ filteredRequests.length }}</strong> de
              <strong class="text-foreground">{{ requests.length }}</strong> solicitudes
            </span>
            <button
              v-if="selectedShiftFilter !== 'all' || searchTerm"
              type="button"
              class="text-xs text-primary hover:underline cursor-pointer ml-1 inline-flex items-center gap-1 font-medium"
              title="Restablecer filtros"
              @click="clearFilters"
            >
              <CloseIcon class="size-3" />
              Limpiar filtros
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
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                  >
                    <PillBadge
                      size="xs"
                      color="foreground"
                      rounded="md"
                      class="font-mono font-semibold"
                      :label="request.folio || `#${request.id}`"
                    />
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
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                  >
                    <div class="font-medium text-xs text-foreground">
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
                      <PillBadge
                        size="xs"
                        :color="getShiftBadgeColor(request.turno_preferido)"
                        :dot="true"
                        :label="getShiftBadgeLabel(request.turno_preferido)"
                        :title="getShiftDescription(request.turno_preferido)"
                      />
                      <span
                        v-if="getShiftDescription(request.turno_preferido)"
                        class="text-[10px] text-foreground/50 ml-1 hidden md:inline-block"
                      >
                        {{ getShiftDescription(request.turno_preferido) }}
                      </span>
                    </div>
                  </td>

                  <!-- Columna Motivo con expansión interactiva en textos largos -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r min-w-[200px] max-w-xs align-top"
                  >
                    <div
                      v-clamp="request.id"
                      class="font-medium text-xs text-foreground transition-all"
                      :class="[
                        isReasonExpanded(request.id) ? 'whitespace-normal break-words' : 'line-clamp-2 break-words',
                      ]"
                      :title="request.motivo"
                    >
                      {{ request.motivo || 'Sin motivo especificado' }}
                    </div>
                    <div
                      v-if="request.observaciones_cita || request.observaciones"
                      v-clamp="request.id"
                      class="text-[11px] text-foreground/60 italic mt-1 transition-all"
                      :class="[
                        isReasonExpanded(request.id) ? 'whitespace-normal break-words' : 'line-clamp-1 break-words',
                      ]"
                      :title="request.observaciones_cita || request.observaciones || ''"
                    >
                      <span class="font-medium not-italic text-foreground/70">Nota:</span>
                      {{ request.observaciones_cita || request.observaciones }}
                    </div>
                    <button
                      v-if="hasLongReason(request)"
                      type="button"
                      class="text-[11px] font-medium text-primary hover:underline cursor-pointer mt-1 inline-flex items-center gap-0.5"
                      @click="toggleReasonExpanded(request.id)"
                    >
                      <span>{{ isReasonExpanded(request.id) ? 'Ver menos' : 'Ver más...' }}</span>
                    </button>
                  </td>

                  <!-- Columna Fecha de Creación: usa request.creado_el de la interfaz -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap text-xs text-foreground/80 font-medium"
                  >
                    {{ request.creado_el || formatDateTime(request.created_at) || 'Sin fecha' }}
                  </td>

                  <!-- Columna Acciones homologada -->
                  <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 border-y border-foreground/10 bg-background first:border-l last:border-r text-center whitespace-nowrap"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <TableActionButton
                        variant="success"
                        :icon="CalendarCheckIcon"
                        tooltip="Asignar"
                        @click="openAssignModal(request)"
                      />
                      <TableActionButton
                        variant="danger"
                        :icon="TrashIcon"
                        tooltip="Cancelar"
                        @click="openCancelModal(request)"
                      />
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
import { ref, computed, onMounted, onBeforeUnmount, type Directive } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import TableActionButton from '@/modules/common/components/TableActionButton.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';
import AppointmentRequestsShiftCards from '@/modules/appointment/components/AppointmentRequestsShiftCards.vue';

import {
  CalendarClock as CalendarClockIcon,
  CalendarCheck as CalendarCheckIcon,
  RefreshCw as RefreshIcon,
  Search as SearchIcon,
  X as CloseIcon,
  Trash2 as TrashIcon,
} from 'lucide-vue-next';

import type { Appointment } from '../interfaces/appointment.interface';
import { getAppointmentRequestsAction } from '../actions/get-appointment-requests.action';
import {
  getShiftBadgeColor,
  getShiftBadgeLabel,
  getShiftDescription,
  normalizeShift,
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

// Estado de expansión y detección de desbordamiento en motivo/notas
const expandedReasonIds = ref<Set<number>>(new Set());
const clampedReasonIds = ref<Record<number, boolean>>({});
const monitoredElements = new Map<HTMLElement, number>();

const isReasonExpanded = (id: number): boolean => {
  return expandedReasonIds.value.has(id);
};

const toggleReasonExpanded = (id: number) => {
  const newSet = new Set(expandedReasonIds.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  expandedReasonIds.value = newSet;
};

const checkElementClamp = (el: HTMLElement, id: number) => {
  if (expandedReasonIds.value.has(id)) return;
  const isOverflowing = el.scrollHeight > el.clientHeight + 1;
  if (isOverflowing) {
    clampedReasonIds.value[id] = true;
  }
};

const recheckAllClamps = () => {
  monitoredElements.forEach((id, el) => {
    if (!expandedReasonIds.value.has(id)) {
      const isOverflowing = el.scrollHeight > el.clientHeight + 1;
      clampedReasonIds.value[id] = isOverflowing;
    }
  });
};

const vClamp: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    monitoredElements.set(el, binding.value);
    checkElementClamp(el, binding.value);
  },
  updated(el, binding) {
    monitoredElements.set(el, binding.value);
    checkElementClamp(el, binding.value);
  },
  unmounted(el) {
    monitoredElements.delete(el);
  },
};

onMounted(() => {
  window.addEventListener('resize', recheckAllClamps, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', recheckAllClamps);
  monitoredElements.clear();
});

const hasLongReason = (appointment: Appointment): boolean => {
  if (expandedReasonIds.value.has(appointment.id)) {
    return true;
  }
  if (clampedReasonIds.value[appointment.id] !== undefined) {
    return clampedReasonIds.value[appointment.id];
  }
  // Heurística antes del renderizado DOM: en celda max-w-xs caben ~95-100 caracteres en 2 líneas
  const motivoLength = (appointment.motivo || '').length;
  const notaLength = (appointment.observaciones_cita || appointment.observaciones || '').length;
  return motivoLength > 95 || notaLength > 55;
};

// Limpieza de filtros
const clearFilters = () => {
  searchTerm.value = '';
  selectedShiftFilter.value = 'all';
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
