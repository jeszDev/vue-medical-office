<template>
  <TemplateView :title="`CITAS DEL PACIENTE`">
    <template #main>
      <div class="flex justify-end mb-2">
        <ButtonBase
          text="Nueva cita"
          :icon="PreviewIcon"
          color="primary"
          data-tw-toggle="modal"
          data-tw-target="#modal-appointment-create-or-edit"
        />
      </div>

      <div>
        <TimeLine :patientId />
      </div>

      <DialogBasic id="modal-appointment-create-or-edit" size="3xl">
        <AppointmentCreateUpdate :patientId :is-inside-modal="true" />
      </DialogBasic>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import TimeLine from '@/modules/common/components/TimeLine.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';

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
