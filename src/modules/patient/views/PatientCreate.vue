<template>
  <!-- <div
    class="pt-8 pb-12 px-7 z-10 relative xl:mt-8 before:absolute before:inset-0 before:opacity-[.07] before:bg-foreground before:rounded-4xl after:absolute after:inset-0 after:bg-[color-mix(in_oklch,_var(--color-background),_var(--color-foreground)_2%)] after:rounded-4xl after:border after:border-foreground/[.15] dark:after:opacity-[.59]"
  > -->
  <div class="relative z-20">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">Registro de paciente</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->

      <div class="mt-10 border-t px-5 pt-10 sm:px-20">
        <!-- <div class="text-base font-medium">Profile Settings</div> -->
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
                  placeholder="Ejemplo: 44 31 86 37 55"
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
            <ButtonPrimary text="Registrar" @click="onSubmit" />
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

<script src="./PatientCreate.ts" lang="ts"></script>

<style scoped></style>
