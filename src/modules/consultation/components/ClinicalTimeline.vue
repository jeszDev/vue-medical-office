<template>
  <div class="space-y-6">
    <!-- Estado de carga -->
    <div v-if="isLoading" class="py-14 flex flex-col items-center justify-center gap-3">
      <div
        class="size-9 rounded-full border-2 border-primary border-t-transparent animate-spin"
      ></div>
      <p class="text-sm text-muted-foreground">Cargando historial clínico...</p>
    </div>

    <!-- Estado vacío -->
    <div
      v-else-if="!consultations.length"
      class="box relative p-8 sm:p-12 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-2xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-2xl after:z-[-1] after:backdrop-blur-md text-center flex flex-col items-center justify-center max-w-lg mx-auto"
    >
      <div
        class="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4"
      >
        <StethoscopeIcon class="size-8" />
      </div>
      <h4 class="text-base font-bold text-foreground">Sin consultas registradas</h4>
      <p class="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-md">
        Este paciente aún no tiene consultas médicas registradas en el expediente. Al registrar una
        nueva consulta médica, aparecerá aquí su evolución cronológica.
      </p>
      <div class="mt-5">
        <ButtonBase
          text="Iniciar primera consulta"
          color="primary"
          size="md"
          @click="$emit('new-consultation')"
        />
      </div>
    </div>

    <!-- Línea de tiempo cronológica con DetailListItem -->
    <div v-else class="space-y-8">
      <div
        v-for="group in groupedConsultations"
        :key="group.period"
        class="relative"
      >
        <!-- Separador de período cronológico (Mes / Año) -->
        <div class="my-5 flex items-center justify-center relative">
          <div class="h-px bg-foreground/10 w-full absolute inset-x-0"></div>
          <span
            class="relative z-10 bg-background px-4 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground border border-foreground/10 rounded-full shadow-xs"
          >
            {{ group.period }}
          </span>
        </div>

        <!-- Lista de consultas del período -->
        <div class="space-y-6">
          <div
            v-for="consultation in group.consultations"
            :key="consultation.id"
            class="space-y-2.5"
          >
            <!-- Indicador de consulta cronológica con DetailListItem -->
            <div class="px-1">
              <DetailListItem
                :label="`Consulta #${consultation.id}`"
                dot-color="primary"
                dot-size="md"
              >
                <div class="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <CalendarIcon class="size-3.5 text-primary shrink-0" />
                  <span>{{ formatConsultationDate(consultation) }}</span>
                  <template v-if="consultation.cita?.folio">
                    <span class="text-foreground/30">•</span>
                    <span class="text-foreground/70">Cita: {{ consultation.cita.folio }}</span>
                  </template>
                </div>
              </DetailListItem>
            </div>

            <!-- Tarjeta de consulta -->
            <ClinicalTimelineCard
              :consultation="consultation"
              @view-detail="$emit('view-detail', consultation)"
              @edit="$emit('edit', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Consultation } from '../interfaces/consultation.interface';
import ClinicalTimelineCard from './ClinicalTimelineCard.vue';
import DetailListItem from '@/modules/common/components/DetailListItem.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';

const formatConsultationDate = (consultation: Consultation): string => {
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

interface Props {
  consultations: Consultation[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  consultations: () => [],
  isLoading: false,
});

defineEmits<{
  (e: 'view-detail', consultation: Consultation): void;
  (e: 'edit', consultationId: number | string): void;
  (e: 'new-consultation'): void;
}>();

interface TimelineGroup {
  period: string;
  consultations: Consultation[];
}

const groupedConsultations = computed<TimelineGroup[]>(() => {
  if (!props.consultations?.length) return [];

  const groupsMap = new Map<string, Consultation[]>();

  props.consultations.forEach((item) => {
    const raw = item.fecha || item.creado_el || item.created_at;
    let periodKey = 'Fecha no registrada';

    if (raw) {
      try {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          const monthName = d.toLocaleDateString('es-ES', { month: 'long' });
          const year = d.getFullYear();
          periodKey = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        }
      } catch {
        periodKey = 'Consultas Recientes';
      }
    }

    if (!groupsMap.has(periodKey)) {
      groupsMap.set(periodKey, []);
    }
    groupsMap.get(periodKey)!.push(item);
  });

  const result: TimelineGroup[] = [];
  groupsMap.forEach((consultations, period) => {
    result.push({ period, consultations });
  });

  return result;
});
</script>

<style scoped></style>
