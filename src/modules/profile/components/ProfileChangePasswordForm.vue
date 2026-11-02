<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5 sm:p-7"
    >
      <div class="flex items-center gap-3 pb-4 mb-6 border-b border-foreground/10">
        <IconBadge color="warning" size="md">
          <KeyRoundIcon class="size-5 text-warning" />
        </IconBadge>
        <div>
          <h3 class="text-base font-bold text-foreground">Cambio de Contraseña</h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Mantén protegida tu cuenta actualizando periódicamente tu clave de acceso
          </p>
        </div>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <!-- Contraseña Actual -->
        <div>
          <label class="block text-xs font-semibold text-foreground mb-1.5">
            Contraseña Actual
          </label>
          <div class="relative">
            <input
              v-model="form.current_password"
              :type="showCurrent ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña actual"
              class="h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 text-sm"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              tabindex="-1"
              @click="showCurrent = !showCurrent"
            >
              <EyeOffIcon v-if="showCurrent" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
        </div>

        <!-- Nueva Contraseña -->
        <div>
          <label class="block text-xs font-semibold text-foreground mb-1.5">
            Nueva Contraseña *
          </label>
          <div class="relative">
            <input
              v-model="form.new_password"
              :type="showNew ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              class="h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 text-sm"
              :class="{ 'border-danger': errors.new_password }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              tabindex="-1"
              @click="showNew = !showNew"
            >
              <EyeOffIcon v-if="showNew" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
          <span v-if="errors.new_password" class="text-xs text-danger mt-1 block">
            {{ errors.new_password }}
          </span>

          <!-- Medidor visual de fortaleza estilo Midone Icewall -->
          <div v-if="form.new_password" class="mt-2.5 space-y-1">
            <div class="grid h-1.5 w-full grid-flow-col gap-2">
              <div
                class="h-full rounded transition-all"
                :class="strengthScore >= 1 ? strengthColorClass : 'bg-foreground/10'"
              ></div>
              <div
                class="h-full rounded transition-all"
                :class="strengthScore >= 2 ? strengthColorClass : 'bg-foreground/10'"
              ></div>
              <div
                class="h-full rounded transition-all"
                :class="strengthScore >= 3 ? strengthColorClass : 'bg-foreground/10'"
              ></div>
              <div
                class="h-full rounded transition-all"
                :class="strengthScore >= 4 ? strengthColorClass : 'bg-foreground/10'"
              ></div>
            </div>
            <div class="text-[11px] text-muted-foreground flex justify-between">
              <span>Seguridad: <strong :class="strengthTextClass">{{ strengthLabel }}</strong></span>
              <span>{{ form.new_password.length }} caracteres</span>
            </div>
          </div>
        </div>

        <!-- Confirmar Nueva Contraseña -->
        <div>
          <label class="block text-xs font-semibold text-foreground mb-1.5">
            Confirmar Nueva Contraseña *
          </label>
          <div class="relative">
            <input
              v-model="form.new_password_confirmation"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Vuelve a escribir tu nueva contraseña"
              class="h-10 w-full rounded-md border bg-background px-3 py-2 pr-10 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 text-sm"
              :class="{ 'border-danger': errors.new_password_confirmation }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              tabindex="-1"
              @click="showConfirm = !showConfirm"
            >
              <EyeOffIcon v-if="showConfirm" class="size-4" />
              <EyeIcon v-else class="size-4" />
            </button>
          </div>
          <span
            v-if="errors.new_password_confirmation"
            class="text-xs text-danger mt-1 block"
          >
            {{ errors.new_password_confirmation }}
          </span>
        </div>

        <!-- Recomendaciones de seguridad -->
        <div class="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 text-xs text-muted-foreground mt-4 leading-relaxed">
          <strong class="text-foreground font-semibold">Consejo de seguridad:</strong>
          Te recomendamos usar al menos 8 caracteres combinando mayúsculas, minúsculas, números y símbolos para proteger tu cuenta clínica.
        </div>

        <!-- Botones de Acción -->
        <div class="pt-4 flex items-center justify-end gap-3">
          <ButtonBase
            text="Cancelar"
            color="secondary"
            type="button"
            @click="$emit('cancel')"
          />
          <ButtonBase
            text="Actualizar Contraseña"
            color="primary"
            type="submit"
            :is-loading="isSubmitting"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { ChangePasswordPayload } from '../interfaces';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import {
  KeyRound as KeyRoundIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from 'lucide-vue-next';

defineProps<{
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: ChangePasswordPayload): void;
  (e: 'cancel'): void;
}>();

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const form = reactive<ChangePasswordPayload>({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const errors = reactive({
  new_password: '',
  new_password_confirmation: '',
});

// Medidor de fortaleza de contraseña
const strengthScore = computed(() => {
  const p = form.new_password;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
});

const strengthLabel = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'Débil';
    case 2:
      return 'Regular';
    case 3:
      return 'Buena';
    case 4:
      return 'Excelente';
    default:
      return 'Muy corta';
  }
});

const strengthColorClass = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'bg-danger';
    case 2:
      return 'bg-warning';
    case 3:
      return 'bg-primary';
    case 4:
      return 'bg-success';
    default:
      return 'bg-foreground/10';
  }
});

const strengthTextClass = computed(() => {
  switch (strengthScore.value) {
    case 1:
      return 'text-danger';
    case 2:
      return 'text-warning';
    case 3:
      return 'text-primary';
    case 4:
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
});

const handleSubmit = () => {
  errors.new_password = '';
  errors.new_password_confirmation = '';

  if (!form.new_password) {
    errors.new_password = 'Debes ingresar una nueva contraseña.';
    return;
  }

  if (form.new_password.length < 8) {
    errors.new_password = 'La contraseña debe tener al menos 8 caracteres.';
    return;
  }

  if (form.new_password !== form.new_password_confirmation) {
    errors.new_password_confirmation = 'Las contraseñas no coinciden.';
    return;
  }

  emit('submit', { ...form });
};
</script>
