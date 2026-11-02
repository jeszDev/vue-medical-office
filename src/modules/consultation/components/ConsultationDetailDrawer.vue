<template>
  <SheetBasic
    v-model="isOpen"
    size="3xl"
    @close="close"
  >
    <!-- Slot Header -->
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-foreground/10">
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
            <h3 class="text-lg font-bold text-foreground">
              Detalle del Expediente
            </h3>
          </div>
        </div>

        <PillBadge
          v-if="patientName"
          size="sm"
          color="primary"
          :label="patientName"
        />
      </div>
    </template>

    <!-- Slot Body: Contenido clínico -->
    <div class="space-y-6">
      <!-- Barra de Médico y Fecha -->
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

      <!-- Cita Médica Vinculada (si existe) -->
      <div
        v-if="consultation?.cita"
        class="box p-4 rounded-xl border border-primary/20 bg-primary/[0.02] shadow-xs"
      >
        <div
          class="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5"
        >
          <CalendarIcon class="size-4" />
          Cita Médica de Origen
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mt-2">
          <div>
            <span class="text-foreground/60 block">Folio:</span>
            <span class="font-bold text-foreground">
              {{ consultation.cita.folio || 'S/F' }}
            </span>
          </div>
          <div>
            <span class="text-foreground/60 block">Fecha y Hora:</span>
            <span class="font-medium text-foreground">
              {{ consultation.cita.fecha_inicio }} {{ consultation.cita.hora_inicio }}
            </span>
          </div>
          <div>
            <span class="text-foreground/60 block">Estatus de Cita:</span>
            <PillBadge
              size="sm"
              :color="getAppointmentStatusColor(consultation.cita.estatus)"
              :label="getAppointmentStatusName(consultation.cita.estatus)"
            />
          </div>
          <div>
            <span class="text-foreground/60 block">Motivo:</span>
            <div
              class="font-medium text-foreground break-words"
              :class="isAppointmentReasonExpanded ? 'whitespace-normal' : 'line-clamp-1'"
              :title="consultation.cita.motivo || ''"
            >
              {{ consultation.cita.motivo || 'Sin motivo' }}
            </div>
            <button
              v-if="hasLongAppointmentReason"
              type="button"
              class="text-[11px] font-medium text-primary hover:underline cursor-pointer mt-0.5 inline-flex items-center gap-0.5"
              @click="isAppointmentReasonExpanded = !isAppointmentReasonExpanded"
            >
              <span>{{ isAppointmentReasonExpanded ? 'Ver menos' : 'Ver más...' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Signos Vitales y Somatometría (Componente Atómico) -->
      <ConsultationVitalsDashboard :consultation="consultation" />

      <!-- Motivo de consulta -->
      <div class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs">
        <div
          class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5"
        >
          <FileTextIcon class="size-4 text-primary" />
          Motivo de la Consulta
        </div>
        <p class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {{ consultation?.motivo || 'Sin motivo registrado.' }}
        </p>
      </div>

      <!-- Exploración Física -->
      <div
        v-if="consultation?.exploracion_fisica"
        class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs"
      >
        <div
          class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5"
        >
          <StethoscopeIcon class="size-4 text-primary" />
          Exploración Física
        </div>
        <p class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {{ consultation.exploracion_fisica }}
        </p>
      </div>

      <!-- Diagnóstico -->
      <div class="box p-5 rounded-xl border border-primary/20 bg-primary/[0.03] shadow-xs">
        <div
          class="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5"
        >
          <StethoscopeIcon class="size-4" />
          Diagnóstico Médico
        </div>
        <div
          class="text-base font-semibold text-foreground whitespace-pre-line leading-relaxed"
        >
          {{ consultation?.diagnostico || 'Sin diagnóstico registrado.' }}
        </div>
      </div>

      <!-- Tratamiento y Receta -->
      <div
        class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 size-24 bg-primary/5 rounded-bl-full pointer-events-none flex items-start justify-end p-3 text-primary/30 font-bold text-xl"
        >
          Rx
        </div>
        <div
          class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5"
        >
          <ClipboardListIcon class="size-4 text-primary" />
          Tratamiento y Receta Médica
        </div>
        <div
          class="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-foreground/[0.02] p-4 rounded-lg border border-foreground/5 font-mono"
        >
          {{ consultation?.tratamiento || 'Sin tratamiento registrado.' }}
        </div>
      </div>

      <!-- Notas Adicionales / Observaciones -->
      <div
        v-if="consultation?.observaciones || consultation?.notas"
        class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs"
      >
        <div
          class="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2 flex items-center gap-1.5"
        >
          <ObservationsIcon class="size-4 text-primary" />
          Notas y Observaciones
        </div>
        <p class="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
          {{ consultation.observaciones || consultation.notas }}
        </p>
      </div>

      <!-- Estudios y Documentos Clínicos Adjuntos -->
      <div
        v-if="consultation?.id"
        class="box p-5 rounded-xl border border-foreground/10 bg-background shadow-xs space-y-3"
      >
        <div class="flex items-center justify-between pb-2 border-b border-foreground/10">
          <div
            class="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5"
          >
            <FolderArchiveIcon class="size-4 text-primary" />
            Estudios y Documentos Adjuntos ({{ consultationDocuments?.length || 0 }})
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
            @click="isUploadModalOpen = true"
          >
            Anexar Estudio
          </button>
        </div>

        <div v-if="isLoadingDocuments" class="py-6 flex justify-center">
          <div
            class="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
          ></div>
        </div>

        <DocumentList
          v-else
          :documents="consultationDocuments || []"
          :consultation-id="consultation.id"
          :show-filters="false"
          @document-deleted="refetchDocuments"
          @document-restored="refetchDocuments"
        />
      </div>
    </div>

    <!-- Slot Footer -->
    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <ButtonBase
            text="Imprimir Receta / Nota"
            :icon="FileTextIcon"
            color="secondary"
            @click="printConsultation"
          />

          <ButtonBase
            v-if="consultation?.id"
            text="Editar Consulta"
            :icon="EditIcon"
            color="secondary"
            @click="editConsultation"
          />
        </div>

        <ButtonBase text="Cerrar" color="primary" @click="close" />
      </div>
    </template>
  </SheetBasic>

  <!-- Modal para Anexar Estudio Rápido -->
  <DocumentUploadModal
    v-if="consultation?.id"
    v-model="isUploadModalOpen"
    :consultation-id="consultation.id"
    @document-uploaded="refetchDocuments"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import type { Consultation } from '../interfaces/consultation.interface';
import {
  getAppointmentStatusColor,
  getAppointmentStatusName,
} from '@/modules/appointment/helpers/get-appointment-status-color.mapper';
import { getConsultationDocumentsAction } from '@/modules/clinical-document/actions/get-consultation-documents.action';
import DocumentList from '@/modules/clinical-document/components/DocumentList.vue';
import DocumentUploadModal from '@/modules/clinical-document/components/DocumentUploadModal.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import ClipboardListIcon from '@/icons/ClipboardListIcon.vue';
import ObservationsIcon from '@/icons/ObservationsIcon.vue';
import EditIcon from '@/icons/EditIcon.vue';
import FolderArchiveIcon from '@/icons/FolderArchiveIcon.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import SheetBasic from '@/modules/common/components/SheetBasic.vue';
import ConsultationVitalsDashboard from '@/modules/consultation/components/ConsultationVitalsDashboard.vue';

interface Props {
  modelValue: boolean;
  consultation: Consultation | null;
  patientName?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const router = useRouter();
const queryClient = useQueryClient();

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

const isUploadModalOpen = ref(false);

const isAppointmentReasonExpanded = ref(false);

const hasLongAppointmentReason = computed(() => {
  const motivo = props.consultation?.cita?.motivo;
  return Boolean(motivo && motivo.length > 30);
});

watch(
  () => props.consultation?.id,
  () => {
    isAppointmentReasonExpanded.value = false;
  },
);

const { data: consultationDocuments, isLoading: isLoadingDocuments } = useQuery({
  queryKey: ['consultation-documents', computed(() => props.consultation?.id)],
  queryFn: () => {
    if (!props.consultation?.id) return [];
    return getConsultationDocumentsAction(props.consultation.id);
  },
  enabled: computed(() => Boolean(props.modelValue && props.consultation?.id)),
});

const refetchDocuments = () => {
  if (props.consultation?.id) {
    queryClient.invalidateQueries({
      queryKey: ['consultation-documents', props.consultation.id],
    });
  }
};

const close = () => {
  emit('update:modelValue', false);
};

const editConsultation = () => {
  if (!props.consultation?.id) return;
  close();
  router.push({
    name: 'consultations.edit',
    params: { consultationId: props.consultation.id },
  });
};

const formattedDate = computed(() => {
  if (!props.consultation) return '—';
  const raw =
    props.consultation.fecha || props.consultation.creado_el || props.consultation.created_at;

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

const printConsultation = () => {
  window.print();
};
</script>

<style scoped></style>
