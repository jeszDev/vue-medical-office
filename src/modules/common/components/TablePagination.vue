<template>
  <div class="col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
    <nav class="w-full sm:mr-auto sm:w-auto">
      <ul class="mr-0 flex w-full gap-1 sm:mr-auto sm:w-auto">
        <li class="flex-1 sm:flex-initial">
          <button
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
            @click="$emit('page-change', 1)"
          >
            <ChevronsLeft
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </button>
        </li>

        <li class="flex-1 sm:flex-initial">
          <button
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
            @click="$emit('page-change', pagination.currentPage - 1)"
          >
            <ChevronLeft
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </button>
        </li>

        <li v-for="(link, index) in pagination.links" :key="index" class="flex-1 sm:flex-initial">
          <button
            v-if="link.active"
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background h-10 px-4 py-2 box rounded-xl border-inherit"
            @click="$emit('page-change', Number(link.label))"
          >
            {{ link.label }}
          </button>

          <button
            v-else-if="!link.active && !Number.isNaN(Number(link.label))"
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
            @click="$emit('page-change', Number(link.label))"
          >
            {{ link.label }}
          </button>
        </li>

        <li class="flex-1 sm:flex-initial">
          <button
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
            @click="$emit('page-change', pagination.currentPage + 1)"
          >
            <ChevronRight
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </button>
        </li>

        <li class="flex-1 sm:flex-initial">
          <button
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
            @click="$emit('page-change', pagination.lastPage)"
          >
            <ChevronsRight
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </button>
        </li>

        <!-- <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            ...
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            1
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background h-10 px-4 py-2 box rounded-xl border-inherit"
          >
            2
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            3
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            ...
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            <ChevronRight
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </a>
        </li>
        <li class="flex-1 sm:flex-initial">
          <a
            class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 h-10 px-4 py-2 border-transparent bg-transparent"
          >
            <ChevronsRight
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
            />
          </a>
        </li> -->
      </ul>
    </nav>
    <select
      class="bg-(image:--background-image-chevron) bg-[position:calc(100%-theme(spacing.3))_center] bg-[size:theme(spacing.5)] bg-no-repeat relative appearance-none flex h-10 rounded-md border bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box mt-3 w-20 sm:mt-0"
    >
      <option>10</option>
      <option>25</option>
      <option>35</option>
      <option>50</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { Pagination } from '../interfaces/pagination.interface';

interface Props {
  pagination: Pagination;
}

defineProps<Props>();

defineEmits<{
  (e: 'page-change', pageNumber: number): void;
}>();
</script>

<style scoped></style>
