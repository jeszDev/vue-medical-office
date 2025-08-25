<template>
  <div
    data-tw-backdrop=""
    class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    id="basic-dialog"
  >
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05] sm:max-w-lg"
    >
      <a
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur"
        data-tw-dismiss="modal"
        href="#"
      >
        <XIcon
          class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-5 opacity-70"
        />
      </a>
      <div class="flex flex-col items-center gap-3 py-2 text-center">
        <h2 class="text-lg font-medium">What is Lorem Ipsum?</h2>
        <p class="opacity-80">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
          Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
          PageMaker including versions of Lorem Ipsum.
        </p>
        <button
          class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 px-4 py-2 mt-2 w-40"
          data-tw-dismiss="modal"
          type="button"
        >
          Close Dialog
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X as XIcon } from 'lucide-vue-next';
</script>

<style scoped></style>
