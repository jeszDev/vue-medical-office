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
          :disabled="appointment.estatus === 'Cancelada' || isPending"
          @click="goToConsultation()"
        />
        <ButtonBase
          text="Editar cita"
          :icon="EditIcon"
          color="secondary"
          :disabled="appointment.estatus === 'Cancelada' || isPending"
          data-tw-toggle="modal"
          data-tw-target="#modal-patient-create-or-edit"
        />
        <ButtonBase
          text="Cancelar cita"
          :icon="CancelIcon"
          color="danger"
          :disabled="appointment.estatus === 'Cancelada' || isPending"
          data-tw-toggle="modal"
          data-tw-target="#modal-appointment-cancel"
        />
      </div>

      <ModalQuestion
        id="modal-appointment-cancel"
        title="¿Quieres cancelar la cita?"
        description="Está acción es irrevesible."
        confirmText="Sí, cancelar cita"
        cancelText="Cerrar"
        :loading="isPending"
        @confirm="onCancel"
      />
    </template>
  </TemplateView>
  <div v-else>cargando...</div>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import EditIcon from '@/icons/EditIcon.vue';
import CancelIcon from '@/icons/CancelIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';

import { Appointment } from '../interfaces/appointment.interface';
import { useMutation } from '@tanstack/vue-query';
import { cancelAppointmentAction } from '../actions/cancel-appointment.action';
import { useToast } from 'vue-toastification';
import { computed, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import MessageIcon from '@/icons/MessageIcon.vue';
import stethoscopeIcon from '@/icons/stethoscopeIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import { useRouter } from 'vue-router';

interface Props {
  appointment: Appointment;
}

const props = defineProps<Props>();

const queryClient = useQueryClient();
const toast = useToast();

const router = useRouter();

const emit = defineEmits<{
  (e: 'updated', appointment: Appointment): void;
  (e: 'consultation', appointmentId: number): void;
}>();

const { mutateAsync, isPending } = useMutation({
  mutationFn: cancelAppointmentAction,

  onSuccess: (updatedAppointment) => {
    toast.success('Cita cancelada correctamente');

    queryClient.invalidateQueries({
      queryKey: ['appointments'],
    });

    emit('updated', updatedAppointment);

    window.tailwind.Modal.getOrCreateInstance(
      document.getElementById('modal-appointment-cancel'),
    )?.hide();
  },

  onError: (error: Error) => {
    toast.error(error.message);
  },
});

const onCancel = async () => {
  if (isPending.value) return;

  // mutate(props.appointment.id.toString());

  try {
    await mutateAsync(props.appointment.id.toString());
  } catch {}
};

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
</script>

<style scoped></style>
