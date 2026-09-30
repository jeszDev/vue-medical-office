<template>
  <FullScreenLoader v-if="!patient" />
  <TemplateView v-else title="INFORMACIÓN">
    <template #main>
      <div v-if="patient">
        <div class="flex flex-col p-5 lg:flex-row">
          <!-- Nombre -->
          <!-- Columna izquierda: Avatar e Identificación del Paciente -->
          <div
            class="flex flex-col items-center justify-center flex-[0.7] px-5 text-center lg:items-start lg:text-left"
          >
            <div class="flex items-center gap-4">
              <!-- Circle Avatar con la inicial del paciente -->

              <div class="flex items-center gap-4">
                <!-- Avatar con Diseño de Midone -->
                <span
                  class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full border-3 ring-1 ring-(--color)/25 [--color:var(--color-primary)] bg-background size-16 cursor-pointer transition-all hover:scale-110"
                >
                  <!-- 🖼️ 1. Si el paciente tiene foto -->
                  <img
                    v-if="patient.avatar"
                    class="absolute top-0 size-full object-cover"
                    :src="patient.avatar"
                    :alt="patient.nombre_completo"
                  />

                  <!-- 🔤 2. Si NO tiene foto: Muestra la Letra Inicial centrada -->
                  <div
                    v-else
                    class="absolute top-0 size-full bg-primary/15 text-primary flex items-center justify-center text-2xl font-bold uppercase"
                  >
                    {{ patient.nombre ? patient.nombre.charAt(0).toUpperCase() : 'P' }}
                  </div>
                </span>

                <!-- Nombre y Edad del Paciente -->
                <div>
                  <div class="text-xs font-semibold uppercase tracking-wider opacity-60">
                    PACIENTE
                  </div>
                  <h3 class="text-lg font-bold text-foreground mt-0.5">
                    {{ patient.nombre_completo }}
                  </h3>
                  <div v-if="patient.edad" class="mt-1">
                    <!-- <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary"
                    >
                      {{ patient.edad }} años
                    </span> -->
                    <PillBadge size="sm" color="primary" :label="`${patient.edad} años`" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Datos del paciente -->
          <div
            class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 lg:border-t-0 lg:pt-0"
          >
            <div class="grid grid-cols-12 gap-x-10 gap-y-6">
              <div class="col-span-12 sm:col-span-12 md:col-span-12">
                <div class="text-xs opacity-70 flex">
                  <CalendarBirthdayIcon /> FECHA DE NACIMIENTO
                </div>
                <div class="mt-1.5 flex items-center">
                  <div class="text-base">
                    {{ patient.fecha_nacimiento ?? 'Fecha de nacimiento no registrado' }}
                    ~ <span v-if="patient.edad" class="">{{ patient.edad }} años</span>
                  </div>
                </div>
              </div>
              <!-- Teléfono interactivo -->
              <div class="col-span-12 sm:col-span-12 md:col-span-12">
                <div class="text-xs opacity-70 flex items-center gap-1.5 font-medium">
                  <PhoneIcon class="w-3.5 h-3.5" /> TÉLEFONO
                </div>
                <div class="mt-1.5 flex items-center">
                  <a
                    v-if="patient.telefono"
                    :href="`tel:${patient.telefono}`"
                    class="text-base text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {{ patient.telefono }}
                  </a>
                  <span v-else class="text-base opacity-50">Sin teléfono registrado</span>
                </div>
              </div>

              <!-- Correo interactivo -->
              <div class="col-span-12 sm:col-span-12 md:col-span-12">
                <div class="text-xs opacity-70 flex items-center gap-1.5 font-medium">
                  <EmailIcon class="w-3.5 h-3.5" /> CORREO ELECTRÓNICO
                </div>
                <div class="mt-1.5 flex items-center">
                  <a
                    v-if="patient.correo_electronico"
                    :href="`mailto:${patient.correo_electronico}`"
                    class="text-base text-primary hover:underline font-medium"
                  >
                    {{ patient.correo_electronico }}
                  </a>
                  <span v-else class="text-base opacity-50">Correo no registrado</span>
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
          <div class="flex-1 px-5 pt-5 mt-6 lg:mt-0">
            <div class="text-xs opacity-70 flex items-center gap-1.5 font-medium mb-2">
              <ObservationsIcon class="w-3.5 h-3.5" /> OBSERVACIONES Y NOTAS MÉDICAS
            </div>

            <div class="p-4 rounded-xl border bg-muted/30 dark:bg-foreground/5 min-h-[100px]">
              <p class="text-sm leading-relaxed opacity-90">
                {{ patient.observaciones || 'Sin observaciones o antecedentes registrados.' }}
              </p>
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

        <DialogBasic id="modal-patient-create-or-edit" size="3xl">
          <PatientCreate :patient-id="patient.id" />
        </DialogBasic>
      </div>
    </template>
  </TemplateView>
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
import type { Patient } from '../interfaces/patient.interface';

import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import PatientCreate from '@/modules/patient/views/PatientCreate.vue';

// import { useQuery } from '@tanstack/vue-query';
// import { getPatientByIdAction } from '../actions/get-patient-by-id.action';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';

interface Props {
  patient: Patient | undefined;
}

defineProps<Props>();

// const {
//   data: patient,
//   isLoading,
//   error,
// } = useQuery({
//   queryKey: ['patient', { patientId: props.patientId }],
//   queryFn: () => getPatientByIdAction(props.patientId),
// });
</script>

<style scoped></style>
