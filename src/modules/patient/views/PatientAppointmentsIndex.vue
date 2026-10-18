<template>
  <FullScreenLoader v-if="isLoading && !responseAppointments" />
  <TemplateView v-else :title="`AGENDA DE CITAS`">
    <template #main>
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-2 flex flex-wrap items-center sm:flex-nowrap">
          <ButtonBase
            text="Nueva cita"
            :icon="PlusIcon"
            color="primary"
            data-tw-toggle="modal"
            data-tw-target="#modal-appointment-create-or-edit"
          />

          <div class="mx-auto hidden opacity-70 md:block">
            Mostrando los registros del {{ pagination.from }} al {{ pagination.to }} de
            {{ pagination.total }} registros
          </div>

          <div class="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
            <div class="relative w-64">
              <input
                class="h-10 rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box w-full pr-16"
                type="text"
                placeholder="Buscar cita..."
                v-model="searchInput"
                @keyup.enter="doSearch"
              />
              <span
                v-if="searchInput"
                class="absolute inset-y-0 right-7 my-auto flex items-center cursor-pointer text-foreground/40 hover:text-foreground"
                title="Limpiar búsqueda"
                @click="clearSearch"
              >
                <CloseIcon class="size-4" />
              </span>
              <SearchIcon class="cursor-pointer hover:text-primary transition-colors" @click="doSearch" />
            </div>
          </div>
        </div>

        <div
          class="col-span-12 overflow-auto lg:overflow-visible transition-opacity"
          :class="{ 'opacity-60 pointer-events-none': isFetching }"
        >
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
                    FOLIO
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
                    colspan="8"
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
                      {{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r font-medium text-primary"
                    >
                      {{ appointment.folio || 'S/F' }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.fecha_inicio }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      {{ appointment.hora_inicio }} - {{ appointment.hora_termino }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ getAppointmentDoctorName(appointment) }}
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
                        :label="getAppointmentStatusName(appointment.estatus)"
                      />
                    </td>
                    <td
                      width="20%"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex items-center justify-center gap-3">
                        <div v-if="expandedRow != appointment.id">
                          <PreviewIcon class="cursor-pointer" @click="toggleRow(appointment.id)" />
                        </div>
                        <div v-else>
                          <PreviewHideIcon
                            class="cursor-pointer"
                            @click="toggleRow(appointment.id)"
                          />
                        </div>
                        <div
                          v-if="
                            getAppointmentStatusName(appointment.estatus) !== 'Cancelada' &&
                            getAppointmentStatusName(appointment.estatus) !== 'Atendida'
                          "
                        >
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
                      colspan="8"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="grid grid-cols-12 mt-4 gap-x-10 gap-y-6">
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">PESO (kg)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.peso
                                  ? `${appointment.consulta.signos_vitales.peso} kg`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">ALTURA (m)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.altura
                                  ? `${appointment.consulta.signos_vitales.altura} m`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">TEMPERATURA (ºC)</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.temperatura
                                  ? `${appointment.consulta.signos_vitales.temperatura} ºC`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">PRESIÓN ARTERIAL</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.presion_arterial
                                  ? `${appointment.consulta.signos_vitales.presion_arterial} mmHg`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">FRECUENCIA CARDÍACA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.frecuencia_cardiaca
                                  ? `${appointment.consulta.signos_vitales.frecuencia_cardiaca} bpm`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 sm:col-span-6 md:col-span-4">
                          <div class="text-xs opacity-70">FRECUENCIA RESPIRATORIA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.signos_vitales?.frecuencia_respiratoria
                                  ? `${appointment.consulta.signos_vitales.frecuencia_respiratoria} rpm`
                                  : 'N/E'
                              }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="appointment.consulta?.exploracion_fisica"
                          class="col-span-12"
                        >
                          <div class="text-xs opacity-70">EXPLORACIÓN FÍSICA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{ appointment.consulta.exploracion_fisica }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12">
                          <div class="text-xs opacity-70">DIAGNÓSTICO</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.diagnostico || 'Sin diagnóstico registrado.'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12">
                          <div class="text-xs opacity-70">TRATAMIENTO Y PRESCRIPCIÓN</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.tratamiento || 'Sin tratamiento registrado.'
                              }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12">
                          <div class="text-xs opacity-70">NOTAS / OBSERVACIONES</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base">
                              {{
                                appointment.consulta?.observaciones ||
                                appointment.consulta?.notas ||
                                appointment.observaciones ||
                                appointment.observaciones_cita ||
                                'Sin observaciones registradas.'
                              }}
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="appointment.consulta?.doctor?.nombre_completo"
                          class="col-span-12"
                        >
                          <div class="text-xs opacity-70">MÉDICO QUE ATENDIÓ LA CONSULTA</div>
                          <div class="mt-1.5 flex items-center">
                            <div class="text-base font-medium">
                              {{ appointment.consulta.doctor.nombre_completo }}
                            </div>
                          </div>
                        </div>
                        <div class="col-span-12 flex justify-end gap-3 mt-4 pt-4 border-t">
                          <ButtonBase
                            v-if="canAttendAppointment(appointment)"
                            text="Atender esta consulta"
                            :icon="StethoscopeIcon"
                            color="primary"
                            @click="goToConsultation(appointment.id)"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <!-- BEGIN: Pagination -->
        <TablePagination :pagination="pagination" @page-change="pageChange" />
        <!-- END: Pagination -->
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
import SearchIcon from '@/icons/SearchIcon.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import AppointmentCreateUpdate from '@/modules/appointment/views/AppointmentCreateUpdate.vue';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PreviewHideIcon from '@/icons/PreviewHideIcon.vue';
import { getAppointmentsByPatientAction } from '@/modules/appointment/actions/get-appointments-by-patient.action';
import { computed, ref } from 'vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import PillBadge from '@/modules/common/components/PillBadge.vue';
import {
  getAppointmentDoctorName,
  getAppointmentStatusColor,
  getAppointmentStatusName,
} from '@/modules/appointment/helpers/get-appointment-status-color.mapper';
import CancelIcon from '@/icons/CancelIcon.vue';
import CloseIcon from '@/icons/CloseIcon.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';
import TablePagination from '@/modules/common/components/TablePagination.vue';
import type { Pagination } from '@/modules/common/interfaces/pagination.interface';
import type { Appointment } from '@/modules/appointment/interfaces/appointment.interface';
import { useRoute, useRouter } from 'vue-router';
import StethoscopeIcon from '@/icons/StethoscopeIcon.vue';

interface Props {
  patientId: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const page = ref<number>(Number(route.query.page) || 1);
const perPage = ref<number>(10);
const searchInput = ref<string>(route.query.search?.toString() || '');
const searchQuery = ref<string>(route.query.search?.toString() || '');

const expandedRow = ref<null | number>(null);

const showCancelModalQuestion = ref(false);
const selectedAppointmentId = ref<null | number>(null);

const {
  data: responseAppointments,
  isLoading,
  isFetching,
  refetch,
} = useQuery({
  queryKey: ['appointments', { patientId: props.patientId, page, search: searchQuery }],
  queryFn: () =>
    getAppointmentsByPatientAction(props.patientId, page.value, perPage.value, searchQuery.value),
  placeholderData: keepPreviousData,
});

const appointments = computed<Appointment[]>(() => responseAppointments.value?.data || []);

const pagination = computed<Pagination>(() => ({
  currentPage: responseAppointments.value?.meta?.current_page || 1,
  firstPageUrl: responseAppointments.value?.links?.first || '',
  lastPage: responseAppointments.value?.meta?.last_page || 1,
  lastPageUrl: responseAppointments.value?.links?.last || '',
  links: responseAppointments.value?.meta?.links || [],
  nextPageUrl: responseAppointments.value?.links?.next || '',
  perPage: responseAppointments.value?.meta?.per_page || perPage.value,
  prevPageUrl: responseAppointments.value?.links?.prev || '',
  total: responseAppointments.value?.meta?.total || 0,
  to: responseAppointments.value?.meta?.to || 0,
  from: responseAppointments.value?.meta?.from || 0,
}));

function pageChange(pageNumber: number) {
  page.value = pageNumber;
  router.push({
    query: { ...route.query, page: pageNumber, search: searchQuery.value || undefined },
  });
}

function doSearch() {
  page.value = 1;
  searchQuery.value = searchInput.value.trim();
  router.push({
    query: { ...route.query, page: 1, search: searchQuery.value || undefined },
  });
}

function clearSearch() {
  searchInput.value = '';
  doSearch();
}


const toggleRow = (id: number) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

const openCancelModal = (id: number) => {
  selectedAppointmentId.value = id;
  showCancelModalQuestion.value = true;
};

const handleCancelled = () => {
  refetch();
};

const goToConsultation = (appointmentId: number) => {
  router.push({
    name: 'appointments.consultations.create',
    params: { appointmentId: appointmentId },
  });
};

const canAttendAppointment = (appointment: Appointment) => {
  const statusName = getAppointmentStatusName(appointment.estatus);
  if (statusName === 'Cancelada' || statusName === 'Atendida') {
    return false;
  }
  const appointmentDate = new Date(appointment.fecha_hora_inicio);
  appointmentDate.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return appointmentDate <= endOfToday;
};
</script>

<style scoped></style>
