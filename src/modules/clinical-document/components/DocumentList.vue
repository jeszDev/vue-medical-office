<template>
  <div class="space-y-4">
    <!-- Barra de Filtros y Búsqueda -->
    <div
      v-if="showFilters"
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-3"
    >
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <!-- Buscador -->
        <div class="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título o archivo..."
            class="w-full rounded-xl border border-foreground/15 bg-background pl-9 pr-3 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <!-- Filtro por Tipo de Documento -->
        <select
          v-model="selectedType"
          class="rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value="all">Todos los tipos ({{ documents.length }})</option>
          <option
            v-for="opt in DOCUMENT_TYPE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Toggle Admin para Ver Eliminados -->
      <div v-if="isAdmin" class="flex items-center gap-2 text-xs">
        <label class="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            v-model="showDeleted"
            type="checkbox"
            class="rounded border-foreground/20 text-primary focus:ring-primary"
          />
          <span class="text-foreground/70">Mostrar eliminados</span>
        </label>
      </div>
    </div>

    <!-- Lista / Cuadrícula de Documentos -->
    <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DocumentCard
        v-for="doc in filteredDocuments"
        :key="doc.id"
        :document="doc"
        :consultation-id="consultationId"
        :can-delete="canDelete"
        :can-restore="isAdmin"
        :show-consultation-info="showConsultationInfo"
        @preview="onPreview"
        @download="onDownload"
        @delete="onConfirmDelete"
        @restore="onRestore"
      />
    </div>

    <!-- Estado Vacío -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.01] py-12 px-4 text-center"
    >
      <div
        class="flex size-14 items-center justify-center rounded-2xl bg-foreground/5 text-foreground/40 border border-foreground/10"
      >
        <FileBox class="size-7" />
      </div>
      <h4 class="mt-3 text-sm font-bold text-foreground">No se encontraron estudios o documentos</h4>
      <p class="mt-1 max-w-sm text-xs text-foreground/60">
        {{
          searchQuery || selectedType !== 'all'
            ? 'Ningún documento coincide con los criterios de búsqueda aplicados.'
            : 'No hay documentos o estudios clínicos anexados todavía.'
        }}
      </p>
    </div>

    <!-- Modal de Previsualización -->
    <DocumentViewerModal
      v-model="isViewerOpen"
      :document="selectedDocForViewer"
      :consultation-id="consultationId"
    />

    <!-- Modal de Confirmación para Soft-Delete -->
    <ModalQuestion
      v-model="isDeleteModalOpen"
      variant="danger"
      title="¿Eliminar estudio clínico?"
      :description="`¿Deseas enviar a la papelera el documento '${docToDelete?.titulo}'? Esta acción podrá ser restaurada por un administrador.`"
      :is-busy="isDeleting"
      confirm-text="Sí, eliminar"
      cancel-text="Cancelar"
      @confirm="executeDelete"
      @cancel="isDeleteModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';
import { DOCUMENT_TYPE_OPTIONS } from '../helpers/document-type.mapper';
import { deleteConsultationDocumentAction } from '../actions/delete-consultation-document.action';
import { restoreConsultationDocumentAction } from '../actions/restore-consultation-document.action';
import { getDocumentDetailAction } from '../actions/get-document-detail.action';
import DocumentCard from './DocumentCard.vue';
import DocumentViewerModal from './DocumentViewerModal.vue';
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue';
import { Search, FileBox } from 'lucide-vue-next';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { useToast } from 'vue-toastification';

interface Props {
  documents: ClinicalDocument[];
  consultationId?: number | string;
  canDelete?: boolean;
  showFilters?: boolean;
  showConsultationInfo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canDelete: true,
  showFilters: true,
  showConsultationInfo: false,
});

const emit = defineEmits<{
  (e: 'documentDeleted', documentId: number): void;
  (e: 'documentRestored', document: ClinicalDocument): void;
}>();

const toast = useToast();
const authStore = useAuthStore();

const searchQuery = ref('');
const selectedType = ref('all');
const showDeleted = ref(false);

const isViewerOpen = ref(false);
const selectedDocForViewer = ref<ClinicalDocument | null>(null);

const isDeleteModalOpen = ref(false);
const docToDelete = ref<ClinicalDocument | null>(null);
const isDeleting = ref(false);

const isAdmin = computed(() => {
  const roles = authStore.user?.roles || [];
  return roles.some((r) => {
    const lower = r.toLowerCase();
    return lower === 'admin' || lower === 'administrador';
  });
});

const filteredDocuments = computed(() => {
  return props.documents.filter((doc) => {
    // Si no está activo showDeleted, excluir borrados
    if (!showDeleted.value && doc.deleted_at) {
      return false;
    }

    // Filtro por tipo
    if (selectedType.value !== 'all' && doc.tipo_documento !== selectedType.value) {
      return false;
    }

    // Filtro por búsqueda
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchTitle = doc.titulo?.toLowerCase().includes(q);
      const matchOriginal = doc.nombre_archivo_original?.toLowerCase().includes(q);
      const matchDesc = doc.descripcion?.toLowerCase().includes(q);
      return matchTitle || matchOriginal || matchDesc;
    }

    return true;
  });
});

const onPreview = (doc: ClinicalDocument) => {
  selectedDocForViewer.value = doc;
  isViewerOpen.value = true;
};

const onDownload = async (doc: ClinicalDocument) => {
  let downloadUrl = doc.temporary_url || doc.download_url || doc.url;

  if (!downloadUrl) {
    const consId = props.consultationId || doc.consulta_id;
    if (consId && doc.id) {
      toast.info('Generando enlace de descarga seguro...');
      const detail = await getDocumentDetailAction(consId, doc.id);
      downloadUrl = detail?.temporary_url || detail?.download_url || detail?.url;
    }
  }

  if (downloadUrl) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = doc.nombre_archivo_original || 'estudio_clinico';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    toast.error('No se pudo generar el enlace de descarga.');
  }
};

const onConfirmDelete = (doc: ClinicalDocument) => {
  docToDelete.value = doc;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!docToDelete.value) return;
  const consId = props.consultationId || docToDelete.value.consulta_id;

  try {
    isDeleting.value = true;
    await deleteConsultationDocumentAction(consId, docToDelete.value.id);
    toast.success('Documento eliminado correctamente.');
    emit('documentDeleted', docToDelete.value.id);
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    toast.error('Ocurrió un error al intentar eliminar el documento.');
  } finally {
    isDeleting.value = false;
  }
};

const onRestore = async (doc: ClinicalDocument) => {
  const consId = props.consultationId || doc.consulta_id;

  try {
    toast.info('Restaurando estudio...');
    const restored = await restoreConsultationDocumentAction(consId, doc.id);
    toast.success('Documento restaurado con éxito.');
    if (typeof restored === 'object' && restored !== null) {
      emit('documentRestored', restored as ClinicalDocument);
    }
  } catch (error) {
    console.error('Error al restaurar documento:', error);
    toast.error('No se pudo restaurar el documento.');
  }
};
</script>

<style scoped></style>
