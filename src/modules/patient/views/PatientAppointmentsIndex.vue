<template>
  <FullScreenLoader v-if="isLoading && !responseAppointments" />
  <div v-else>
    <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 mt-2 flex flex-wrap items-center sm:flex-nowrap">
          <ButtonBase
            text="Nueva cita"
            color="primary"
            @click="openCreateModal"
          />

          <div class="mx-auto hidden opacity-70 md:block">
            <span v-if="pagination.total === 0">0 citas</span>
            <span v-else-if="pagination.total === 1">Mostrando 1 de 1 cita</span>
            <span v-else>
              Mostrando del {{ pagination.from }} al {{ pagination.to }} de
              {{ pagination.total }} citas
            </span>
          </div>

          <div class="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
            <SearchInput
              v-model="searchInput"
              placeholder="Buscar cita..."
              @search="doSearch"
              @clear="clearSearch"
            />
          </div>
        </div>

        <div
          class="col-span-12 overflow-auto lg:overflow-visible transition-opacity"
          :class="{ 'opacity-60 pointer-events-none': isFetching }"
        >
          <div class="relative w-full overflow-auto">
            <table class="w-full caption-bottom border-separate border-spacing-y-[10px] -mt-2">
              <TableHead :columns="tableColumns" />
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
                      <div class="flex items-center justify-center gap-3 whitespace-nowrap">
                        <TableActionButton
                          v-if="canAttendAppointment(appointment)"
                          variant="success"
                          :icon="StethoscopeIcon"
                          tooltip="Atender"
                          @click="goToConsultation(appointment.id)"
                        />
                        <TableActionButton
                          v-if="canEditAppointment(appointment)"
                          variant="neutral"
                          :icon="EditIcon"
                          tooltip="Editar"
                          @click="openEditModal(appointment.id)"
                        />
                        <TableActionButton
                          v-if="canCancelAppointment(appointment)"
                          variant="danger"
                          :icon="TrashIcon"
                          tooltip="Cancelar"
                          @click="openCancelModal(appointment.id)"
                        />
                        <span
                          v-if="!canAttendAppointment(appointment) && !canEditAppointment(appointment) && !canCancelAppointment(appointment)"
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
        <AppointmentCreateUpdate
          :patient-id="patientId"
          :appointment-id="appointmentModalId"
          :is-inside-modal="true"
        />
      </DialogBasic>

      <AppointmentCancelModalQuestion
        v-model="showCancelModalQuestion"
        :appointmentId="selectedAppointmentId"
        @cancelled="handleCancelled"
      />
  </div>
</template>

<script setup lang="ts">
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import SearchInput from '@/modules/common/components/SearchInput.vue';
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
import TableActionButton from '@/modules/common/components/TableActionButton.vue';
import TableHead, { type TableColumn } from '@/modules/common/components/TableHead.vue';
import AppointmentCancelModalQuestion from '@/modules/appointment/components/AppointmentCancelModalQuestion.vue';
import TablePagination from '@/modules/common/components/TablePagination.vue';
import type { Pagination } from '@/modules/common/interfaces/pagination.interface';
import type { Appointment } from '@/modules/appointment/interfaces/appointment.interface';
import { useRoute, useRouter } from 'vue-router';
import {
  Stethoscope as StethoscopeIcon,
  CheckSquare as EditIcon,
  Trash as TrashIcon,
} from 'lucide-vue-next';

interface Props {
  patientId: string;
}

const props = defineProps<Props>();

const router = useRouter();
const route = useRoute();

const tableColumns: TableColumn[] = [
  { key: 'index', label: '#', align: 'center', width: 'w-12' },
  { key: 'folio', label: 'FOLIO', align: 'left' },
  { key: 'dateTime', label: 'FECHA Y HORA', align: 'left' },
  { key: 'doctor', label: 'MÉDICO', align: 'left' },
  { key: 'reason', label: 'MOTIVO', align: 'left' },
  { key: 'status', label: 'ESTATUS', align: 'center' },
  { key: 'actions', label: 'ACCIONES', align: 'center', width: 'w-24' },
];

const page = ref<number>(Number(route.query.page) || 1);
const perPage = ref<number>(10);
const searchInput = ref<string>(route.query.search?.toString() || '');
const searchQuery = ref<string>(route.query.search?.toString() || '');

const showCancelModalQuestion = ref(false);
const selectedAppointmentId = ref<null | number>(null);
const appointmentModalId = ref<string>('create');

const canCancelAppointment = (appointment: Appointment) => {
  const statusName = getAppointmentStatusName(appointment.estatus);
  return statusName !== 'Cancelada' && statusName !== 'Atendida';
};

const canEditAppointment = (appointment: Appointment) => {
  const statusName = getAppointmentStatusName(appointment.estatus);
  return statusName !== 'Cancelada' && statusName !== 'Atendida';
};

const openCreateModal = () => {
  appointmentModalId.value = 'create';
  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

const openEditModal = (id: number) => {
  appointmentModalId.value = String(id);
  const modalEl = document.getElementById('modal-appointment-create-or-edit');
  if (modalEl && window.tailwind) {
    window.tailwind.Modal.getOrCreateInstance(modalEl).show();
  }
};

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
