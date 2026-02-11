<template>
  <TemplateView v-if="!isLoading" title="Calendario de citas">
    <template #main>
      <vue-cal
        locale="es"
        active-view="week"
        :time="true"
        :time-from="8 * 60"
        :time-to="20 * 60"
        :today-button="false"
        :views="['day', 'days', 'month']"
        :time-step="30"
        :hide-weekends="false"
        :disable-views="['years', 'year']"
      />
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { VueCal } from 'vue-cal';
import 'vue-cal/style';

import { medicalOfficeApi } from '@/api/medicalOfficeApi';
import { Appointment } from '../interfaces/appointment.interface';

import TemplateView from '@/modules/template/components/TemplateView.vue';

const { data } = await medicalOfficeApi.get<Appointment[]>(`/appointments/${appointmentId}`);
</script>

<style scoped></style>
