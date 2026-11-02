<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Columna Izquierda: Ficha Operativa con DetailListItem -->
    <div class="col-span-12 lg:col-span-5 xl:col-span-4">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
      >
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-foreground/10">
          <IconBadge color="neutral" size="md">
            <Building2Icon class="size-5 text-foreground" />
          </IconBadge>
          <div>
            <h3 class="text-sm font-bold text-foreground">Ficha de Recepción</h3>
            <p class="text-xs text-muted-foreground">Datos de asignación y contacto</p>
          </div>
        </div>

        <div class="space-y-3.5">
          <DetailListItem
            label="Personal"
            dot-color="primary"
            :value="user.name"
          />

          <DetailListItem
            label="Turno"
            dot-color="primary"
            :value="user.turno || 'Matutino (08:00 - 15:00 hrs)'"
          />

          <DetailListItem
            label="Área Asignada"
            dot-color="success"
            :value="user.area || 'Recepción Central & Módulo de Citas'"
          />

          <DetailListItem label="Teléfono" dot-color="neutral">
            <a
              v-if="user.telefono"
              :href="`tel:${user.telefono}`"
              class="text-primary hover:underline font-medium text-xs sm:text-sm"
            >
              {{ user.telefono }}
            </a>
            <span v-else class="text-xs opacity-50 italic">Sin registrar</span>
          </DetailListItem>

          <DetailListItem label="Correo" dot-color="neutral" value-classes="max-w-[190px]">
            <a
              v-if="user.email"
              :href="`mailto:${user.email}`"
              class="text-primary hover:underline font-medium text-xs sm:text-sm truncate block"
              :title="user.email"
            >
              {{ user.email }}
            </a>
          </DetailListItem>
        </div>
      </div>
    </div>

    <!-- Columna Derecha: Métricas y Flujo Operativo de Recepción -->
    <div class="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
      >
        <div class="flex items-center justify-between pb-3 border-b border-foreground/10 mb-4">
          <div class="flex items-center gap-2.5">
            <IconBadge color="neutral" size="sm">
              <CalendarClockIcon class="size-4 text-foreground" />
            </IconBadge>
            <div>
              <h4 class="text-sm font-semibold text-foreground">
                Panel Operativo de Citas y Pacientes
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">
                Control de solicitudes en espera y gestión de agenda en ventanilla
              </p>
            </div>
          </div>
          <PillBadge color="neutral" size="xs" label="Módulo Activo" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Widget 1: Solicitudes Pendientes -->
          <div class="rounded-xl border border-warning/20 bg-warning/5 p-4 flex items-center gap-3">
            <IconBadge color="warning" size="lg">
              <CalendarClockIcon class="size-6 text-warning" />
            </IconBadge>
            <div>
              <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Solicitudes Pendientes
              </span>
              <div class="text-xl font-bold text-warning mt-0.5">
                {{ user.solicitudes_pendientes || 0 }}
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                Citas en espera de confirmación
              </p>
            </div>
          </div>

          <!-- Widget 2: Citas Gestionadas Hoy -->
          <div class="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
            <IconBadge color="primary" size="lg">
              <CheckCircleIcon class="size-6 text-primary" />
            </IconBadge>
            <div>
              <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Gestionadas Hoy
              </span>
              <div class="text-xl font-bold text-primary mt-0.5">
                {{ user.citas_gestionadas_hoy || 0 }}
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                Pacientes recibidos en ventanilla
              </p>
            </div>
          </div>
        </div>

        <!-- Atajos de Acción Rápida para Recepción -->
        <div class="mt-5 pt-4 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs text-muted-foreground">Acciones operativas rápidas:</span>
          <div class="flex flex-wrap items-center gap-2">
            <ButtonBase
              text="Solicitudes Pendientes"
              :icon="CalendarClockIcon"
              color="warning"
              size="sm"
              @click="$router.push({ name: 'appointments.requests' })"
            />
            <ButtonBase
              text="Agendar Cita"
              :icon="PlusIcon"
              color="secondary"
              size="sm"
              @click="$router.push({ name: 'appointments.create' })"
            />
            <ButtonBase
              text="Registrar Paciente"
              :icon="UserPlusIcon"
              color="primary"
              size="sm"
              @click="$router.push({ name: 'patients.create' })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { UserProfileData } from '../interfaces';
import DetailListItem from '@/modules/common/components/DetailListItem.vue';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import {
  Building2 as Building2Icon,
  CalendarClock as CalendarClockIcon,
  CheckCircle2 as CheckCircleIcon,
  UserPlus as UserPlusIcon,
} from 'lucide-vue-next';

interface Props {
  user: UserProfileData;
}

defineProps<Props>();
const $router = useRouter();
</script>
