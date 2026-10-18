<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        @click="close"
      ></div>

      <!-- Slide-over container -->
      <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          class="w-screen max-w-2xl bg-background border-l border-foreground/10 shadow-2xl flex flex-col h-full transform transition-all duration-300 ease-in-out relative z-10"
        >
          <!-- Header -->
          <div
            class="px-6 py-5 border-b border-foreground/10 flex items-center justify-between bg-foreground/5"
          >
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
              >
                <StethoscopeIcon class="size-5" />
              </div>
              <div>
                <div class="text-xs font-semibold uppercase tracking-wider text-primary">
                  CONSULTA MÉDICA {{ consultation?.id ? `#${consultation.id}` : '' }}
                </div>
                <h3 id="slide-over-title" class="text-lg font-bold text-foreground">
                  Detalle del Expediente
                </h3>
              </div>
            </div>

            <button
              type="button"
              class="size-9 rounded-full border border-foreground/10 bg-background/80 hover:bg-foreground/10 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
              @click="close"
              aria-label="Cerrar panel"
            >
              <CloseIcon class="size-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <!-- Doctor & Date Bar -->
            <div
              class="box p-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex flex-wrap items-center justify-between gap-3"
            >
              <div class="flex items-center gap-2 text-sm">
                <CalendarIcon class="size-4 text-primary" />
                <span class="text-foreground/70">Fecha:</span>
                <span class="font-medium text-foreground">{{ formattedDate }}</span>
              </div>

              <div class="flex items-center gap-2 text-sm">
                <UserIcon class="size-4 text-primary" />
                <span class="text-foreground/70">Médico:</span>
                <span class="font-medium text-foreground">{{ doctorName }}</span>
              </div>
            </div>

            <!-- Signos Vitales Dashboard -->
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-3 flex items-center gap-2">
                <ClipboardListIcon class="size-4 text-primary" />
                Signos Vitales y Somatometría
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <!-- Presión arterial -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs">
                  <div class="text-xs text-foreground/60 font-medium">Presión Arterial</div>
                  <div class="text-base font-bold text-foreground mt-1">
                    {{ consultation?.presion_arterial || '—' }}
                    <span v-if="consultation?.presion_arterial" class="text-xs font-normal text-foreground/60">
                      mmHg
                    </span>
                  </div>
                </div>

                <!-- Frecuencia cardíaca -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs">
                  <div class="text-xs text-foreground/60 font-medium">Frecuencia Cardíaca</div>
                  <div class="text-base font-bold text-foreground mt-1">
                    {{ consultation?.frecuencia_cardiaca || '—' }}
                    <span v-if="consultation?.frecuencia_cardiaca" class="text-xs font-normal text-foreground/60">
                      bpm
                    </span>
                  </div>
                </div>

                <!-- Temperatura -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs">
                  <div class="text-xs text-foreground/60 font-medium">Temperatura</div>
                  <div class="text-base font-bold text-foreground mt-1">
                    {{ consultation?.temperatura || '—' }}
                    <span v-if="consultation?.temperatura" class="text-xs font-normal text-foreground/60">
                      °C
                    </span>
                  </div>
                </div>

                <!-- Frecuencia respiratoria -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs">
                  <div class="text-xs text-foreground/60 font-medium">Frec. Respiratoria</div>
                  <div class="text-base font-bold text-foreground mt-1">
                    {{ consultation?.frecuencia_respiratoria || '—' }}
                    <span v-if="consultation?.frecuencia_respiratoria" class="text-xs font-normal text-foreground/60">
                      rpm
                    </span>
                  </div>
                </div>

                <!-- Peso y Talla -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs">
                  <div class="text-xs text-foreground/60 font-medium">Peso / Talla</div>
                  <div class="text-base font-bold text-foreground mt-1">
                    {{ consultation?.peso ? `${consultation.peso} kg` : '—' }}
                    <span v-if="consultation?.altura" class="text-xs font-normal text-foreground/60">
                      / {{ consultation.altura }} cm
                    </span>
                  </div>
                </div>

                <!-- IMC -->
                <div class="p-3.5 rounded-xl border border-foreground/10 bg-background shadow-xs flex flex-col justify-between">
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

            <!-- Motivo de consulta -->
            <div class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs">
              <div class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5">
                <FileTextIcon class="size-4 text-primary" />
                Motivo de la Consulta
              </div>
              <p class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {{ consultation?.motivo || 'Sin motivo registrado.' }}
              </p>
            </div>

            <!-- Diagnóstico -->
            <div class="box p-5 rounded-xl border border-primary/20 bg-primary/[0.03] shadow-xs">
              <div class="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                <StethoscopeIcon class="size-4" />
                Diagnóstico Médico
              </div>
              <div class="text-base font-semibold text-foreground whitespace-pre-line leading-relaxed">
                {{ consultation?.diagnostico || 'Sin diagnóstico registrado.' }}
              </div>
            </div>

            <!-- Tratamiento y Receta -->
            <div class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs relative overflow-hidden">
              <div
                class="absolute top-0 right-0 size-24 bg-primary/5 rounded-bl-full pointer-events-none flex items-start justify-end p-3 text-primary/30 font-bold text-xl"
              >
                Rx
              </div>
              <div class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5">
                <ClipboardListIcon class="size-4 text-primary" />
                Tratamiento y Receta Médica
              </div>
              <div class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-foreground/[0.02] p-4 rounded-lg border border-foreground/5 font-mono">
                {{ consultation?.tratamiento || 'Sin tratamiento registrado.' }}
              </div>
            </div>

            <!-- Notas Adicionales -->
            <div
              v-if="consultation?.notas"
              class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs"
            >
              <div class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5">
                <ObservationsIcon class="size-4 text-primary" />
                Notas y Observaciones
              </div>
              <p class="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                {{ consultation.notas }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-foreground/10 flex items-center justify-between bg-foreground/5"
          >
            <ButtonBase
              text="Imprimir Receta / Nota"
              :icon="FileTextIcon"
              color="secondary"
              @click="printConsultation"
            />

            <ButtonBase
              text="Cerrar"
              color="primary"
              @click="close"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Consultation } from '../interfaces/consultation.interface';
import CloseIcon from '@/icons/CloseIcon.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import ClipboardListIcon from '@/icons/ClipboardListIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';

interface Props {
  modelValue: boolean;
  consultation: Consultation | null;
  patientName?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const close = () => {
  emit('update:modelValue', false);
};

const formattedDate = computed(() => {
  if (!props.consultation) return '—';
  const raw =
    props.consultation.fecha ||
    props.consultation.creado_el ||
    props.consultation.created_at;

  if (!raw) return 'No registrada';

  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return raw;
  }
});

const doctorName = computed(() => {
  if (!props.consultation) return 'No especificado';
  const doc = props.consultation.medico;
  if (!doc) return 'Médico Asignado';
  if (typeof doc === 'string') return doc;
  return doc.nombre_completo || `${doc.nombre || ''} ${doc.primer_apellido || ''}`.trim() || 'Médico Asignado';
});

const imcInfo = computed(() => {
  if (!props.consultation?.peso || !props.consultation?.altura) return null;
  const peso = Number(props.consultation.peso);
  let altura = Number(props.consultation.altura);

  // Si la altura viene en cm (ej. 170), convertir a metros (1.70)
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

const printConsultation = () => {
  window.print();
};
</script>

<style scoped></style>
