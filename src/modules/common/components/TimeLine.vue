<template>
  <section class="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
    <div class="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
      <div class="flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16">
        <div class="w-full max-w-3xl mx-auto">
          <!-- Vertical Timeline #1 -->
          <div class="-my-6">
            <TimeLineItem />
          </div>
          <!-- End: Vertical Timeline #1 -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TimeLineItem from './TimeLineItem.vue'
</script>

<style scoped></style>
