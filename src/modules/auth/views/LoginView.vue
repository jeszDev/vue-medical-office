<template>
  <div class="my-10 flex h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
    <div
      class="box relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mx-auto my-auto w-full px-5 py-8 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-24 xl:w-auto xl:p-0 xl:before:hidden xl:after:hidden"
    >
      <h2 class="text-center text-2xl font-semibold xl:text-left xl:text-3xl">Iniciar sesión</h2>
      <div class="mt-2 text-center opacity-70 xl:hidden">
        A few more clicks to sign in to your account. Manage all your e-commerce accounts in one
        place
      </div>
      <div class="mt-8 flex flex-col gap-5">
        <input
          ref="emailInputRef"
          class="h-10 w-full rounded-md border bg-background ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box block min-w-full px-5 py-6 xl:min-w-[28rem]"
          type="text"
          value="midone@leftcode.com"
          placeholder="Correo electronico"
          v-model="email"
        />
        <input
          ref="passwordInputRef"
          class="h-10 w-full rounded-md border bg-background ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box block min-w-full px-5 py-6 xl:min-w-[28rem]"
          type="password"
          value="123456"
          placeholder="Contaseña"
          v-model="password"
        />
        <div class="flex text-xs sm:text-sm">
          <!-- <div class="flex gap-2.5 mr-auto flex-row items-center">
            <div class="bg-background border-foreground/70 relative size-4 rounded-sm border">
              <input
                class="peer relative z-10 size-full cursor-pointer opacity-0"
                type="checkbox"
                id="remember-me"
              />
              <div
                class="z-4 bg-foreground invisible absolute inset-0 flex items-center justify-center text-white peer-checked:visible"
              >
                <i
                  data-lucide="check"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                ></i>
              </div>
            </div>
            <label
              class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-70"
              for="remember-me"
              >Remember me</label
            >
          </div> -->
          <a class="opacity-70" href="">¿Olvidaste la contraseña?</a>
        </div>
      </div>
      <div class="mt-5 text-center xl:mt-10 xl:text-left">
        <button
          class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 login-button box w-full px-4 py-5"
          @click="handleLogin"
        >
          Iniciar
        </button>
        <button
          class="[--color:var(--color-foreground)] cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background border-(--color)/20 h-10 box mt-4 w-full px-4 py-5"
        >
          Registrarse
        </button>
      </div>
      <!-- <div class="mt-10 text-center opacity-70 xl:mt-24 xl:text-left">
        By signin up, you agree to our
        <a class="text-primary" href=""> Terms and Conditions </a>
        &
        <a class="text-primary" href=""> Privacy Policy </a>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { ref } from 'vue';

const authStore = useAuthStore();
// const toast = useToast();
const emailInputRef = ref<HTMLInputElement | null>(null);
const passwordInputRef = ref<HTMLInputElement | null>(null);

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  if (email.value === '') {
    return emailInputRef.value?.focus();
  }

  if (password.value.length < 8) {
    return passwordInputRef.value?.focus();
  }

  const ok = await authStore.login(email.value, password.value);

  if (ok) return;

  // toast.error('Usuario o contraseña incorrectos');
};
</script>

<style scoped></style>
