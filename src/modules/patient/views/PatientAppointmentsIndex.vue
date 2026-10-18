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
                    width="4%"
                    class="h-12 px-4 text-center font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    #
                  </th>
                  <th
                    width="12%"
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap"
                  >
                    FOLIO
                  </th>
                  <th
                    width="15%"
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap"
                  >
                    FECHA Y HORA
                  </th>
                  <th
                    width="18%"
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap"
                  >
                    MÉDICO
                  </th>
                  <th
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    MOTIVO
                  </th>
                  <th
                    width="14%"
                    class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 whitespace-nowrap"
                  >
                    ESTATUS
                  </th>
                  <th
                    width="10%"
                    class="h-12 px-4 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-center whitespace-nowrap"
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
                      width="4%"
                      class="text-center shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ (pagination.currentPage - 1) * pagination.perPage + index + 1 }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r font-medium text-primary whitespace-nowrap"
                    >
                      {{ appointment.folio || 'S/F' }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      <div class="font-medium text-foreground">
                        {{ appointment.fecha_inicio }}
                      </div>
                      <div class="text-xs text-muted-foreground mt-0.5">
                        {{ appointment.hora_inicio }} - {{ appointment.hora_termino }}
                      </div>
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      {{ getAppointmentDoctorName(appointment) }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ appointment.motivo }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      <PillBadge
                        size="sm"
                        :color="getAppointmentStatusColor(appointment.estatus)"
                        :label="getAppointmentStatusName(appointment.estatus)"
                      />
                    </td>
                    <td
                      width="10%"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-3 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      <div class="flex flex-col items-center justify-center gap-1">
                        <button
                          v-if="canAttendAppointment(appointment)"
                          type="button"
                          class="inline-flex items-center justify-center gap-1 w-full max-w-[90px] px-2 py-1 rounded-lg text-xs font-medium text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          title="Atender consulta médica"
                          @click="goToConsultation(appointment.id)"
                        >
                          <StethoscopeIcon class="size-3.5" />
                          <span>Atender</span>
                        </button>

                        <button
                          v-if="canCancelAppointment(appointment)"
                          type="button"
                          class="inline-flex items-center justify-center gap-1 w-full max-w-[90px] px-2 py-1 rounded-lg text-xs font-medium text-danger/80 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                          title="Cancelar cita"
                          @click="openCancelModal(appointment.id)"
                        >
                          <CancelIcon class="size-3.5 !mr-0" />
                          <span>Cancelar</span>
                        </button>

                        <span
                          v-if="!canAttendAppointment(appointment) && !canCancelAppointment(appointment)"
                          class="text-xs text-muted-foreground/60 italic"
                        >
                          —
                        </span>
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


const canCancelAppointment = (appointment: Appointment) => {
  const statusName = getAppointmentStatusName(appointment.estatus);
  return statusName !== 'Cancelada' && statusName !== 'Atendida';
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
