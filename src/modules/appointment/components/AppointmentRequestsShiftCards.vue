<template>
  <div class="grid grid-cols-12 gap-x-5 gap-y-8 mb-6">
    <CategoryCard
      v-for="card in cards"
      :key="card.value"
      class="col-span-12 sm:col-span-6 lg:col-span-3"
      :active="modelValue === card.value"
      :title="card.title"
      :count="card.count"
      :count-label="card.count === 1 ? 'solicitud' : 'solicitudes'"
      :subtitle="card.schedule"
      @click="onSelect(card.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CategoryCard from '@/modules/common/components/CategoryCard.vue';
import type { Appointment } from '../interfaces/appointment.interface';
import {
  normalizeShift,
  type TurnoPreferido,
} from '../helpers/appointment-shift.mapper';

interface Props {
  modelValue: TurnoPreferido | 'all';
  requests: Appointment[];
}

interface CardItem {
  value: TurnoPreferido | 'all';
  title: string;
  count: number;
  schedule: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TurnoPreferido | 'all'): void;
}>();

const onSelect = (val: TurnoPreferido | 'all') => {
  emit('update:modelValue', val);
};

const countAll = computed(() => props.requests.length);
const countMatutino = computed(
  () => props.requests.filter((r) => normalizeShift(r.turno_preferido) === 'matutino').length,
);
const countVespertino = computed(
  () => props.requests.filter((r) => normalizeShift(r.turno_preferido) === 'vespertino').length,
);
const countIndistinto = computed(
  () => props.requests.filter((r) => normalizeShift(r.turno_preferido) === 'indistinto').length,
);

const cards = computed<CardItem[]>(() => [
  {
    value: 'all',
    title: 'Todos los Turnos',
    count: countAll.value,
    schedule: 'Todas las solicitudes',
  },
  {
    value: 'matutino',
    title: 'Turno Matutino',
    count: countMatutino.value,
    schedule: '08:00 AM - 02:00 PM',
  },
  {
    value: 'vespertino',
    title: 'Turno Vespertino',
    count: countVespertino.value,
    schedule: '02:00 PM - 08:00 PM',
  },
  {
    value: 'indistinto',
    title: 'Horario Indistinto',
    count: countIndistinto.value,
    schedule: 'Cualquier horario del día',
  },
]);
</script>
