<template>
  <!-- <div
    class="pt-8 pb-12 px-7 z-10 relative xl:mt-8 before:absolute before:inset-0 before:opacity-[.07] before:bg-foreground before:rounded-4xl after:absolute after:inset-0 after:bg-[color-mix(in_oklch,_var(--color-background),_var(--color-foreground)_2%)] after:rounded-4xl after:border after:border-foreground/[.15] dark:after:opacity-[.59]"
  > -->
  <div class="relative z-20">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">Crear nueva cita</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->

    <div :class="['mt-10 border-t pt-10', !isInsideModal ? 'px-5 sm:px-20' : '']">
      <form @submit="onSubmit">
        <div class="mt-5 grid grid-cols-12 gap-4 gap-y-5">
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Motivo de la cita" :isRequired="false" />
            <InputBase
              type="text"
              name="segundo_apellido"
              placeholder="Ejemplo: realizar ultrasonido"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Fecha y hora de inicio de la cita" :isRequired="true" />
            <InputBaseDate type="datetime-local" name="fecha_hora_inicio" />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Fecha y hora de termino de la cita" :isRequired="true" />
            <InputBaseDate type="datetime-local" name="fecha_hora_termino" />
          </div>

          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Observaciones / anotaciones sobre la cita" :isRequired="false" />
            <TextArea
              v-model="observaciones"
              name="observaciones"
              placeholder="Ejemplo: traer estudios sobre la tiroides"
              :error="observaciones"
            />
          </div>
        </div>

        <div class="col-span-12 mt-10 flex items-center justify-center sm:justify-end">
          <ButtonPrimary text="Agendar cita" @click="onSubmit" />
        </div>
      </form>
    </div>
  </div>

  <!-- <div class="grid grid-cols-2 mt-2">
    <pre class="bg-blue-200 p-2">
      {{ JSON.stringify(values, null, 2) }}
    </pre>
    <pre class="bg-red-200 p-2">
      {{ JSON.stringify(errors, null, 2) }}
    </pre>
    <pre class="bg-green-200 p-2 col-span-2">
      {{ JSON.stringify(meta, null, 2) }}
    </pre>
  </div> -->
</template>

<script src="./AppointmentCreate.ts" lang="ts"></script>

<style scoped></style>
