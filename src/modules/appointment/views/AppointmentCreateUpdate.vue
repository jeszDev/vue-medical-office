<template>
  <div class="relative z-20 w-full">
    <!-- Encabezado compacto -->
    <div
      class="flex items-center pb-3 border-b border-foreground/10"
      :class="{ 'mt-2': !isInsideModal }"
    >
      <h2 class="text-base sm:text-lg font-semibold text-foreground">
        {{ action === 'create' ? 'Agendar nueva cita' : 'Editar cita' }}
      </h2>
    </div>

    <!-- Formulario con espaciado optimizado -->
    <div :class="['mt-4', !isInsideModal ? 'px-5 sm:px-20' : '']">
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-4 gap-y-4">
          <!-- Selector de paciente con buscador si no viene preseleccionado -->
          <div v-if="patientId === '0'" class="flex flex-col gap-2 col-span-12">
            <InputLabel label="La cita es para el paciente" :isRequired="true" />
            <SelectSearchable
              v-model="patient_id"
              :options="patientOptions"
              placeholder="Buscar paciente por nombre o CURP..."
              :error="errors.patient_id"
              v-bind="patient_idAttrs"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-12">
            <InputLabel label="Motivo de la cita" :isRequired="true" />
            <InputBase
              type="text"
              v-model="motivo"
              v-bind="motivoAttrs"
              :error="errors.motivo"
              placeholder="Ejemplo: Consulta general o revisión de estudios"
              name="motivo"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
            <InputLabel label="Fecha y hora de inicio" :isRequired="true" />
            <InputBaseDate
              type="datetime-local"
              v-model="fecha_hora_inicio"
              v-bind="fecha_hora_inicioAttrs"
              :error="errors.fecha_hora_inicio"
              name="fecha_hora_inicio"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-12 sm:col-span-6">
            <InputLabel label="Fecha y hora de término" :isRequired="true" />
            <InputBaseDate
              type="datetime-local"
              v-model="fecha_hora_termino"
              v-bind="fecha_hora_terminoAttrs"
              :error="errors.fecha_hora_termino"
              name="fecha_hora_termino"
            />
          </div>

          <div class="flex flex-col gap-2 col-span-12">
            <InputLabel label="Observaciones / notas sobre la cita" :isRequired="false" />
            <TextArea
              v-model="observaciones_cita"
              v-bind="observaciones_citaAttrs"
              placeholder="Ejemplo: Traer estudios previos de laboratorio"
              name="observaciones_cita"
              :error="errors.observaciones_cita"
            />
          </div>

          <!-- Botones de Acción: Agendar a la izquierda, Cancelar a la derecha -->
          <div
            class="col-span-12 mt-4 pt-4 border-t border-foreground/10 flex items-center justify-end gap-3"
          >
            <ButtonBase
              :text="
                isPending
                  ? action === 'create'
                    ? 'Agendando...'
                    : 'Guardando...'
                  : action === 'create'
                    ? 'Agendar cita'
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
      id="modal-confirm-appointment-save"
      variant="primary"
      :title="action === 'create' ? '¿Deseas agendar esta cita?' : '¿Deseas guardar los cambios?'"
      :confirm-text="action === 'create' ? 'Sí, agendar cita' : 'Sí, guardar cambios'"
      cancel-text="Revisar datos"
      :is-loading="isPending"
      :loading-text="action === 'create' ? 'Agendando...' : 'Guardando...'"
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </template>
      <template #description>
        <div class="space-y-2 text-sm text-foreground/80">
          <p>
            {{
              action === 'create'
                ? 'Se registrará la cita médica con la siguiente programación:'
                : 'Se actualizarán los datos de la cita médica:'
            }}
          </p>
          <div
            class="p-3 rounded-lg bg-foreground/5 border border-foreground/10 text-left space-y-1.5 text-xs"
          >
            <div v-if="selectedPatientName">
              <span class="font-medium text-foreground">Paciente:</span>
              <span class="ml-1 text-primary font-bold">{{ selectedPatientName }}</span>
            </div>
            <div v-if="pendingAppointmentValues?.motivo">
              <span class="font-medium text-foreground">Motivo:</span>
              <span class="ml-1 text-foreground/90 font-medium">
                {{ pendingAppointmentValues.motivo }}
              </span>
            </div>
            <div v-if="pendingAppointmentValues?.fecha_hora_inicio">
              <span class="font-medium text-foreground">Inicio:</span>
              <span class="ml-1 text-foreground/90 font-semibold">
                {{ String(pendingAppointmentValues.fecha_hora_inicio).replace('T', ' ') }}
              </span>
            </div>
            <div v-if="pendingAppointmentValues?.fecha_hora_termino">
              <span class="font-medium text-foreground">Término:</span>
              <span class="ml-1 text-foreground/90 font-semibold">
                {{ String(pendingAppointmentValues.fecha_hora_termino).replace('T', ' ') }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </ModalQuestion>
  </Teleport>
</template>

<script src="./AppointmentCreateUpdate.ts" lang="ts"></script>

<style scoped></style>
