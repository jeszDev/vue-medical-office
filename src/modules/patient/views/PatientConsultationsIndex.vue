<template>
  <div class="space-y-6">
    <!-- BARRA SUPERIOR DE ACCIONES Y BÚSQUEDA -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <ButtonBase
          text="Nueva consulta"
          :icon="PlusIcon"
          color="primary"
          @click="createNewConsultation"
        />
      </div>

      <SearchInput
        v-model="searchQuery"
        placeholder="Buscar por diagnóstico o médico..."
        width-class="w-full sm:w-72 md:w-80"
      />
    </div>

    <!-- 1. RESUMEN CLÍNICO Y ÚLTIMAS CONSTANTES VITALES ESTILO MIDONE ICEWALL -->
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
    >
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-foreground/10"
      >
        <div class="flex items-center gap-3">
          <IconBadge color="primary" size="lg" rounded="xl">
            <StethoscopeIcon class="size-6 text-primary" />
          </IconBadge>
          <div>
            <h3 class="text-base font-bold text-foreground">
              Resumen Clínico y Constantes del Paciente
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">
              Historial acumulado y signos vitales registrados en su última consulta médica
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

      <!-- Tarjetas de Métricas Recientes con IconBadge -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5">
        <!-- Última Presión Arterial -->
        <div
          class="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-3"
        >
          <IconBadge color="primary" size="md" rounded="lg">
            <Activity class="size-4" />
          </IconBadge>
          <div class="min-w-0">
            <div class="text-xs text-muted-foreground font-medium truncate">Última Presión</div>
            <div class="text-base font-bold text-foreground mt-0.5">
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
                class="text-xs font-normal text-muted-foreground"
              >
                mmHg
              </span>
            </div>
          </div>
        </div>

        <!-- Último Peso -->
        <div
          class="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-3"
        >
          <IconBadge color="pending" size="md" rounded="lg">
            <Scale class="size-4" />
          </IconBadge>
          <div class="min-w-0">
            <div class="text-xs text-muted-foreground font-medium truncate">Último Peso</div>
            <div class="text-base font-bold text-foreground mt-0.5">
              {{
                latestConsultation?.signos_vitales?.peso || latestConsultation?.peso
                  ? `${latestConsultation?.signos_vitales?.peso ?? latestConsultation?.peso} kg`
                  : '—'
              }}
            </div>
          </div>
        </div>

        <!-- Última Frecuencia Cardíaca -->
        <div
          class="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-3"
        >
          <IconBadge color="danger" size="md" rounded="lg">
            <HeartPulse class="size-4" />
          </IconBadge>
          <div class="min-w-0">
            <div class="text-xs text-muted-foreground font-medium truncate">Frec. Cardíaca</div>
            <div class="text-base font-bold text-foreground mt-0.5">
              {{
                latestConsultation?.signos_vitales?.frecuencia_cardiaca ||
                latestConsultation?.frecuencia_cardiaca
                  ? `${latestConsultation?.signos_vitales?.frecuencia_cardiaca ?? latestConsultation?.frecuencia_cardiaca} bpm`
                  : '—'
              }}
            </div>
          </div>
        </div>

        <!-- Último IMC Calculado -->
        <div
          class="p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-3"
        >
          <IconBadge :color="latestImc?.color || 'success'" size="md" rounded="lg">
            <ClipboardListIcon class="size-4" />
          </IconBadge>
          <div class="min-w-0 flex-1">
            <div class="text-xs text-muted-foreground font-medium truncate">Último IMC</div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-base font-bold text-foreground">
                {{ latestImc ? latestImc.value : '—' }}
              </span>
              <PillBadge
                v-if="latestImc"
                size="xs"
                :color="latestImc.color"
                :label="latestImc.label"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Antecedentes y Observaciones Base -->
      <div
        class="mt-4 pt-4 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs"
      >
        <span class="font-semibold text-foreground/80 flex items-center gap-1.5 shrink-0">
          <ObservationsIcon class="size-3.5 text-primary" />
          Antecedentes / Observaciones generales:
        </span>
        <span class="text-muted-foreground italic">
          {{
            patient?.observaciones ||
            'Sin antecedentes ni notas clínicas iniciales registradas en su ficha.'
          }}
        </span>
      </div>
    </div>

    <!-- 2. HISTORIAL CRONOLÓGICO DE CONSULTAS (TIMELINE ESTILO MIDONE) -->
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5 sm:p-6"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-foreground/10"
      >
        <div>
          <h3 class="text-base font-bold text-foreground flex items-center gap-2">
            <FileTextIcon class="size-5 text-primary" />
            Línea de Tiempo de Consultas
          </h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Registro secuencial de atenciones, diagnósticos y tratamientos médicos
          </p>
        </div>

        <div v-if="searchQuery" class="text-xs text-muted-foreground">
          Mostrando {{ filteredConsultations.length }} de {{ sortedConsultations.length }} consultas
        </div>
      </div>

      <!-- Componente Atómico del Timeline -->
      <ClinicalTimeline
        :consultations="filteredConsultations"
        :is-loading="isLoading"
        class="mt-6"
        @view-detail="openConsultationDetail"
        @edit="editConsultation"
        @new-consultation="createNewConsultation"
      />
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
import FileTextIcon from '@/icons/FileTextIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import ClipboardListIcon from '@/icons/ClipboardListIcon.vue';
import { Activity, HeartPulse, Scale } from 'lucide-vue-next';

import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import SearchInput from '@/modules/common/components/SearchInput.vue';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import ConsultationDetailDrawer from '@/modules/consultation/components/ConsultationDetailDrawer.vue';
import ClinicalTimeline from '@/modules/consultation/components/ClinicalTimeline.vue';

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

// Estado del Slide-over drawer
const isDrawerOpen = ref(false);
const selectedConsultation = ref<Consultation | null>(null);

const openConsultationDetail = (consultation: Consultation) => {
  selectedConsultation.value = consultation;
  isDrawerOpen.value = true;
};

// Estado del buscador en tiempo real
const searchQuery = ref('');

// Consulta de datos remotos de consultas para este paciente
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

const getDoctorDisplayName = (consultation: Consultation): string => {
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

// Filtro en tiempo real por diagnóstico, médico, motivo o ID
const filteredConsultations = computed(() => {
  if (!searchQuery.value.trim()) {
    return sortedConsultations.value;
  }
  const q = searchQuery.value.toLowerCase().trim();
  return sortedConsultations.value.filter((c) => {
    const diag = (c.diagnostico || '').toLowerCase();
    const motivo = (c.motivo || '').toLowerCase();
    const doc = getDoctorDisplayName(c).toLowerCase();
    const id = String(c.id);
    const citaFolio = (c.cita?.folio || '').toLowerCase();
    return (
      diag.includes(q) ||
      motivo.includes(q) ||
      doc.includes(q) ||
      id.includes(q) ||
      citaFolio.includes(q)
    );
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

const latestImc = computed(() => {
  const vitals = latestConsultation.value?.signos_vitales;
  const rawPeso = vitals?.peso ?? latestConsultation.value?.peso;
  const rawAltura = vitals?.altura ?? latestConsultation.value?.altura;

  if (!rawPeso || !rawAltura) return null;
  const peso = Number(rawPeso);
  let altura = Number(rawAltura);

  if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) return null;

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
