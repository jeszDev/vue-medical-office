<template>
  <div
    :class="[
      isActive ? 'active' : '',
      'group z-10 flex flex-1 items-center lg:block lg:text-center',
    ]"
  >
    <button
      class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background border-(--color)/20 px-4 py-2 group-[.active]:bg-primary/20 group-[.active]:text-primary mx-2 size-12 rounded-full"
    >
      {{ step }}
    </button>
    <div
      class="group-[.active]:text-primary ml-3 opacity-70 group-[.active]:font-medium group-[.active]:opacity-100 lg:mx-auto lg:mt-3 lg:w-32"
    >
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isActive: boolean;
  description: string;
  step: string;
}

defineProps<Props>();
</script>

<style scoped></style>
