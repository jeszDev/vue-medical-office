<template>
  <div
    v-if="canManageRequests"
    ref="dropdownRef"
    class="group/notifications relative flex h-9 items-center"
  >
    <!-- Botón disparador con campana nativa Midone e indicador sutil -->
    <button
      type="button"
      class="cursor-pointer relative flex size-9 items-center justify-center text-(--color-nav-foreground) hover:opacity-80 transition-all focus:outline-none"
      :title="tooltipText"
      aria-label="Notificaciones de citas"
      @click="toggleDropdown"
    >
      <BellIcon
        class="size-4 stroke-[1.5] stroke-(--color) fill-(--color)/25 [--color:var(--color-nav-foreground)] transition-transform active:scale-95"
      />

      <!-- Indicador sutil de punto cuando hay solicitudes pendientes -->
      <span
        v-if="pendingCount > 0"
        class="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-primary dark:ring-background shadow-xs"
      />
    </button>

    <!-- Menú desplegable con diseño de doble tarjeta flotante Midone -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isOpen"
        class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:shadow-foreground/5 absolute right-0 top-full z-50 -mr-0.5 mt-2 flex w-80 sm:w-96 flex-col gap-2.5 px-6 py-5 before:rounded-2xl before:shadow-xl before:backdrop-blur after:rounded-2xl text-foreground"
      >
        <!-- Encabezado del dropdown -->
        <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm text-foreground">Solicitudes de Citas</span>
            <PillBadge
              v-if="pendingCount > 0"
              size="xs"
              color="primary"
              :label="`${pendingCount} pendiente${pendingCount === 1 ? '' : 's'}`"
            />
          </div>

          <RouterLink
            v-if="canManageRequests"
            :to="{ name: 'appointments.requests' }"
            class="text-xs font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            @click="isOpen = false"
          >
            <span>Ver todas</span>
            <ChevronRightIcon class="size-3.5" />
          </RouterLink>
        </div>

        <!-- Lista de solicitudes o estado vacío -->
        <div class="py-2 max-h-80 overflow-y-auto">
          <!-- Cargando -->
          <div
            v-if="isLoading"
            class="flex flex-col items-center justify-center py-6 gap-2 text-foreground/60"
          >
            <div class="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span class="text-xs">Consultando solicitudes...</span>
          </div>

          <!-- Estado vacío -->
          <div
            v-else-if="pendingCount === 0"
            class="flex flex-col items-center justify-center py-6 px-4 text-center"
          >
            <div
              class="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2.5"
            >
              <CheckCircle2Icon class="size-5.5" />
            </div>
            <p class="font-medium text-xs text-foreground">Sin solicitudes pendientes</p>
            <p class="text-[11px] text-foreground/60 mt-0.5">
              {{
                canManageRequests
                  ? 'Todas las solicitudes de pacientes han sido atendidas.'
                  : 'No tienes notificaciones pendientes en este momento.'
              }}
            </p>
          </div>

          <!-- Lista de solicitudes pendientes -->
          <div v-else class="flex flex-col gap-1.5">
            <div
              v-for="request in displayRequests"
              :key="request.id"
              class="group/item flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-foreground/5 cursor-pointer border border-transparent hover:border-foreground/10"
              @click="goToRequests"
            >
              <!-- Avatar con iniciales del paciente -->
              <div
                class="flex size-9 flex-none items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20"
              >
                {{ getPatientInitials(request) }}
              </div>

              <!-- Información de la solicitud -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span
                    class="font-medium text-xs text-foreground truncate group-hover/item:text-primary transition-colors"
                  >
                    {{ getPatientDisplayName(request) }}
                  </span>
                  <PillBadge
                    v-if="request.turno_preferido"
                    size="xs"
                    :color="getShiftBadgeColor(request.turno_preferido)"
                    :label="getShiftBadgeLabel(request.turno_preferido)"
                    class="shrink-0 uppercase"
                  />
                </div>

                <p class="text-[11px] text-foreground/70 truncate mt-0.5" :title="request.motivo">
                  {{ request.motivo || 'Sin motivo especificado' }}
                </p>

                <div class="flex items-center gap-2 mt-1 text-[10px] text-foreground/50">
                  <span v-if="request.folio" class="font-mono">{{ request.folio }}</span>
                  <span v-if="request.folio && (request.creado_el || request.created_at)">•</span>
                  <span>{{ request.creado_el || formatRelativeOrDate(request.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie del dropdown -->
        <div v-if="pendingCount > 0 && canManageRequests" class="pt-2 border-t border-foreground/10">
          <button
            type="button"
            class="w-full py-2 px-3 text-center text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            @click="goToRequests"
          >
            <span>Atender solicitudes ({{ pendingCount }})</span>
            <ExternalLinkIcon class="size-3.5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { onClickOutside } from '@vueuse/core';
import {
  Bell as BellIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle2 as CheckCircle2Icon,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-vue-next';

import { usePermissions } from '@/modules/auth/composables/usePermissions';
import { PERMISSIONS } from '@/modules/auth/constants/permissions.constant';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import { getAppointmentRequestsAction } from '@/modules/appointment/actions/get-appointment-requests.action';
import {
  getShiftBadgeColor,
  getShiftBadgeLabel,
} from '@/modules/appointment/helpers/appointment-shift.mapper';
import type { Appointment } from '@/modules/appointment/interfaces/appointment.interface';

const router = useRouter();
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

onClickOutside(dropdownRef, () => {
  isOpen.value = false;
});

// Permisos autorizados para gestionar solicitudes de citas
const { can, isAdmin } = usePermissions();
const canManageRequests = computed(() => isAdmin.value || can(PERMISSIONS.APPOINTMENTS_CONFIRM));

// Consulta periódica (polling cada 30 segundos) de solicitudes pendientes
const { data: rawRequests, isLoading } = useQuery({
  queryKey: ['appointment-requests'],
  queryFn: getAppointmentRequestsAction,
  enabled: canManageRequests,
  refetchInterval: 30000,
  refetchOnWindowFocus: true,
});

const requests = computed<Appointment[]>(() => rawRequests.value ?? []);
const pendingCount = computed(() => requests.value.length);
const displayRequests = computed(() => requests.value.slice(0, 4));

const tooltipText = computed(() => {
  if (pendingCount.value > 0) {
    return `${pendingCount.value} solicitud${pendingCount.value === 1 ? '' : 'es'} de cita pendiente${pendingCount.value === 1 ? '' : 's'}`;
  }
  return 'Notificaciones';
});

// Helpers de presentación
const getPatientDisplayName = (appointment: Appointment): string => {
  if (appointment.pacientes && appointment.pacientes.length > 0) {
    return appointment.pacientes[0].nombre_completo;
  }
  if (appointment.paciente) {
    return appointment.paciente.nombre_completo;
  }
  return 'Paciente';
};

const getPatientInitials = (appointment: Appointment): string => {
  const name = getPatientDisplayName(appointment);
  if (!name || name === 'Paciente') return 'P';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const formatRelativeOrDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr.replace(' ', 'T')}`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr || '';
  }
};

const goToRequests = () => {
  isOpen.value = false;
  router.push({ name: 'appointments.requests' });
};
</script>
