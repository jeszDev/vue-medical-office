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

import { createUpdatePatientAction, getPatientByIdAction } from '../actions';
import formatDateToInput from '@/helpers/format-date-to-input.helper';

import { watch } from 'vue';

const schema = yup.object({
  motivo: yup.string().required('Este campo es obligatorio'),
  fecha_hora_inicio: yup.string().required('Este campo es obligatorio'),
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
      data: updatedPatient,
    } = useMutation({
      mutationFn: createUpdateAppointmentAction,
    });

    const { values, defineField, validateField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });
    const [motivo, motivoAttrs] = defineField('motivo');
    const [fecha_hora_inicio, fecha_hora_inicioAttrs] = defineField('fecha_hora_inicio');
    const [fecha_hora_termino, fecha_hora_terminoAttrs] = defineField('fecha_hora_termino');
    const [observaciones, observacionesAttrs] = defineField('observaciones');

    const onSubmit = handleSubmit(async (values) => {
      mutate(values);

      if (props.isInsideModal) {
        window.tailwind.Modal.getOrCreateInstance(
          document.getElementById('modal-patient-create-or-edit'),
        ).hide();
      }
    });

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'patients.index' });
      }
    });

    watch(isUpdateSuccess, (value) => {
      if (!value) return;

      props.patientId === 'create'
        ? toast.success('Paciente creado correctamente')
        : toast.success('Paciente editado correctamente');

      resetForm({
        values: updatedPatient.value,
      });
    });

    watch(
      patient,
      (newPatient) => {
        if (!newPatient) return;

        const formattedPatient = {
          ...newPatient,
          fecha_nacimiento: formatDateToInput(newPatient.fecha_nacimiento),
        };

        resetForm({
          values: formattedPatient,
        });
      },
      {
        immediate: true,
      },
    );

    watch(
      () => props.patientId,
      (newPatientId) => {
        if (newPatientId === 'create') {
          resetForm({
            values: {
              id: '',
              nombre: '',
              primer_apellido: '',
              segundo_apellido: '',
              fecha_nacimiento: '',
              telefono: '',
              correo_electronico: '',
              observaciones: '',
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
      observaciones,

      motivoAttrs,
      fecha_hora_inicioAttrs,
      fecha_hora_terminoAttrs,
      observacionesAttrs,

      // getters
      action: props.appointmentId === 'create' ? 'create' : 'edit',

      // actions
      onSubmit,
    };
  },
});
