<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Columna Izquierda: Ficha Técnica Profesional con DetailListItem -->
    <div class="col-span-12 lg:col-span-5 xl:col-span-4">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
      >
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-foreground/10">
          <IconBadge color="primary" size="md">
            <StethoscopeIcon class="size-5 text-primary" />
          </IconBadge>
          <div>
            <h3 class="text-sm font-bold text-foreground">Ficha Profesional</h3>
            <p class="text-xs text-muted-foreground">Datos médicos y de acreditación</p>
          </div>
        </div>

        <div class="space-y-3.5">
          <DetailListItem
            label="Médico"
            dot-color="primary"
            :value="user.name"
          />

          <DetailListItem
            label="Especialidad"
            dot-color="primary"
            :value="user.especialidad || 'Medicina General'"
          />

          <DetailListItem
            label="Cédula Prof."
            dot-color="success"
            :value="user.cedula_profesional || 'No especificada'"
          />

          <DetailListItem
            label="Consultorio"
            dot-color="neutral"
            :value="user.consultorio || 'Consultorio Principal'"
          />

          <DetailListItem
            label="Horario"
            dot-color="neutral"
            :value="user.horario_atencion || 'Lunes a Viernes 09:00 - 17:00'"
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

    <!-- Columna Derecha: Métricas y Atajos de Atención Clínica -->
    <div class="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
      <!-- Tarjeta de Productividad y Resumen de Agenda -->
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
      >
        <div class="flex items-center justify-between pb-3 border-b border-foreground/10 mb-4">
          <div class="flex items-center gap-2.5">
            <IconBadge color="primary" size="sm">
              <CalendarIcon class="size-4 text-primary" />
            </IconBadge>
            <div>
              <h4 class="text-sm font-semibold text-foreground">
                Resumen Clínico y Actividad del Médico
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">
                Estadísticas de consulta y accesos directos para la jornada diaria
              </p>
            </div>
          </div>
          <PillBadge color="primary" size="xs" label="Jornada Activa" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Widget 1: Consultas Realizadas -->
          <div class="rounded-xl border border-foreground/10 bg-background/50 p-4 flex items-center gap-3">
            <IconBadge color="primary" size="lg">
              <ClipboardListIcon class="size-6 text-primary" />
            </IconBadge>
            <div>
              <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Consultas Totales
              </span>
              <div class="text-xl font-bold text-foreground mt-0.5">
                {{ user.total_consultas || 0 }}
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                Historial de expedientes atendidos
              </p>
            </div>
          </div>

          <!-- Widget 2: Citas de Hoy -->
          <div class="rounded-xl border border-foreground/10 bg-background/50 p-4 flex items-center gap-3">
            <IconBadge color="success" size="lg">
              <CalendarIcon class="size-6 text-success" />
            </IconBadge>
            <div>
              <span class="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Citas para Hoy
              </span>
              <div class="text-xl font-bold text-success mt-0.5">
                {{ user.citas_hoy || 0 }}
              </div>
              <p class="text-[11px] text-muted-foreground mt-0.5">
                Programadas en consultorio
              </p>
            </div>
          </div>
        </div>

        <!-- Atajos de Acción Rápida Médica -->
        <div class="mt-5 pt-4 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs text-muted-foreground">Acciones directas para la jornada:</span>
          <div class="flex flex-wrap items-center gap-2">
            <ButtonBase
              text="Ver Calendario de Citas"
              :icon="CalendarIcon"
              color="secondary"
              size="sm"
              @click="$router.push({ name: 'appointments.index' })"
            />
            <ButtonBase
              text="Buscar Pacientes"
              :icon="UsersIcon"
              color="primary"
              size="sm"
              @click="$router.push({ name: 'patients.index' })"
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
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import ClipboardListIcon from '@/icons/ClipboardListIcon.vue';
import { Users as UsersIcon } from 'lucide-vue-next';

interface Props {
  user: UserProfileData;
}

defineProps<Props>();
const $router = useRouter();
</script>
