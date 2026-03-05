<template>
  <TemplateView :title="action === 'create' ? 'REGISTRAR PACIENTE' : 'EDITAR PACIENTE'">
    <template #main>
      <!-- <FullScreenLoader v-if="isLoading" /> -->

      <!-- <template v-else> -->
      <!-- <template> -->
      <form @submit="onSubmit">
        <div class="mt-5 grid grid-cols-12 gap-4 gap-y-5">
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Nombre" :isRequired="true" />
            <InputBase
              type="text"
              v-model="nombre"
              v-bind="nombreAttrs"
              :error="errors.nombre"
              name="nombre"
              placeholder="Ejemplo: Mauricio"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Primer apellido" :isRequired="true" />
            <InputBase
              type="text"
              v-model="primer_apellido"
              v-bind="primer_apellidoAttrs"
              :error="errors.primer_apellido"
              name="primer_apellido"
              placeholder="Ejemplo: Colin"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Segundo apellido" :isRequired="false" />
            <InputBase
              type="text"
              v-model="segundo_apellido"
              v-bind="segundo_apellidoAttrs"
              :error="errors.segundo_apellido"
              name="segundo_apellido"
              placeholder="Ejemplo: Yepez"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Fecha de nacimiento" :isRequired="false" />
            <InputBaseDate
              type="date"
              v-model="fecha_nacimiento"
              v-bind="fecha_nacimientoAttrs"
              :error="errors.fecha_nacimiento"
              name="fecha_nacimiento"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Télefono" :isRequired="false" />
            <InputBase
              type="tel"
              v-model="telefono"
              v-bind="telefonoAttrs"
              :error="errors.telefono"
              name="telefono"
              placeholder="Ejemplo: 44 31 86 37 55"
            />
          </div>
          <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-4">
            <InputLabel label="Correo eléctronico" :isRequired="false" />
            <InputBase
              type="email"
              v-model="correo_electronico"
              v-bind="correo_electronicoAttrs"
              :error="errors.correo_electronico"
              name="correo_electronico"
              placeholder="Ejemplo: correo@gmail.com"
            />
          </div>

          <div class="flex flex-col gap-2.5 col-span-12">
            <InputLabel label="Observaciones" :isRequired="false" />
            <TextArea
              v-model="observaciones"
              name="observaciones"
              placeholder="Ejemplo: tipo de alergias"
              :error="observaciones"
            />
          </div>
        </div>

        <div class="col-span-12 mt-10 flex items-center justify-center sm:justify-end">
          <ButtonPrimary :text="action === 'create' ? 'Registrar' : 'Editar'" @click="onSubmit" />
        </div>
      </form>
      <!-- </template> -->
    </template>
  </TemplateView>
</template>

<script src="./PatientCreate.ts" lang="ts"></script>

<style scoped></style>
