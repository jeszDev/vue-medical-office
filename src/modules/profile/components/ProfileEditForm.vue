<template>
  <div class="space-y-6">
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
    >
      <div class="flex items-center gap-3 pb-4 mb-6 border-b border-foreground/10">
        <IconBadge color="primary" size="md">
          <UserEditIcon class="size-5 text-primary" />
        </IconBadge>
        <div>
          <h3 class="text-base font-bold text-foreground">Actualizar Información del Perfil</h3>
          <p class="text-xs text-muted-foreground mt-0.5">
            Modifica tus datos personales y de contacto registrados en el sistema
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- 1. Información General y de Contacto -->
        <div>
          <h4 class="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
            Información General y Contacto
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nombre Completo -->
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1.5">
                Nombre Completo *
              </label>
              <InputBase
                v-model="form.name"
                name="name"
                placeholder="Ingresa tu nombre completo"
                :error="errors.name"
              />
            </div>

            <!-- Correo Electrónico -->
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1.5">
                Correo Electrónico *
              </label>
              <InputBase
                v-model="form.email"
                name="email"
                type="email"
                placeholder="ejemplo@correo.com"
                :error="errors.email"
              />
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1.5">
                Teléfono de Contacto
              </label>
              <InputBase
                v-model="form.telefono"
                name="telefono"
                type="tel"
                placeholder="55-1234-5678"
              />
            </div>

            <!-- Dirección / Domicilio -->
            <div>
              <label class="block text-xs font-semibold text-foreground mb-1.5">
                Domicilio / Dirección
              </label>
              <InputBase
                v-model="form.direccion"
                name="direccion"
                placeholder="Calle, número, colonia, ciudad"
              />
            </div>
          </div>
        </div>

        <!-- 2. Información Específica del Rol -->
        <div class="mt-6 pt-6 border-t border-foreground/10">
          <!-- Campos para Doctor -->
          <template v-if="isDoctor">
            <h4 class="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
              Datos Profesionales y de Consulta
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Especialidad Médica
                </label>
                <InputBase
                  v-model="form.especialidad"
                  name="especialidad"
                  placeholder="Ej. Medicina General, Pediatría"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Cédula Profesional
                </label>
                <InputBase
                  v-model="form.cedula_profesional"
                  name="cedula_profesional"
                  placeholder="Ej. CED-1234567"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Consultorio / Torre
                </label>
                <InputBase
                  v-model="form.consultorio"
                  name="consultorio"
                  placeholder="Ej. Consultorio 102 - Torre A"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Horario de Atención
                </label>
                <InputBase
                  v-model="form.horario_atencion"
                  name="horario_atencion"
                  placeholder="Ej. Lunes a Viernes 09:00 - 17:00 hrs"
                />
              </div>
            </div>
          </template>

          <!-- Campos para Recepcionista -->
          <template v-else-if="isReceptionist">
            <h4 class="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
              Asignación Operativa
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Turno de Atención
                </label>
                <InputBase
                  v-model="form.turno"
                  name="turno"
                  placeholder="Ej. Matutino (08:00 - 15:00 hrs)"
                />
              </div>
            </div>
          </template>

          <!-- Campos para Paciente -->
          <template v-else>
            <h4 class="text-xs uppercase tracking-wider font-semibold text-primary mb-3">
              Contacto de Emergencia
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Nombre de Contacto de Emergencia
                </label>
                <InputBase
                  v-model="form.contacto_emergencia_nombre"
                  name="contacto_emergencia_nombre"
                  placeholder="Familiar o contacto de confianza"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-foreground mb-1.5">
                  Teléfono de Emergencia
                </label>
                <InputBase
                  v-model="form.contacto_emergencia_telefono"
                  name="contacto_emergencia_telefono"
                  type="tel"
                  placeholder="Teléfono directo del contacto"
                />
              </div>
            </div>
          </template>
        </div>

        <!-- Botones de Acción -->
        <div class="mt-8 pt-5 border-t border-foreground/10 flex items-center justify-end gap-3">
          <ButtonBase
            text="Cancelar"
            color="secondary"
            type="button"
            @click="$emit('cancel')"
          />
          <ButtonBase
            text="Guardar Cambios"
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
import type { UserProfileData, UpdateProfilePayload } from '../interfaces';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import InputBase from '@/modules/common/components/InputBase.vue';
import UserEditIcon from '@/icons/UserEditIcon.vue';

interface Props {
  user: UserProfileData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'submit', payload: UpdateProfilePayload): void;
  (e: 'cancel'): void;
}>();

const isSubmitting = ref(false);
const errors = reactive<Record<string, string>>({});

const rolesNormalized = computed(() => {
  return (props.user.roles || []).map((r) => String(r).toLowerCase());
});

const isDoctor = computed(() => {
  return rolesNormalized.value.some((r) => ['doctor', 'medico', 'médico'].includes(r));
});

const isReceptionist = computed(() => {
  return rolesNormalized.value.includes('recepcionista');
});

const form = reactive<UpdateProfilePayload>({
  name: props.user.name || '',
  email: props.user.email || '',
  telefono: props.user.telefono || '',
  direccion: props.user.direccion || '',
  especialidad: props.user.especialidad || '',
  cedula_profesional: props.user.cedula_profesional || '',
  consultorio: props.user.consultorio || '',
  horario_atencion: props.user.horario_atencion || '',
  turno: props.user.turno || '',
  contacto_emergencia_nombre: props.user.contacto_emergencia_nombre || '',
  contacto_emergencia_telefono: props.user.contacto_emergencia_telefono || '',
});

const handleSubmit = () => {
  errors.name = '';
  errors.email = '';

  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido.';
    return;
  }

  if (!form.email.trim()) {
    errors.email = 'El correo electrónico es requerido.';
    return;
  }

  emit('submit', { ...form });
};
</script>
