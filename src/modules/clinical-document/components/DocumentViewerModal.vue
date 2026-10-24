<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[10050] overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        @click="close"
      ></div>

      <!-- Modal Container -->
      <div class="flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div
          class="relative w-full max-w-4xl rounded-2xl border border-foreground/10 bg-background shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between border-b border-foreground/10 bg-foreground/[0.02] px-6 py-4"
          >
            <div class="flex items-center gap-3 min-w-0 pr-4">
              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20"
              >
                <FileText v-if="isPdf" class="size-4 text-danger" />
                <FileImage v-else class="size-4 text-primary" />
              </div>
              <div class="min-w-0">
                <h3 class="truncate text-base font-bold text-foreground" :title="document?.titulo">
                  {{ document?.titulo || 'Visor de Documento' }}
                </h3>
                <div class="flex items-center gap-2 text-xs text-foreground/60">
                  <span class="truncate font-mono">{{ document?.nombre_archivo_original }}</span>
                  <span v-if="document?.peso_bytes">• {{ formattedSize }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <!-- Botón de Descarga -->
              <a
                v-if="finalUrl"
                :href="finalUrl"
                target="_blank"
                download
                class="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-foreground/10 bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5 hover:text-primary"
              >
                <Download class="size-3.5" />
                <span class="hidden sm:inline">Descargar</span>
              </a>

              <!-- Botón Cerrar -->
              <button
                type="button"
                class="flex size-9 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
                @click="close"
              >
                <CloseIcon class="size-4" />
              </button>
            </div>
          </div>

          <!-- Body / Viewer Content -->
          <div class="relative min-h-[320px] max-h-[75vh] overflow-y-auto bg-foreground/[0.01] p-4 sm:p-6 flex items-center justify-center">
            <!-- Spinner mientras obtiene URL -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center gap-3 py-16">
              <div class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p class="text-xs text-foreground/60 font-medium">Obteniendo enlace seguro del archivo...</p>
            </div>

            <!-- Error al cargar -->
            <div v-else-if="errorMessage" class="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <AlertCircle class="size-10 text-danger" />
              <p class="text-sm font-semibold text-danger">{{ errorMessage }}</p>
              <button
                type="button"
                class="mt-2 text-xs text-primary underline"
                @click="loadDocumentUrl"
              >
                Reintentar
              </button>
            </div>

            <!-- Visualizador de Imagen -->
            <div v-else-if="isImage && finalUrl" class="flex items-center justify-center max-h-[70vh] w-full">
              <img
                :src="finalUrl"
                :alt="document?.titulo"
                class="max-h-[70vh] max-w-full rounded-lg object-contain shadow-xs border border-foreground/5"
              />
            </div>

            <!-- Visualizador de PDF -->
            <div v-else-if="isPdf && finalUrl" class="w-full h-[70vh]">
              <iframe
                :src="finalUrl"
                class="size-full rounded-xl border border-foreground/10 shadow-inner"
                title="Visor PDF"
              ></iframe>
            </div>

            <!-- Archivo no previsualizable directamente -->
            <div v-else class="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <FileBox class="size-14 text-foreground/40" />
              <p class="text-sm font-semibold text-foreground">
                Este tipo de archivo no cuenta con previsualización embebida.
              </p>
              <p class="text-xs text-foreground/60 max-w-md">
                Puedes descargarlo para abrirlo directamente en tu aplicación local correspondiente.
              </p>
              <a
                v-if="finalUrl"
                :href="finalUrl"
                target="_blank"
                download
                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-primary/90"
              >
                <Download class="size-4" />
                Descargar {{ document?.nombre_archivo_original }}
              </a>
            </div>
          </div>

          <!-- Footer con descripción -->
          <div
            v-if="document?.descripcion"
            class="border-t border-foreground/10 bg-foreground/[0.02] px-6 py-3 text-xs text-foreground/75"
          >
            <span class="font-bold text-foreground">Hallazgos / Notas:</span> {{ document.descripcion }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ClinicalDocument } from '../interfaces/clinical-document.interface';
import { getDocumentDetailAction } from '../actions/get-document-detail.action';
import { isImageMimeType, isPdfMimeType } from '../helpers/document-type.mapper';
import { formatFileSize } from '../helpers/format-file-size.helper';
import CloseIcon from '@/icons/CloseIcon.vue';
import { FileText, FileImage, FileBox, Download, AlertCircle } from 'lucide-vue-next';

interface Props {
  modelValue: boolean;
  document: ClinicalDocument | null;
  consultationId?: number | string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const fetchedUrl = ref<string | null>(null);

const isImage = computed(() => isImageMimeType(props.document?.mime_type));
const isPdf = computed(() => isPdfMimeType(props.document?.mime_type));
const formattedSize = computed(() => formatFileSize(props.document?.peso_bytes));

const finalUrl = computed(() => {
  return (
    fetchedUrl.value ||
    props.document?.temporary_url ||
    props.document?.download_url ||
    props.document?.url ||
    null
  );
});

const close = () => {
  emit('update:modelValue', false);
};

const loadDocumentUrl = async () => {
  if (!props.document) return;

  // Si ya tenemos URL en el objeto, la usamos directamente
  if (props.document.temporary_url || props.document.download_url || props.document.url) {
    fetchedUrl.value =
      props.document.temporary_url || props.document.download_url || props.document.url || null;
    return;
  }

  const consId = props.consultationId || props.document.consulta_id;
  if (!consId || !props.document.id) return;

  try {
    isLoading.value = true;
    errorMessage.value = null;
    const detail = await getDocumentDetailAction(consId, props.document.id);
    if (detail) {
      fetchedUrl.value = detail.temporary_url || detail.download_url || detail.url || null;
    }
  } catch (error) {
    console.error('Error al cargar la URL del documento:', error);
    errorMessage.value = 'No se pudo obtener el enlace de descarga o visualización.';
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      fetchedUrl.value = null;
      errorMessage.value = null;
      loadDocumentUrl();
    }
  },
);
</script>

<style scoped></style>
