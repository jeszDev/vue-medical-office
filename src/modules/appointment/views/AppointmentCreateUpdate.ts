import ButtonPrimary from '@/modules/common/components/ButtonPrimary.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import InputBaseDate from '@/modules/common/components/InputBaseDate.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';

import { createUpdateAppointmentAction, getAppointmentByIdAction } from '../actions';
import formatDateToInput from '@/helpers/format-date-to-input.helper';

import { watch } from 'vue';

const schema = yup.object({
  motivo: yup.string().required('Este campo es obligatorio'),
  fecha_hora_inicio: yup
    .string()
    .required('Este campo es obligatorio')
    .test(
      'hora-cita-5-min-mayor-hora-actual',
      'La fecha/hora de inicio debe ser al menos 5 minutos después de la hora actual',
      (value) => {
        if (!value) return true;

        const validStarDate = new Date();
        validStarDate.setMinutes(validStarDate.getMinutes() + 5);

        return new Date(value) >= validStarDate;
      },
    ),
  fecha_hora_termino: yup.string().required('Este campo es obligatorio'),
  observaciones: yup.string().nullable(),
});

export default defineComponent({
  components: {
    ButtonPrimary,
    InputLabel,
    InputBase,
    InputBaseDate,
    TextArea,
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
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: appointment,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['appointment', props.appointmentId],
      queryFn: () => getAppointmentByIdAction(props.appointmentId),
      // enabled: props.patientId !== 'create', // Evitar la consulta si es 'create'
      // retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedAppointment,
    } = useMutation({
      mutationFn: createUpdateAppointmentAction,
    });

    const { values, defineField, validateField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });
    const [motivo, motivoAttrs] = defineField('motivo');
    const [fecha_hora_inicio, fecha_hora_inicioAttrs] = defineField('fecha_hora_inicio');
    const [fecha_hora_termino, fecha_hora_terminoAttrs] = defineField('fecha_hora_termino');
    const [observaciones_cita, observaciones_citaAttrs] = defineField('observaciones_cita');

    const onSubmit = handleSubmit(async (values) => {
      mutate({ ...values, patient_id: props.patientId });
    });

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'patients.index' });
      }
    });

    watch(isUpdateSuccess, (value) => {
      if (!value) return;

      if (props.isInsideModal) {
        window.tailwind.Modal.getOrCreateInstance(
          document.getElementById('modal-appointment-create-or-edit'),
        ).hide();
      }

      props.appointmentId === 'create'
        ? toast.success('Cita agendada correctamente')
        : toast.success('Cita editada correctamente');

      resetForm({
        values: updatedAppointment.value,
      });
    });

    watch(
      appointment,
      (newAppointment) => {
        if (!newAppointment) return;

        // const formattedPatient = {
        //   ...newPatient,
        //   fecha_nacimiento: formatDateToInput(newPatient.fecha_nacimiento),
        // };

        resetForm({
          values: newAppointment,
        });
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.appointmentId,
      (newAppointmentId) => {
        if (newAppointmentId === 'create') {
          resetForm({
            values: {
              id: '',
              fecha_hora_inicio: '',
              fecha_hora_termino: '',
              motivo: '',
              observaciones_cita: '',
              medico_id: '',
              cita_estatus_id: '',
            },
          });
        }
      },
    );

    // Redirigir en caso de error al cargar el paciente
    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'patients.index' });
      }
    });

    return {
      //props
      values,
      errors,
      meta,

      motivo,
      fecha_hora_inicio,
      fecha_hora_termino,
      observaciones_cita,

      motivoAttrs,
      fecha_hora_inicioAttrs,
      fecha_hora_terminoAttrs,
      observaciones_citaAttrs,

      // getters
      action: props.appointmentId === 'create' ? 'create' : 'edit',

      // actions
      onSubmit,
    };
  },
});
