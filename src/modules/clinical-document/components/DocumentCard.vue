<template>
  <div
    class="group relative flex flex-col justify-between rounded-2xl border border-foreground/10 bg-background p-4 shadow-xs transition-all duration-200 hover:border-primary/30 hover:shadow-md"
    :class="{ 'opacity-60 bg-foreground/[0.02] border-dashed border-danger/30': isDeleted }"
  >
    <div>
      <!-- Cabecera: Icono de tipo + Badges de tipo y estado -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <!-- Icono / Miniatura -->
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105"
            :class="iconContainerClasses"
          >
            <!-- Si es imagen y tiene url directa disponible -->
            <img
              v-if="isImage && directPreviewUrl"
              :src="directPreviewUrl"
              :alt="document.titulo"
              class="size-full rounded-xl object-cover"
              loading="lazy"
            />
            <component :is="typeIcon" v-else class="size-5" />
          </div>

          <div class="min-w-0 flex-1">
            <h4
              class="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary"
              :title="document.titulo"
            >
              {{ document.titulo }}
            </h4>
            <div class="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-foreground/60">
              <span class="truncate font-mono font-medium" :title="document.nombre_archivo_original">
                {{ document.nombre_archivo_original }}
              </span>
              <span>•</span>
              <span class="shrink-0">{{ formattedSize }}</span>
            </div>
          </div>
        </div>

        <!-- Badges -->
        <div class="flex shrink-0 flex-col items-end gap-1">
          <PillBadge
            size="sm"
            :color="badgeColor"
            :label="typeLabel"
          />
          <PillBadge
            v-if="isDeleted"
            size="sm"
            color="danger"
            label="Eliminado"
          />
        </div>
      </div>

      <!-- Descripción (si existe) -->
      <p
        v-if="document.descripcion"
        class="mt-3 line-clamp-2 text-xs leading-relaxed text-foreground/75"
        :title="document.descripcion"
      >
        {{ document.descripcion }}
      </p>

      <!-- Metadatos adicionales: Consulta o Fecha -->
      <div
        class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/5 pt-2.5 text-[11px] text-foreground/50"
      >
        <div class="flex items-center gap-1">
          <CalendarIcon class="size-3" />
          <span>{{ formattedDate }}</span>
        </div>

        <div v-if="showConsultationInfo && document.consulta_id" class="flex items-center gap-1 font-medium text-primary">
          <StethoscopeIcon class="size-3" />
          <span>Consulta #{{ document.consulta_id }}</span>
        </div>
      </div>
    </div>

    <!-- Botonera de Acciones -->
    <div class="mt-4 flex items-center justify-end gap-1.5 border-t border-foreground/10 pt-3">
      <!-- Ver / Previsualizar -->
      <button
        type="button"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.02] text-foreground/70 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        title="Ver o previsualizar documento"
        @click="$emit('preview', document)"
      >
        <Eye class="size-4" />
      </button>

      <!-- Descargar -->
      <button
        type="button"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.02] text-foreground/70 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
        title="Descargar archivo"
        @click="$emit('download', document)"
      >
        <Download class="size-4" />
      </button>

      <!-- Restaurar (Solo si está borrado y tiene permiso de admin) -->
      <button
        v-if="isDeleted && canRestore"
        type="button"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-success/30 bg-success/10 text-success transition-colors hover:bg-success/20"
        title="Restaurar estudio"
        @click="$emit('restore', document)"
      >
        <RotateCcw class="size-4" />
      </button>

      <!-- Eliminar (Soft delete) -->
      <button
        v-if="!isDeleted && canDelete"
        type="button"
        class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.02] text-foreground/70 transition-colors hover:border-danger hover:bg-danger/10 hover:text-danger"
        title="Eliminar estudio"
        @click="$emit('delete', document)"
      >
        <Trash2 class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';
import {
  getDocumentTypeBadgeColor,
  getDocumentTypeLabel,
  isImageMimeType,
  isPdfMimeType,
} from '../helpers/document-type.mapper';
import { formatFileSize } from '../helpers/format-file-size.helper';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';
import {
  Eye,
  Download,
  Trash2,
  RotateCcw,
  FileText,
  FileImage,
  Activity,
  Layers,
  FileBox,
} from 'lucide-vue-next';

interface Props {
  document: ClinicalDocument;
  canDelete?: boolean;
  canRestore?: boolean;
  showConsultationInfo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canDelete: true,
  canRestore: false,
  showConsultationInfo: false,
});

defineEmits<{
  (e: 'preview', document: ClinicalDocument): void;
  (e: 'download', document: ClinicalDocument): void;
  (e: 'delete', document: ClinicalDocument): void;
  (e: 'restore', document: ClinicalDocument): void;
}>();

const isDeleted = computed(() => Boolean(props.document.deleted_at));

const isImage = computed(() => isImageMimeType(props.document.mime_type));
const isPdf = computed(() => isPdfMimeType(props.document.mime_type));

const directPreviewUrl = computed(() => {
  return props.document.url || props.document.temporary_url;
});

const typeLabel = computed(() => getDocumentTypeLabel(props.document.tipo_documento));
const badgeColor = computed(() => getDocumentTypeBadgeColor(props.document.tipo_documento));
const formattedSize = computed(() => formatFileSize(props.document.peso_bytes));

const typeIcon = computed(() => {
  if (isPdf.value) return FileText;
  if (isImage.value) return FileImage;

  switch (props.document.tipo_documento) {
    case 'laboratorio':
      return Activity;
    case 'radiografia':
    case 'ultrasonido':
      return Layers;
    default:
      return FileBox;
  }
});

const iconContainerClasses = computed(() => {
  if (isPdf.value) {
    return 'bg-danger/10 text-danger border-danger/20';
  }
  if (isImage.value) {
    return 'bg-primary/10 text-primary border-primary/20';
  }
  switch (props.document.tipo_documento) {
    case 'laboratorio':
      return 'bg-success/10 text-success border-success/20';
    case 'radiografia':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'ultrasonido':
      return 'bg-secondary/15 text-foreground border-foreground/10';
    default:
      return 'bg-foreground/5 text-foreground/70 border-foreground/10';
  }
});

const formattedDate = computed(() => {
  const raw = props.document.created_at;
  if (!raw) return '—';
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
});
</script>

<style scoped></style>
