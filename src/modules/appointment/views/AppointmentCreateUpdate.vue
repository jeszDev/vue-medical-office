<template>
  <div class="relative z-20 w-full">
    <!-- Encabezado compacto -->
    <div
      class="flex items-center justify-between pb-3 border-b border-foreground/10"
      :class="{ 'mt-2': !isInsideModal }"
    >
      <div class="flex items-center gap-2.5">
        <h2 class="text-base sm:text-lg font-semibold text-foreground">
          {{
            action === 'create'
              ? 'Agendar nueva cita'
              : !appointment?.fecha_hora_inicio
                ? 'Asignar horario y confirmar cita'
                : 'Editar cita'
          }}
        </h2>
        <span
          v-if="action === 'edit' && appointmentFolio"
          class="px-2 py-0.5 text-xs font-mono font-medium rounded-md bg-foreground/5 text-foreground/70 border border-foreground/10"
        >
          Folio: {{ appointmentFolio }}
        </span>
      </div>
      <PillBadge
        v-if="appointment && !appointment.fecha_hora_inicio"
        size="sm"
        color="warning"
        label="Solicitud pendiente de asignación"
      />
    </div>

    <!-- Banner informativo de solicitud del paciente -->
    <div
      v-if="appointment?.fecha_preferida || appointment?.turno_preferido"
      class="mt-3 p-3 rounded-xl bg-primary/10 border border-primary/20 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
    >
      <div class="flex items-center gap-2 text-xs sm:text-sm">
        <span class="font-semibold text-primary">Fecha preferida:</span>
        <span class="font-medium text-foreground">
          {{ appointment.fecha_preferida || 'A convenir' }}
        </span>
      </div>
      <div v-if="appointment?.turno_preferido" class="flex items-center gap-2 shrink-0">
        <span class="text-xs text-foreground/70">Turno preferido:</span>
        <PillBadge
          size="sm"
          :color="getShiftBadgeColor(appointment.turno_preferido)"
          :label="getShiftBadgeLabel(appointment.turno_preferido)"
        />
      </div>
    </div>


    <!-- Formulario con espaciado optimizado -->
    <div :class="['mt-4', !isInsideModal ? 'px-5 sm:px-20' : '']">
      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-12 gap-4 gap-y-4">
          <!-- Modo creación: Selector con buscador si no viene preseleccionado -->
          <div
            v-if="action === 'create' && patientId === '0'"
            class="flex flex-col gap-2 col-span-12"
          >
            <InputLabel label="La cita es para el paciente" :isRequired="true" />
            <SelectSearchable
              v-model="patient_id"
              :options="patientOptions"
              placeholder="Buscar paciente por nombre o CURP..."
              :error="errors.patient_id"
              v-bind="patient_idAttrs"
            />
          </div>

          <!-- Modo edición: Paciente inmutable (Solo lectura) -->
          <div v-else-if="action === 'edit'" class="flex flex-col gap-2 col-span-12">
            <InputLabel label="Paciente de la cita" :isRequired="false" />
            <div
              class="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/10 flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
                >
                  <UserIcon class="size-4 shrink-0" />
                </div>
                <div class="min-w-0">
                  <div class="font-semibold text-foreground text-sm truncate">
                    {{ currentPatientName || 'Cargando paciente...' }}
                  </div>
                  <div
                    v-if="currentPatientCurp"
                    class="text-xs text-foreground/60 font-mono mt-0.5"
                  >
                    CURP: {{ currentPatientCurp }}
                  </div>
                </div>
              </div>
              <span class="text-[11px] text-foreground/50 italic shrink-0 hidden sm:inline">
                Paciente asociado a esta cita
              </span>
            </div>
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
