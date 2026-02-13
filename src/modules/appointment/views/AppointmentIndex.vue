<template>
  <TemplateView v-if="!isLoading" title="Calendario de citas">
    <template #main>
      <!-- <vue-cal
        locale="es"
        active-view="week"
        :time="true"
        :time-from="8 * 60"
        :time-to="20 * 60"
        :today-button="false"
        :views="['day', 'days']"
        :time-step="30"
        :hide-weekends="false"
        :disable-views="['years', 'year']"
        :events="events"
      /> -->

      <vue-cal
        locale="es"
        active-view="week"
        :time-from="8 * 60"
        :time-step="30"
        :time-to="20 * 60"
        :time="true"
        :today-button="false"
        :views="['day', 'week']"
        :events="calendarEvents"
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
import { ref, onMounted, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getAppointmentsAction } from '../actions/get-appointments.action';

const fromDate = ref<string | null>('2026-02-01');
const toDate = ref<string | null>('2026-02-28');

const {
  data: events,
  isLoading,
  error,
} = useQuery({
  queryKey: ['appointments', fromDate.value, toDate.value],
  queryFn: () => getAppointmentsAction(fromDate.value, toDate.value),
  select: (data) =>
    data.map((appointment: Appointment) => ({
      start: new Date(appointment.fecha_hora_inicio),
      end: new Date(appointment.fecha_hora_termino),
      title: `${appointment.motivo}` ?? 'Cita médica',
    })),
});

const calendarEvents = computed(() => (events.value ?? []).map((e) => ({ ...e })));

// const formatDate = (date: Date) => {
//   return date.toISOString().split('T')[0];
// };

// const onViewChange = ({ startDate, endDate }: any) => {
//   fromDate.value = formatDate(startDate);
//   toDate.value = formatDate(endDate);
// };

// onMounted(() => {
//   loadAppointments();
// });
</script>

<style scoped></style>
