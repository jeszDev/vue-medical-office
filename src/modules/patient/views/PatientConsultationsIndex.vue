<template>
  <div class="space-y-6">
    <!-- BARRA SUPERIOR DE ACCIONES -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <ButtonBase
        text="Nueva consulta"
        :icon="PlusIcon"
        color="primary"
        @click="createNewConsultation"
      />
    </div>

    <!-- 1. RESUMEN CLÍNICO Y ÚLTIMAS CONSTANTES VITALES -->
    <div
      class="box p-5 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b] relative overflow-hidden"
    >
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-foreground/10"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
          >
            <StethoscopeIcon class="size-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-foreground">
              Resumen Clínico y Constantes del Paciente
            </h3>
            <p class="text-xs text-foreground/60 mt-0.5">
              Historial acumulado y signos vitales registrados en su última consulta
            </p>
          </div>
        </div>

        <!-- Badges del Resumen Clínico -->
        <div class="flex flex-wrap items-center gap-2">
          <PillBadge
            size="md"
            color="primary"
            :label="`${consultations?.length || 0} ${consultations?.length === 1 ? 'consulta' : 'consultas'}`"
          />
          <PillBadge
            v-if="latestConsultationDate"
            size="md"
            color="pending"
            :label="`Última: ${latestConsultationDate}`"
          />
        </div>
      </div>

      <!-- Tarjetas de Métricas Recientes -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
        <!-- Última Presión Arterial -->
        <div class="p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
          <div class="text-xs text-foreground/60 font-medium">Última Presión Arterial</div>
          <div class="text-base font-bold text-foreground mt-1">
            {{
              latestConsultation?.signos_vitales?.presion_arterial ||
              latestConsultation?.presion_arterial ||
              '—'
            }}
            <span
              v-if="
                latestConsultation?.signos_vitales?.presion_arterial ||
                latestConsultation?.presion_arterial
              "
              class="text-xs font-normal text-foreground/60"
            >
              mmHg
            </span>
          </div>
        </div>

        <!-- Último Peso -->
        <div class="p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
          <div class="text-xs text-foreground/60 font-medium">Último Peso</div>
          <div class="text-base font-bold text-foreground mt-1">
            {{
              latestConsultation?.signos_vitales?.peso || latestConsultation?.peso
                ? `${latestConsultation?.signos_vitales?.peso ?? latestConsultation?.peso} kg`
                : '—'
            }}
          </div>
        </div>

        <!-- Última Frecuencia Cardíaca -->
        <div class="p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
          <div class="text-xs text-foreground/60 font-medium">Frecuencia Cardíaca</div>
          <div class="text-base font-bold text-foreground mt-1">
            {{
              latestConsultation?.signos_vitales?.frecuencia_cardiaca ||
              latestConsultation?.frecuencia_cardiaca
                ? `${latestConsultation?.signos_vitales?.frecuencia_cardiaca ?? latestConsultation?.frecuencia_cardiaca} bpm`
                : '—'
            }}
          </div>
        </div>

        <!-- Último IMC Calculado -->
        <div
          class="p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between"
        >
          <div class="text-xs text-foreground/60 font-medium">Último IMC</div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-base font-bold text-foreground">
              {{ latestImc ? latestImc.value : '—' }}
            </span>
            <PillBadge
              v-if="latestImc"
              size="sm"
              :color="latestImc.color"
              :label="latestImc.label"
            />
          </div>
        </div>
      </div>

      <!-- Antecedentes y Observaciones Base -->
      <div
        class="mt-4 pt-4 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
      >
        <span class="font-semibold text-foreground/70 flex items-center gap-1.5 shrink-0">
          <ObservationsIcon class="size-3.5 text-primary" />
          Antecedentes / Observaciones generales:
        </span>
        <span class="text-foreground/80 italic">
          {{
            patient?.observaciones ||
            'Sin antecedentes ni notas clínicas iniciales registradas en su ficha.'
          }}
        </span>
      </div>
    </div>

    <!-- 2. HISTORIAL CRONOLÓGICO DE CONSULTAS (TIMELINE) -->
    <div
      class="box p-5 sm:p-6 rounded-2xl border border-foreground/10 bg-background shadow-[0px_3px_5px_#0000000b]"
    >
      <div class="flex items-center justify-between pb-4 border-b border-foreground/10">
        <div>
          <h3 class="text-base font-bold text-foreground flex items-center gap-2">
            <FileTextIcon class="size-5 text-primary" />
            Línea de Tiempo de Consultas
          </h3>
          <p class="text-xs text-foreground/60 mt-0.5">
            Registro secuencial de atenciones, diagnósticos y tratamientos
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="py-12 flex flex-col items-center justify-center gap-3">
        <div
          class="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        ></div>
        <p class="text-sm text-foreground/60">Cargando historial clínico...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!sortedConsultations.length"
        class="py-14 text-center flex flex-col items-center justify-center max-w-md mx-auto"
      >
        <div
          class="size-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground/40 mb-4"
        >
          <FileTextIcon class="size-8" />
        </div>
        <h4 class="text-base font-semibold text-foreground">Sin consultas registradas</h4>
        <p class="text-xs text-foreground/60 mt-1 leading-relaxed">
          Este paciente aún no tiene consultas médicas registradas en el expediente. Al completar
          una cita médica o registrar una atención, aparecerá aquí su evolución.
        </p>
        <div class="mt-4">
          <ButtonBase
            text="Iniciar Consulta para este Paciente"
            :icon="PlusIcon"
            color="primary"
            size="sm"
            @click="createNewConsultation"
          />
        </div>
      </div>

      <!-- Timeline Entries -->
      <div
        v-else
        class="mt-6 relative pl-6 sm:pl-8 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-foreground/10"
      >
        <div
          v-for="(consultation, index) in sortedConsultations"
          :key="consultation.id || index"
          class="relative mb-8 last:mb-0 group"
        >
          <!-- Timeline Marker Circle -->
          <div
            class="absolute -left-6 sm:-left-8 top-1.5 size-5 sm:size-6 rounded-full bg-background border-2 border-primary group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center shadow-xs"
          >
            <div class="size-2 rounded-full bg-primary group-hover:bg-background"></div>
          </div>

          <!-- Timeline Card -->
          <div
            class="box p-4 sm:p-5 rounded-xl border border-foreground/10 bg-background hover:border-primary/40 transition-all shadow-xs"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-foreground/5"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary"
                >
                  Consulta #{{ consultation.id }}
                </span>
                <span
                  v-if="consultation.cita?.folio"
                  class="text-xs font-medium px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/70 border border-foreground/10"
                >
                  Cita: {{ consultation.cita.folio }}
                </span>
                <span class="text-xs text-foreground/60 flex items-center gap-1">
                  <CalendarIcon class="size-3.5 text-foreground/40" />
                  {{ formatDate(consultation) }}
                </span>
              </div>

              <!-- Quick Vitals Badges -->
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span
                  v-if="
                    consultation.signos_vitales?.presion_arterial || consultation.presion_arterial
                  "
                  class="px-2 py-0.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/70"
                >
                  TA:
                  {{
                    consultation.signos_vitales?.presion_arterial || consultation.presion_arterial
                  }}
                </span>
                <span
                  v-if="consultation.signos_vitales?.peso || consultation.peso"
                  class="px-2 py-0.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/70"
                >
                  {{ consultation.signos_vitales?.peso || consultation.peso }} kg
                </span>
                <span
                  v-if="consultation.signos_vitales?.temperatura || consultation.temperatura"
                  class="px-2 py-0.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/70"
                >
                  {{ consultation.signos_vitales?.temperatura || consultation.temperatura }} °C
                </span>
                <span
                  v-if="
                    consultation.signos_vitales?.frecuencia_cardiaca ||
                    consultation.frecuencia_cardiaca
                  "
                  class="px-2 py-0.5 rounded-full border border-foreground/10 bg-foreground/5 text-foreground/70"
                >
                  {{
                    consultation.signos_vitales?.frecuencia_cardiaca ||
                    consultation.frecuencia_cardiaca
                  }}
                  bpm
                </span>
              </div>
            </div>

            <!-- Content preview -->
            <div class="mt-3.5 space-y-2">
              <div>
                <span class="text-xs font-semibold text-primary uppercase tracking-wider">
                  Diagnóstico:
                </span>
                <h4 class="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {{ consultation.diagnostico || 'Sin diagnóstico registrado' }}
                </h4>
              </div>

              <div class="text-xs text-foreground/70 line-clamp-2">
                <span class="font-medium text-foreground/90">Motivo:</span>
                {{ consultation.motivo || 'No especificado' }}
              </div>

              <div
                v-if="consultation.exploracion_fisica"
                class="text-xs text-foreground/70 line-clamp-2"
              >
                <span class="font-medium text-foreground/90">Exploración física:</span>
                {{ consultation.exploracion_fisica }}
              </div>
            </div>

            <!-- Card Actions -->
            <div
              class="mt-4 pt-3 border-t border-foreground/5 flex flex-wrap items-center justify-between gap-2"
            >
              <span class="text-xs text-foreground/50">
                Atendido por:
                <strong class="text-foreground/70">{{ getDoctorDisplayName(consultation) }}</strong>
              </span>

              <div class="flex items-center gap-2">
                <ButtonBase
                  v-if="consultation.id"
                  text="Editar"
                  :icon="EditIcon"
                  color="secondary"
                  size="sm"
                  @click="editConsultation(consultation.id)"
                />

                <ButtonBase
                  text="Ver expediente completo"
                  :icon="PreviewIcon"
                  color="secondary"
                  size="sm"
                  @click="openConsultationDetail(consultation)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. SLIDE-OVER DRAWER DE DETALLE DE CONSULTA -->
    <ConsultationDetailDrawer
      v-model="isDrawerOpen"
      :consultation="selectedConsultation"
      :patient-name="patient?.nombre_completo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import type { Patient } from '../interfaces/patient.interface';
import type { Consultation } from '@/modules/consultation/interfaces/consultation.interface';
import { getAllConsultationsByPatientAction } from '@/modules/consultation/actions';

import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import EditIcon from '@/icons/EditIcon.vue';

import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import ConsultationDetailDrawer from '@/modules/consultation/components/ConsultationDetailDrawer.vue';

interface Props {
  patientId: string;
  patient?: Patient;
}

const props = defineProps<Props>();

const router = useRouter();

const createNewConsultation = () => {
  router.push({
    name: 'patients.consultations.create',
    params: { patientId: props.patientId },
  });
};

const editConsultation = (consultationId: number | string) => {
  router.push({
    name: 'consultations.edit',
    params: { consultationId },
  });
};

// Drawer state
const isDrawerOpen = ref(false);
const selectedConsultation = ref<Consultation | null>(null);

const openConsultationDetail = (consultation: Consultation) => {
  selectedConsultation.value = consultation;
  isDrawerOpen.value = true;
};

// Fetch consultations for this patient
const { data: consultations, isLoading } = useQuery({
  queryKey: ['patient-consultations', { patientId: props.patientId, all: true }],
  queryFn: () => getAllConsultationsByPatientAction(props.patientId),
});

// Ordenar las consultas cronológicamente (las más recientes primero)
const sortedConsultations = computed<Consultation[]>(() => {
  if (!consultations.value) return [];
  return [...consultations.value].sort((a, b) => {
    return (b.id || 0) - (a.id || 0);
  });
});

const latestConsultation = computed<Consultation | null>(() => {
  return sortedConsultations.value[0] || null;
});

const latestConsultationDate = computed(() => {
  if (!latestConsultation.value) return null;
  return formatDate(latestConsultation.value);
});

const formatDate = (consultation: Consultation) => {
  const raw = consultation.fecha || consultation.creado_el || consultation.created_at;

  if (!raw) return 'Fecha no registrada';

  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return raw;
  }
};

const getDoctorDisplayName = (consultation: Consultation) => {
  if (consultation.doctor?.nombre_completo) {
    return consultation.doctor.nombre_completo;
  }
  const doc = consultation.medico;
  if (!doc) return 'Médico Asignado';
  if (typeof doc === 'string') return doc;
  return (
    doc.nombre_completo ||
    `${doc.nombre || ''} ${doc.primer_apellido || ''}`.trim() ||
    'Médico Asignado'
  );
};

const latestImc = computed(() => {
  const vitals = latestConsultation.value?.signos_vitales;
  const rawPeso = vitals?.peso ?? latestConsultation.value?.peso;
  const rawAltura = vitals?.altura ?? latestConsultation.value?.altura;

  if (!rawPeso || !rawAltura) return null;
  const peso = Number(rawPeso);
  let altura = Number(rawAltura);

  if (altura > 3) {
    altura = altura / 100;
  }

  if (altura <= 0) return null;

  const imc = +(peso / (altura * altura)).toFixed(1);

  if (imc < 18.5) {
    return { value: imc, label: 'Bajo peso', color: 'warning' as const };
  } else if (imc < 25) {
    return { value: imc, label: 'Normal', color: 'success' as const };
  } else if (imc < 30) {
    return { value: imc, label: 'Sobrepeso', color: 'warning' as const };
  } else {
    return { value: imc, label: 'Obesidad', color: 'danger' as const };
  }
});
</script>

<style scoped></style>
