<template>
  <FullScreenLoader v-if="isLoading" />
  <TemplateView v-else :title="`AGENDA`">
    <template #main>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-2 flex flex-wrap items-center sm:flex-nowrap">
          <!-- <button
            class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 px-4 py-2 box mr-2"
            @click="handleModalCreateUpdate('create')"
          >
            Registrar nuevo paciente
          </button> -->
          <ButtonBase
            text="Nueva cita"
            :icon="PlusIcon"
            color="primary"
            data-tw-toggle="modal"
            data-tw-target="#modal-appointment-create-or-edit"
          />
          <!-- <div data-tw-placement="bottom-end" class="dropdown">
            <button
              class="[--color:var(--color-foreground)] border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-(--color) hover:bg-(--color)/5 bg-background border-(--color)/20 h-10 py-2 dropdown-toggle inline-flex cursor-pointer relative z-[51] box px-2"
              data-tw-toggle="dropdown"
            >
              <span class="flex h-5 w-5 items-center justify-center">
                <i
                  data-lucide="plus"
                  class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 size-4"
                ></i>
              </span>
            </button>
            <div
              class="box before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md dropdown-menu invisible absolute z-50 p-1 opacity-0 before:backdrop-blur-xl [&.show]:visible [&.show]:opacity-100"
            >
              <div class="dropdown-content w-40">
                <a
                  class="relative flex cursor-default select-none hover:bg-foreground/5 items-center rounded-lg px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <i
                    data-lucide="printer"
                    class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                  ></i>
                  Print
                </a>
                <a
                  class="relative flex cursor-default select-none hover:bg-foreground/5 items-center rounded-lg px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <i
                    data-lucide="file-text"
                    class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                  ></i>
                  Export to Excel
                </a>
                <a
                  class="relative flex cursor-default select-none hover:bg-foreground/5 items-center rounded-lg px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <i
                    data-lucide="file-text"
                    class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 mr-2 size-4"
                  ></i>
                  Export to PDF
                </a>
              </div>
            </div>
          </div> -->
          <!-- <div class="mx-auto hidden opacity-70 md:block">
            Mostrando los registros del {{ pagination.from }} al {{ pagination.to }} de
            {{ pagination.total }} registros
          </div> -->
          <!-- <div class="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
            <div class="relative w-56">
              <input
                class="h-10 rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box w-56 pr-10"
                type="text"
                placeholder="Buscar..."
                v-model="search"
                @keyup.enter="doSearch"
              />
              <SearchIcon class="cursor-pointer" @click="doSearch" />
            </div>
          </div> -->
        </div>
        <div class="col-span-12 overflow-auto lg:overflow-visible">
          <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom border-separate border-spacing-y-[10px] -mt-2">
              <thead class="[&_tr]:border-b-0 [&_tr_th]:h-10">
                <tr
                  class="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-b-0"
                >
                  <th
                    class="h-12 px-4 text-center font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    #
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    FECHA
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    HORA
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    MÉDICO
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    MOTIVO
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    ESTATUS
                  </th>
                  <th
                    class="h-12 px-4 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-center"
                  >
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0">
                <tr v-if="!appointments?.length">
                  <td
                    colspan="7"
                    class="text-center shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                  >
                    El paciente no tiene citas registradas.
                  </td>
                </tr>
                <template v-else v-for="(appointment, index) in appointments" :key="appointment.id">
                  <tr
                    class="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-b-0"
                  >
                    <td
                      width="5%"
                      class="text-center shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.fecha_inicio }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.hora_inicio }} - {{ appointment.hora_termino }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.medico }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.motivo }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <PillBadge
                        size="sm"
                        :color="getAppointmentStatusColor(appointment.estatus)"
                        :label="appointment.estatus"
                      />
                    </td>
                    <td
                      width="20%"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex items-center justify-center gap-3">
                        <!-- <span @click="toggleRow(appointment.id)">
                          {{ expandedRow === appointment.id ? 'Ocultar' : 'Ver' }}
                        </span> -->

                        <div v-if="expandedRow != appointment.id">
                          <PreviewIcon class="cursor-pointer" @click="toggleRow(appointment.id)" />
                        </div>
                        <div v-else>
                          <PreviewHideIcon
                            class="cursor-pointer"
                            @click="toggleRow(appointment.id)"
                          />
                        </div>
                        <div>
                          <CancelIcon
                            class="cursor-pointer"
                            @click="openCancelModal(appointment.id)"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="expandedRow === appointment.id" class="">
                    <td
                      colspan="7"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="grid grid-cols-12 mt-6 gap-x-10 gap-y-9">
                        <div class="col-span-6 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">MOTIVO DE LA CONSULTA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">4.501</div>
                            <div
                              class="text-(--color) flex cursor-pointer items-center rounded-full border px-2 py-px text-xs tooltip border-transparent bg-transparent [--color:var(--color-success)]"
                              data-content="9% Higher than last month"
                            >
                              2%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                data-lucide="chevron-down"
                                class="lucide lucide-chevron-down size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 ml-0.5"
                              >
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">PESO (kg)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">2</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">ALTURA (cm)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">$72.000</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">TEMPERATURA (ºC)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">$54.000</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">PRESION ARTERIAL</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">2.500</div>
                            <div
                              class="text-(--color) flex cursor-pointer items-center rounded-full border px-2 py-px text-xs tooltip border-transparent bg-transparent [--color:var(--color-danger)]"
                              data-content="9% Higher than last month"
                            >
                              52%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                data-lucide="chevron-down"
                                class="lucide lucide-chevron-down size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 ml-0.5"
                              >
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">FERECUANCIA CARDIACA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">$72.000</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-12 md:col-span-12">
                          <div class="text-xs opacity-70">DIAGNÓSTICO</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">4.501</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-12 md:col-span-12">
                          <div class="text-xs opacity-70">TRATAMIENTO</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">2</div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-12 md:col-span-12">
                          <div class="text-xs opacity-70">NOTAS / OBSERVACIONES</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">$72.000</div>
                            <div
                              class="text-(--color) flex cursor-pointer items-center rounded-full border px-2 py-px text-xs tooltip border-transparent bg-transparent [--color:var(--color-success)]"
                              data-content="9% Higher than last month"
                            >
                              49%
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                data-lucide="chevron-down"
                                class="lucide lucide-chevron-down size-4 stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 ml-0.5"
                              >
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DialogBasic id="modal-appointment-create-or-edit" size="3xl">
        <AppointmentCreateUpdate :patientId appointmentId="create" :is-inside-modal="true" />
      </DialogBasic>

      <AppointmentCancelModalQuestion
        v-model="showCancelModalQuestion"
        :appointmentId="selectedAppointmentId"
        @cancelled="handleCancelled"
      />
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';
import { useQuery } from '@tanstack/vue-query';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PreviewHideIcon from '@/icons/PreviewHideIcon.vue';
import { getAppointmentsByPatientAction } from '../../appointment/actions/get-appointments-by-patient.action';
import { ref } from 'vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import { getAppointmentStatusColor } from '@/modules/appointment/helpers/get-appointment-status-color.mapper';
import CancelIcon from '@/icons/CancelIcon.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';

interface Props {
  patientId: string;
  // isInsideModal: boolean;
}

const props = defineProps<Props>();
const expandedRow = ref<null | number>(null);

const showCancelModalQuestion = ref(false);
const selectedAppointmentId = ref<null | number>(null);

const {
  data: appointments,
  isLoading,
  error,
} = useQuery({
  queryKey: ['appointments', { patientId: props.patientId }],
  queryFn: () => getAppointmentsByPatientAction(props.patientId),
  select: (data) => data ?? [],
});

console.log(appointments.value);

const toggleRow = (id: number) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

const openCancelModal = (id: number) => {
  console.log('simon');

  selectedAppointmentId.value = id;

  showCancelModalQuestion.value = true;
};

const handleCancelled = (updatedAppointment) => {};
</script>

<style scoped></style>
