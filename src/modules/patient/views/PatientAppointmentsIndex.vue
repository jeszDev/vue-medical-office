<template>
  <TemplateView title="Citas del paciente">
    <template #main>
      <TimeLine />
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import TemplateView from '@/modules/template/components/TemplateView.vue';
import TimeLine from '@/modules/common/components/TimeLine.vue';
</script>

<style scoped></style>
