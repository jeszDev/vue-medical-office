import ButtonPrimary from '@/modules/common/components/ButtonPrimary.vue';
import ButtonSecondary from '@/modules/common/components/ButtonSecondary.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputText from '@/modules/common/components/InputText.vue';
import InputDateTime from '@/modules/common/components/InputDateTime.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import WizardStep from '@/modules/common/components/WizardStep.vue';
import DeleteIcon from '@/icons/DeleteIcon.vue';
import CloneIcon from '@/icons/CloneIcon.vue';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';

import { createUpdateChainCustodyAction, getChainCustodyByIdAction } from '../actions';
import { watch } from 'vue';

const schema = yup.object({
  numero_caso: yup.string().required('Este campo es obligatorio'),
  folio: yup.string(),
  intervencion_fecha: yup
    .date()
    .required('Indique la fecha de intervención')
    .typeError('Debe ingresar una fecha y hora válidas')
    .max(new Date(), 'La fecha y hora no pueden ser mayores a la actual'),
  motivo_registro: yup.string().required('Indique el motivo del registro'),
  tiene_documento_escrito: yup.string().required('Indique si empleo el método escrito'),
  tiene_documento_fotografico: yup.string().required('Indique si empleo el método fotográfico'),
  tiene_documento_croquis: yup.string().required('Indique si empleo el método croquis'),
  tiene_documento_otro: yup.string().required('Indique si empleo el método otro'),
  clues: yup
    .array()
    .of(
      yup.object({
        identificador: yup.string().required('Identificador requerido'),
        descripcion: yup.string().required('Descripción requerida'),
        ubicacion_lugar: yup.string().required('Ubicación en el lugar requerida'),
        recoleccion_fecha: yup
          .date()
          .required('Indique la hora de recolección')
          .typeError('Debe ingresar una fecha y hora válidas')
          .max(new Date(), 'La fecha y hora no pueden ser mayores a la actual'),
      }),
    )
    .min(1, 'Al menos un indicio es requerido'),
});

export default defineComponent({
  components: {
    ButtonPrimary,
    ButtonSecondary,
    InputLabel,
    InputText,
    InputDateTime,
    TextArea,
    WizardStep,
    DeleteIcon,
    CloneIcon,
  },
  props: {
    chainCustodyId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const totalSteps = 5;
    const currentStep = ref<number>(1);
    const router = useRouter();

    const {
      data: chainCustody,
      isError,
      isLoading,
    } = useQuery({
      queryKey: ['chainCustody', props.chainCustodyId],
      queryFn: () => getChainCustodyByIdAction(props.chainCustodyId),
      retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedChainCustody,
    } = useMutation({
      mutationFn: createUpdateChainCustodyAction,
    });

    const { values, defineField, validateField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
      // initialValues: {
      //   numero_caso: '',
      //   folio: '',
      //   intervencion_fecha: '',
      //   motivo_registro: '',
      //   clues: [{ identificador: '', descripcion: '' }],
      // },
    });
    const [numero_caso, numero_casoAttrs] = defineField('numero_caso');
    const [folio, folioAttrs] = defineField('folio');
    const [intervencion_fecha, intervencion_fechaAttrs] = defineField('intervencion_fecha');
    const [motivo_registro, motivo_registroAttrs] = defineField('motivo_registro');
    const [tiene_documento_escrito, tiene_documento_escritoAttrs] =
      defineField('tiene_documento_escrito');
    const [tiene_documento_fotografico, tiene_documento_fotograficoAttrs] = defineField(
      'tiene_documento_fotografico',
    );
    const [tiene_documento_croquis, tiene_documento_croquisAttrs] =
      defineField('tiene_documento_croquis');
    const [tiene_documento_otro, tiene_documento_otroAttrs] = defineField('tiene_documento_otro');
    const [documento_otro_descripcion, documento_otro_descripcionAttrs] = defineField(
      'documento_otro_descripcion',
    );

    const { fields: clues, push: pushClue, remove: removeClue } = useFieldArray('clues');

    const addClue = () => {
      pushClue({
        identificador: '',
        descripcion: '',
        ubicacion_lugar: '',
        recoleccion_fecha: '',
        recoleccion_tipo: '',
        embalaje_tipo: '',
      });
    };

    const cloneClue = (index: number) => {
      console.log(clues.value[0].value.identificador);

      // const clue = clues.value[index];

      pushClue({
        identificador: clues.value[index].value.identificador,
        descripcion: clues.value[index].value.descripcion,
        ubicacion_lugar: clues.value[index].value.ubicacion_lugar,
        recoleccion_fecha: clues.value[index].value.recoleccion_fecha,
        recoleccion_tipo: clues.value[index].value.recoleccion_tipo,
        embalaje_tipo: clues.value[index].value.embalaje_tipo,
      });
    };

    async function nextStep() {
      let isValid = false;

      switch (currentStep.value) {
        case 1:
          const results = await Promise.all([
            validateField('numero_caso'),
            validateField('intervencion_fecha'),
            validateField('motivo_registro'),
          ]);

          isValid = results.every((result) => result.valid);
          break;

        case 2:
          const validations = await Promise.all(
            clues.value.map((_, idx) =>
              Promise.all([
                validateField(`clues[${idx}].identificador`),
                validateField(`clues[${idx}].descripcion`),
                validateField(`clues[${idx}].ubicacion_lugar`),
                validateField(`clues[${idx}].recoleccion_fecha`),
              ]),
            ),
          );

          // Flatten y revisar si todos son válidos
          isValid = validations.flat().every((v) => v.valid);
          break;

        case 3:
          const r = await Promise.all([
            validateField('tiene_documento_escrito'),
            validateField('tiene_documento_fotografico'),
            validateField('tiene_documento_croquis'),
            validateField('tiene_documento_otro'),
          ]);

          isValid = r.every((result) => result.valid);
          break;

        case 4:
          const va = await Promise.all(
            clues.value.map((_, idx) =>
              Promise.all([validateField(`clues[${idx}].tipo_recoleccion`)]),
            ),
          );

          // Flatten y revisar si todos son válidos
          isValid = va.flat().every((v) => v.valid);
          break;

        default:
          break;
      }

      if (isValid && currentStep.value <= totalSteps) {
        currentStep.value++;
      }
    }

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
      }
    };

    const onSubmit = handleSubmit(async (values) => {
      console.log('onsubmit');
      console.log({ values });

      mutate(values);
    });

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'chains-custody.index' });
      }
    });

    watch(
      chainCustody,
      () => {
        if (!chainCustody) return;

        resetForm({
          values: chainCustody.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(tiene_documento_otro, (value) => {
      if (!value) {
        documento_otro_descripcion.value = '';
      }
    });

    watch(isUpdateSuccess, (value) => {
      if (!value) return;

      // todo: toast(Cadena actualizada)

      resetForm({
        values: updatedChainCustody.value,
      });
    });

    return {
      //
      // clues,
      totalSteps,
      currentStep,

      values,
      errors,
      meta,

      numero_caso,
      numero_casoAttrs,
      folio,
      folioAttrs,
      intervencion_fecha,
      intervencion_fechaAttrs,
      motivo_registro,
      motivo_registroAttrs,
      tiene_documento_escrito,
      tiene_documento_escritoAttrs,
      tiene_documento_fotografico,
      tiene_documento_fotograficoAttrs,
      tiene_documento_croquis,
      tiene_documento_croquisAttrs,
      tiene_documento_otro,
      tiene_documento_otroAttrs,
      documento_otro_descripcion,
      documento_otro_descripcionAttrs,

      clues,
      addClue,
      cloneClue,
      removeClue,
      // getters

      // actions

      nextStep,
      prevStep,
      onSubmit,
    };
  },
});
