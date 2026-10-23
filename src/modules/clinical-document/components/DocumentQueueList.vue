<template>
  <div v-if="queue.length > 0" class="space-y-3">
    <div class="flex items-center justify-between pb-1">
      <h4 class="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
        <Clock class="size-3.5 text-primary" />
        Archivos en cola para anexar ({{ queue.length }})
      </h4>
      <span class="text-[11px] text-foreground/50">
        Se subirán automáticamente al guardar la consulta
      </span>
    </div>

    <div
      v-for="(item, index) in queue"
      :key="item.id"
      class="group relative rounded-2xl border border-foreground/10 bg-background p-4 shadow-xs transition-all hover:border-primary/30"
    >
      <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <!-- Columna Izquierda: Miniatura / Icono e info básica -->
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <!-- Miniatura o Icono -->
          <div
            class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden"
          >
            <img
              v-if="item.previewUrl"
              :src="item.previewUrl"
              :alt="item.titulo"
              class="size-full object-cover"
            />
            <FileText v-else-if="item.file.type === 'application/pdf'" class="size-5 text-danger" />
            <FileBox v-else class="size-5 text-primary" />
          </div>

          <div class="space-y-2 flex-1 min-w-0">
            <!-- Título del documento -->
            <div>
              <label class="block text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                Título del estudio <span class="text-danger">*</span>
              </label>
              <input
                v-model="item.titulo"
                type="text"
                maxlength="150"
                placeholder="Ej. Radiografía de Tórax AP"
                class="w-full rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <!-- Tipo de Documento y Descripción -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                  Clasificación Clínica <span class="text-danger">*</span>
                </label>
                <select
                  v-model="item.tipo_documento"
                  class="w-full rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option
                    v-for="opt in DOCUMENT_TYPE_OPTIONS"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-semibold uppercase tracking-wider text-foreground/60 mb-1">
                  Notas / Hallazgos (Opcional)
                </label>
                <input
                  v-model="item.descripcion"
                  type="text"
                  maxlength="2000"
                  placeholder="Ej. Sin condensaciones activas..."
                  class="w-full rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-xs text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <!-- Metadatos de archivo -->
            <div class="flex items-center gap-2 text-[11px] text-foreground/50 pt-1">
              <span class="truncate font-mono">{{ item.file.name }}</span>
              <span>•</span>
              <span>{{ formatFileSize(item.file.size) }}</span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Estado y Botón Eliminar -->
        <div class="flex items-center justify-between lg:flex-col lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
          <PillBadge
            v-if="item.status === 'pending'"
            size="sm"
            color="pending"
            label="Pendiente"
          />
          <PillBadge
            v-else-if="item.status === 'uploading'"
            size="sm"
            color="primary"
            label="Subiendo..."
          />
          <PillBadge
            v-else-if="item.status === 'success'"
            size="sm"
            color="success"
            label="Subido"
          />
          <PillBadge
            v-else-if="item.status === 'error'"
            size="sm"
            color="danger"
            :label="item.errorMessage || 'Error al subir'"
          />

          <button
            type="button"
            class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-foreground/10 bg-foreground/[0.02] text-foreground/60 transition-colors hover:border-danger hover:bg-danger/10 hover:text-danger disabled:pointer-events-none disabled:opacity-50"
            title="Quitar de la cola"
            :disabled="item.status === 'uploading'"
            @click="removeFromQueue(index)"
          >
            <Trash2 class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueuedDocument } from '../interfaces/clinical-document.interface';
import { DOCUMENT_TYPE_OPTIONS } from '../helpers/document-type.mapper';
import { formatFileSize } from '../helpers/format-file-size.helper';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import { Clock, FileText, FileBox, Trash2 } from 'lucide-vue-next';

interface Props {
  queue: QueuedDocument[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'remove', index: number): void;
}>();

const removeFromQueue = (index: number) => {
  const item = props.queue[index];
  if (item?.previewUrl) {
    URL.revokeObjectURL(item.previewUrl);
  }
  emit('remove', index);
};
</script>

<style scoped></style>
