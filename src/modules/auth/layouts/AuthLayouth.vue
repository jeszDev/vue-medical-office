<template>
  <div
    class="relative h-screen lg:overflow-hidden bg-primary bg-noise xl:bg-background xl:bg-none before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[6deg] before:bg-primary/[.95] before:bg-noise before:rounded-[35%] after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[28%] after:-mb-[16%] after:-ml-[12%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[6deg] after:border after:bg-accent after:bg-cover after:blur-xl after:rounded-[35%] after:border-[20px] after:border-primary"
  >
    <div
      class="p-3 sm:px-8 relative h-full before:hidden before:xl:block before:w-[57%] before:-mt-[20%] before:-mb-[13%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-6deg] before:bg-primary/40 before:bg-noise before:border before:border-primary/50 before:opacity-60 before:rounded-[20%]"
    >
      <div class="container relative z-10 mx-auto sm:px-20">
        <div class="block grid-cols-2 gap-4 xl:grid">
          <!-- BEGIN: Login Info -->
          <div class="hidden min-h-screen flex-col xl:flex">
            <a class="flex items-center pt-10" href="">
              <img
                class="w-6"
                src="@/assets/images/logo.svg"
                alt="Midone - Tailwind Admin Dashboard Template"
              />
              <span class="ml-3 text-xl font-medium text-white">
                Midone <span class="font-light opacity-70">Admin</span>
              </span>
            </a>
            <div class="my-auto">
              <img
                class="-mt-16 w-1/2"
                src="@/assets/images/illustration.svg"
                alt="Midone - Tailwind Admin Dashboard Template"
              />
              <div class="mt-10 text-4xl font-medium leading-tight text-white">
                A few more clicks to <br />
                sign in to your account.
              </div>
              <div class="mt-5 text-lg text-white opacity-60">
                Manage all your e-commerce accounts in one place
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
