<template>
  <div class="relative z-20">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">CONSULTA MÉDICA</h2>
    </div>

    <div class="mt-10 border-t pt-10">
      <form @submit.prevent="onSubmit">
        <div class="mt-5 grid grid-cols-12 gap-4 gap-y-5">
          <!-- Motivo -->
          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Motivo de la consulta" :isRequired="true" />
            <TextArea
              v-model="motivo"
              v-bind="motivoAttrs"
              placeholder="Paciente refiere dolor de cabeza por 3 días..."
              name="motivo"
              :error="errors.motivo"
            />
          </div>
          <!-- Peso -->
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Peso (kg)" :isRequired="false" />
            <InputBase type="number" step="0.01" placeholder="78" name="weight" />
          </div>

          <!-- Altura -->
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Altura (cm)" :isRequired="false" />
            <InputBase type="number" step="0.1" placeholder="175" name="height" />
          </div>

          <!-- Temperatura -->
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Temperatura (°C)" :isRequired="false" />
            <InputBase type="number" step="0.1" placeholder="36.5" name="temperature" />
          </div>

          <!-- Presión arterial -->
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
            <InputLabel label="Presión arterial (mmHg)" :isRequired="false" />
            <InputBase type="text" placeholder="120/80" name="blood_pressure" />
          </div>

          <!-- Frecuencia cardiaca -->
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
            <InputLabel label="Frecuencia cardiaca (bpm)" :isRequired="false" />
            <InputBase type="number" placeholder="72" name="heart_rate" />
          </div>

          <!-- Diagnóstico -->
          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Diagnóstico" :isRequired="true" />
            <TextArea
              v-model="diagnostico"
              v-bind="diagnosticoAttrs"
              placeholder="Migraña sin aura..."
              name="diagnosticos"
              :error="errors.diagnostico"
            />
          </div>

          <!-- Tratamiento -->
          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Tratamiento" :isRequired="true" />
            <TextArea
              v-model="tratamiento"
              v-bind="tratamientoAttrs"
              placeholder="Ibuprofeno 400mg cada 8 horas..."
              name="tratamiento"
              :error="errors.tratamiento"
            />
          </div>

          <!-- Notas -->
          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Notas" :isRequired="false" />
            <TextArea placeholder="Observaciones adicionales..." name="notes" />
          </div>
        </div>

        <div class="col-span-12 mt-10 flex items-center justify-center sm:justify-end">
          <ButtonPrimary text="Guardar consulta" @click="onSubmit" />
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./AppointmentConsultationCreate.ts" lang="ts"></script>

<style scoped></style>
