<template>
  <div
    class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0 mt-5"
  >
    <!-- Cabecera del Perfil estilo Midone Icewall Profile Overview -->
    <div class="flex flex-col p-5 border-b border-foreground/10 lg:flex-row gap-6">
      <!-- 1. Avatar e Identificación del Usuario -->
      <div class="flex items-center justify-center flex-1 px-2 sm:px-5 lg:justify-start">
        <div class="relative shrink-0">
          <AvatarBase
            :src="user.avatar"
            :name="user.name"
            fallback-text="U"
            size="xl"
            shape="circle"
            class="ring-4 ring-primary/20"
          />
          <!-- Botón de cambio de foto estilo Midone -->
          <button
            type="button"
            class="bg-primary text-white border-2 border-background absolute bottom-0 right-0 flex items-center justify-center rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform cursor-pointer"
            title="Cambiar foto de perfil"
            @click="$emit('change-avatar')"
          >
            <CameraIcon class="size-3.5" />
          </button>
        </div>

        <div class="ml-5 min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {{ roleSubtitle }}
            </span>
            <PillBadge
              :color="roleBadgeColor"
              size="xs"
              :label="roleDisplayName"
            />
            <PillBadge
              v-if="authStore.isDualUser"
              color="primary"
              size="xs"
              label="Médico y Paciente"
            />
            <PillBadge
              color="success"
              size="xs"
              label="Cuenta activa"
            />
          </div>

          <h2
            class="text-lg sm:text-xl font-bold text-foreground truncate mt-1"
            :title="user.name"
          >
            {{ user.name }}
          </h2>

          <div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span v-if="user.cedula_profesional" class="font-mono font-medium">
              Cédula: {{ user.cedula_profesional }}
            </span>
            <span v-else-if="user.folio_paciente" class="font-mono font-medium text-foreground/80">
              {{ user.folio_paciente }}
            </span>
            <span v-else-if="user.turno" class="font-medium text-foreground/80">
              {{ user.turno }}
            </span>
          </div>
        </div>
      </div>

      <!-- 2. Datos de Contacto Directo -->
      <div
        class="flex-1 px-4 pt-5 border-t border-foreground/10 lg:mt-0 lg:border-t-0 lg:border-l lg:border-r lg:pt-0"
      >
        <div
          class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center lg:text-left"
        >
          Contacto Directo
        </div>
        <div
          class="flex flex-col items-center justify-center mt-2 lg:items-start space-y-2.5 text-xs sm:text-sm"
        >
          <!-- Correo -->
          <div class="flex items-center gap-2.5 text-foreground truncate max-w-[280px]">
            <MailIcon class="size-3.5 text-muted-foreground shrink-0" />
            <a
              v-if="user.email"
              :href="`mailto:${user.email}`"
              class="text-primary hover:underline font-medium truncate"
              :title="user.email"
            >
              {{ user.email }}
            </a>
            <span v-else class="opacity-50 italic">Sin correo</span>
          </div>

          <!-- Teléfono -->
          <div class="flex items-center gap-2.5 text-foreground">
            <PhoneIcon class="size-3.5 text-muted-foreground shrink-0" />
            <a
              v-if="user.telefono"
              :href="`tel:${user.telefono}`"
              class="text-primary hover:underline font-medium"
            >
              {{ user.telefono }}
            </a>
            <span v-else class="opacity-50 italic">Sin teléfono</span>
          </div>

          <!-- Ubicación / Consultorio -->
          <div class="flex items-center gap-2.5 text-foreground truncate max-w-[280px]">
            <Building2Icon
              v-if="isDoctor || isReceptionist"
              class="size-3.5 text-muted-foreground shrink-0"
            />
            <MapPinIcon v-else class="size-3.5 text-muted-foreground shrink-0" />
            <span class="truncate text-xs">
              {{ user.consultorio || user.direccion || user.area || 'Consultorio Central' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 3. Métricas y Destacados según Rol -->
      <div
        class="flex-1 px-4 pt-5 border-t border-foreground/10 lg:mt-0 lg:border-0 lg:pt-0 flex flex-col justify-center items-center lg:items-end"
      >
        <div class="text-xs text-muted-foreground mb-3 text-center lg:text-right">
          Perfil del Sistema:<br />
          <span class="font-semibold text-foreground text-sm">Latidos Medical Office</span>
        </div>

        <div class="flex flex-wrap gap-2 justify-center lg:justify-end">
          <!-- Métricas Doctor -->
          <template v-if="isDoctor">
            <div
              class="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Consultas</div>
              <div class="text-base font-bold text-primary">{{ user.total_consultas || 0 }}</div>
            </div>
            <div
              class="rounded-xl border border-success/20 bg-success/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Citas Hoy</div>
              <div class="text-base font-bold text-success">{{ user.citas_hoy || 0 }}</div>
            </div>
          </template>

          <!-- Métricas Recepcionista -->
          <template v-else-if="isReceptionist">
            <div
              class="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Gestionadas Hoy</div>
              <div class="text-base font-bold text-primary">
                {{ user.citas_gestionadas_hoy || 0 }}
              </div>
            </div>
            <div
              class="rounded-xl border border-warning/20 bg-warning/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Pendientes</div>
              <div class="text-base font-bold text-warning">
                {{ user.solicitudes_pendientes || 0 }}
              </div>
            </div>
          </template>

          <!-- Métricas Paciente -->
          <template v-else>
            <div
              v-if="user.edad"
              class="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Edad</div>
              <div class="text-base font-bold text-primary">{{ user.edad }} años</div>
            </div>
            <div
              v-if="user.tutelados?.length"
              class="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-foreground/5 px-3 py-1.5 text-center"
            >
              <div class="text-xs text-muted-foreground">Dependientes</div>
              <div class="text-base font-bold text-foreground">
                {{ user.tutelados.length }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Barra de Tabs integrada al pie del Profile Box (Estilo Midone Icewall) -->
    <div class="px-5 py-3">
      <ul
        role="tablist"
        class="bg-foreground/5 relative z-0 flex h-10 w-full select-none items-center justify-center rounded-xl p-1 [&>*]:flex-1 mb-0"
      >
        <!-- Tab 1: Visión General -->
        <li role="presentation" class="z-20 w-full">
          <button
            class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium [&.active]:shadow gap-1.5 transition-colors"
            :class="{ active: activeTab === 'overview' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'overview'"
            @click="$emit('update:activeTab', 'overview')"
          >
            <UserIcon class="size-4 shrink-0" />
            <span class="hidden sm:inline">Visión General</span>
            <span class="sm:hidden">Perfil</span>
          </button>
        </li>

        <!-- Tab 2: Editar Información -->
        <li role="presentation" class="z-20 w-full">
          <button
            class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium [&.active]:shadow gap-1.5 transition-colors"
            :class="{ active: activeTab === 'edit' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'edit'"
            @click="$emit('update:activeTab', 'edit')"
          >
            <UserEditIcon class="size-4 shrink-0" />
            <span>Editar Datos</span>
          </button>
        </li>

        <!-- Tab 3: Seguridad y Contraseña -->
        <li role="presentation" class="z-20 w-full">
          <button
            class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium [&.active]:shadow gap-1.5 transition-colors"
            :class="{ active: activeTab === 'security' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'security'"
            @click="$emit('update:activeTab', 'security')"
          >
            <KeyRoundIcon class="size-4 shrink-0" />
            <span>Contraseña</span>
          </button>
        </li>

        <!-- Tab 4: Familiares / Dependientes (Solo para paciente / tutor) -->
        <li
          v-if="isPatient || user.es_tutor || (user.tutelados && user.tutelados.length > 0)"
          role="presentation"
          class="z-20 w-full"
        >
          <button
            class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium [&.active]:shadow gap-1.5 transition-colors"
            :class="{ active: activeTab === 'dependents' }"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'dependents'"
            @click="$emit('update:activeTab', 'dependents')"
          >
            <UsersIcon class="size-4 shrink-0" />
            <span class="hidden sm:inline">Familiares / Dependientes</span>
            <span class="sm:hidden">Familiares</span>
            <span
              v-if="user.tutelados?.length"
              class="ml-1 rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-primary"
            >
              {{ user.tutelados.length }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UserProfileData, ProfileTabType } from '../interfaces';
import AvatarBase from '@/modules/common/components/AvatarBase.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import UserIcon from '@/icons/UserIcon.vue';
import UserEditIcon from '@/icons/UserEditIcon.vue';
import {
  Camera as CameraIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Building2 as Building2Icon,
  MapPin as MapPinIcon,
  KeyRound as KeyRoundIcon,
  Users as UsersIcon,
} from 'lucide-vue-next';

interface Props {
  user: UserProfileData;
  activeTab: ProfileTabType;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'update:activeTab', tab: ProfileTabType): void;
  (e: 'change-avatar'): void;
}>();

const authStore = useAuthStore();
const activeRole = computed(() => authStore.activeRole?.toLowerCase().trim() || '');

const rolesNormalized = computed(() => {
  return (props.user.roles || []).map((r) => String(r).toLowerCase());
});

const isDoctor = computed(() => {
  if (authStore.isDualUser) {
    return activeRole.value === 'doctor';
  }
  return rolesNormalized.value.some((r) => ['doctor', 'medico', 'médico'].includes(r));
});

const isReceptionist = computed(() => {
  return rolesNormalized.value.some((r) => ['recepcionista', 'receptionist'].includes(r));
});

const isPatient = computed(() => {
  if (authStore.isDualUser) {
    return activeRole.value === 'patient';
  }
  return rolesNormalized.value.some((r) => ['paciente', 'patient'].includes(r));
});

const roleDisplayName = computed(() => {
  if (isDoctor.value) return 'Médico / Especialista';
  if (isReceptionist.value) return 'Recepcionista';
  if (isPatient.value) return 'Paciente Titular';
  if (rolesNormalized.value.includes('admin') || rolesNormalized.value.includes('administrador')) {
    return 'Administrador';
  }
  return 'Personal';
});

const roleSubtitle = computed(() => {
  if (isDoctor.value) return 'PERSONAL MÉDICO';
  if (isReceptionist.value) return 'PERSONAL DE RECEPCIÓN';
  if (isPatient.value) return 'EXPEDIENTE DE PACIENTE';
  return 'USUARIO';
});

const roleBadgeColor = computed(() => {
  if (isDoctor.value) return 'primary' as const;
  if (isReceptionist.value) return 'neutral' as const;
  if (isPatient.value) return 'success' as const;
  return 'primary' as const;
});
</script>
