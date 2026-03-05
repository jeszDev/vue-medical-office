<template>
  <TemplateView title="AGENDAR NUEVA CITA">
    <template #main>
      <!-- <FullScreenLoader v-if="isLoading" /> -->

      <form @submit="onSubmit">
        <div class="mt-5 grid grid-cols-12 gap-4 gap-y-5">
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-12">
            <InputLabel label="Motivo de la cita" :isRequired="true" />
            <InputBase
              type="text"
              v-model="motivo"
              v-bind="motivoAttrs"
              :error="errors.motivo"
              placeholder="Ejemplo: realizar ultrasonido"
              name="motivo"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
            <InputLabel label="Fecha y hora de inicio de la cita" :isRequired="true" />
            <InputBaseDate
              type="datetime-local"
              v-model="fecha_hora_inicio"
              v-bind="fecha_hora_inicioAttrs"
              :error="errors.fecha_hora_inicio"
              name="fecha_hora_inicio"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
            <InputLabel label="Fecha y hora de termino de la cita" :isRequired="true" />
            <InputBaseDate
              type="datetime-local"
              v-model="fecha_hora_termino"
              v-bind="fecha_hora_terminoAttrs"
              :error="errors.fecha_hora_termino"
              name="fecha_hora_termino"
            />
          </div>

          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Observaciones / anotaciones sobre la cita" :isRequired="false" />
            <TextArea
              v-model="observaciones_cita"
              v-bind="observaciones_citaAttrs"
              placeholder="Ejemplo: traer estudios sobre la tiroides"
              name="observaciones"
              :error="errors.observaciones_cita"
            />
          </div>
        </div>

        <div class="col-span-12 mt-10 flex items-center justify-center sm:justify-end">
          <ButtonPrimary text="Agendar cita" @click="onSubmit" />
        </div>
      </form>

      <!-- <template v-else> -->
      <!-- </template> -->
    </template>
  </TemplateView>

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

<script src="./AppointmentCreateUpdate.ts" lang="ts"></script>

<style scoped></style>
