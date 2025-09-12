<template>
  <div class="relative">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">Información del paciente</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->

    <div class="mt-10 border-t pt-10 px-5 sm:px-20">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0 mt-5"
      >
        <div class="flex flex-col p-5 lg:flex-row">
  <!-- Nombre -->
  <div class="flex items-center justify-center flex-[0.7] px-5 lg:justify-start">
    <div class="ml-5">
      <div class="opacity-70">Nombre</div>
      <div
        class="max-w-[180px] text-base font-medium truncate sm:max-w-[220px] sm:whitespace-normal lg:text-sm"
      >
        {{ patient.nombre_completo }}
      </div>
    </div>
  </div>

  <!-- Datos del paciente -->
  <div
    class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 lg:border-t-0 lg:pt-0"
  >
    <div class="flex font-medium text-center lg:mt-3 lg:text-left">
      <CalendarBirthdayIcon /> Fecha de nacimiento
    </div>
    <div class="flex flex-col items-center justify-center mt-1 lg:items-start">
      <div class="flex items-center truncate sm:whitespace-normal ps-6">
        {{ patient.fecha_nacimiento ?? 'Fecha de nacimiento no registrado' }}
      </div>
      <div v-if="patient.edad" class="ps-6">({{ patient.edad }} años)</div>
    </div>

    <div class="flex font-medium text-center lg:mt-3 lg:text-left">
      <PhoneIcon /> Télefono
    </div>
    <div class="flex flex-col items-center justify-center mt-1 lg:items-start">
      <div class="flex items-center truncate sm:whitespace-normal ps-6">
        {{ patient.telefono ?? 'Télefono no registrado' }}
      </div>
    </div>

    <div class="flex font-medium text-center lg:mt-3 lg:text-left">
      <EmailIcon /> Correo electrónico
    </div>
    <div class="flex flex-col items-center justify-center mt-1 lg:items-start">
      <div class="flex items-center truncate sm:whitespace-normal ps-6">
        {{ patient.correo_electronico ?? 'Correo electrónico no registrado' }}
      </div>
    </div>

    <div class="flex font-medium text-center lg:mt-3 lg:text-left">
      <CalendarDateRegisterIcon /> Fecha de registro en sistema
    </div>
    <div class="flex flex-col items-center justify-center mt-1 lg:items-start">
      <div class="flex items-center truncate sm:whitespace-normal ps-6">
        {{ patient.creado_el }}
      </div>
    </div>
  </div>

  <!-- Acciones -->
  <div
    class="flex items-center justify-center flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 lg:pt-0"
  >
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 w-full">
      <ButtonBase text="Ver citas" :icon="PreviewIcon" color="primary" data-tw-toggle="modal"
                          data-tw-target="#modal-patient-appointments" />
      <ButtonBase text="Editar" :icon="EditIcon" color="secondary" data-tw-toggle="modal"
                          data-tw-target="#modal-patient-edit" />
      <ButtonBase text="Eliminar" :icon="DeleteIcon" color="danger" />
    </div>
  </div>
</div>

      </div>
    </div>
  </div>

  <DialogBasic id="modal-patient-appointments" size="3xl">
    <PatientAppointmentsIndex :patient-id="patientId" />
  </DialogBasic>

  <DialogBasic id="modal-patient-edit" size="3xl">
    <PatientCreate :patient-id="patientId" :is-inside-modal="true" />
  </DialogBasic>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { getPatientByIdAction } from '../actions/get-patient-by-id.action'
import CalendarBirthdayIcon from '@/icons/CalendarBirthdayIcon.vue'
import CalendarDateRegisterIcon from '@/icons/CalendarDateRegisterIcon.vue'
import EmailIcon from '@/icons/EmailIcon.vue'
import EditIcon from '@/icons/EditIcon.vue'
import DeleteIcon from '@/icons/DeleteIcon.vue'
import PreviewIcon from '@/icons/PreviewIcon.vue'
import PhoneIcon from '@/icons/PhoneIcon.vue'
import DialogBasic from '@/modules/common/components/DialogBasic.vue'
import ButtonBase from '@/modules/common/components/ButtonBase.vue'
import PatientAppointmentsIndex from '@/modules/patient/views/PatientAppointmentsIndex.vue'
import PatientCreate from '@/modules/patient/views/PatientCreate.vue'

interface Props {
  patientId: string
}

const props = defineProps<Props>()

const {
  data: patient,
  isLoading,
  error,
} = useQuery({
  queryKey: ['patient', { patientId: props.patientId }],
  queryFn: () => getPatientByIdAction(props.patientId),
})
</script>

<style scoped></style>
