import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import InputBaseDate from '@/modules/common/components/InputBaseDate.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import SelectSearchable from '@/modules/common/components/SelectSearchable.vue';
import UserIcon from '@/icons/UserIcon.vue';
import { computed, defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';

import { createUpdateAppointmentAction, getAppointmentByIdAction } from '../actions';
import { getAllPatientsAction } from '@/modules/patient/actions';
import { useModalFormReset } from '@/modules/common/composables/useModalFormReset';

import PillBadge from '@/modules/common/components/PillBadge.vue';
import {
  getShiftLabel,
  getShiftBadgeLabel,
  getShiftBadgeColor,
} from '../helpers/appointment-shift.mapper';

interface AppointmentFormValues {
  id?: string;
  patient_id?: string;
  motivo: string;
  fecha_hora_inicio: string;
  fecha_hora_termino: string;
  observaciones_cita?: string | null;
  medico_id?: string;
  cita_estatus_id?: string;
}

export default defineComponent({
  name: 'AppointmentCreateUpdate',
  components: {
    ButtonBase,
    InputLabel,
    InputBase,
    InputBaseDate,
    TextArea,
    ModalQuestion,
    SelectSearchable,
    UserIcon,
    PillBadge,
  },
  props: {

    appointmentId: {
      type: String,
      required: true,
      default: 'create',
    },
    patientId: {
      type: String,
      required: true,
      default: '0',
    },
    isInsideModal: {
      type: Boolean,
      default: false,
    },
    initialStartDate: {
      type: String,
      default: '',
    },
    initialEndDate: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();

    const showConfirmModal = ref(false);
    const pendingAppointmentValues = ref<AppointmentFormValues | null>(null);

    const validationSchema = computed(() =>
      yup.object({
        patient_id:
          props.appointmentId === 'create' && props.patientId === '0'
            ? yup.string().required('Debe seleccionar un paciente')
            : yup.string().nullable().notRequired(),
        motivo: yup.string().required('El motivo de la cita es obligatorio'),
        fecha_hora_inicio: yup
          .string()
          .required('La fecha y hora de inicio es obligatoria')
          .test(
            'hora-cita-5-min-mayor-hora-actual',
            'La fecha/hora de inicio debe ser al menos 5 minutos después de la hora actual',
            (value) => {
              if (!value || props.appointmentId !== 'create') return true;

              const validStartDate = new Date();
              validStartDate.setMinutes(validStartDate.getMinutes() + 5);

              return new Date(value) >= validStartDate;
            },
          ),
        fecha_hora_termino: yup
          .string()
          .required('La fecha y hora de término es obligatoria')
          .test(
            'termino-mayor-que-inicio',
            'La fecha/hora de término debe ser posterior a la fecha/hora de inicio',
            function (value) {
              const { fecha_hora_inicio } = this.parent;

              if (!fecha_hora_inicio || !value) return true;

              return new Date(value) > new Date(fecha_hora_inicio);
            },
          ),
        observaciones_cita: yup.string().nullable(),
      }),
    );

    const {
      data: appointment,
      isError,
      isLoading,
    } = useQuery({
      queryKey: ['appointment', computed(() => props.appointmentId)],
      queryFn: () => getAppointmentByIdAction(props.appointmentId),
      enabled: computed(() => props.appointmentId !== 'create' && !!props.appointmentId),
    });

    const { data: patientsResponse } = useQuery({
      queryKey: ['patients', 'all'],
      queryFn: getAllPatientsAction,
    });

    const patients = computed(() => patientsResponse.value ?? []);

    const patientOptions = computed(() =>
      patients.value.map((patient) => ({
        value: String(patient.id),
        label: patient.nombre_completo,
        sublabel: patient.curp ? `CURP: ${patient.curp}` : 'Sin CURP',
      })),
    );

    const appointmentFolio = computed(() => {
      if (props.appointmentId === 'create') return '';
      if (appointment.value?.folio) return appointment.value.folio;
      const id = appointment.value?.id || props.appointmentId;
      return id ? `#${id}` : '';
    });

    const currentPatient = computed(() => {
      if (props.patientId !== '0') {
        const found = patients.value.find((p) => String(p.id) === String(props.patientId));
        if (found) return found;
      }
      if (appointment.value?.pacientes && appointment.value.pacientes.length > 0) {
        return appointment.value.pacientes[0];
      }
      const targetId = values.patient_id || patient_id.value;
      if (targetId) {
        return patients.value.find((p) => String(p.id) === String(targetId)) || null;
      }
      return null;
    });

    const currentPatientName = computed(() => {
      return (
        currentPatient.value?.nombre_completo ||
        appointment.value?.pacientes?.[0]?.nombre_completo ||
        ''
      );
    });

    const currentPatientCurp = computed(() => {
      return currentPatient.value?.curp || appointment.value?.pacientes?.[0]?.curp || '';
    });

    const selectedPatientName = computed(() => {
      if (currentPatientName.value) return currentPatientName.value;
      const targetId =
        props.patientId !== '0' ? props.patientId : pendingAppointmentValues.value?.patient_id;
      if (!targetId) return '';
      const found = patients.value.find((p) => String(p.id) === String(targetId));
      return found?.nombre_completo || '';
    });

    const { mutateAsync, isPending } = useMutation({
      mutationFn: createUpdateAppointmentAction,
      onSuccess: () => {
        toast.success(
          props.appointmentId === 'create'
            ? 'Cita agendada correctamente'
            : 'Cita actualizada correctamente',
        );

        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['appointment'] });
        queryClient.invalidateQueries({ queryKey: ['appointment-requests'] });

        if (props.appointmentId === 'create') {
          resetForm({
            values: {
              id: '',
              fecha_hora_inicio: '',
              fecha_hora_termino: '',
              motivo: '',
              observaciones_cita: '',
              patient_id: props.patientId !== '0' ? props.patientId : '',
              medico_id: '',
              cita_estatus_id: '',
            },
          });
        }

        pendingAppointmentValues.value = null;
        showConfirmModal.value = false;

        if (!props.isInsideModal) {
          router.replace({ name: 'appointments.index' });
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al guardar la cita');
      },
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
      initialValues: {
        patient_id: props.patientId !== '0' ? props.patientId : '',
        motivo: '',
        fecha_hora_inicio: props.initialStartDate || '',
        fecha_hora_termino: props.initialEndDate || '',
        observaciones_cita: '',
      },
    });

    const [patient_id, patient_idAttrs] = defineField('patient_id');
    const [motivo, motivoAttrs] = defineField('motivo');
    const [fecha_hora_inicio, fecha_hora_inicioAttrs] = defineField('fecha_hora_inicio');
    const [fecha_hora_termino, fecha_hora_terminoAttrs] = defineField('fecha_hora_termino');
    const [observaciones_cita, observaciones_citaAttrs] = defineField('observaciones_cita');

    const formatDateTimeForInput = (dateStr?: string | null): string => {
      if (!dateStr) return '';
      const formatted = dateStr.replace(' ', 'T');
      return formatted.length >= 16 ? formatted.slice(0, 16) : formatted;
    };

    const onSubmit = handleSubmit(
      (formValues) => {
        const targetPatientId =
          props.patientId !== '0'
            ? props.patientId
            : formValues.patient_id ||
              (appointment.value?.pacientes?.[0]?.id
                ? String(appointment.value.pacientes[0].id)
                : values.patient_id);

        pendingAppointmentValues.value = {
          ...formValues,
          id: props.appointmentId !== 'create' ? props.appointmentId : undefined,
          patient_id: targetPatientId,
        } as AppointmentFormValues;

        showConfirmModal.value = true;

        if (props.isInsideModal) {
          const modalEl = document.getElementById('modal-appointment-create-or-edit');
          if (modalEl && window.tailwind) {
            window.tailwind.Modal.getOrCreateInstance(modalEl).hide();
          }
        }
      },
      ({ errors: validationErrors }) => {
        const errorValues = Object.values(validationErrors);
        if (errorValues.length > 0) {
          const firstError = errorValues[0];
          toast.warning(
            typeof firstError === 'string'
              ? firstError
              : 'Por favor completa los campos requeridos de la cita.',
          );
        }
      },
    );

    const onConfirmSave = async () => {
      if (!pendingAppointmentValues.value || isPending.value) return;

      try {
        await mutateAsync(pendingAppointmentValues.value as Record<string, unknown>);
      } catch {
        // Manejado en onError
      }
    };

    const onCancelConfirm = () => {
      showConfirmModal.value = false;
    };

    // Si se cierra el modal de confirmación sin guardar, reabrir el modal de cita con datos intactos
    watch(showConfirmModal, (isOpen, wasOpen) => {
      if (!isOpen && wasOpen && pendingAppointmentValues.value && props.isInsideModal) {
        setTimeout(() => {
          const modalEl = document.getElementById('modal-appointment-create-or-edit');
          if (modalEl && window.tailwind) {
            window.tailwind.Modal.getOrCreateInstance(modalEl).show();
          }
          pendingAppointmentValues.value = null;
        }, 200);
      }
    });

    const resetAppointmentForm = () => {
      if (props.appointmentId === 'create') {
        resetForm({
          values: {
            id: '',
            fecha_hora_inicio: props.initialStartDate || '',
            fecha_hora_termino: props.initialEndDate || '',
            motivo: '',
            observaciones_cita: '',
            patient_id: props.patientId !== '0' ? props.patientId : '',
            medico_id: '',
            cita_estatus_id: '',
          },
        });
      } else if (appointment.value) {
        resetForm({
          values: {
            id: String(appointment.value.id || ''),
            fecha_hora_inicio: appointment.value.fecha_hora_inicio || '',
            fecha_hora_termino: appointment.value.fecha_hora_termino || '',
            motivo: appointment.value.motivo || '',
            observaciones_cita:
              appointment.value.observaciones || appointment.value.observaciones_cita || '',
            patient_id:
              props.patientId !== '0'
                ? props.patientId
                : appointment.value.patient_id
                  ? String(appointment.value.patient_id)
                  : '',
            medico_id: String(appointment.value.medico_id || ''),
            cita_estatus_id: String(appointment.value.cita_estatus_id || ''),
          },
        });
      }
      pendingAppointmentValues.value = null;
      showConfirmModal.value = false;
    };

    useModalFormReset(
      'modal-appointment-create-or-edit',
      resetAppointmentForm,
      computed(
        () => props.isInsideModal && !showConfirmModal.value && !pendingAppointmentValues.value,
      ),
    );

    const onCancel = () => {
      resetAppointmentForm();
      if (props.isInsideModal) {
        const modalEl = document.getElementById('modal-appointment-create-or-edit');
        if (modalEl && window.tailwind) {
          window.tailwind.Modal.getOrCreateInstance(modalEl).hide();
        }
      } else {
        router.back();
      }
    };

    watch(
      () => props.patientId,
      (newPatientId) => {
        if (newPatientId !== '0') {
          patient_id.value = newPatientId;
        }
      },
      { immediate: true },
    );

    watch(
      appointment,
      (newAppointment) => {
        if (!newAppointment || props.appointmentId === 'create') return;

        let startValue = formatDateTimeForInput(newAppointment.fecha_hora_inicio);
        let endValue = formatDateTimeForInput(newAppointment.fecha_hora_termino);

        // Si es una solicitud de cita sin fecha/hora asignada pero tiene fecha_preferida,
        // sugerir un horario inicial según el turno preferido
        if (!startValue && newAppointment.fecha_preferida) {
          const normShift = (newAppointment.turno_preferido || '').toLowerCase();
          let defaultHour = '09:00';
          let defaultEndHour = '09:30';
          if (normShift === 'vespertino') {
            defaultHour = '15:00';
            defaultEndHour = '15:30';
          } else if (normShift === 'indistinto') {
            defaultHour = '10:00';
            defaultEndHour = '10:30';
          }
          startValue = `${newAppointment.fecha_preferida}T${defaultHour}`;
          endValue = `${newAppointment.fecha_preferida}T${defaultEndHour}`;
        }

        const resolvedPatientId =
          props.patientId !== '0'
            ? props.patientId
            : newAppointment.pacientes?.[0]?.id
              ? String(newAppointment.pacientes[0].id)
              : newAppointment.paciente?.id
                ? String(newAppointment.paciente.id)
                : newAppointment.patient_id
                  ? String(newAppointment.patient_id)
                  : '';

        resetForm({
          values: {
            id: String(newAppointment.id),
            motivo: newAppointment.motivo || '',
            fecha_hora_inicio: startValue,
            fecha_hora_termino: endValue,
            observaciones_cita:
              newAppointment.observaciones_cita || newAppointment.observaciones || '',
            patient_id: resolvedPatientId,
          },
        });
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.appointmentId,
      () => {
        resetAppointmentForm();
      },
    );

    watch(
      () => [props.initialStartDate, props.initialEndDate],
      ([newStart, newEnd]) => {
        if (props.appointmentId === 'create') {
          fecha_hora_inicio.value = newStart || '';
          fecha_hora_termino.value = newEnd || '';
        }
      },
    );

    watchEffect(() => {
      if (isError.value && !isLoading.value && props.appointmentId !== 'create') {
        router.replace({ name: 'patients.index' });
      }
    });

    return {
      patients,
      patientOptions,
      selectedPatientName,
      appointmentFolio,
      currentPatientName,
      currentPatientCurp,

      appointment,
      getShiftLabel,
      getShiftBadgeLabel,
      getShiftBadgeColor,

      values,
      errors,
      meta,

      motivo,
      fecha_hora_inicio,
      fecha_hora_termino,
      observaciones_cita,
      patient_id,

      motivoAttrs,
      fecha_hora_inicioAttrs,
      fecha_hora_terminoAttrs,
      observaciones_citaAttrs,
      patient_idAttrs,

      action: computed(() => (props.appointmentId === 'create' ? 'create' : 'edit')),
      isPending,
      showConfirmModal,
      pendingAppointmentValues,

      onSubmit,
      onConfirmSave,
      onCancelConfirm,
      onCancel,
    };
  },
});
