<template>
  <div>
    <!-- Dropzone Box -->
    <div
      class="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer"
      :class="[
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-foreground/15 bg-foreground/[0.01] hover:border-primary/50 hover:bg-foreground/[0.03]',
        disabled ? 'pointer-events-none opacity-50' : '',
      ]"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        :multiple="multiple"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        class="hidden"
        @change="onFileInputChange"
      />

      <div
        class="flex size-12 items-center justify-center rounded-2xl border transition-all duration-200 group-hover:scale-110"
        :class="
          isDragging
            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
            : 'bg-primary/10 text-primary border-primary/20'
        "
      >
        <UploadCloud class="size-6" />
      </div>

      <div class="mt-3">
        <p class="text-sm font-bold text-foreground">
          <span class="text-primary hover:underline">Haz clic para seleccionar</span> o arrastra tus archivos aquí
        </p>
        <p class="mt-1 text-xs text-foreground/60">
          Formatos admitidos: <span class="font-semibold text-foreground/80">PDF, JPG, PNG, WEBP</span>
          <span class="mx-1">•</span>
          Máx. <span class="font-semibold text-foreground/80">25 MB</span> por archivo
        </p>
      </div>
    </div>

    <!-- Mensaje de error de validación -->
    <div
      v-if="validationError"
      class="mt-2.5 flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-3.5 py-2 text-xs font-medium text-danger"
    >
      <AlertCircle class="size-4 shrink-0" />
      <span>{{ validationError }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadCloud, AlertCircle } from 'lucide-vue-next';

interface Props {
  multiple?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'filesSelected', files: File[]): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const validationError = ref<string | null>(null);

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

const triggerFileInput = () => {
  if (props.disabled) return;
  fileInputRef.value?.click();
};

const onDragOver = () => {
  if (props.disabled) return;
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (props.disabled) return;

  const droppedFiles = event.dataTransfer?.files;
  if (!droppedFiles || droppedFiles.length === 0) return;

  processFiles(Array.from(droppedFiles));
};

const onFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  processFiles(Array.from(target.files));
  target.value = ''; // Reset input to allow re-selecting same file if desired
};

const processFiles = (fileList: File[]) => {
  validationError.value = null;
  const validFiles: File[] = [];

  for (const file of fileList) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      validationError.value = `El archivo "${file.name}" tiene una extensión no permitida. Solo se admiten: ${ALLOWED_EXTENSIONS.join(', ')}.`;
      return;
    }

    if (file.size > MAX_BYTES) {
      validationError.value = `El archivo "${file.name}" supera el límite máximo de 25 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`;
      return;
    }

    validFiles.push(file);
  }

  if (validFiles.length > 0) {
    emit('filesSelected', validFiles);
  }
};
</script>

<style scoped></style>
