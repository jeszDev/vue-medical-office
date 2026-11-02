<template>
  <div class="space-y-6">
    <div
      class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-5"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/10">
        <div class="flex items-center gap-3">
          <IconBadge color="primary" size="md">
            <UsersIcon class="size-5 text-primary" />
          </IconBadge>
          <div>
            <h3 class="text-base font-bold text-foreground">
              Familiares y Dependientes (Tutor / Padres)
            </h3>
            <p class="text-xs text-muted-foreground mt-0.5">
              Pacientes vinculados a tu expediente bajo tu tutela o representación legal
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <PillBadge
            color="primary"
            size="md"
            :label="`${dependents.length} ${dependents.length === 1 ? 'dependiente' : 'dependientes'}`"
          />
        </div>
      </div>

      <!-- Lista de tarjetas de dependientes -->
      <div v-if="dependents.length" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div
          v-for="dep in dependents"
          :key="dep.id"
          class="rounded-xl border border-foreground/10 bg-background/60 p-4 hover:border-primary/40 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3">
                <AvatarBase
                  :name="dep.nombre_completo"
                  fallback-text="D"
                  size="md"
                  shape="circle"
                />
                <div>
                  <h4 class="text-sm font-bold text-foreground">
                    {{ dep.nombre_completo }}
                  </h4>
                  <div class="flex items-center gap-2 mt-0.5">
                    <PillBadge
                      color="neutral"
                      size="xs"
                      :label="dep.parentesco"
                    />
                    <span v-if="dep.edad" class="text-xs text-muted-foreground">
                      {{ dep.edad }} años
                    </span>
                  </div>
                </div>
              </div>

              <span
                v-if="dep.folio_expediente"
                class="font-mono text-xs font-semibold text-primary"
              >
                {{ dep.folio_expediente }}
              </span>
            </div>

            <!-- Datos clave del dependiente con DetailListItem -->
            <div class="mt-4 space-y-2 border-t border-foreground/5 pt-3">
              <DetailListItem
                v-if="dep.curp"
                label="CURP"
                dot-color="neutral"
                :value="dep.curp"
              />

              <DetailListItem
                v-if="dep.fecha_nacimiento"
                label="Nacimiento"
                dot-color="neutral"
                :value="dep.fecha_nacimiento"
              />

              <DetailListItem
                v-if="dep.alergias"
                label="Alergias"
                dot-color="danger"
                :value="dep.alergias"
              />
            </div>
          </div>

          <!-- Acciones para el dependiente -->
          <div class="mt-4 pt-3 border-t border-foreground/10 flex flex-wrap items-center justify-end gap-2">
            <ButtonBase
              text="Agendar Cita"
              :icon="CalendarIcon"
              color="secondary"
              size="sm"
              @click="$router.push({ name: 'appointments.create' })"
            />
            <ButtonBase
              v-if="dep.id"
              text="Ver Expediente"
              :icon="PreviewIcon"
              color="primary"
              size="sm"
              @click="$router.push({ name: 'patients.show', params: { patientId: String(dep.id) } })"
            />
          </div>
        </div>
      </div>

      <!-- Estado vacío si no hay dependientes -->
      <div v-else class="py-10 text-center flex flex-col items-center justify-center">
        <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
          <UsersIcon class="size-6" />
        </div>
        <h4 class="text-sm font-bold text-foreground">No hay dependientes registrados</h4>
        <p class="text-xs text-muted-foreground max-w-sm mt-1">
          Si eres padre, madre o tutor legal de un paciente menor o dependiente, puedes solicitar en recepción la vinculación de su expediente.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { ProfileDependent } from '../interfaces';
import IconBadge from '@/modules/common/components/IconBadge.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import AvatarBase from '@/modules/common/components/AvatarBase.vue';
import DetailListItem from '@/modules/common/components/DetailListItem.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import CalendarIcon from '@/icons/CalendarIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import { Users as UsersIcon } from 'lucide-vue-next';

interface Props {
  dependents?: ProfileDependent[];
}

withDefaults(defineProps<Props>(), {
  dependents: () => [],
});

const $router = useRouter();
</script>
