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

import ArrowLeftIcon from '@/icons/ArrowLeftIcon.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PhoneIcon from '@/icons/PhoneIcon.vue';
import EmailIcon from '@/icons/EmailIcon.vue';

import { createUpdateConsultationAction, getAllConsultationsByPatientAction } from '@/modules/consultation/actions';
import { getAppointmentByIdAction } from '../actions';
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
      required: true,
    },
  },

  setup(props) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 1. Cargar cita médica
    const { data: appointment, isLoading: isLoadingAppointment } = useQuery({
      queryKey: ['appointment', props.appointmentId],
      queryFn: () => getAppointmentByIdAction(props.appointmentId),
    });

    // 2. Extraer información del paciente
    const patient = computed(() => appointment.value?.pacientes?.[0]);
    const patientId = computed(() => patient.value?.id || appointment.value?.patient_id);

    // 3. Consultas anteriores del paciente
    const { data: previousConsultations, isLoading: isLoadingConsultations } = useQuery({
      queryKey: ['patient-consultations', { patientId, all: true }],
      queryFn: () => getAllConsultationsByPatientAction(patientId.value!),
      enabled: computed(() => !!patientId.value),
    });

    // 4. Formulario con Vee-Validate
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

    // Precargar automáticamente el motivo de la cita
    watch(
      () => appointment.value,
      (app) => {
        if (app?.motivo && !values.motivo) {
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
    const [frecuencia_respiratoria, frecuenciaRespiratoriaAttrs] = defineField('frecuencia_respiratoria');
    const [exploracion_fisica, exploracionFisicaAttrs] = defineField('exploracion_fisica');
    const [notas, notasAttrs] = defineField('notas');

    // 5. Cálculo reactivo del IMC
    const currentImc = computed(() => calculateImc(values.peso, values.altura));

    // 6. Mutación para guardar consulta
    const { mutateAsync, isPending } = useMutation({
      mutationFn: createUpdateConsultationAction,
      onSuccess: () => {
        toast.success('Consulta guardada y finalizada correctamente');

        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        queryClient.invalidateQueries({ queryKey: ['patient-consultations'] });
        queryClient.invalidateQueries({ queryKey: ['appointment', props.appointmentId] });

        if (patientId.value) {
          queryClient.invalidateQueries({ queryKey: ['patient', String(patientId.value)] });
          router.push({
            name: 'patients.show',
            params: { patientId: String(patientId.value) },
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

    const onSubmit = handleSubmit(async (formValues) => {
      const pId = patientId.value;
      if (!pId) {
        toast.error('No se pudo identificar al paciente asociado a esta cita.');
        return;
      }

      await mutateAsync({
        ...formValues,
        paciente_id: Number(pId),
        cita_id: Number(props.appointmentId),
      });
    });

    // 7. Navegación hacia atrás
    const goBack = () => {
      if (patientId.value) {
        router.push({
          name: 'patients.show',
          params: { patientId: String(patientId.value) },
          query: { tab: 'appointments' },
        });
      } else {
        router.back();
      }
    };

    // 8. Drawer de detalle para consulta anterior
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
      isLoadingAppointment,
      patient,
      patientId,
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
      goBack,

      isDrawerOpen,
      selectedConsultation,
      viewConsultationDetail,
      formatConsultationDate,
    };
  },
});
