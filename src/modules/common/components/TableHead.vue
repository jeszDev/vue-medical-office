<script setup lang="ts">
export interface TableColumn {
  key?: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  nowrap?: boolean;
  headerClass?: string;
}

withDefaults(
  defineProps<{
    columns: TableColumn[];
  }>(),
  {},
);
</script>

<template>
  <thead class="[&_tr]:border-b-0 [&_tr_th]:h-10">
    <tr class="border-b-0">
      <th
        v-for="(col, index) in columns"
        :key="col.key ?? index"
        class="h-10 px-4 align-middle font-medium text-xs uppercase tracking-wider text-muted-foreground"
        :class="[
          col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
          col.width ? col.width : '',
          col.nowrap !== false ? 'whitespace-nowrap' : '',
          col.headerClass ? col.headerClass : '',
        ]"
      >
        <slot :name="col.key" :column="col">
          {{ col.label }}
        </slot>
      </th>
    </tr>
  </thead>
</template>
