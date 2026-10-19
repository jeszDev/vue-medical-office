<template>
  <div class="relative z-20 w-full">
    <!-- Encabezado compacto -->
    <div
      class="flex items-center pb-3 border-b border-foreground/10"
      :class="{ 'mt-2': !isInsideModal }"
    >
      <h2 class="text-base sm:text-lg font-semibold text-foreground">
        {{ action === 'create' ? 'Registro de nuevo paciente' : 'Editar paciente' }}
      </h2>
    </div>

    <!-- Formulario con espaciado optimizado -->
    <div :class="['mt-4', !isInsideModal ? 'px-5 sm:px-20' : '']">
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-4 gap-y-4">
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
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
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
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
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
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
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
            <InputLabel label="CURP" :isRequired="false" />
            <InputBase
              type="text"
              v-model="curp"
              v-bind="curpAttrs"
              :error="errors.curp"
              name="curp"
              placeholder="Ejemplo: GOHC820512HDFR0001"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
            <InputLabel label="Fecha de nacimiento" :isRequired="false" />
            <InputBaseDate
              type="date"
              v-model="fecha_nacimiento"
              v-bind="fecha_nacimientoAttrs"
              :error="errors.fecha_nacimiento"
              name="fecha_nacimiento"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-4">
            <InputLabel label="Teléfono" :isRequired="false" />
            <InputBase
              type="tel"
              v-model="telefono"
              v-bind="telefonoAttrs"
              :error="errors.telefono"
              name="telefono"
              placeholder="Ejemplo: 44 31 86 37 55"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
            <InputLabel label="Correo electrónico" :isRequired="false" />
            <InputBase
              type="email"
              v-model="correo_electronico"
              v-bind="correo_electronicoAttrs"
              :error="errors.correo_electronico"
              name="correo_electronico"
              placeholder="Ejemplo: correo@gmail.com"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-12">
            <InputLabel label="Observaciones" :isRequired="false" />
            <TextArea
              v-model="observaciones"
              name="observaciones"
              placeholder="Ejemplo: tipo de alergias"
              :error="errors.observaciones"
            />
          </div>

          <!-- Botones de Acción: Registrar a la izquierda, Cancelar a la derecha -->
          <div
            class="col-span-12 mt-4 pt-4 border-t border-foreground/10 flex items-center justify-end gap-3"
          >
            <ButtonBase
              :text="
                isPending
                  ? action === 'create'
                    ? 'Registrando...'
                    : 'Guardando...'
                  : action === 'create'
                    ? 'Registrar'
                    : 'Guardar cambios'
              "
              color="primary"
              :disabled="isPending"
              @click="onSubmit"
            />
            <ButtonBase
              text="Cancelar"
              color="secondary"
              :disabled="isPending"
              @click="onCancel"
            />
          </div>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal de Confirmación -->
  <Teleport to="body">
    <ModalQuestion
      v-model="showConfirmModal"
      id="modal-confirm-patient-save"
      variant="primary"
      :title="action === 'create' ? '¿Deseas registrar al paciente?' : '¿Deseas guardar los cambios?'"
      :confirm-text="action === 'create' ? 'Sí, registrar' : 'Sí, guardar cambios'"
      cancel-text="Revisar datos"
      :is-loading="isPending"
      :loading-text="action === 'create' ? 'Registrando...' : 'Guardando...'"
      @confirm="onConfirmSave"
      @cancel="onCancelConfirm"
    >
      <template #icon>
        <div
          class="size-16 rounded-2xl mx-auto mt-3 flex items-center justify-center bg-primary/10 border border-primary/20 text-primary"
        >
          <svg class="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </template>
      <template #description>
        <div class="space-y-1">
          <p>
            {{
              action === 'create'
                ? 'Se creará el expediente clínico del paciente con los datos ingresados.'
                : 'Se actualizarán los datos del paciente en el sistema.'
            }}
          </p>
          <p v-if="pendingPatientValues?.nombre" class="text-xs font-medium text-foreground/80 mt-1">
            Paciente:
            <span class="text-primary font-bold">
              {{ pendingPatientValues.nombre }} {{ pendingPatientValues.primer_apellido || '' }}
            </span>
          </p>
        </div>
      </template>
    </ModalQuestion>
  </Teleport>
</template>

<script src="./PatientCreate.ts" lang="ts"></script>

<style scoped></style>
