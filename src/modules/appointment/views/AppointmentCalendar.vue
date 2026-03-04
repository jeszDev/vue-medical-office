<template>
  <TemplateView v-if="appointment" title="DETALLES DE LA CITA">
    <template #main>
      <div class="flex flex-wrap justify-end">
        <PillBadge
          size="lg"
          :color="badgeColor"
          :label="`CITA ${appointment.estatus.toUpperCase()}`"
        />
      </div>

      <div class="grid grid-cols-12 gap-x-10 gap-y-6">
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70 flex"><CalendarIcon /> FECHA Y HORA DE LA CITA</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">
              {{ appointment.fecha_inicio }} de las {{ appointment.hora_inicio }} a las
              {{ appointment.hora_termino }} hrs.
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70 flex"><UserIcon /> PACIENTE</div>
          <div class="mt-1.5 flex items-center">
            <div v-for="(patient, index) in appointment.pacientes" :key="index" class="text-base">
              {{ patient.nombre_completo }}
            </div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70 flex"><UserIcon /> MÉDICO</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.medico }}</div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70 flex"><MessageIcon /> MOTIVO DE LA CITA</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.motivo }}</div>
          </div>
        </div>
        <div class="col-span-12 sm:col-span-12 md:col-span-12">
          <div class="text-xs opacity-70 flex"><ObservationsIcon /> OBSERVACIONES</div>
          <div class="mt-1.5 flex items-center">
            <div class="text-base">{{ appointment.observaciones_cita || 'SIN OBSERVACIONES' }}</div>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t pt-10 flex flex-wrap justify-center gap-3">
        <ButtonBase
          text="Atender cita"
          :icon="stethoscopeIcon"
          color="primary"
          :disabled="appointment.estatus === 'Cancelada'"
          @click="goToConsultation()"
        />
        <ButtonBase
          text="Editar cita"
          :icon="EditIcon"
          color="secondary"
          :disabled="appointment.estatus === 'Cancelada'"
          data-tw-toggle="modal"
          data-tw-target="#modal-patient-create-or-edit"
        />
        <ButtonBase
          text="Cancelar cita"
          :icon="CancelIcon"
          color="danger"
          :disabled="appointment.estatus === 'Cancelada'"
          @click="showCancelModalQuestion = true"
        />
      </div>

      <AppointmentCancelModalQuestion
        v-model="showCancelModalQuestion"
        :appointmentId="appointment.id"
        @cancelled="handleCancelled"
      />
    </template>
  </TemplateView>
  <div v-else>cargando...</div>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import EditIcon from '@/icons/EditIcon.vue';
import CancelIcon from '@/icons/CancelIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';

import { Appointment } from '../interfaces/appointment.interface';
import { computed, ref } from 'vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import MessageIcon from '@/icons/MessageIcon.vue';
import stethoscopeIcon from '@/icons/stethoscopeIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';

interface Props {
  appointment: null | Appointment;
}

const props = defineProps<Props>();

const showCancelModalQuestion = ref(false);

const emit = defineEmits<{
  (e: 'updated', appointment: Appointment): void;
  (e: 'consultation', appointmentId: number): void;
}>();

const badgeColor = computed(() => {
  const status = props.appointment.estatus.toLowerCase();

  const map: Record<string, 'primary' | 'warning' | 'success' | 'danger' | 'pending'> = {
    confirmada: 'success',
    cancelada: 'danger',
    pendiente: 'pending',
  };

  return map[status] ?? 'primary';
});

const goToConsultation = () => {
  emit('consultation', props.appointment.id);
};

const handleCancelled = (updatedAppointment) => {
  emit('updated', updatedAppointment);
};
</script>

<style scoped></style>
