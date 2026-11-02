<template>
  <TemplateView title="Detalle del paciente">
    <template #main>
      <FullScreenLoader v-if="isLoading" />

      <template v-else>
        <div class="tabs relative w-full">
          <!-- BEGIN: Profile Info Box estilo Midone (icewall-side-menu-profile-overview-1.html) -->
          <div
            class="box relative before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md p-0 mt-5"
          >
            <!-- Cabecera del Paciente -->
            <div class="flex flex-col p-5 border-b border-foreground/10 lg:flex-row">
              <!-- 1. Avatar e Identificación del Paciente -->
              <div class="flex items-center justify-center flex-1 px-5 lg:justify-start">
                <AvatarBase
                  :src="patient?.avatar"
                  :name="patient?.nombre_completo || patient?.nombre"
                  fallback-text="P"
                  size="xl"
                />
                <div class="ml-5 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      PACIENTE
                    </span>
                    <PillBadge
                      color="success"
                      size="xs"
                      label="Expediente activo"
                    />
                  </div>
                  <h3
                    class="text-lg lg:text-xl font-bold text-foreground truncate mt-0.5"
                    :title="patient?.nombre_completo"
                  >
                    {{ patient?.nombre_completo }}
                  </h3>
                  <div class="mt-1.5 flex flex-wrap items-center gap-2">
                    <span class="text-xs font-mono text-muted-foreground font-semibold">
                      #PAC-{{ String(patient?.id || patientId).padStart(5, '0') }}
                    </span>
                    <PillBadge
                      v-if="patient?.edad"
                      size="xs"
                      color="primary"
                      :label="`${patient.edad} años`"
                    />
                  </div>
                </div>
              </div>

              <!-- 2. Datos de Contacto Rápido -->
              <div
                class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r border-foreground/10 lg:mt-0 lg:border-t-0 lg:pt-0"
              >
                <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center lg:text-left">
                  Datos de Contacto
                </div>
                <div class="flex flex-col items-center justify-center mt-2 lg:items-start space-y-2 text-xs sm:text-sm">
                  <!-- Teléfono -->
                  <div class="flex items-center gap-2 text-foreground">
                    <Phone class="size-3.5 text-muted-foreground shrink-0" />
                    <a
                      v-if="patient?.telefono"
                      :href="`tel:${patient.telefono}`"
                      class="text-primary hover:underline font-medium"
                    >
                      {{ patient.telefono }}
                    </a>
                    <span v-else class="opacity-50 italic">Sin teléfono registrado</span>
                  </div>
                  <!-- Correo -->
                  <div class="flex items-center gap-2 text-foreground truncate max-w-[280px]">
                    <Mail class="size-3.5 text-muted-foreground shrink-0" />
                    <a
                      v-if="patient?.correo_electronico"
                      :href="`mailto:${patient.correo_electronico}`"
                      class="text-primary hover:underline font-medium truncate block"
                      :title="patient.correo_electronico"
                    >
                      {{ patient.correo_electronico }}
                    </a>
                    <span v-else class="opacity-50 italic">Sin correo registrado</span>
                  </div>
                  <!-- CURP -->
                  <div class="flex items-center gap-2 text-foreground">
                    <FileText class="size-3.5 text-muted-foreground shrink-0" />
                    <span v-if="patient?.curp" class="font-mono text-xs font-semibold tracking-wider">
                      {{ patient.curp }}
                    </span>
                    <span v-else class="opacity-50 italic">CURP no registrada</span>
                  </div>
                </div>
              </div>

              <!-- 3. Registro y Acciones rápidas -->
              <div
                class="flex-1 px-5 pt-5 mt-6 border-t border-foreground/10 lg:mt-0 lg:border-0 lg:pt-0 flex flex-col justify-center items-center lg:items-end"
              >
                <div class="text-xs text-muted-foreground mb-3 text-center lg:text-right">
                  Fecha de registro:<br />
                  <span class="font-medium text-foreground text-sm">{{ patient?.creado_el || 'Reciente' }}</span>
                </div>
                <div
                  v-if="can(PERMISSIONS.PATIENTS_UPDATE)"
                  class="flex flex-wrap gap-2 justify-center lg:justify-end"
                >
                  <ButtonBase
                    text="Editar datos"
                    :icon="UserEditIcon"
                    color="secondary"
                    size="sm"
                    data-tw-toggle="modal"
                    data-tw-target="#modal-patient-create-or-edit"
                  />
                </div>
              </div>
            </div>

            <!-- Barra de Tabs integrada al pie del Profile Box -->
            <div class="px-5 py-3">
              <ul
                role="tablist"
                class="bg-foreground/5 relative z-0 flex h-10 w-full select-none items-center justify-center rounded-xl p-1 [&>*]:flex-1 mb-0"
              >
                <li role="presentation" class="z-20 w-full">
                  <button
                    class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow gap-1.5"
                    :class="{ active: activeTab === 'information' }"
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'information'"
                    @click="changeTab('information')"
                  >
                    <UserIcon />
                    Información
                  </button>
                </li>
                <li role="presentation" class="z-20 w-full">
                  <button
                    class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow gap-1.5"
                    :class="{ active: activeTab === 'appointments' }"
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'appointments'"
                    @click="changeTab('appointments')"
                  >
                    <CalendarIcon />
                    Agenda
                  </button>
                </li>
                <li role="presentation" class="z-20 w-full">
                  <button
                    class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow gap-1.5"
                    :class="{ active: activeTab === 'consultations' }"
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'consultations'"
                    @click="changeTab('consultations')"
                  >
                    <FileTextIcon />
                    Historial clínico
                  </button>
                </li>
                <li role="presentation" class="z-20 w-full">
                  <button
                    class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow gap-1.5"
                    :class="{ active: activeTab === 'documents' }"
                    type="button"
                    role="tab"
                    :aria-selected="activeTab === 'documents'"
                    @click="changeTab('documents')"
                  >
                    <FolderArchiveIcon />
                    Estudios y Documentos
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <!-- END: Profile Info Box -->

          <!-- Tab Content (Active view) -->
          <div class="tab-content mt-5">
            <KeepAlive>
              <component :is="currentTabComponent" :patient="patient" :patient-id="patientId" />
            </KeepAlive>
          </div>

          <!-- Modal para editar datos del paciente (disponible globalmente en cualquier tab) -->
          <DialogBasic id="modal-patient-create-or-edit" size="3xl">
            <PatientCreate
              v-if="patient"
              :patient-id="String(patient.id)"
              :is-inside-modal="true"
            />
          </DialogBasic>
        </div>
      </template>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import { getPatientByIdAction } from '../actions/get-patient-by-id.action';
import { useBreadcrumb } from '@/modules/common/composables/useBreadcrumb';

import CalendarIcon from '@/icons/CalendarIcon.vue';
import FileTextIcon from '@/icons/FileTextIcon.vue';
import UserIcon from '@/icons/UserIcon.vue';
import UserEditIcon from '@/icons/UserEditIcon.vue';
import FolderArchiveIcon from '@/icons/FolderArchiveIcon.vue';
import { Phone, Mail, FileText } from 'lucide-vue-next';

import TemplateView from '@/modules/template/components/TemplateView.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import AvatarBase from '@/modules/common/components/AvatarBase.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import PatientCreate from '@/modules/patient/views/PatientCreate.vue';

import PatientAppointmentsIndex from '@/modules/patient/views/PatientAppointmentsIndex.vue';
import PatientShowInformation from '@/modules/patient/views/PatientShowInformation.vue';
import PatientConsultationsIndex from '@/modules/patient/views/PatientConsultationsIndex.vue';
import PatientDocumentsTab from '@/modules/clinical-document/components/PatientDocumentsTab.vue';
import { usePermissions } from '@/modules/auth/composables/usePermissions';
import { PERMISSIONS } from '@/modules/auth/constants/permissions.constant';

interface Props {
  patientId: string;
}

type PatientTab = 'information' | 'appointments' | 'consultations' | 'documents';

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();
const activeTab = ref<PatientTab>((route.query.tab as PatientTab) || 'information');
const { setBreadcrumbs } = useBreadcrumb();
const { can } = usePermissions();

// Al cambiar de tab actualizas la query sin recargar:
const changeTab = (tab: PatientTab) => {
  activeTab.value = tab;
  router.replace({ query: { ...route.query, tab } });
};

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'appointments':
      return PatientAppointmentsIndex;
    case 'consultations':
      return PatientConsultationsIndex;
    case 'documents':
      return PatientDocumentsTab;
    default:
      return PatientShowInformation;
  }
});

const { data: patient, isLoading } = useQuery({
  queryKey: ['patient', props.patientId],
  queryFn: () => getPatientByIdAction(props.patientId),
});

const tabLabels: Record<PatientTab, string> = {
  information: 'Información',
  appointments: 'Agenda',
  consultations: 'Historial clínico',
  documents: 'Estudios y Documentos',
};

const updatePatientBreadcrumbs = () => {
  const patientName = patient.value?.nombre_completo || 'Detalle del Paciente';
  const tabLabel = tabLabels[activeTab.value] || 'Información';

  setBreadcrumbs([
    { title: 'Pacientes', routeName: 'patients.index' },
    { title: `${patientName} (${tabLabel})` },
  ]);
};

watch([patient, activeTab], updatePatientBreadcrumbs, { immediate: true });

watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab && newTab !== activeTab.value && Object.keys(tabLabels).includes(newTab as string)) {
      activeTab.value = newTab as PatientTab;
    }
  },
);
</script>

<style scoped></style>
