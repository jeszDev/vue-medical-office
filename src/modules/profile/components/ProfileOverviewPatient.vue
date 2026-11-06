<template>
  <div class="grid grid-cols-12 gap-6">
    <!-- Columna Izquierda: Ficha Técnica Médica del Paciente con DetailListItem -->
    <div class="col-span-12 lg:col-span-5 xl:col-span-4">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
      >
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-foreground/10">
          <IconBadge color="success" size="md">
            <UserIcon class="size-5 text-success" />
          </IconBadge>
          <div>
            <h3 class="text-sm font-bold text-foreground">Ficha de Identificación</h3>
            <p class="text-xs text-muted-foreground">Datos personales del expediente</p>
          </div>
        </div>

        <div class="space-y-3.5">
          <DetailListItem
            label="Paciente"
            dot-color="primary"
            :value="user.name"
          />

          <DetailListItem
            label="Expediente"
            dot-color="primary"
            :value="user.folio_paciente || 'Por asignar'"
          />

          <DetailListItem
            label="CURP"
            dot-color="success"
            :value="user.curp || 'Sin CURP registrada'"
          />

          <DetailListItem
            v-if="user.edad"
            label="Edad"
            dot-color="neutral"
            :value="`${user.edad} años`"
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

          <DetailListItem
            v-if="user.contacto_emergencia_nombre"
            label="Emergencia"
            dot-color="warning"
            :value="user.contacto_emergencia_nombre"
          />
        </div>
      </div>
    </div>

    <!-- Columna Derecha: Resumen de Salud y Dependientes a Cargo -->
    <div class="col-span-12 lg:col-span-7 xl:col-span-8 space-y-6">
      <!-- Tarjeta de Estado del Expediente y Citas -->
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
                Portal del Paciente y Citas Médicas
              </h4>
              <p class="text-xs text-muted-foreground mt-0.5">
                Seguimiento de tu atención de salud y solicitudes de citas
              </p>
            </div>
          </div>
          <PillBadge color="success" size="xs" label="Expediente Activo" />
        </div>

        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Desde tu perfil puedes consultar tu información de salud, gestionar tus citas programadas y,
          si eres tutor o padre de familia, supervisar el expediente médico de tus dependientes.
        </p>

        <!-- Banner especial si es tutor o padre de familia -->
        <div
          v-if="user.es_tutor || (user.tutelados && user.tutelados.length > 0)"
          class="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3.5"
        >
          <div class="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <UsersIcon class="size-5" />
          </div>
          <div class="flex-1 min-w-0">
            <h5 class="text-xs sm:text-sm font-bold text-foreground">
              Tutor / Representante Legal Registrado
            </h5>
            <p class="text-xs text-muted-foreground mt-0.5">
              Tienes {{ user.tutelados?.length || 0 }} familiar(es) o dependiente(s) vinculado(s) a tu cuenta con acceso a sus expedientes.
            </p>
            <div class="mt-2.5">
              <button
                type="button"
                class="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                @click="$emit('switch-tab', 'dependents')"
              >
                <span>Ver y gestionar dependientes</span>
                <ChevronRightIcon class="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Atajos de Acción Rápida para el Paciente -->
        <div class="mt-5 pt-4 border-t border-foreground/10 flex flex-wrap items-center justify-between gap-3">
          <span class="text-xs text-muted-foreground">Acciones disponibles para tu atención:</span>
          <div class="flex flex-wrap items-center gap-2">
            <ButtonBase
              text="Solicitar Cita Médica"
              :icon="CalendarIcon"
              color="primary"
              size="sm"
              @click="isRequestModalOpen = true"
            />
            <ButtonBase
              text="Ver Mis Citas"
              :icon="CalendarCheckIcon"
              color="secondary"
              size="sm"
              @click="$router.push({ name: 'appointments.index' })"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Solicitud de Cita Médica para el Paciente -->
    <AppointmentPatientRequestModal
      v-model="isRequestModalOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { UserProfileData, ProfileTabType } from '../interfaces';
import DetailListItem from '@/modules/common/components/DetailListItem.vue';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import AppointmentPatientRequestModal from '@/modules/appointment/components/AppointmentPatientRequestModal.vue';
import UserIcon from '@/icons/UserIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import {
  Users as UsersIcon,
  CalendarCheck as CalendarCheckIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-vue-next';

interface Props {
  user: UserProfileData;
}

defineProps<Props>();

defineEmits<{
  (e: 'switch-tab', tab: ProfileTabType): void;
}>();

const $router = useRouter();
const isRequestModalOpen = ref(false);
</script>
