<template>
  <div
    data-tw-backdrop=""
    class="modal group bg-black/60 transition-[visibility,opacity] w-screen h-screen fixed left-0 top-0 [&:not(.show)]:duration-[0s,0.2s] [&:not(.show)]:delay-[0.2s,0s] [&:not(.show)]:invisible [&:not(.show)]:opacity-0 [&.show]:visible [&.show]:opacity-100 [&.show]:duration-[0s,0.4s]"
    id="delete-dialog"
  >
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:z-[-1] after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:z-[-1] after:backdrop-blur-md before:bg-background/60 dark:before:shadow-background before:shadow-foreground/60 z-50 mx-auto -mt-16 p-6 transition-[margin-top,transform] duration-[0.4s,0.3s] before:rounded-3xl before:shadow-2xl after:rounded-3xl group-[.show]:mt-16 group-[.modal-static]:scale-[1.05] sm:max-w-lg"
    >
      <a
        class="bg-background/80 hover:bg-background absolute right-0 top-0 -mr-3 -mt-3 flex size-9 items-center justify-center rounded-full border shadow backdrop-blur"
        data-tw-dismiss="modal"
        href="#"
      >
        <CloseIcon />
      </a>
      <div class="p-5 text-center">
        <i
          data-lucide="x-circle"
          class="[--color:currentColor] stroke-(--color) fill-(--color)/25 text-danger mx-auto mt-3 size-16 stroke-1"
        ></i>
        <div class="mt-5 text-3xl">¿Quiere cerrar sesión?</div>
        <div class="mt-2 opacity-70">
          Do you really want to delete these records? <br />
          This process cannot be undone.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background border-(--color)/20 h-10 px-4 py-2 mr-1 w-24"
          type="button"
          data-tw-dismiss="modal"
        >
          Cancelar
        </button>
        <button
          class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-danger)] h-10 px-4 py-2"
          type="button"
          @click="handleLogout"
        >
          Sí, cerrar sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CloseIcon from '@/icons/CloseIcon.vue'
import { useAuthStore } from '../../auth/stores/auth.store'

// interface Props {
//   title: string;
// }

const authStore = useAuthStore()

const handleLogout = async () => {
  const modalElement = document.querySelector('.modal.show')
  if (modalElement) {
    console.log('entrtas')

    window.tailwind.Modal.getOrCreateInstance(modalElement).hide()
  }

  setTimeout(() => {
    authStore.logout()
  }, 300)
}
</script>

<style scoped></style>
