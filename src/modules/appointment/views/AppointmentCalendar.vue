<template>
  <TemplateView v-if="appointment" title="Detalles de la cita">
    <template #main>
      <div class="flex flex-wrap justify-end">
        <div
          class="bg-(--color)/20 border-(--color)/60 text-(--color) flex cursor-pointer items-center rounded-full border text-xs px-5 py-2 [--color:var(--color-pending)]"
        >
          CITA {{ appointment.estatus.toUpperCase() }}
        </div>
      </div>

      <div class="grid grid-cols-12 gap-x-10 gap-y-9">
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">FECHA Y HORA DE LA CITA</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">
              {{ appointment.fecha_inicio }} de las {{ appointment.hora_inicio }} a las
              {{ appointment.hora_termino }} hrs.
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">PACIENTE</div>
          <div class="mt-1.5 flex items-center">
            <div v-for="(patient, index) in appointment.pacientes" :key="index" class="text-base">
              {{ patient.nombre_completo }}
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">MEDICO</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.medico }}</div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">MOTIVO DE LA CITA</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.motivo }}</div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">OBSERVACIONES</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.observaciones_cita || 'SIN OBSERVACIONES' }}</div>
          </div>
        </div>
      </div>
    </template>
  </TemplateView>
  <div v-else>cargando...</div>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import { Appointment } from '../interfaces/appointment.interface';

interface Props {
  appointment: Appointment;
}

defineProps<Props>();
</script>

<style scoped></style>
