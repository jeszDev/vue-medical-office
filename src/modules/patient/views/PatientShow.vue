<template>
  <TemplateView>
    <template #header>
      <div class="flex flex-wrap items-center gap-2.5 mr-auto">
        <h2 class="text-lg font-bold uppercase tracking-wider text-foreground">
          Información del Paciente
        </h2>
        <template v-if="patient?.nombre_completo">
          <span class="text-foreground/30 text-lg font-light select-none">/</span>
          <span class="text-lg sm:text-xl font-bold text-primary">
            {{ patient.nombre_completo }}
          </span>
          <span
            v-if="patient?.edad"
            class="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20"
          >
            {{ patient.edad }} años
          </span>
        </template>
      </div>
    </template>
    <template #main>
      <FullScreenLoader v-if="isLoading" />

      <template v-else>
        <div
          class="box p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md relative mt-5"
        >
          <div class="tabs relative w-full">
            <ul
              role="tablist"
              class="bg-foreground/5 relative z-0 mb-2 flex h-10 w-full select-none items-center justify-center rounded-xl p-1 [&>*]:flex-1"
            >
              <li role="presentation" class="z-20 w-full">
                <button
                  class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
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
                  class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
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
                  class="[&.active]:bg-background inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 font-medium [&.active]:shadow"
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
                  <FolderArchive class="size-4" />
                  Estudios y Documentos
                </button>
              </li>
            </ul>
            <div class="tab-content mt-3.5 rounded-xl border p-5">
              <KeepAlive>
                <component :is="currentTabComponent" :patient="patient" :patient-id="patientId" />
              </KeepAlive>
            </div>
          </div>
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
import { FolderArchive } from 'lucide-vue-next';

import TemplateView from '@/modules/template/components/TemplateView.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';

import PatientAppointmentsIndex from '@/modules/patient/views/PatientAppointmentsIndex.vue';
import PatientShowInformation from '@/modules/patient/views/PatientShowInformation.vue';
import PatientConsultationsIndex from '@/modules/patient/views/PatientConsultationsIndex.vue';
import PatientDocumentsTab from '@/modules/clinical-document/components/PatientDocumentsTab.vue';

interface Props {
  patientId: string;
}

type PatientTab = 'information' | 'appointments' | 'consultations' | 'documents';

const props = defineProps<Props>();

const route = useRoute();
const router = useRouter();
const activeTab = ref<PatientTab>((route.query.tab as PatientTab) || 'information');
const { setBreadcrumbs } = useBreadcrumb();

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
