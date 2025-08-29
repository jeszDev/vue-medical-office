import ButtonPrimary from '@/modules/common/components/ButtonPrimary.vue'
import InputLabel from '@/modules/common/components/InputLabel.vue'
import InputBase from '@/modules/common/components/InputBase.vue'
import InputBaseDate from '@/modules/common/components/InputBaseDate.vue'
import TextArea from '@/modules/common/components/TextArea.vue'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useForm, useFieldArray } from 'vee-validate'
import * as yup from 'yup'

import { createUpdatePatientAction, getPatientByIdAction } from '../actions'
import { watch } from 'vue'

const schema = yup.object({
  nombre: yup.string().required('Este campo es obligatorio'),
  primer_apellido: yup.string().required('Este campo es obligatorio'),
  segundo_apellido: yup.string(),
  fecha_nacimiento: yup
    .date()
    .required('Indique la fecha de intervención')
    .typeError('Debe ingresar una fecha y hora válidas'),
  telefono: yup.string(),
  correo_electronico: yup.string(),
  observaciones: yup.string(),
})

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
    const router = useRouter()
    // const modal = props.isInsideModal

    const {
      data: patient,
      isError,
      isLoading,
    } = useQuery({
      queryKey: ['patient', props.patientId],
      queryFn: () => getPatientByIdAction(props.patientId),
      retry: false,
    })

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedPatient,
    } = useMutation({
      mutationFn: createUpdatePatientAction,
    })

    const { values, defineField, validateField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    })
    const [nombre, nombreAttrs] = defineField('nombre')
    const [primer_apellido, primer_apellidoAttrs] = defineField('primer_apellido')
    const [segundo_apellido, segundo_apellidoAttrs] = defineField('segundo_apellido')
    const [fecha_nacimiento, fecha_nacimientoAttrs] = defineField('fecha_nacimiento')
    const [telefono, telefonoAttrs] = defineField('telefono')
    const [correo_electronico, correo_electronicoAttrs] = defineField('correo_electronico')
    const [observaciones, observacionesAttrs] = defineField('observaciones')

    const onSubmit = handleSubmit(async (values) => {
      console.log('onsubmit')
      console.log({ values })

      mutate(values)
    })

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace({ name: 'patients.index' })
      }
    })

    watch(
      patient,
      () => {
        if (!patient) return

        resetForm({
          values: patient.value,
        })
      },
      {
        deep: true,
        immediate: true,
      },
    )

    watch(isUpdateSuccess, (value) => {
      if (!value) return

      // todo: toast(Cadena actualizada)

      resetForm({
        values: updatedPatient.value,
      })
    })

    return {
      // modal,

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

      // actions
      onSubmit,
    }
  },
})
