<template>
  <div class="space-y-6">
    <!-- BARRA SUPERIOR Y RESUMEN DE EXPEDIENTE DE ESTUDIOS -->
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
            <FolderArchive class="size-6" />
          </div>
          <div>
            <h3 class="text-base font-bold text-foreground">
              Expediente de Estudios y Documentos Clínicos
            </h3>
            <p class="text-xs text-foreground/60 mt-0.5">
              Historial global de radiografías, ultrasonidos, análisis de laboratorio y estudios anexados
            </p>
          </div>
        </div>

        <!-- Badges del Resumen -->
        <div class="flex flex-wrap items-center gap-2">
          <PillBadge
            size="md"
            color="primary"
            :label="`${documents?.length || 0} ${documents?.length === 1 ? 'estudio registrado' : 'estudios registrados'}`"
          />
        </div>
      </div>

      <!-- Tarjetas de Métricas por Tipo de Estudio -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        <div
          v-for="stat in typeStats"
          :key="stat.type"
          class="p-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex flex-col justify-between"
        >
          <div class="text-[11px] font-medium text-foreground/60 truncate" :title="stat.label">
            {{ stat.label }}
          </div>
          <div class="text-lg font-bold text-foreground mt-1">
            {{ stat.count }}
          </div>
        </div>
      </div>
    </div>

    <!-- SPINNER DE CARGA -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 gap-3">
      <div class="size-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
      <p class="text-xs text-foreground/60 font-medium">Cargando expediente de documentos...</p>
    </div>

    <!-- LISTADO DE ESTUDIOS -->
    <div v-else>
      <DocumentList
        :documents="documents || []"
        :show-filters="true"
        :show-consultation-info="true"
        @document-deleted="onDocumentModified"
        @document-restored="onDocumentModified"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { getPatientDocumentsAction } from '../actions/get-patient-documents.action';
import { DOCUMENT_TYPE_OPTIONS } from '../helpers/document-type.mapper';
import DocumentList from './DocumentList.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import { FolderArchive } from 'lucide-vue-next';

interface Props {
  patientId: number | string;
}

const props = defineProps<Props>();

const queryClient = useQueryClient();

const { data: documents, isLoading } = useQuery({
  queryKey: ['patient-documents', String(props.patientId)],
  queryFn: () => getPatientDocumentsAction(props.patientId),
});

const onDocumentModified = () => {
  queryClient.invalidateQueries({
    queryKey: ['patient-documents', String(props.patientId)],
  });
};

const typeStats = computed(() => {
  const docs = documents.value || [];
  return DOCUMENT_TYPE_OPTIONS.map((opt) => {
    const count = docs.filter((d) => d.tipo_documento === opt.value && !d.deleted_at).length;
    return {
      type: opt.value,
      label: opt.label,
      count,
    };
  });
});
</script>

<style scoped></style>
