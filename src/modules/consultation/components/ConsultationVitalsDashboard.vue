<template>
  <div class="space-y-3">
    <div
      v-if="showHeader"
      class="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2"
    >
      <ClipboardListIcon class="size-4 text-primary" />
      Signos Vitales y Somatometría
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <!-- Presión arterial -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Presión Arterial</div>
        <div class="text-base font-bold text-foreground mt-1">
          {{ presionArterial }}
          <span v-if="presionArterial !== '—'" class="text-xs font-normal text-foreground/60">
            mmHg
          </span>
        </div>
      </div>

      <!-- Frecuencia cardíaca -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Frecuencia Cardíaca</div>
        <div class="text-base font-bold text-foreground mt-1">
          {{ frecuenciaCardiaca }}
          <span v-if="frecuenciaCardiaca !== '—'" class="text-xs font-normal text-foreground/60">
            bpm
          </span>
        </div>
      </div>

      <!-- Temperatura -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Temperatura</div>
        <div class="text-base font-bold text-foreground mt-1">
          {{ temperatura }}
          <span v-if="temperatura !== '—'" class="text-xs font-normal text-foreground/60">
            °C
          </span>
        </div>
      </div>

      <!-- Frecuencia respiratoria -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Frec. Respiratoria</div>
        <div class="text-base font-bold text-foreground mt-1">
          {{ frecuenciaRespiratoria }}
          <span
            v-if="frecuenciaRespiratoria !== '—'"
            class="text-xs font-normal text-foreground/60"
          >
            rpm
          </span>
        </div>
      </div>

      <!-- Peso y Talla -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Peso / Talla</div>
        <div class="text-base font-bold text-foreground mt-1">
          {{ peso ? `${peso} kg` : '—' }}
          <span v-if="alturaDisplay" class="text-xs font-normal text-foreground/60">
            / {{ alturaDisplay }}
          </span>
        </div>
      </div>

      <!-- IMC -->
      <div
        class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs flex flex-col justify-between hover:border-primary/30 transition-colors"
      >
        <div class="text-xs text-foreground/60 font-medium">Índice Masa Corporal</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-base font-bold text-foreground">
            {{ imcInfo ? imcInfo.value : '—' }}
          </span>
          <PillBadge
            v-if="imcInfo"
            size="sm"
            :color="imcInfo.color"
            :label="imcInfo.label"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VitalSigns } from '@/modules/appointment/interfaces/appointment.interface';
import type { Consultation } from '../interfaces/consultation.interface';
import ClipboardListIcon from '@/icons/ClipboardListIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';

interface Props {
  vitals?: VitalSigns | null;
  consultation?: Consultation | null;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  vitals: null,
  consultation: null,
  showHeader: true,
});

const activeVitals = computed(() => {
  return props.vitals || props.consultation?.signos_vitales;
});

const presionArterial = computed(() => {
  return (
    activeVitals.value?.presion_arterial ||
    props.consultation?.presion_arterial ||
    '—'
  );
});

const frecuenciaCardiaca = computed(() => {
  return (
    activeVitals.value?.frecuencia_cardiaca ||
    props.consultation?.frecuencia_cardiaca ||
    '—'
  );
});

const temperatura = computed(() => {
  return (
    activeVitals.value?.temperatura ||
    props.consultation?.temperatura ||
    '—'
  );
});

const frecuenciaRespiratoria = computed(() => {
  return (
    activeVitals.value?.frecuencia_respiratoria ||
    props.consultation?.frecuencia_respiratoria ||
    '—'
  );
});

const peso = computed(() => {
  return activeVitals.value?.peso ?? props.consultation?.peso;
});

const altura = computed(() => {
  return activeVitals.value?.altura ?? props.consultation?.altura;
});

const alturaDisplay = computed(() => {
  if (!altura.value) return '';
  const num = Number(altura.value);
  if (isNaN(num) || num <= 0) return '';
  if (num > 3) {
    return `${num} cm`;
  }
  return `${num} m`;
});

const imcInfo = computed(() => {
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
