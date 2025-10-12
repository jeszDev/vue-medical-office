<template>
  <TemplateView title="Citas del paciente">
    <template #main>
      <div class="flex justify-end mb-2">
        <ButtonBase text="Agendar nueva cita" :icon="PreviewIcon" color="primary" />
      </div>

      <div>
        <TimeLine :patientId />
      </div>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
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
