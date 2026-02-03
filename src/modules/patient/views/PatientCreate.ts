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
  nombre: yup.string().required('Este campo es obligatorio'),
  primer_apellido: yup.string().required('Este campo es obligatorio'),
  segundo_apellido: yup.string().nullable(),
  fecha_nacimiento: yup.string().nullable(),
  telefono: yup.string().nullable().notRequired(),
  correo_electronico: yup.string().nullable().notRequired().email('Correo electrónico inválido'),
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
    patientId: {
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
    // const modal = props.isInsideModal
    // console.log(`patientIddd: ${props.patientId}`);

    const {
      data: patient,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['patient', props.patientId],
      queryFn: () => getPatientByIdAction(props.patientId),
      // enabled: props.patientId !== 'create', // Evitar la consulta si es 'create'
      // retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedPatient,
    } = useMutation({
      mutationFn: createUpdatePatientAction,
    });

    const { values, defineField, validateField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });
    const [nombre, nombreAttrs] = defineField('nombre');
    const [primer_apellido, primer_apellidoAttrs] = defineField('primer_apellido');
    const [segundo_apellido, segundo_apellidoAttrs] = defineField('segundo_apellido');
    const [fecha_nacimiento, fecha_nacimientoAttrs] = defineField('fecha_nacimiento');
    const [telefono, telefonoAttrs] = defineField('telefono');
    const [correo_electronico, correo_electronicoAttrs] = defineField('correo_electronico');
    const [observaciones, observacionesAttrs] = defineField('observaciones');

    const onSubmit = handleSubmit(async (values) => {
      mutate(values);

      if (props.isInsideModal) {
        window.tailwind.Modal.getOrCreateInstance(
          document.getElementById('modal-patient-create'),
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

      nombre,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento,
      telefono,
      correo_electronico,
      observaciones,

      nombreAttrs,
      primer_apellidoAttrs,
      segundo_apellidoAttrs,
      fecha_nacimientoAttrs,
      telefonoAttrs,
      correo_electronicoAttrs,
      observacionesAttrs,

      // getters
      action: props.patientId === 'create' ? 'create' : 'edit',

      // actions
      onSubmit,
    };
  },
});
