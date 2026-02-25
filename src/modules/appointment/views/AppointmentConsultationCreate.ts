import { defineComponent } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import ButtonPrimary from '@/modules/common/components/ButtonPrimary.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { createUpdateConsultationAction } from '@/modules/consultation/actions';
import { useToast } from 'vue-toastification';
import { getAppointmentByIdAction } from '../actions';

const toast = useToast();

const schema = yup.object({
  motivo: yup.string().required('Este campo es obligatorio'),
  diagnostico: yup.string().required('Este campo es obligatorio'),
  tratamiento: yup.string().required('Este campo es obligatorio'),
});

export default defineComponent({
  components: {
    ButtonPrimary,
    InputLabel,
    InputBase,
    TextArea,
  },
  props: {
    appointmentId: {
      type: String,
      required: true,
      // default: 'create',
    },
  },

  setup(props) {
    const { data: appointment, isLoading } = useQuery({
      queryKey: ['appointment', props.appointmentId],
      queryFn: () => getAppointmentByIdAction(props.appointmentId),
    });

    // console.log(appointment.value);

    const { mutateAsync, isPending } = useMutation({
      mutationFn: createUpdateConsultationAction,
      onSuccess: (/* updatedAppointment */) => {
        toast.success('Consulta guardada correctamente');

        // queryClient.invalidateQueries({
        //   queryKey: ['appointments'],
        // });

        // emit('updated', updatedAppointment);
      },

      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });

    const onSubmit = handleSubmit(async (values) => {
      await mutateAsync({
        ...values,
        paciente_id: appointment.value?.pacientes[0].id,
        cita_id: Number(props.appointmentId),
      });
    });

    const [motivo, motivoAttrs] = defineField('motivo');
    const [diagnostico, diagnosticoAttrs] = defineField('diagnostico');
    const [tratamiento, tratamientoAttrs] = defineField('tratamiento');

    return {
      values,
      errors,
      meta,

      motivo,
      diagnostico,
      tratamiento,

      motivoAttrs,
      diagnosticoAttrs,
      tratamientoAttrs,

      onSubmit,
    };
  },
});
