<template>
  <Teleport to="body">
    <DialogBasic
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      id="modal-appointment-patient-request"
      size="xl"
      title="Solicitar Cita Médica"
      description="Envía tu solicitud indicando tu fecha y turno de preferencia. Recepción revisará tu cita y te asignará el horario disponible a la brevedad."
      @close="onClose"
    >
      <form @submit.prevent="onSubmit" class="space-y-4 pt-1">
      <!-- 1. Paciente destinatario de la cita -->
      <div class="flex flex-col gap-1.5">
        <InputLabel label="Paciente para quien es la cita" :isRequired="true" />

        <!-- Si tiene dependientes/tutelados, permitir elegir entre el titular y sus tutelados -->
        <div v-if="dependentsOptions.length > 1" class="space-y-2">
          <select
            v-model="selectedPatientId"
            class="h-10 w-full rounded-md border border-foreground/10 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option
              v-for="opt in dependentsOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Paciente único (Titular) -->
        <div
          v-else
          class="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
            >
              <UserIcon class="size-4 shrink-0" />
            </div>
            <div class="min-w-0">
              <div class="font-semibold text-foreground text-sm truncate">
                {{ patientName }}
              </div>
              <div class="text-xs text-foreground/60 font-mono mt-0.5">
                {{ patientCurp ? `CURP: ${patientCurp}` : 'Titular de la cuenta' }}
              </div>
            </div>
          </div>
          <PillBadge size="xs" color="success" label="Titular" />
        </div>
      </div>

      <!-- 2. Fecha Preferida -->
      <div class="flex flex-col gap-1.5">
        <InputLabel label="Fecha preferida para tu cita" :isRequired="true" />
        <InputBaseDate
          type="date"
          v-model="fecha_preferida"
          v-bind="fecha_preferidaAttrs"
          :error="errors.fecha_preferida"
          name="fecha_preferida"
          :min="minDate"
        />
        <span class="text-[11px] text-foreground/50">
          Selecciona el día sugerido en el que te gustaría asistir a tu consulta.
        </span>
      </div>

      <!-- 3. Turno Preferido -->
      <div class="flex flex-col gap-1.5">
        <InputLabel label="Turno preferido" :isRequired="true" />
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            class="flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer gap-1"
            :class="
              turno_preferido === 'matutino'
                ? 'border-primary bg-primary/10 text-primary shadow-xs font-bold'
                : 'border-foreground/10 bg-background/50 text-foreground/75 hover:bg-foreground/5'
            "
            @click="setTurno('matutino')"
          >
            <span class="text-base">🌅</span>
            <span>Matutino</span>
            <span class="text-[10px] text-foreground/50">8:00 - 14:00</span>
          </button>

          <button
            type="button"
            class="flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer gap-1"
            :class="
              turno_preferido === 'vespertino'
                ? 'border-primary bg-primary/10 text-primary shadow-xs font-bold'
                : 'border-foreground/10 bg-background/50 text-foreground/75 hover:bg-foreground/5'
            "
            @click="setTurno('vespertino')"
          >
            <span class="text-base">🌇</span>
            <span>Vespertino</span>
            <span class="text-[10px] text-foreground/50">14:00 - 20:00</span>
          </button>

          <button
            type="button"
            class="flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer gap-1"
            :class="
              turno_preferido === 'indistinto'
                ? 'border-primary bg-primary/10 text-primary shadow-xs font-bold'
                : 'border-foreground/10 bg-background/50 text-foreground/75 hover:bg-foreground/5'
            "
            @click="setTurno('indistinto')"
          >
            <span class="text-base">🔄</span>
            <span>Indistinto</span>
            <span class="text-[10px] text-foreground/50">Cualquier horario</span>
          </button>
        </div>
        <span v-if="errors.turno_preferido" class="text-xs text-danger mt-0.5">
          {{ errors.turno_preferido }}
        </span>
      </div>

      <!-- 4. Motivo de la Cita -->
      <div class="flex flex-col gap-1.5">
        <InputLabel label="Motivo de la cita o síntomas" :isRequired="true" />
        <TextArea
          v-model="motivo"
          v-bind="motivoAttrs"
          placeholder="Ejemplo: Tengo gripa y dolor de garganta desde hace 2 días, o revisión periódica de estudios."
          name="motivo"
          :error="errors.motivo"
          rows="3"
        />
      </div>

      <!-- 5. Observaciones adicionales -->
      <div class="flex flex-col gap-1.5">
        <InputLabel label="Observaciones o notas adicionales" :isRequired="false" />
        <TextArea
          v-model="observaciones"
          v-bind="observacionesAttrs"
          placeholder="Ejemplo: Salgo de trabajar después de las 4:00 PM, o llamar antes de confirmar."
          name="observaciones"
          :error="errors.observaciones"
          rows="2"
        />
      </div>

      <!-- Acciones del Modal -->
      <div class="pt-4 border-t border-foreground/10 flex items-center justify-end gap-3">
        <ButtonBase
          text="Cancelar"
          color="secondary"
          :disabled="isPending"
          @click="onClose"
        />
        <ButtonBase
          text="Enviar Solicitud de Cita"
          color="primary"
          :loading="isPending"
          loading-text="Enviando..."
          @click="onSubmit"
        />
      </div>
    </form>
  </DialogBasic>
</Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'vue-toastification';

import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBaseDate from '@/modules/common/components/InputBaseDate.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import UserIcon from '@/icons/UserIcon.vue';

import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { getMyPatientsAction } from '@/modules/patient/actions';
import {
  requestAppointmentAction,
  type RequestAppointmentPayload,
} from '../actions/request-appointment.action';
import type { TurnoPreferido } from '../helpers/appointment-shift.mapper';

interface Props {
  modelValue: boolean;
  initialPatientId?: number | string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'requested'): void;
}>();

const authStore = useAuthStore();
const queryClient = useQueryClient();
const toast = useToast();

// Fecha mínima permitida: Hoy
const minDate = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

const patientName = computed(() => {
  return (
    authStore.user?.patient?.nombre_completo ||
    authStore.user?.nombre_completo ||
    authStore.user?.name ||
    'Paciente Titular'
  );
});

const patientCurp = computed(() => {
  return authStore.user?.patient?.curp || authStore.user?.curp || '';
});

// Id efectivo del paciente titular
const defaultPatientId = computed(() => {
  return authStore.user?.patient?.id || authStore.user?.id || 0;
});

const selectedPatientId = ref<number | string>(props.initialPatientId || defaultPatientId.value);

// Obtener pacientes vinculados al núcleo familiar (titular + dependientes)
const { data: myPatients } = useQuery({
  queryKey: ['my-patients', authStore.user?.id],
  queryFn: () => getMyPatientsAction(),
  enabled: computed(() => authStore.isPatientMode),
});

// Opciones de pacientes para la solicitud
const dependentsOptions = computed(() => {
  const list = myPatients.value || [];
  if (list.length === 0) {
    return [
      {
        value: defaultPatientId.value,
        label: `${patientName.value} (Para mí - Titular)`,
      },
    ];
  }

  return list.map((p) => {
    const isTitular = p.vinculo_familiar?.relacion === 'titular' || !p.es_dependiente;
    const label = isTitular
      ? `${p.nombre_completo} (Para mí - Titular)`
      : `${p.nombre_completo} (${p.vinculo_familiar?.relacion_texto || 'Dependiente'})`;
    return {
      value: p.id,
      label,
    };
  });
});

watch(
  () => [props.modelValue, props.initialPatientId],
  ([open, initId]) => {
    if (open) {
      if (initId) {
        selectedPatientId.value = initId;
      } else if (!selectedPatientId.value || selectedPatientId.value === 0) {
        selectedPatientId.value = defaultPatientId.value;
      }
    }
  },
  { immediate: true },
);

// Esquema de validación
const validationSchema = yup.object({
  fecha_preferida: yup
    .string()
    .required('La fecha preferida es obligatoria')
    .test('fecha-no-pasada', 'La fecha no puede ser anterior a hoy', (value) => {
      if (!value) return true;
      return value >= minDate.value;
    }),
  turno_preferido: yup
    .string()
    .oneOf(['matutino', 'vespertino', 'indistinto'])
    .required('Debe seleccionar un turno preferido'),
  motivo: yup.string().required('El motivo de la consulta es obligatorio'),
  observaciones: yup.string().nullable(),
});

const { handleSubmit, errors, defineField, resetForm, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    fecha_preferida: '',
    turno_preferido: 'indistinto' as TurnoPreferido,
    motivo: '',
    observaciones: '',
  },
});

const [fecha_preferida, fecha_preferidaAttrs] = defineField('fecha_preferida');
const [turno_preferido] = defineField('turno_preferido');
const [motivo, motivoAttrs] = defineField('motivo');
const [observaciones, observacionesAttrs] = defineField('observaciones');

const setTurno = (t: TurnoPreferido) => {
  setFieldValue('turno_preferido', t);
};

// Mutación para enviar la solicitud
const mutation = useMutation({
  mutationFn: (payload: RequestAppointmentPayload) => requestAppointmentAction(payload),
  onSuccess: () => {
    toast.success(
      '¡Tu solicitud de cita ha sido enviada con éxito! Recepción asignará tu horario.',
    );
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    queryClient.invalidateQueries({ queryKey: ['appointment-requests'] });
    resetForm();
    emit('requested');
    onClose();
  },
  onError: (error: Error) => {
    toast.error(error.message || 'Ocurrió un error al enviar tu solicitud de cita.');
  },
});

const isPending = computed(() => mutation.isPending.value);

const onSubmit = handleSubmit((values) => {
  const pId = selectedPatientId.value || defaultPatientId.value;
  mutation.mutate({
    patient_id: pId,
    fecha_preferida: values.fecha_preferida,
    turno_preferido: values.turno_preferido as TurnoPreferido,
    motivo: values.motivo,
    observaciones: values.observaciones || null,
  });
});

const onClose = () => {
  emit('update:modelValue', false);
};

// Reset al abrir/cerrar
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      selectedPatientId.value = defaultPatientId.value;
      resetForm({
        values: {
          fecha_preferida: '',
          turno_preferido: 'indistinto',
          motivo: '',
          observaciones: '',
        },
      });
    }
  },
);
</script>

