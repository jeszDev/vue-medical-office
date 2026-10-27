<template>
  <div ref="dropdownRef" class="relative flex h-9 items-center">
    <!-- Botón disparador con campana e indicador de notificaciones -->
    <button
      type="button"
      class="relative flex size-9 items-center justify-center rounded-xl border border-(--color-nav-foreground)/30 bg-(--color-nav-foreground)/10 text-(--color-nav-foreground) hover:bg-(--color-nav-foreground)/20 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
      :class="{ 'ring-2 ring-primary/40 bg-(--color-nav-foreground)/20': isOpen }"
      :title="tooltipText"
      aria-label="Notificaciones de citas"
      @click="toggleDropdown"
    >
      <BellIcon class="size-4.5 stroke-[1.6]" />

      <!-- Badge con contador y animación tipo ping si hay solicitudes -->
      <span
        v-if="pendingCount > 0"
        class="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background"
      >
        <span
          class="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75"
        ></span>
        <span class="relative">{{ pendingCount > 9 ? '9+' : pendingCount }}</span>
      </span>
    </button>

    <!-- Menú desplegable con diseño moderno y soporte para clics fuera -->
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
        class="box absolute right-0 top-full mt-2.5 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border border-foreground/10 bg-background/95 p-4 shadow-2xl backdrop-blur-md"
      >
        <!-- Encabezado del dropdown -->
        <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm text-foreground">Solicitudes de Citas</span>
            <span
              v-if="pendingCount > 0"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/25"
            >
              {{ pendingCount }} pendiente{{ pendingCount === 1 ? '' : 's' }}
            </span>
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
                  <span
                    v-if="request.turno_preferido"
                    class="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase shrink-0"
                    :class="getShiftBadgeStyle(request.turno_preferido)"
                  >
                    {{ getShiftBadgeLabel(request.turno_preferido) }}
                  </span>
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

import { useNavigationMenu } from '../composables/useNavigationMenu';
import { getAppointmentRequestsAction } from '@/modules/appointment/actions/get-appointment-requests.action';
import {
  normalizeShift,
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

// Roles autorizados para gestionar solicitudes de citas
const { hasRole } = useNavigationMenu();
const canManageRequests = computed(() =>
  hasRole(['admin', 'administrador', 'recepcionista', 'doctor', 'medico', 'médico']),
);

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

const getShiftBadgeStyle = (shift?: string | null) => {
  const norm = normalizeShift(shift);
  if (norm === 'matutino') {
    return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30';
  }
  if (norm === 'vespertino') {
    return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30';
  }
  return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30';
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
