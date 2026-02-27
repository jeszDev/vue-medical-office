<template>
  <TemplateView :title="`INFORMACIÓN DEL PACIENTE - ${patient.nombre_completo}`">
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
                  @click="activeTab = 'information'"
                >
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
                  @click="activeTab = 'appointments'"
                >
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
                  @click="activeTab = 'consultations'"
                >
                  Historial clínico
                </button>
              </li>
            </ul>
            <div class="tab-content mt-3.5 rounded-xl border p-5">
              <!-- <div
                class="tab-pane hidden [&.active]:block"
                :class="{ active: activeTab === 'information' }"
                role="tabpanel"
              >
                <PatientShowInformation
                  v-if="activeTab === 'information'"
                  :patient-id="patientId"
                />
              </div>
              <div
                class="tab-pane hidden [&.active]:block"
                :class="{ active: activeTab === 'appointments' }"
                role="tabpanel"
              >
                <PatientAppointmentsIndex
                  v-else-if="activeTab === 'appointments'"
                  :patient-id="patientId"
                />
              </div>
              <div
                class="tab-pane hidden [&.active]:block"
                :class="{ active: activeTab === 'consultations' }"
                role="tabpanel"
              >
                <PatientConsultationsIndex
                  v-else-if="activeTab === 'consultations'"
                  :patient-id="patientId"
                />
              </div> -->

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
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getPatientByIdAction } from '../actions/get-patient-by-id.action';

import TemplateView from '@/modules/template/components/TemplateView.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';

import PatientAppointmentsIndex from '@/modules/patient/views/PatientAppointmentsIndex.vue';
import PatientShowInformation from '@/modules/patient/views/PatientShowInformation.vue';
import PatientConsultationsIndex from '@/modules/patient/views/PatientConsultationsIndex.vue';

interface Props {
  patientId: string;
}

type PatientTab = 'information' | 'appointments' | 'consultations';

const props = defineProps<Props>();

const activeTab = ref<PatientTab>('information');

const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'appointments':
      return PatientAppointmentsIndex;
    case 'consultations':
      return PatientConsultationsIndex;
    default:
      return PatientShowInformation;
  }
});

const { data: patient, isLoading } = useQuery({
  queryKey: ['patient', props.patientId],
  queryFn: () => getPatientByIdAction(props.patientId),
});
</script>

<style scoped></style>
