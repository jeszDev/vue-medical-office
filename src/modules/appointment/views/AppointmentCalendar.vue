<template>
  <TemplateView v-if="!isLoading" title="Cita">
    <template #main>
      <div class="grid grid-cols-12 gap-x-10 gap-y-9">
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">FECHA Y HORA DE LA CITA</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">13/02/2026 de las 09:00 a las 10:00 hrs.</div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70">MEDICO</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.motivo }}</div>
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
