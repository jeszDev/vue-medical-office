<template>
  <div class="relative z-20">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">Información del paciente</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->

    <div class="mt-10 border-t pt-10 px-5 sm:px-20">
      <div
        class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0 mt-5"
      >
        <div class="flex flex-col p-5 lg:flex-row">
          <div class="flex items-center justify-center flex-1 px-5 lg:justify-start">
            <!-- <div class="relative">
              <span
                data-content=""
                class="tooltip border-(--color)/5 block relative flex-none overflow-hidden rounded-full ring-1 ring-(--color)/25 [--color:var(--color-primary)] border-5 size-20 sm:size-24 lg:size-32"
                alt="Midone - Tailwind Admin Dashboard Template"
              >
                <img
                  class="absolute top-0 size-full object-cover"
                  src="dist/images/fakers/profile-3.jpg"
                  alt="Midone - Tailwind Admin Dashboard Template"
                />
              </span>
              <div
                class="bg-(--color)/70 border-3 border-background absolute bottom-0 right-0 mb-1 mr-1 flex items-center justify-center rounded-full p-2 text-white [--color:var(--color-primary)]"
              >
                <i
                  data-lucide="camera"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                ></i>
              </div>
            </div> -->
            <div class="ml-5">
              <div class="opacity-70">Nombre</div>
              <div class="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                {{ patient.nombre_completo }}
              </div>
              <!-- <div class="opacity-70">Backend Engineer</div> -->
            </div>
          </div>
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
                {{ patient.telefono ?? 'Télefono no regsitado' }}
              </div>
            </div>

            <div class="flex font-medium text-center lg:mt-3 lg:text-left">
              <EmailIcon /> Correo eléctronico
            </div>
            <div class="flex flex-col items-center justify-center mt-1 lg:items-start">
              <div class="flex items-center truncate sm:whitespace-normal ps-6">
                {{ patient.correo_electronico ?? 'Correo eléctronico no regsitado' }}
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
          <div
            class="flex items-center justify-center flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 lg:pt-0"
          >
            <div class="grid grid-cols-3 gap-5">
              <div class="text-center">
                <div class="text-xl font-medium">201</div>
                <div class="opacity-70">Orders</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-medium">1k</div>
                <div class="opacity-70">Purchases</div>
              </div>
              <div class="text-center">
                <div class="text-xl font-medium">492</div>
                <div class="opacity-70">Reviews</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="px-5 py-4">
          <ul
            role="tablist"
            class="bg-foreground/5 relative z-0 flex h-10 w-full select-none items-center justify-center rounded-xl p-1 [&&gt;*]:flex-1 mb-0"
          >
            <li role="presentation" class="z-20 w-full">
              <button
                class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
                type="button"
                role="tab"
              >
                <i
                  data-lucide="airplay"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                ></i>
                Profile
              </button>
            </li>
            <li role="presentation" class="z-20 w-full">
              <button
                class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
                type="button"
                role="tab"
              >
                <i
                  data-lucide="aperture"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                ></i>
                Account
              </button>
            </li>
            <li role="presentation" class="z-20 w-full">
              <button
                class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
                type="button"
                role="tab"
              >
                <i
                  data-lucide="package-check"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                ></i>
                Change Password
              </button>
            </li>
            <li role="presentation" class="z-20 w-full">
              <button
                class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
                type="button"
                role="tab"
              >
                <i
                  data-lucide="palette"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                ></i>
                Settings
              </button>
            </li>
          </ul>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { getPatientByIdAction } from '../actions/get-patient-by-id.action'
import CalendarBirthdayIcon from '@/icons/CalendarBirthdayIcon.vue'
import CalendarDateRegisterIcon from '@/icons/CalendarDateRegisterIcon.vue'
import EmailIcon from '@/icons/EmailIcon.vue'
import PhoneIcon from '@/icons/PhoneIcon.vue'

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
