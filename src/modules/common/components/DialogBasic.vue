<template>
  <div
    data-tw-backdrop=""
    class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    :id="id"
  >
    <div
      :class="[
        'box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05]',
        sizes[size],
      ]"
    >
      <a
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur"
        data-tw-dismiss="modal"
        href="#"
      >
        <CloseIcon />
      </a>
      <div class="flex flex-col items-center gap-3 overflow-y-auto max-h-[70vh] w-full px-2">
        <slot>Contenido de modal</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { X as XIcon } from 'lucide-vue-next';
import CloseIcon from '@/icons/CloseIcon.vue';

interface Props {
  id: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

withDefaults(defineProps<Props>(), {
  id: 'basic-dialog',
  size: 'md',
});

const sizes = {
  sm: 'sm:!max-w-sm',
  md: 'sm:!max-w-md',
  lg: 'sm:!max-w-lg',
  xl: 'sm:!max-w-xl',
  '2xl': 'sm:!max-w-2xl',
  '3xl': 'sm:!max-w-3xl',
};
</script>

<style scoped></style>
