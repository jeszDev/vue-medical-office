<template>
  <FullScreenLoader v-if="!patient" />
  <div v-else class="space-y-6">
    <div class="grid grid-cols-12 gap-6">
      <!-- Columna Izquierda: Ficha de Identificación Técnica -->
      <div class="col-span-12 lg:col-span-5 xl:col-span-4">
        <div class="rounded-xl border border-foreground/10 bg-background/60 p-5 shadow-xs">
          <!-- Cabecera de la ficha técnica -->
          <div class="flex items-center justify-between border-b border-foreground/10 pb-3.5 mb-4">
            <div class="flex items-center gap-2.5">
              <IconBadge color="primary">
                <UserIcon class="size-4" />
              </IconBadge>
              <div>
                <h4 class="text-sm font-semibold text-foreground">
                  Ficha Técnica del Paciente
                </h4>
                <p class="text-xs text-muted-foreground">
                  Datos de registro y contacto oficial
                </p>
              </div>
            </div>
          </div>

          <!-- Listado con Puntos Indicadores de Midone (Componente atómico DetailListItem) -->
          <div class="space-y-3.5">
            <!-- Nombre Completo -->
            <DetailListItem
              label="Nombre"
              dot-color="primary"
              :value="patient.nombre_completo"
            />
            <!-- Teléfono -->
            <DetailListItem label="Teléfono" dot-color="success">
              <a
                v-if="patient.telefono"
                :href="`tel:${patient.telefono}`"
                class="text-primary hover:underline font-medium text-xs sm:text-sm"
                :title="patient.telefono"
              >
                {{ patient.telefono }}
              </a>
              <span v-else class="text-xs opacity-50 italic">Sin registrar</span>
            </DetailListItem>

            <!-- Correo electrónico -->
            <DetailListItem label="Correo" dot-color="primary" value-classes="max-w-[190px]">
              <a
                v-if="patient.correo_electronico"
                :href="`mailto:${patient.correo_electronico}`"
                class="text-primary hover:underline font-medium text-xs sm:text-sm truncate block"
                :title="patient.correo_electronico"
              >
                {{ patient.correo_electronico }}
              </a>
              <span v-else class="text-xs opacity-50 italic">Sin registrar</span>
            </DetailListItem>

            <!-- CURP -->
            <DetailListItem label="CURP" dot-color="warning">
              <div class="flex items-center gap-1.5 justify-end">
                <span
                  v-if="patient.curp"
                  class="font-mono text-xs sm:text-sm font-semibold tracking-wider text-foreground"
                >
                  {{ patient.curp }}
                </span>
                <span v-else class="text-xs opacity-50 italic">No registrada</span>

                <button
                  v-if="patient.curp"
                  type="button"
                  @click="copyCurp(patient.curp)"
                  class="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-foreground/5 cursor-pointer"
                  title="Copiar CURP"
                >
                  <Check v-if="copiedCurp" class="size-3.5 text-success" />
                  <Copy v-else class="size-3.5" />
                </button>
              </div>
            </DetailListItem>

            <!-- Fecha de Nacimiento -->
            <DetailListItem
              label="Nacimiento"
              dot-color="pending"
              :value="patient.fecha_nacimiento"
              empty-text="No registrada"
            />

            <!-- Registro en Sistema -->
            <DetailListItem
              label="Registro"
              dot-color="foreground"
              :value="patient.creado_el || 'Reciente'"
            />
          </div>

          <!-- Acciones integradas del paciente -->
          <div class="border-t border-foreground/10 pt-4 mt-5 space-y-2">
            <ButtonBase
              text="Editar datos del paciente"
              :icon="UserEditIcon"
              color="secondary"
              class="w-full justify-center"
              data-tw-toggle="modal"
              data-tw-target="#modal-patient-create-or-edit"
            />
            <ButtonBase
              text="Eliminar paciente"
              :icon="UserDeleteIcon"
              color="danger"
              class="w-full justify-center"
            />
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Clínica & Atajos del Expediente -->
      <div class="col-span-12 lg:col-span-7 xl:col-span-8 space-y-5">
        <!-- Tarjeta de Observaciones y Antecedentes Clínicos -->
        <div class="rounded-xl border border-foreground/10 bg-background/60 p-5 shadow-xs">
          <div class="flex items-center justify-between border-b border-foreground/10 pb-3.5 mb-4">
            <div class="flex items-center gap-2.5">
              <IconBadge color="primary">
                <MessageSquareText class="size-4" />
              </IconBadge>
              <div>
                <h4 class="text-sm font-semibold text-foreground">
                  Antecedentes y Observaciones Clínicas
                </h4>
                <p class="text-xs text-muted-foreground">
                  Notas generales y consideraciones médicas registradas
                </p>
              </div>
            </div>

            <button
              type="button"
              data-tw-toggle="modal"
              data-tw-target="#modal-patient-create-or-edit"
              class="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit3 class="size-3.5" />
              Editar nota
            </button>
          </div>

          <!-- Contenido de notas médicas -->
          <div
            v-if="patient.observaciones && patient.observaciones.trim().length > 0"
            class="rounded-xl border border-primary/20 bg-primary/[0.02] p-4 border-l-4 border-l-primary"
          >
            <p class="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {{ patient.observaciones }}
            </p>
          </div>

          <!-- Empty state si no hay notas médicas -->
          <div
            v-else
            class="rounded-xl border border-dashed border-foreground/15 p-6 text-center bg-foreground/[0.01]"
          >
            <div
              class="mx-auto size-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground mb-2"
            >
              <ClipboardList class="size-5" />
            </div>
            <p class="text-sm font-medium text-foreground/80">
              Sin antecedentes ni observaciones clínicas
            </p>
            <p class="text-xs text-muted-foreground mt-1">
              Puedes registrar antecedentes, alergias o notas médicas relevantes editando los datos del paciente.
            </p>
            <button
              type="button"
              data-tw-toggle="modal"
              data-tw-target="#modal-patient-create-or-edit"
              class="mt-3 text-xs text-primary font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              + Agregar notas médicas
            </button>
          </div>
        </div>

        <!-- Atajos Rápidos del Expediente (Estilo Midone Profile Overview) -->
        <div>
          <div class="flex items-center justify-between mb-3 px-0.5">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Accesos Rápidos del Expediente
            </h4>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <!-- Agenda -->
            <div
              @click="goToTab('appointments')"
              class="group cursor-pointer rounded-xl border border-foreground/10 bg-background/60 p-4 transition-all hover:border-primary/40 hover:shadow-xs hover:-translate-y-0.5 select-none"
            >
              <div class="flex items-center justify-between mb-2.5">
                <IconBadge color="primary">
                  <Calendar class="size-4" />
                </IconBadge>
                <ArrowRight
                  class="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div class="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Agenda de Citas
              </div>
              <p class="text-xs text-muted-foreground mt-1 leading-snug">
                Programar nueva cita o revisar citas activas y pasadas.
              </p>
            </div>

            <!-- Historial Clínico -->
            <div
              @click="goToTab('consultations')"
              class="group cursor-pointer rounded-xl border border-foreground/10 bg-background/60 p-4 transition-all hover:border-success/40 hover:shadow-xs hover:-translate-y-0.5 select-none"
            >
              <div class="flex items-center justify-between mb-2.5">
                <IconBadge color="success">
                  <Stethoscope class="size-4" />
                </IconBadge>
                <ArrowRight
                  class="size-4 text-muted-foreground group-hover:text-success group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div class="text-sm font-semibold text-foreground group-hover:text-success transition-colors">
                Historial Clínico
              </div>
              <p class="text-xs text-muted-foreground mt-1 leading-snug">
                Consultas médicas previas, recetas y notas de evolución.
              </p>
            </div>

            <!-- Estudios y Documentos -->
            <div
              @click="goToTab('documents')"
              class="group cursor-pointer rounded-xl border border-foreground/10 bg-background/60 p-4 transition-all hover:border-warning/40 hover:shadow-xs hover:-translate-y-0.5 select-none"
            >
              <div class="flex items-center justify-between mb-2.5">
                <IconBadge color="warning">
                  <FolderArchive class="size-4" />
                </IconBadge>
                <ArrowRight
                  class="size-4 text-muted-foreground group-hover:text-warning group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <div class="text-sm font-semibold text-foreground group-hover:text-warning transition-colors">
                Estudios y Archivos
              </div>
              <p class="text-xs text-muted-foreground mt-1 leading-snug">
                Expediente digital, análisis clínicos y documentos adjuntos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import DetailListItem from '@/modules/common/components/DetailListItem.vue';
import IconBadge from '@/modules/common/components/IconBadge.vue';

import UserIcon from '@/icons/UserIcon.vue';
import UserEditIcon from '@/icons/UserEditIcon.vue';
import UserDeleteIcon from '@/icons/UserDeleteIcon.vue';

import {
  Calendar,
  Stethoscope,
  FolderArchive,
  ArrowRight,
  Edit3,
  Copy,
  Check,
  ClipboardList,
  MessageSquareText,
} from 'lucide-vue-next';

import type { Patient } from '../interfaces/patient.interface';

interface Props {
  patient: Patient | undefined;
}

defineProps<Props>();

const route = useRoute();
const router = useRouter();
const toast = useToast();

const copiedCurp = ref(false);

const copyCurp = async (curpText: string) => {
  if (!curpText) return;
  try {
    await navigator.clipboard.writeText(curpText);
    copiedCurp.value = true;
    toast.success('CURP copiada al portapapeles');
    setTimeout(() => {
      copiedCurp.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error al copiar CURP:', err);
  }
};

const goToTab = (tabName: 'appointments' | 'consultations' | 'documents') => {
  router.replace({ query: { ...route.query, tab: tabName } });
};
</script>

<style scoped></style>

