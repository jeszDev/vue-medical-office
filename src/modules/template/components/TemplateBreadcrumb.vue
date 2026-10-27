<template>
  <nav
    aria-label="Breadcrumb"
    class="mr-auto hidden xl:flex items-center truncate min-w-0"
  >
    <ul
      v-if="breadcrumbs.length > 0"
      class="truncate gap-x-6 [--background-image-chevron:var(--background-image-chevron-light)] [--color-base:--alpha(var(--color-nav-foreground)/70%)] [--color-link:var(--color-nav-foreground)] flex items-center text-sm"
    >
      <li
        v-for="(item, index) in breadcrumbs"
        :key="index"
        class="[&:not(:last-child)>a]:text-(--color-link) text-(--color-base) before:bg-(image:--background-image-chevron) relative before:absolute before:inset-y-0 before:my-auto before:-ml-4 before:size-2 before:-rotate-90 before:bg-center before:bg-no-repeat before:opacity-70 first:before:hidden flex items-center"
      >
        <RouterLink
          v-if="item.routeName && index < breadcrumbs.length - 1"
          :to="{ name: item.routeName, params: item.params, query: item.query }"
          class="cursor-pointer hover:underline transition-opacity opacity-80 hover:opacity-100"
        >
          {{ item.title }}
        </RouterLink>
        <span v-else class="cursor-default select-none font-medium">
          {{ item.title }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useBreadcrumb } from '@/modules/common/composables/useBreadcrumb';

const { breadcrumbs } = useBreadcrumb();
</script>
