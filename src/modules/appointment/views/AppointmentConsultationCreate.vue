<template>
  <div class="relative z-20 pb-16">
    <FullScreenLoader v-if="isLoadingAppointment" />

    <template v-else>
      <!-- HEADER / BARRA SUPERIOR DE LA ESTACIÓN CLÍNICA -->
      <div
        class="box p-4 sm:p-5 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b] flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4"
      >
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="size-10 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:bg-foreground/10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            title="Volver a la agenda"
            @click="goBack"
          >
            <ArrowLeftIcon class="size-4" />
          </button>

          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-md bg-primary/10"
              >
                <StethoscopeIcon class="size-3.5" />
                Estación de Consulta Médica
              </span>

              <span
                v-if="appointment?.folio"
                class="text-xs font-semibold px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/80 border border-foreground/10 font-mono"
              >
                Cita: {{ appointment.folio }}
              </span>

              <PillBadge size="sm" color="pending" label="En atención activa" />
            </div>

            <h2 class="text-lg sm:text-xl font-bold text-foreground mt-1">
              {{ patient?.nombre_completo || 'Atención de Consulta' }}
            </h2>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end md:self-center">
          <ButtonBase
            color="danger"
            text="Cancelar y volver"
            @click="goBack"
          />

          <ButtonBase
            color="primary"
            :text="isPending ? 'Guardando...' : 'Finalizar y Guardar Consulta'"
            :disabled="isPending"
            @click="onSubmit"
          >
            <template #icon>
              <div
                v-if="isPending"
                class="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
              ></div>
              <StethoscopeIcon v-else class="size-4" />
            </template>
          </ButtonBase>
        </div>
      </div>

      <!-- MAIN SPLIT-VIEW (EXPEDIENTE RÁPIDO + FORMULARIO DE CONSULTA) -->
      <div class="grid grid-cols-12 gap-6 mt-6">
        <!-- COLUMNA IZQUIERDA: EXPEDIENTE RÁPIDO DEL PACIENTE (35%) -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <!-- 1. Tarjeta Resumen del Paciente -->
          <div
            class="box p-5 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b] space-y-4"
          >
            <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
              <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                <UserIcon class="size-4 text-primary" />
                Ficha del Paciente
              </h3>
              <PillBadge
                v-if="patient?.edad"
                size="sm"
                color="secondary"
                :label="`${patient.edad} años`"
              />
            </div>

            <div class="flex items-start gap-3">
              <div
                class="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-base shrink-0"
              >
                {{ patient?.nombre?.charAt(0) || 'P' }}{{ patient?.primer_apellido?.charAt(0) || '' }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-foreground text-base leading-tight truncate">
                  {{ patient?.nombre_completo || 'Paciente' }}
                </div>
                <div class="text-xs text-muted-foreground font-mono mt-0.5">
                  CURP: {{ patient?.curp || 'Sin CURP' }}
                </div>
              </div>
            </div>

            <!-- Datos de contacto -->
            <div class="grid grid-cols-1 gap-2 pt-2 text-xs border-t border-foreground/5">
              <div class="flex items-center gap-2 text-foreground/80">
                <PhoneIcon class="size-3.5 text-foreground/50 shrink-0" />
                <span>{{ patient?.telefono || 'Sin teléfono registrado' }}</span>
              </div>
              <div class="flex items-center gap-2 text-foreground/80 truncate">
                <EmailIcon class="size-3.5 text-foreground/50 shrink-0" />
                <span class="truncate">{{ patient?.correo_electronico || 'Sin correo electrónico' }}</span>
              </div>
            </div>

            <!-- Alergias y Antecedentes Críticos -->
            <div class="rounded-xl p-3.5 border border-amber-500/20 bg-amber-500/5 text-xs space-y-1">
              <div class="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ObservationsIcon class="size-3.5" />
                Alergias y Antecedentes Clínicos
              </div>
              <p class="text-foreground/80 leading-relaxed italic">
                {{
                  patient?.observaciones ||
                  'Sin antecedentes, alergias ni patologías previas registradas en su ficha.'
                }}
              </p>
            </div>
          </div>

          <!-- 2. Tarjeta Historial de Consultas Anteriores -->
          <div
            class="box p-5 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b] space-y-4"
          >
            <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
              <h3 class="text-sm font-bold text-foreground flex items-center gap-2">
                <FileTextIcon class="size-4 text-primary" />
                Historial de Consultas
              </h3>
              <PillBadge
                size="sm"
                color="primary"
                :label="`${previousConsultations?.length || 0} previas`"
              />
            </div>

            <!-- Loading de consultas -->
            <div
              v-if="isLoadingConsultations"
              class="py-8 flex flex-col items-center justify-center gap-2 text-xs text-foreground/60"
            >
              <div
                class="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin"
              ></div>
              <span>Cargando consultas anteriores...</span>
            </div>

            <!-- Sin consultas previas -->
            <div
              v-else-if="!previousConsultations?.length"
              class="py-6 text-center text-xs text-muted-foreground italic"
            >
              Esta es la primera consulta registrada para este paciente.
            </div>

            <!-- Lista de consultas anteriores con scroll -->
            <div v-else class="max-h-[460px] overflow-y-auto space-y-3 pr-1">
              <div
                v-for="consultation in previousConsultations"
                :key="consultation.id"
                class="p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:border-primary/40 transition-colors space-y-2 text-xs"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-semibold text-primary">
                    {{ formatConsultationDate(consultation) }}
                  </span>
                  <span
                    v-if="consultation.signos_vitales?.presion_arterial"
                    class="px-1.5 py-0.5 rounded-md border border-foreground/10 bg-background text-[11px] text-foreground/70"
                  >
                    TA: {{ consultation.signos_vitales.presion_arterial }}
                  </span>
                </div>

                <div>
                  <span class="text-foreground/50 font-medium">Diagnóstico: </span>
                  <strong class="text-foreground">
                    {{ consultation.diagnostico || 'Sin diagnóstico registrado' }}
                  </strong>
                </div>

                <div v-if="consultation.tratamiento" class="text-foreground/70 line-clamp-2">
                  <span class="text-foreground/50 font-medium">Tratamiento: </span>
                  {{ consultation.tratamiento }}
                </div>

                <div class="pt-2 border-t border-foreground/5 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    @click="viewConsultationDetail(consultation)"
                  >
                    <PreviewIcon class="size-3" />
                    <span>Ver expediente completo</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: FORMULARIO DE CONSULTA ACTIVA (65%) -->
        <div class="col-span-12 lg:col-span-8">
          <form class="space-y-6" @submit.prevent="onSubmit">
            <!-- 1. Motivo de la Consulta -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
                <div>
                  <h3 class="text-base font-bold text-foreground">1. Motivo de la Consulta</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Razón principal por la que acude el paciente (precargado desde la cita)
                  </p>
                </div>
                <PillBadge size="sm" color="pending" label="Requerido" />
              </div>

              <div class="mt-4">
                <TextArea
                  v-model="motivo"
                  v-bind="motivoAttrs"
                  placeholder="Escriba o ajuste el motivo de la consulta..."
                  name="motivo"
                  :error="errors.motivo"
                />
              </div>
            </div>

            <!-- 2. Signos Vitales y Somatometría -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-foreground/10">
                <div>
                  <h3 class="text-base font-bold text-foreground">2. Signos Vitales y Somatometría</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Constantes fisiológicas tomadas al ingreso del paciente
                  </p>
                </div>

                <!-- Live IMC Badge -->
                <div v-if="currentImc" class="flex items-center gap-2">
                  <span class="text-xs font-semibold text-foreground/70">IMC Calculado:</span>
                  <span class="text-sm font-bold text-foreground">{{ currentImc.value }}</span>
                  <PillBadge
                    size="sm"
                    :color="currentImc.color"
                    :label="currentImc.label"
                  />
                </div>
              </div>

              <div class="grid grid-cols-12 gap-4 mt-4">
                <!-- Peso -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Peso (kg)" :isRequired="false" />
                  <InputBase
                    v-model="peso"
                    v-bind="pesoAttrs"
                    type="number"
                    step="0.01"
                    placeholder="Ej. 74.5"
                    name="peso"
                    :error="errors.peso"
                  />
                </div>

                <!-- Altura -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Altura (m o cm)" :isRequired="false" />
                  <InputBase
                    v-model="altura"
                    v-bind="alturaAttrs"
                    type="number"
                    step="0.01"
                    placeholder="Ej. 1.75 o 175"
                    name="altura"
                    :error="errors.altura"
                  />
                </div>

                <!-- Temperatura -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Temperatura (°C)" :isRequired="false" />
                  <InputBase
                    v-model="temperatura"
                    v-bind="temperaturaAttrs"
                    type="number"
                    step="0.1"
                    placeholder="Ej. 36.6"
                    name="temperatura"
                    :error="errors.temperatura"
                  />
                </div>

                <!-- Presión Arterial -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Presión Arterial (mmHg)" :isRequired="false" />
                  <InputBase
                    v-model="presion_arterial"
                    v-bind="presionArterialAttrs"
                    type="text"
                    placeholder="Ej. 120/80"
                    name="presion_arterial"
                    :error="errors.presion_arterial"
                  />
                </div>

                <!-- Frecuencia Cardíaca -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Frecuencia Cardíaca (bpm)" :isRequired="false" />
                  <InputBase
                    v-model="frecuencia_cardiaca"
                    v-bind="frecuenciaCardiacaAttrs"
                    type="number"
                    placeholder="Ej. 75"
                    name="frecuencia_cardiaca"
                    :error="errors.frecuencia_cardiaca"
                  />
                </div>

                <!-- Frecuencia Respiratoria -->
                <div class="col-span-12 sm:col-span-4">
                  <InputLabel label="Frecuencia Respiratoria (rpm)" :isRequired="false" />
                  <InputBase
                    v-model="frecuencia_respiratoria"
                    v-bind="frecuenciaRespiratoriaAttrs"
                    type="number"
                    placeholder="Ej. 18"
                    name="frecuencia_respiratoria"
                    :error="errors.frecuencia_respiratoria"
                  />
                </div>
              </div>
            </div>

            <!-- 3. Exploración Física -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="pb-3 border-b border-foreground/10">
                <h3 class="text-base font-bold text-foreground">3. Exploración Física</h3>
                <p class="text-xs text-muted-foreground mt-0.5">
                  Hallazgos relevantes observados durante el examen físico por sistemas
                </p>
              </div>

              <div class="mt-4">
                <TextArea
                  v-model="exploracion_fisica"
                  v-bind="exploracionFisicaAttrs"
                  placeholder="Paciente consciente, orientado. Campos pulmonares limpios, ruidos cardíacos rítmicos..."
                  name="exploracion_fisica"
                  :error="errors.exploracion_fisica"
                />
              </div>
            </div>

            <!-- 4. Diagnóstico Clínico -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
                <div>
                  <h3 class="text-base font-bold text-foreground">4. Diagnóstico Clínico</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Impresión diagnóstica médica principal y diagnósticos secundarios
                  </p>
                </div>
                <PillBadge size="sm" color="pending" label="Requerido" />
              </div>

              <div class="mt-4">
                <TextArea
                  v-model="diagnostico"
                  v-bind="diagnosticoAttrs"
                  placeholder="Ej. Faringitis bacteriana aguda (CIE-10 J02.9) / Rinitis alérgica..."
                  name="diagnostico"
                  :error="errors.diagnostico"
                />
              </div>
            </div>

            <!-- 5. Tratamiento y Prescripción Médica -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="flex items-center justify-between pb-3 border-b border-foreground/10">
                <div>
                  <h3 class="text-base font-bold text-foreground">5. Tratamiento y Prescripción Médica</h3>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Plan farmacológico, posología, indicaciones de ingesta y duración del tratamiento
                  </p>
                </div>
                <PillBadge size="sm" color="pending" label="Requerido" />
              </div>

              <div class="mt-4">
                <TextArea
                  v-model="tratamiento"
                  v-bind="tratamientoAttrs"
                  placeholder="1. Amoxicilina con Ácido Clavulánico 875/125 mg cada 12 hrs por 7 días.&#10;2. Paracetamol 500 mg cada 8 hrs en caso de dolor o fiebre..."
                  name="tratamiento"
                  :error="errors.tratamiento"
                />
              </div>
            </div>

            <!-- 6. Notas y Recomendaciones Adicionales -->
            <div
              class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
            >
              <div class="pb-3 border-b border-foreground/10">
                <h3 class="text-base font-bold text-foreground">6. Notas y Recomendaciones Adicionales</h3>
                <p class="text-xs text-muted-foreground mt-0.5">
                  Estilo de vida, dieta, reposo, signos de alarma o fecha sugerida para próxima cita
                </p>
              </div>

              <div class="mt-4">
                <TextArea
                  v-model="notas"
                  v-bind="notasAttrs"
                  placeholder="Abundantes líquidos, reposo relativo por 48 horas. Cita de control en 7 días..."
                  name="notas"
                  :error="errors.notas"
                />
              </div>
            </div>

            <!-- BOTONES DE ACCIÓN INFERIORES -->
            <div
              class="box p-4 sm:p-5 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b] flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <ButtonBase
                color="danger"
                text="Cancelar y volver"
                @click="goBack"
              />

              <ButtonBase
                color="primary"
                :text="isPending ? 'Guardando consulta...' : 'Finalizar y Guardar Consulta'"
                :disabled="isPending"
                @click="onSubmit"
              >
                <template #icon>
                  <div
                    v-if="isPending"
                    class="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
                  ></div>
                  <StethoscopeIcon v-else class="size-4" />
                </template>
              </ButtonBase>
            </div>
          </form>
        </div>
      </div>
    </template>

    <!-- SLIDE-OVER DRAWER PARA CONSULTAR EXPEDIENTES PREVIOS -->
    <ConsultationDetailDrawer
      v-model="isDrawerOpen"
      :consultation="selectedConsultation"
      :patient-name="patient?.nombre_completo"
    />
  </div>
</template>

<script src="./AppointmentConsultationCreate.ts" lang="ts"></script>

<style scoped></style>
