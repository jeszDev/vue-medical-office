import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import InputLabel from '@/modules/common/components/InputLabel.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import InputBaseDate from '@/modules/common/components/InputBaseDate.vue';
import TextArea from '@/modules/common/components/TextArea.vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import { computed, defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toastification';

import { createUpdatePatientAction, getPatientByIdAction } from '../actions';
import formatDateToInput from '@/helpers/format-date-to-input.helper';
import { useModalFormReset } from '@/modules/common/composables/useModalFormReset';

const schema = yup.object({
  curp: yup.string().nullable().notRequired(),
  nombre: yup.string().required('El nombre es obligatorio'),
  primer_apellido: yup.string().required('El primer apellido es obligatorio'),
  segundo_apellido: yup.string().nullable(),
  fecha_nacimiento: yup.string().nullable(),
  telefono: yup.string().nullable().notRequired(),
  correo_electronico: yup.string().nullable().notRequired().email('Correo electrónico inválido'),
  observaciones: yup.string().nullable(),
});

interface PatientFormValues {
  id?: string;
  curp?: string | null;
  nombre: string;
  primer_apellido: string;
  segundo_apellido?: string | null;
  fecha_nacimiento?: string | null;
  telefono?: string | null;
  correo_electronico?: string | null;
  observaciones?: string | null;
}

export default defineComponent({
  name: 'PatientCreate',
  components: {
    ButtonBase,
    InputLabel,
    InputBase,
    InputBaseDate,
    TextArea,
    ModalQuestion,
  },
  props: {
    patientId: {
      type: String,
      required: true,
      default: 'create',
    },
    isInsideModal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const queryClient = useQueryClient();

    const showConfirmModal = ref(false);
    const pendingPatientValues = ref<PatientFormValues | null>(null);

    const {
      data: patient,
      isError,
      isLoading,
    } = useQuery({
      queryKey: ['patient', computed(() => props.patientId)],
      queryFn: () => getPatientByIdAction(props.patientId),
      enabled: computed(() => props.patientId !== 'create' && !!props.patientId),
    });

    const { mutateAsync, isPending } = useMutation({
      mutationFn: createUpdatePatientAction,
      onSuccess: () => {
        toast.success(
          props.patientId === 'create'
            ? 'Paciente registrado correctamente'
            : 'Paciente actualizado correctamente',
        );

        queryClient.invalidateQueries({ queryKey: ['patients'] });

        if (props.patientId === 'create') {
          resetForm({
            values: {
              id: '',
              curp: '',
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

        pendingPatientValues.value = null;
        showConfirmModal.value = false;

        if (!props.isInsideModal) {
          router.replace({ name: 'patients.index' });
        }
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Error al guardar el paciente');
      },
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });

    const [curp, curpAttrs] = defineField('curp');
    const [nombre, nombreAttrs] = defineField('nombre');
    const [primer_apellido, primer_apellidoAttrs] = defineField('primer_apellido');
    const [segundo_apellido, segundo_apellidoAttrs] = defineField('segundo_apellido');
    const [fecha_nacimiento, fecha_nacimientoAttrs] = defineField('fecha_nacimiento');
    const [telefono, telefonoAttrs] = defineField('telefono');
    const [correo_electronico, correo_electronicoAttrs] = defineField('correo_electronico');
    const [observaciones, observacionesAttrs] = defineField('observaciones');

    const onSubmit = handleSubmit(
      (formValues) => {
        pendingPatientValues.value = formValues as PatientFormValues;

        if (props.isInsideModal) {
          const modalEl = document.getElementById('modal-patient-create-or-edit');
          if (modalEl && window.tailwind) {
            window.tailwind.Modal.getOrCreateInstance(modalEl).hide();
          }
        }

        showConfirmModal.value = true;
      },
      ({ errors: validationErrors }) => {
        const errorKeys = Object.keys(validationErrors);
        if (errorKeys.length > 0) {
          toast.warning('Por favor completa los campos obligatorios: Nombre y Primer apellido.');
        }
      },
    );

    const onConfirmSave = async () => {
      if (!pendingPatientValues.value || isPending.value) return;

      try {
        await mutateAsync(pendingPatientValues.value as Record<string, unknown>);
      } catch {
        // Manejado en onError
      }
    };

    const onCancelConfirm = () => {
      showConfirmModal.value = false;
    };

    // Si se cierra el modal de confirmación sin haber guardado y estamos dentro de un modal,
    // reabrimos el modal de registro manteniendo los datos intactos
    watch(showConfirmModal, (isOpen, wasOpen) => {
      if (!isOpen && wasOpen && pendingPatientValues.value && props.isInsideModal) {
        setTimeout(() => {
          const modalEl = document.getElementById('modal-patient-create-or-edit');
          if (modalEl && window.tailwind) {
            window.tailwind.Modal.getOrCreateInstance(modalEl).show();
          }
        }, 200);
      }
    });

    const resetPatientForm = () => {
      if (props.patientId === 'create') {
        resetForm({
          values: {
            id: '',
            curp: '',
            nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            fecha_nacimiento: '',
            telefono: '',
            correo_electronico: '',
            observaciones: '',
          },
        });
      } else if (patient.value) {
        const formattedPatient = {
          ...patient.value,
          fecha_nacimiento: formatDateToInput(patient.value.fecha_nacimiento),
        };
        resetForm({
          values: formattedPatient,
        });
      }
      pendingPatientValues.value = null;
      showConfirmModal.value = false;
    };

    useModalFormReset(
      'modal-patient-create-or-edit',
      resetPatientForm,
      computed(() => props.isInsideModal),
    );

    const onCancel = () => {
      resetPatientForm();
      if (props.isInsideModal) {
        const modalEl = document.getElementById('modal-patient-create-or-edit');
        if (modalEl && window.tailwind) {
          window.tailwind.Modal.getOrCreateInstance(modalEl).hide();
        }
      } else {
        router.back();
      }
    };

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
      () => {
        resetPatientForm();
      },
    );

    // Redirigir en caso de error al cargar el paciente en modo edición
    watchEffect(() => {
      if (isError.value && !isLoading.value && props.patientId !== 'create') {
        router.replace({ name: 'patients.index' });
      }
    });

    return {
      values,
      errors,
      meta,

      curp,
      nombre,
      primer_apellido,
      segundo_apellido,
      fecha_nacimiento,
      telefono,
      correo_electronico,
      observaciones,

      curpAttrs,
      nombreAttrs,
      primer_apellidoAttrs,
      segundo_apellidoAttrs,
      fecha_nacimientoAttrs,
      telefonoAttrs,
      correo_electronicoAttrs,
      observacionesAttrs,

      action: computed(() => (props.patientId === 'create' ? 'create' : 'edit')),
      isPending,
      showConfirmModal,
      pendingPatientValues,

      onSubmit,
      onConfirmSave,
      onCancelConfirm,
      onCancel,
    };
  },
});
