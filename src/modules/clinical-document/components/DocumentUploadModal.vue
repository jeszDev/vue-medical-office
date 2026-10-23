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
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        @click="close"
      ></div>

      <!-- Container -->
      <div class="flex min-h-screen items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg rounded-3xl border border-foreground/10 bg-background p-6 shadow-2xl transition-all"
        >
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-foreground/10">
            <div class="flex items-center gap-3">
              <div
                class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20"
              >
                <UploadCloud class="size-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-foreground">Anexar Estudio / Documento</h3>
                <p class="text-xs text-foreground/60">
                  Consulta #{{ consultationId }}
                </p>
              </div>
            </div>

            <button
              type="button"
              class="flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/10 text-foreground/60 hover:bg-foreground/10 hover:text-foreground"
              @click="close"
            >
              <CloseIcon class="size-4" />
            </button>
          </div>

          <!-- Form Body -->
          <form class="mt-5 space-y-4" @submit.prevent="handleSubmit">
            <!-- Dropzone para seleccionar archivo -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                Archivo / Estudio <span class="text-danger">*</span>
              </label>
              <DocumentDropzone
                :multiple="false"
                :disabled="isSubmitting"
                @files-selected="onFileSelected"
              />

              <!-- Preview del archivo seleccionado -->
              <div
                v-if="selectedFile"
                class="mt-2.5 flex items-center justify-between rounded-xl border border-primary/20 bg-primary/[0.04] p-3 text-xs"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <FileText v-if="selectedFile.type === 'application/pdf'" class="size-4 text-danger shrink-0" />
                  <FileImage v-else class="size-4 text-primary shrink-0" />
                  <span class="font-mono font-medium truncate">{{ selectedFile.name }}</span>
                  <span class="text-foreground/50 shrink-0">({{ formatFileSize(selectedFile.size) }})</span>
                </div>

                <button
                  type="button"
                  class="text-xs text-danger hover:underline ml-2 shrink-0 cursor-pointer"
                  @click="selectedFile = null"
                >
                  Cambiar
                </button>
              </div>
              <p v-if="errors.archivo" class="mt-1 text-xs text-danger font-medium">
                {{ errors.archivo }}
              </p>
            </div>

            <!-- Título del estudio -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                Título del estudio <span class="text-danger">*</span>
              </label>
              <input
                v-model="titulo"
                type="text"
                maxlength="150"
                placeholder="Ej. Radiografía de Tórax AP y Lateral"
                class="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                :class="{ 'border-danger': errors.titulo }"
              />
              <p v-if="errors.titulo" class="mt-1 text-xs text-danger font-medium">
                {{ errors.titulo }}
              </p>
            </div>

            <!-- Tipo de Documento -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                Clasificación Clínica <span class="text-danger">*</span>
              </label>
              <select
                v-model="tipo_documento"
                class="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
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

            <!-- Descripción / Notas -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
                Hallazgos / Notas del estudio (Opcional)
              </label>
              <textarea
                v-model="descripcion"
                rows="2"
                maxlength="2000"
                placeholder="Ej. Placa sin consolidaciones, trama vascular normal..."
                class="w-full rounded-xl border border-foreground/15 bg-background px-3.5 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-foreground/10">
              <ButtonBase
                text="Cancelar"
                color="secondary"
                :disabled="isSubmitting"
                @click="close"
              />
              <ButtonBase
                type="submit"
                :text="isSubmitting ? 'Subiendo estudio...' : 'Anexar Estudio'"
                color="primary"
                :disabled="isSubmitting || !selectedFile"
              >
                <template #icon>
                  <div
                    v-if="isSubmitting"
                    class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  ></div>
                  <UploadCloud v-else class="size-4" />
                </template>
              </ButtonBase>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type {
  DocumentType,
  ClinicalDocument,
} from '../interfaces/clinical-document.interface';
import { DOCUMENT_TYPE_OPTIONS } from '../helpers/document-type.mapper';
import { formatFileSize } from '../helpers/format-file-size.helper';
import { uploadConsultationDocumentAction } from '../actions/upload-consultation-document.action';
import DocumentDropzone from './DocumentDropzone.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import CloseIcon from '@/icons/CloseIcon.vue';
import { UploadCloud, FileText, FileImage } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';

interface Props {
  modelValue: boolean;
  consultationId: number | string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'documentUploaded', document: ClinicalDocument): void;
}>();

const toast = useToast();

const selectedFile = ref<File | null>(null);
const titulo = ref('');
const tipo_documento = ref<DocumentType>('laboratorio');
const descripcion = ref('');
const isSubmitting = ref(false);

const errors = reactive({
  archivo: '',
  titulo: '',
});

const onFileSelected = (files: File[]) => {
  if (files.length === 0) return;
  const file = files[0];
  selectedFile.value = file;
  errors.archivo = '';

  // Prefill title with filename without extension if empty
  if (!titulo.value.trim()) {
    const rawName = file.name.replace(/\.[^/.]+$/, '');
    titulo.value = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  }
};

const close = () => {
  if (isSubmitting.value) return;
  emit('update:modelValue', false);
};

const handleSubmit = async () => {
  errors.archivo = '';
  errors.titulo = '';

  if (!selectedFile.value) {
    errors.archivo = 'Debes seleccionar un archivo para anexar.';
    return;
  }

  if (!titulo.value.trim()) {
    errors.titulo = 'El título del estudio es obligatorio.';
    return;
  }

  try {
    isSubmitting.value = true;
    const newDoc = await uploadConsultationDocumentAction(props.consultationId, {
      archivo: selectedFile.value,
      titulo: titulo.value.trim(),
      tipo_documento: tipo_documento.value,
      descripcion: descripcion.value.trim() || undefined,
    });

    toast.success('Documento anexado correctamente.');
    emit('documentUploaded', newDoc);
    close();
  } catch (error) {
    console.error('Error al anexar documento:', error);
    toast.error('No se pudo subir el documento. Verifica los datos e inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      selectedFile.value = null;
      titulo.value = '';
      tipo_documento.value = 'laboratorio';
      descripcion.value = '';
      errors.archivo = '';
      errors.titulo = '';
    }
  },
);
</script>

<style scoped></style>
