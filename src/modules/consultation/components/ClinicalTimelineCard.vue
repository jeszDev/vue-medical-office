<template>
  <div
    class="box relative p-4 sm:p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md z-10 w-full hover:border-primary/40 transition-all shadow-xs"
  >
    <!-- Cabecera de la consulta -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-foreground/10"
    >
      <!-- Atendido por Doctor -->
      <div class="text-xs">
        <span class="text-muted-foreground">Médico tratante: </span>
        <strong class="text-foreground font-semibold">Dr(a). {{ doctorDisplayName }}</strong>
      </div>

      <!-- Cita de origen si existe -->
      <div v-if="consultation.cita?.folio" class="flex items-center gap-2 text-xs">
        <span class="text-muted-foreground">Cita de origen:</span>
        <PillBadge
          size="xs"
          color="neutral"
          rounded="md"
          :label="consultation.cita.folio"
        />
      </div>
    </div>

    <!-- Contenido clínico -->
    <div class="mt-3.5 space-y-2.5">
      <!-- Diagnóstico médico -->
      <div>
        <span class="text-[11px] font-semibold text-primary uppercase tracking-wider block">
          Diagnóstico:
        </span>
        <h4 class="text-sm sm:text-base font-bold text-foreground mt-0.5 leading-snug">
          {{ consultation.diagnostico || 'Sin diagnóstico registrado' }}
        </h4>
      </div>

      <!-- Motivo de la atención con Ver más -->
      <div class="text-xs text-foreground/80">
        <span class="font-semibold text-foreground/90">Motivo: </span>
        <span :class="isReasonExpanded ? 'whitespace-normal' : 'line-clamp-2'">
          {{ consultation.motivo || 'No especificado' }}
        </span>
        <button
          v-if="hasLongReason"
          type="button"
          class="text-[11px] font-medium text-primary hover:underline cursor-pointer mt-0.5 ml-1 inline-flex items-center"
          @click="isReasonExpanded = !isReasonExpanded"
        >
          {{ isReasonExpanded ? 'Ver menos' : 'Ver más...' }}
        </button>
      </div>

      <!-- Exploración física si existe -->
      <div
        v-if="consultation.exploracion_fisica"
        class="text-xs text-foreground/70 line-clamp-2"
      >
        <span class="font-semibold text-foreground/90">Exploración: </span>
        {{ consultation.exploracion_fisica }}
      </div>

      <!-- Chips de constantes vitales registradas -->
      <div
        v-if="hasAnyVitalSign"
        class="flex flex-wrap items-center gap-2 pt-1 text-xs"
      >
        <PillBadge
          v-if="presionArterial"
          size="xs"
          color="neutral"
          :label="`TA: ${presionArterial} mmHg`"
        />
        <PillBadge
          v-if="peso"
          size="xs"
          color="neutral"
          :label="`${peso} kg`"
        />
        <PillBadge
          v-if="temperatura"
          size="xs"
          color="neutral"
          :label="`${temperatura} °C`"
        />
        <PillBadge
          v-if="frecuenciaCardiaca"
          size="xs"
          color="neutral"
          :label="`${frecuenciaCardiaca} bpm`"
        />
        <PillBadge
          v-if="imcData"
          size="xs"
          :color="imcData.color"
          :label="`IMC: ${imcData.value} (${imcData.label})`"
        />
      </div>
    </div>

    <!-- Pie de acciones de la tarjeta -->
    <div
      class="mt-4 pt-3 border-t border-foreground/10 flex flex-wrap items-center justify-end gap-2"
    >
      <ButtonBase
        v-if="consultation.id"
        text="Editar"
        :icon="EditIcon"
        color="secondary"
        size="sm"
        @click="$emit('edit', consultation.id)"
      />

      <ButtonBase
        text="Ver expediente completo"
        :icon="PreviewIcon"
        color="primary"
        size="sm"
        @click="$emit('view-detail', consultation)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Consultation } from '../interfaces/consultation.interface';
import EditIcon from '@/icons/EditIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';

interface Props {
  consultation: Consultation;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'view-detail', consultation: Consultation): void;
  (e: 'edit', consultationId: number | string): void;
}>();

const isReasonExpanded = ref(false);

const hasLongReason = computed(() => {
  const m = props.consultation.motivo;
  return Boolean(m && m.length > 80);
});

const doctorDisplayName = computed(() => {
  if (props.consultation.doctor?.nombre_completo) {
    return props.consultation.doctor.nombre_completo;
  }
  const doc = props.consultation.medico;
  if (!doc) return 'Médico Asignado';
  if (typeof doc === 'string') return doc;
  return (
    doc.nombre_completo ||
    `${doc.nombre || ''} ${doc.primer_apellido || ''}`.trim() ||
    'Médico Asignado'
  );
});

const vitals = computed(() => props.consultation.signos_vitales);

const presionArterial = computed(() => {
  return vitals.value?.presion_arterial || props.consultation.presion_arterial;
});

const peso = computed(() => {
  return vitals.value?.peso ?? props.consultation.peso;
});

const temperatura = computed(() => {
  return vitals.value?.temperatura ?? props.consultation.temperatura;
});

const frecuenciaCardiaca = computed(() => {
  return vitals.value?.frecuencia_cardiaca ?? props.consultation.frecuencia_cardiaca;
});

const altura = computed(() => {
  return vitals.value?.altura ?? props.consultation.altura;
});

const hasAnyVitalSign = computed(() => {
  return Boolean(
    presionArterial.value ||
    peso.value ||
    temperatura.value ||
    frecuenciaCardiaca.value,
  );
});

const imcData = computed(() => {
  if (!peso.value || !altura.value) return null;
  const numPeso = Number(peso.value);
  let numAltura = Number(altura.value);

  if (isNaN(numPeso) || isNaN(numAltura) || numPeso <= 0 || numAltura <= 0) return null;

  if (numAltura > 3) {
    numAltura = numAltura / 100;
  }

  if (numAltura <= 0) return null;

  const imc = +(numPeso / (numAltura * numAltura)).toFixed(1);

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
