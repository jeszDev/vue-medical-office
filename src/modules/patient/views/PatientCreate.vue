<template>
  <div class="relative z-20 w-full">
    <!-- Encabezado de vista o modal -->
    <div :class="[isInsideModal ? 'flex items-center pb-3' : 'mt-8 flex items-center']">
      <h2
        :class="[
          isInsideModal
            ? 'text-base sm:text-lg font-semibold text-foreground'
            : 'mr-auto text-lg font-medium text-foreground',
        ]"
      >
        {{ action === 'create' ? 'Registro de nuevo paciente' : 'Editar paciente' }}
      </h2>
    </div>

    <!-- Formulario con espaciado optimizado -->
    <div :class="['mt-5', !isInsideModal ? 'px-5 sm:px-20' : '']">
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
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
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
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
            <InputLabel label="Fecha de nacimiento" :isRequired="false" />
            <InputBaseDate
              type="date"
              v-model="fecha_nacimiento"
              v-bind="fecha_nacimientoAttrs"
              :error="errors.fecha_nacimiento"
              name="fecha_nacimiento"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
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
              :text="action === 'create' ? 'Registrar' : 'Guardar cambios'"
              color="primary"
              :loading="isPending"
              :loading-text="action === 'create' ? 'Registrando...' : 'Guardando...'"
              @click="onSubmit"
            />
            <ButtonBase text="Cancelar" color="secondary" :disabled="isPending" @click="onCancel" />
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
      :title="
        action === 'create' ? '¿Deseas registrar al paciente?' : '¿Deseas guardar los cambios?'
      "
      :confirm-text="action === 'create' ? 'Sí, registrar' : 'Sí, guardar cambios'"
      cancel-text="Revisar datos"
      :is-loading="isPending"
      :loading-text="action === 'create' ? 'Registrando...' : 'Guardando...'"
      @confirm="onConfirmSave"
      @cancel="onCancelConfirm"
    >
      <template #icon>
        <svg
          class="size-16 stroke-1 mx-auto mt-3 [--color:currentColor] stroke-(--color) fill-(--color)/25 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="8" r="5" stroke-width="1" />
          <path d="M20 21a8 8 0 0 0-16 0" stroke-width="1" />
        </svg>
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
          <p
            v-if="pendingPatientValues?.nombre"
            class="text-xs font-medium text-foreground/80 mt-1"
          >
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
