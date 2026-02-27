<template>
  <div>
    <div class="flex flex-col p-5 lg:flex-row">
      <!-- Nombre -->
      <div class="flex items-center justify-center flex-[0.7] px-5 lg:justify-start">
        <div class="mx-5">
          <div class="opacity-70">NOMBRE</div>
          <div
            class="max-w-[180px] text-base font-medium truncate sm:max-w-[220px] sm:whitespace-normal lg:text-sm"
          >
            {{ patient.nombre_completo }}
          </div>
        </div>
      </div>
      <!-- Datos del paciente -->
      <div class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 lg:border-t-0 lg:pt-0">
        <div class="grid grid-cols-12 gap-x-10 gap-y-6">
          <div class="col-span-12 sm:col-span-12 md:col-span-12">
            <div class="text-xs opacity-70 flex"><CalendarBirthdayIcon /> FECHA DE NACIMIENTO</div>
            <div class="mt-1.5 flex items-center">
              <div class="text-base">
                {{ patient.fecha_nacimiento ?? 'Fecha de nacimiento no registrado' }}
                ~ <span v-if="patient.edad" class="">{{ patient.edad }} años</span>
              </div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-12 md:col-span-12">
            <div class="text-xs opacity-70 flex"><PhoneIcon /> TÉLEFONO</div>
            <div class="mt-1.5 flex items-center">
              <div class="text-base">{{ patient.telefono }}</div>
            </div>
          </div>
          <div class="col-span-12 sm:col-span-12 md:col-span-12">
            <div class="text-xs opacity-70 flex"><EmailIcon /> CORREO ELECTRÓNICO</div>
            <div class="mt-1.5 flex items-center">
              {{ patient.correo_electronico ?? 'Correo electrónico no registrado' }}
            </div>
          </div>
          <div class="col-span-12 sm:col-span-12 md:col-span-12">
            <div class="text-xs opacity-70 flex">
              <CalendarDateRegisterIcon /> FECHA DE REGISTRO EN SISTEMA
            </div>
            <div class="mt-1.5 flex items-center">
              <div class="text-base">{{ patient.creado_el }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- observaciones del paciente -->
      <div class="flex justify-center flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 lg:pt-0">
        <div class="grid grid-cols-12 gap-x-10 gap-y-6">
          <div class="col-span-12 sm:col-span-12 md:col-span-12">
            <div class="text-xs opacity-70 flex"><ObservationsIcon /> OBSERVACIONES</div>
            <div class="mt-1.5 flex items-center">
              <div class="text-base">
                {{ patient.observaciones || 'SIN OBSERVACIONES' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 flex flex-col justify-center gap-2 lg:flex-row">
      <ButtonBase
        text="Editar datos del paciente"
        :icon="UserEditIcon"
        color="secondary"
        data-tw-toggle="modal"
        data-tw-target="#modal-patient-create-or-edit"
      />
      <ButtonBase text="Eliminar paciente" :icon="UserDeleteIcon" color="danger" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonBase from '@/modules/common/components/ButtonBase.vue';

import CalendarBirthdayIcon from '@/icons/CalendarBirthdayIcon.vue';
import CalendarDateRegisterIcon from '@/icons/CalendarBirthdayIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import EmailIcon from '@/icons/EmailIcon.vue';
import PhoneIcon from '@/icons/PhoneIcon.vue';
import UserEditIcon from '@/icons/UserEditIcon.vue';
import UserDeleteIcon from '@/icons/UserDeleteIcon.vue';

import { useQuery } from '@tanstack/vue-query';
import { getPatientByIdAction } from '../actions/get-patient-by-id.action';

interface Props {
  patientId: string;
}

const props = defineProps<Props>();

const {
  data: patient,
  isLoading,
  error,
} = useQuery({
  queryKey: ['patient', { patientId: props.patientId }],
  queryFn: () => getPatientByIdAction(props.patientId),
});
</script>

<style scoped></style>
