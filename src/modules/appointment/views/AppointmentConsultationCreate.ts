import { defineComponent, computed, ref, watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import ConsultationDetailDrawer from '@/modules/consultation/components/ConsultationDetailDrawer.vue';
import ConsultationSaveModalQuestion from '@/modules/consultation/components/ConsultationSaveModalQuestion.vue';

import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PhoneIcon from '@/icons/PhoneIcon.vue';
import EmailIcon from '@/icons/EmailIcon.vue';

import {
  createUpdateConsultationAction,
  getAllConsultationsByPatientAction,
  getConsultationByIdAction,
} from '@/modules/consultation/actions';
import { getAppointmentByIdAction } from '../actions';
import { getPatientByIdAction } from '@/modules/patient/actions/get-patient-by-id.action';
import type { Consultation } from '@/modules/consultation/interfaces/consultation.interface';

const toast = useToast();

const schema = yup.object({
  motivo: yup.string().required('El motivo de la consulta es obligatorio'),
  diagnostico: yup.string().required('El diagnóstico es obligatorio'),
  tratamiento: yup.string().required('El tratamiento es obligatorio'),
  peso: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null || isNaN(v) ? null : Number(v))),
  altura: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null || isNaN(v) ? null : Number(v))),
  temperatura: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null || isNaN(v) ? null : Number(v))),
  presion_arterial: yup.string().nullable(),
  frecuencia_cardiaca: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null || isNaN(v) ? null : Number(v))),
  frecuencia_respiratoria: yup
    .number()
    .nullable()
    .transform((v, o) => (o === '' || o === null || isNaN(v) ? null : Number(v))),
  exploracion_fisica: yup.string().nullable(),
  notas: yup.string().nullable(),
});

const fieldLabels: Record<string, string> = {
  motivo: 'Motivo de la consulta',
  diagnostico: 'Diagnóstico',
  tratamiento: 'Tratamiento y prescripción',
  peso: 'Peso',
  altura: 'Altura',
  temperatura: 'Temperatura',
  presion_arterial: 'Presión arterial',
  frecuencia_cardiaca: 'Frecuencia cardíaca',
  frecuencia_respiratoria: 'Frecuencia respiratoria',
  exploracion_fisica: 'Exploración física',
  notas: 'Notas y recomendaciones',
};

const calculateImc = (
  pesoVal: number | string | null | undefined,
  alturaVal: number | string | null | undefined,
) => {
  if (!pesoVal || !alturaVal) return null;
  const numPeso = typeof pesoVal === 'string' ? parseFloat(pesoVal) : Number(pesoVal);
  let numAltura = typeof alturaVal === 'string' ? parseFloat(alturaVal) : Number(alturaVal);
  if (!numPeso || !numAltura || numPeso <= 0 || numAltura <= 0) return null;
  if (numAltura > 3) {
    numAltura = numAltura / 100;
  }
  const imc = +(numPeso / (numAltura * numAltura)).toFixed(1);
  if (isNaN(imc)) return null;
  if (imc < 18.5) {
    return { value: imc, label: 'Bajo peso', color: 'warning' as const };
  } else if (imc < 25) {
    return { value: imc, label: 'Normal', color: 'success' as const };
  } else if (imc < 30) {
    return { value: imc, label: 'Sobrepeso', color: 'warning' as const };
  } else {
    return { value: imc, label: 'Obesidad', color: 'danger' as const };
  }
};

export default defineComponent({
  name: 'AppointmentConsultationCreate',
  components: {
    ButtonBase,
    InputLabel,
    InputBase,
    TextArea,
    PillBadge,
    FullScreenLoader,
    ConsultationDetailDrawer,
    ConsultationSaveModalQuestion,
    ArrowLeftIcon,
    StethoscopeIcon,
    UserIcon,
    CalendarIcon,
    FileTextIcon,
    ObservationsIcon,
    PreviewIcon,
    PhoneIcon,
    EmailIcon,
  },
  props: {
    appointmentId: {
      type: String,
      default: '',
    },
    consultationId: {
      type: String,
      default: '',
    },
    patientId: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. Cargar consulta existente si viene consultationId (Modo edición directo)
    const { data: existingConsultation, isLoading: isLoadingConsultation } = useQuery({
      queryKey: ['consultation', computed(() => props.consultationId)],
      queryFn: () => getConsultationByIdAction(props.consultationId),
      enabled: computed(() => !!props.consultationId),
    });

    // 2. Determinar cita asociada
    const effectiveAppointmentId = computed(() => {
      if (props.appointmentId) return props.appointmentId;
      return existingConsultation.value?.cita_id ? String(existingConsultation.value.cita_id) : '';
    });

    const { data: appointment, isLoading: isLoadingAppointment } = useQuery({
      queryKey: ['appointment', effectiveAppointmentId],
      queryFn: () => getAppointmentByIdAction(effectiveAppointmentId.value),
      enabled: computed(
        () => !!effectiveAppointmentId.value && effectiveAppointmentId.value !== 'create',
      ),
    });

    // 3. Determinar paciente asociado
    const effectivePatientId = computed(() => {
      if (props.patientId) return props.patientId;
      if (appointment.value?.pacientes?.[0]?.id) return String(appointment.value.pacientes[0].id);
      if (appointment.value?.patient_id) return String(appointment.value.patient_id);
      if (existingConsultation.value?.paciente_id)
        return String(existingConsultation.value.paciente_id);
      return '';
    });

    const { data: directPatient, isLoading: isLoadingPatient } = useQuery({
      queryKey: ['patient', effectivePatientId],
      queryFn: () => getPatientByIdAction(effectivePatientId.value),
      enabled: computed(() => !!effectivePatientId.value && !appointment.value?.pacientes?.[0]),
    });

    const patient = computed(() => appointment.value?.pacientes?.[0] || directPatient.value);

    // 4. Determinar si estamos en Modo Edición y su ID
    const currentConsultationId = computed<number | null>(() => {
      if (props.consultationId) return Number(props.consultationId);
      if (appointment.value?.consulta?.id) return appointment.value.consulta.id;
      return null;
    });

    const isEditMode = computed(() => !!currentConsultationId.value);

    // 5. Consultas anteriores del paciente
    const { data: previousConsultations, isLoading: isLoadingConsultations } = useQuery({
      queryKey: ['patient-consultations', { patientId: effectivePatientId, all: true }],
      queryFn: () => getAllConsultationsByPatientAction(effectivePatientId.value),
      enabled: computed(() => !!effectivePatientId.value),
    });

    // 6. Formulario con Vee-Validate
    const { values, defineField, errors, handleSubmit, setFieldValue } = useForm({
      validationSchema: schema,
      initialValues: {
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        peso: null,
        altura: null,
        temperatura: null,
        presion_arterial: '',
        frecuencia_cardiaca: null,
        frecuencia_respiratoria: null,
        exploracion_fisica: '',
        notas: '',
      },
    });

    // Precargar datos: Si es edición se precarga todo; si es nueva se precarga motivo de cita
    watch(
      () => [existingConsultation.value, appointment.value],
      ([cons, app]) => {
        const target = cons || app?.consulta;
        if (target) {
          setFieldValue('motivo', target.motivo || '');
          setFieldValue('diagnostico', target.diagnostico || '');
          setFieldValue('tratamiento', target.tratamiento || '');
          setFieldValue('exploracion_fisica', target.exploracion_fisica || '');
          setFieldValue('notas', target.notas || target.observaciones || '');

          const vitals = target.signos_vitales;
          setFieldValue('peso', target.peso ?? vitals?.peso ?? null);
          setFieldValue('altura', target.altura ?? vitals?.altura ?? null);
          setFieldValue('temperatura', target.temperatura ?? vitals?.temperatura ?? null);
          setFieldValue(
            'presion_arterial',
            target.presion_arterial ?? vitals?.presion_arterial ?? '',
          );
          setFieldValue(
            'frecuencia_cardiaca',
            target.frecuencia_cardiaca ?? vitals?.frecuencia_cardiaca ?? null,
          );
          setFieldValue(
            'frecuencia_respiratoria',
            target.frecuencia_respiratoria ?? vitals?.frecuencia_respiratoria ?? null,
          );
        } else if (app?.motivo && !values.motivo) {
          setFieldValue('motivo', app.motivo);
        }
      },
      { immediate: true },
    );

    const [motivo, motivoAttrs] = defineField('motivo');
    const [diagnostico, diagnosticoAttrs] = defineField('diagnostico');
    const [tratamiento, tratamientoAttrs] = defineField('tratamiento');
    const [peso, pesoAttrs] = defineField('peso');
    const [altura, alturaAttrs] = defineField('altura');
    const [temperatura, temperaturaAttrs] = defineField('temperatura');
    const [presion_arterial, presionArterialAttrs] = defineField('presion_arterial');
    const [frecuencia_cardiaca, frecuenciaCardiacaAttrs] = defineField('frecuencia_cardiaca');
    const [frecuencia_respiratoria, frecuenciaRespiratoriaAttrs] =
      defineField('frecuencia_respiratoria');
    const [exploracion_fisica, exploracionFisicaAttrs] = defineField('exploracion_fisica');
    const [notas, notasAttrs] = defineField('notas');

    // 7. Cálculo reactivo del IMC
    const currentImc = computed(() => calculateImc(values.peso, values.altura));

    // 8. Estado de carga general de página
    const isLoadingPage = computed(() => {
      if (props.consultationId && isLoadingConsultation.value) return true;
      if (props.appointmentId && isLoadingAppointment.value) return true;
      if (props.patientId && isLoadingPatient.value) return true;
      return false;
    });

    // 9. Mutación para guardar o actualizar consulta
    const { mutateAsync, isPending } = useMutation({
      mutationFn: createUpdateConsultationAction,
      onSuccess: () => {
        toast.success(
          isEditMode.value
            ? 'Consulta médica actualizada correctamente'
            : 'Consulta guardada y finalizada correctamente',
        );

        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['patient-consultations'] });
        if (effectiveAppointmentId.value) {
          queryClient.invalidateQueries({
            queryKey: ['appointment', effectiveAppointmentId.value],
          });
        }
        if (currentConsultationId.value) {
          queryClient.invalidateQueries({
            queryKey: ['consultation', String(currentConsultationId.value)],
          });
        }

        if (effectivePatientId.value) {
          queryClient.invalidateQueries({ queryKey: ['patient', String(effectivePatientId.value)] });
          router.push({
            name: 'patients.show',
            params: { patientId: String(effectivePatientId.value) },
            query: { tab: 'consultations' },
          });
        } else {
          router.push({ name: 'appointments.index' });
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al guardar la consulta');
      },
    });

    const showConfirmSaveModal = ref(false);
    const pendingConsultationPayload = ref<Partial<Consultation> | null>(null);

    const onSubmit = handleSubmit(
      (formValues) => {
        const pId = effectivePatientId.value;
        if (!pId) {
          toast.error('No se pudo identificar al paciente asociado.');
          return;
        }

        const payload: Partial<Consultation> = {
          ...formValues,
          paciente_id: Number(pId),
        };

        if (currentConsultationId.value) {
          payload.id = currentConsultationId.value;
        }

        if (effectiveAppointmentId.value) {
          payload.cita_id = Number(effectiveAppointmentId.value);
        }

        pendingConsultationPayload.value = payload;
        showConfirmSaveModal.value = true;
      },
      ({ errors: validationErrors }) => {
        const isEmpty =
          !values.motivo?.trim() &&
          !values.diagnostico?.trim() &&
          !values.tratamiento?.trim();

        if (isEmpty) {
          toast.warning(
            'No hay datos registrados en la consulta. Por favor complete al menos el motivo, diagnóstico y tratamiento.',
          );
        } else {
          const errorKeys = Object.keys(validationErrors);
          if (errorKeys.length > 0) {
            const missingNames = errorKeys
              .map((key) => fieldLabels[key] || key)
              .filter(Boolean);

            if (missingNames.length === 1) {
              toast.warning(
                `No se puede guardar la consulta: falta completar ${missingNames[0]}.`,
              );
            } else {
              toast.warning(
                `No se puede guardar la consulta. Faltan los campos obligatorios: ${missingNames.join(', ')}.`,
              );
            }
          }
        }

        const firstKey = Object.keys(validationErrors)[0];
        if (firstKey) {
          const el = document.querySelector(`[name="${firstKey}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus?.();
          }
        }
      },
    );

    const onConfirmSave = async () => {
      if (!pendingConsultationPayload.value || isPending.value) return;

      try {
        await mutateAsync(pendingConsultationPayload.value);
        showConfirmSaveModal.value = false;
        pendingConsultationPayload.value = null;
      } catch {
        // El error ya es manejado por onError en useMutation
      }
    };

    const onCancelSave = () => {
      showConfirmSaveModal.value = false;
    };

    // 10. Navegación hacia atrás
    const goBack = () => {
      if (effectivePatientId.value) {
        router.push({
          name: 'patients.show',
          params: { patientId: String(effectivePatientId.value) },
          query: { tab: isEditMode.value ? 'consultations' : 'appointments' },
        });
      } else {
        router.back();
      }
    };

    // 11. Drawer de detalle para consulta anterior
    const isDrawerOpen = ref(false);
    const selectedConsultation = ref<Consultation | null>(null);

    const viewConsultationDetail = (consultation: Consultation) => {
      selectedConsultation.value = consultation;
      isDrawerOpen.value = true;
    };

    const formatConsultationDate = (consultation: Consultation) => {
      const rawDate = consultation.creado_el || consultation.created_at || consultation.fecha;
      if (!rawDate) return 'Fecha no especificada';
      try {
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return rawDate;
        return d.toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return rawDate;
      }
    };

    return {
      appointment,
      existingConsultation,
      isLoadingPage,
      patient,
      effectivePatientId,
      isEditMode,
      previousConsultations,
      isLoadingConsultations,
      currentImc,
      isPending,

      motivo,
      motivoAttrs,
      diagnostico,
      diagnosticoAttrs,
      tratamiento,
      tratamientoAttrs,
      peso,
      pesoAttrs,
      altura,
      alturaAttrs,
      temperatura,
      temperaturaAttrs,
      presion_arterial,
      presionArterialAttrs,
      frecuencia_cardiaca,
      frecuenciaCardiacaAttrs,
      frecuencia_respiratoria,
      frecuenciaRespiratoriaAttrs,
      exploracion_fisica,
      exploracionFisicaAttrs,
      notas,
      notasAttrs,
      errors,

      onSubmit,
      showConfirmSaveModal,
      onConfirmSave,
      onCancelSave,
      goBack,

      isDrawerOpen,
      selectedConsultation,
      viewConsultationDetail,
      formatConsultationDate,
    };
  },
});
