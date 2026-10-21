<template>
  <div v-if="appointment" class="w-full text-foreground">
    <!-- Header del modal: Título a la izquierda, estatus a la derecha -->
    <div class="flex items-center justify-between pb-3 mb-4 border-b border-foreground/10 w-full">
      <div class="flex items-center gap-2.5">
        <h2 class="text-base sm:text-lg font-bold tracking-tight">DETALLES DE LA CITA</h2>
        <span
          v-if="appointment.folio"
          class="text-xs font-mono px-2 py-0.5 rounded bg-foreground/5 text-foreground/70 border border-foreground/10"
        >
          {{ appointment.folio }}
        </span>
      </div>
      <PillBadge
        size="sm"
        :color="badgeColor"
        :label="`CITA ${statusName.toUpperCase()}`"
      />
    </div>

    <!-- Contenido en cuadrícula compacta de 2 columnas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm w-full">
      <!-- Fecha y hora -->
      <div class="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10 flex flex-col justify-center">
        <div class="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <CalendarIcon class="size-3.5 shrink-0" /> Fecha y horario
        </div>
        <div class="font-medium text-foreground text-sm">
          {{ appointment.fecha_inicio }}
        </div>
        <div class="text-xs text-foreground/75 font-mono mt-0.5">
          {{ appointment.hora_inicio }} a {{ appointment.hora_termino }} hrs.
        </div>
      </div>

      <!-- Paciente -->
      <div class="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10 flex flex-col justify-center">
        <div class="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <UserIcon class="size-3.5 shrink-0" /> Paciente
        </div>
        <div
          v-for="(patient, index) in appointment.pacientes"
          :key="index"
          class="font-medium text-foreground text-sm truncate"
        >
          {{ patient.nombre_completo }}
        </div>
      </div>

      <!-- Médico tratante -->
      <div class="sm:col-span-2 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10">
        <div class="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <stethoscopeIcon class="size-3.5 shrink-0" /> Médico asignado
        </div>
        <div class="font-medium text-foreground text-sm">
          {{ getAppointmentDoctorName(appointment) || 'No asignado' }}
        </div>
      </div>

      <!-- Motivo de la cita -->
      <div class="sm:col-span-2 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10">
        <div class="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <MessageIcon class="size-3.5 shrink-0" /> Motivo de consulta
        </div>
        <div class="font-medium text-foreground text-sm leading-snug">
          {{ appointment.motivo }}
        </div>
      </div>

      <!-- Observaciones (si existen) -->
      <div
        v-if="appointment.observaciones || appointment.observaciones_cita"
        class="sm:col-span-2 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/10"
      >
        <div class="text-[11px] font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <ObservationsIcon class="size-3.5 shrink-0" /> Observaciones
        </div>
        <div class="text-xs text-foreground/80 leading-relaxed">
          {{ appointment.observaciones || appointment.observaciones_cita }}
        </div>
      </div>
    </div>

    <!-- Botones de Acción en pie del modal -->
    <div class="mt-4 pt-3.5 border-t border-foreground/10 flex flex-wrap items-center justify-end gap-2.5 w-full">
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
      description="Esta acción es irreversible."
      confirmText="Sí, cancelar cita"
      cancelText="Cerrar"
      :loading="isPendingCancelAppointment"
      @confirm="onCancel"
    />
  </div>
  <div v-else class="flex flex-col items-center justify-center p-8 gap-3 min-h-[200px]">
    <FullScreenLoader />
    <span class="text-sm font-medium opacity-70">Cargando detalles de la cita...</span>
  </div>
</template>

<script setup lang="ts">
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
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
