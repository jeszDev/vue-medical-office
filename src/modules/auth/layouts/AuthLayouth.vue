<template>
  <div
    class="relative h-screen lg:overflow-hidden bg-primary bg-noise xl:bg-background xl:bg-none before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[6deg] before:bg-primary/[.95] before:bg-noise before:rounded-[35%] after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[28%] after:-mb-[16%] after:-ml-[12%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[6deg] after:border after:bg-accent after:bg-cover after:blur-xl after:rounded-[35%] after:border-[20px] after:border-primary"
  >
    <div
      class="p-3 sm:px-8 relative h-full before:hidden before:xl:block before:w-[57%] before:-mt-[20%] before:-mb-[13%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-6deg] before:bg-primary/40 before:bg-noise before:border before:border-primary/50 before:opacity-60 before:rounded-[20%]"
    >
      <div class="container relative z-10 mx-auto">
        <div class="flex flex-col items-center text-center pt-8 pb-2 xl:hidden">
          <img class="w-14 h-14 mb-2" src="@/assets/images/logo-heart.svg" alt="Latidos Logo" />
          <span class="text-4xl font-latidos text-white">Latidos</span>
          <span class="text-[10px] font-latidos-subtitle text-white/80 mt-1">
            GESTOR MÉDICO INTELIGENTE
          </span>
        </div>

        <div class="block grid-cols-2 gap-4 xl:grid">
          <!-- BEGIN: Login Info -->
          <div class="hidden min-h-screen flex-col xl:flex">
            <a class="flex items-center pt-10" href="">
              <img class="w-6" src="@/assets/images/logo-heart.svg" alt="Latidos" />
              <span class="ml-3 text-xl font-latidos text-white"> Latidos </span>
            </a>
            <div class="my-auto flex gap-4">
              <img class="-mt-8 w-1/3" src="@/assets/images/logo-heart.svg" alt="Latidos" />
              <div>
                <div class="mt-6 text-6xl font-latidos text-white">Latidos</div>
                <div class="mt-3 text-sm font-latidos-subtitle text-white/80">
                  GESTOR MÉDICO INTELIGENTE
                </div>
              </div>
            </div>
          </div>
          <!-- END: Login Info -->
          <!-- BEGIN: Login Form -->
          <RouterView />
          <!-- END: Login Form -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
