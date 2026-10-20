<template>
  <TemplateView v-if="appointment" title="DETALLES DE LA CITA">
    <template #main>
      <div class="flex flex-wrap justify-end">
        <PillBadge
          size="lg"
          :color="badgeColor"
          :label="`CITA ${statusName.toUpperCase()}`"
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
            <div class="text-base">
              {{ getAppointmentDoctorName(appointment) || 'No asignado' }}
            </div>
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
            <div class="text-base">
              {{
                appointment.observaciones ||
                appointment.observaciones_cita ||
                'SIN OBSERVACIONES'
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t pt-10 flex flex-wrap justify-center gap-3">
        <ButtonBase
          text="Atender cita"
          :icon="stethoscopeIcon"
          color="primary"
          :disabled="statusName === 'Cancelada' || isPendingCancelAppointment"
          @click="goToConsultation()"
        />
        <ButtonBase
          text="Editar cita"
          :icon="EditIcon"
          color="secondary"
          :disabled="statusName === 'Cancelada' || isPendingCancelAppointment"
          @click="onEdit"
        />
        <ButtonBase
          text="Cancelar cita"
          :icon="CancelIcon"
          color="danger"
          :disabled="statusName === 'Cancelada' || isPendingCancelAppointment"
          data-tw-toggle="modal"
          data-tw-target="#modal-appointment-cancel"
        />
      </div>

      <ModalQuestion
        id="modal-appointment-cancel"
        :model-value="false"
        title="¿Quieres cancelar la cita?"
        description="Está acción es irrevesible."
        confirmText="Sí, cancelar cita"
        cancelText="Cerrar"
        :loading="isPendingCancelAppointment"
        @confirm="onCancel"
      />
    </template>
  </TemplateView>
  <div v-else class="flex flex-col items-center justify-center p-12 gap-3 min-h-[300px]">
    <FullScreenLoader />
    <span class="text-sm font-medium opacity-70">Cargando detalles de la cita...</span>
  </div>
</template>

<script setup lang="ts">
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import EditIcon from '@/icons/EditIcon.vue';
import CancelIcon from '@/icons/CancelIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import type { Appointment } from '../interfaces/appointment.interface';
import { computed } from 'vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import MessageIcon from '@/icons/MessageIcon.vue';
import stethoscopeIcon from '@/icons/stethoscopeIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import { useCancelAppointment } from '../composables/useCancelAppointment';
import {
  getAppointmentDoctorName,
  getAppointmentStatusColor,
  getAppointmentStatusName,
} from '../helpers/get-appointment-status-color.mapper';

interface Props {
  appointment: null | Appointment;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'updated', appointment: Appointment): void;
  (e: 'consultation', appointmentId: number): void;
  (e: 'edit', appointmentId: number): void;
}>();

const { functionCancelAppointment, isPendingCancelAppointment } = useCancelAppointment();

const statusName = computed(() => {
  return getAppointmentStatusName(props.appointment?.estatus);
});

const badgeColor = computed(() => {
  return getAppointmentStatusColor(props.appointment?.estatus);
});

const onCancel = async () => {
  if (isPendingCancelAppointment.value || !props.appointment?.id) return;

  try {
    const updatedAppointment = await functionCancelAppointment(props.appointment.id.toString());

    emit('updated', updatedAppointment);

    window.tailwind.Modal.getOrCreateInstance(
      document.getElementById('modal-appointment-cancel'),
    )?.hide();
  } catch {}
};

const goToConsultation = () => {
  if (!props.appointment?.id) return;
  emit('consultation', props.appointment.id);
};

const onEdit = () => {
  if (!props.appointment?.id) return;
  emit('edit', props.appointment.id);
};
</script>

<style scoped></style>
