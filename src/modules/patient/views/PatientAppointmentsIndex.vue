<template>
  <TemplateView title="Citas del paciente">
    <template #main>
      <TimeLine :patientId />
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import TimeLine from '@/modules/common/components/TimeLine.vue';

interface Props {
  patientId: string;
  isInsideModal: boolean;
}

withDefaults(defineProps<Props>(), {
  patientId: '1',
  isInsideModal: false,
});
</script>

<style scoped></style>
