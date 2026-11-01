<template>
  <TemplateView title="Listado de pacientes">
    <template #main>
      <FullScreenLoader v-if="isLoading && !responsePatients" />

      <template v-else>
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-12 mt-2 flex flex-wrap items-center sm:flex-nowrap">
            <ButtonBase
              text="Registrar nuevo paciente"
              :icon="PlusIcon"
              color="primary"
              class="mr-2"
              @click="handleModalCreateUpdate('create')"
            />
            <div class="mx-auto hidden opacity-70 md:block">
              Mostrando los registros del {{ pagination.from }} al {{ pagination.to }} de
              {{ pagination.total }} registros
            </div>
            <div class="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
              <SearchInput
                v-model="searchInput"
                placeholder="Buscar paciente..."
                @search="doSearch"
                @clear="clearSearch"
              />
            </div>
          </div>
          <!-- BEGIN: Data List -->
          <div
            class="col-span-12 overflow-auto lg:overflow-visible transition-opacity"
            :class="{ 'opacity-60 pointer-events-none': isFetching }"
          >
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom border-separate border-spacing-y-[10px] -mt-2">
                <TableHead :columns="tableColumns" />
                <tbody class="[&_tr:last-child]:border-0">
                  <tr
                    v-for="(patient, index) in patients"
                    :key="patient.id"
                    class="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-b-0"
                  >
                    <td
                      width="5%"
                      class="text-center shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ index + 1 + pagination.perPage * (pagination.currentPage - 1) }}
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="font-medium text-foreground">{{ patient.nombre_completo }}</div>
                      <div v-if="patient.edad" class="text-xs text-muted-foreground mt-0.5">
                        {{ patient.edad }} años
                      </div>
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r font-mono text-xs"
                    >
                      <span v-if="patient.curp" class="tracking-wide">{{ patient.curp }}</span>
                      <span v-else class="text-muted-foreground/60">Sin CURP</span>
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r text-xs"
                    >
                      <div v-if="patient.telefono" class="font-medium text-foreground">
                        {{ patient.telefono }}
                      </div>
                      <div v-if="patient.correo_electronico" class="text-muted-foreground truncate max-w-[180px]">
                        {{ patient.correo_electronico }}
                      </div>
                      <span v-if="!patient.telefono && !patient.correo_electronico" class="text-muted-foreground/60">
                        Sin contacto
                      </span>
                    </td>
                    <td
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r text-sm"
                    >
                      {{ patient.creado_el }}
                    </td>
                    <!-- <td
                    class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r text-center"
                  >
                    <AccordionComponent>
                      <template #title>
                        <span class="text-gray-500 cursor-pointer"
                          >Ver indicos o elementos probatorios</span
                        >
                      </template>
                      <template #content>
                        <div class="grid gap-2">
                          <div v-for="clue in chain.clues" :key="clue.id" class="border p-2 rounded">
                            <div class="text-start font-bold">{{ clue.identificador }}</div>
                            <div class="text-start text-sm text-muted-foreground">
                              {{ clue.descripcion }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </AccordionComponent>
                  </td> -->
                    <td
                      width="15%"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r whitespace-nowrap"
                    >
                      <div class="flex items-center justify-center gap-3 whitespace-nowrap">
                        <TableActionButton
                          variant="primary"
                          :icon="EyeIcon"
                          tooltip="Ver"
                          :to="`patients/${patient.id}`"
                        />
                        <TableActionButton
                          variant="neutral"
                          :icon="EditIcon"
                          tooltip="Editar"
                          @click="handleModalCreateUpdate(patient.id)"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- END: Data List -->
          <!-- BEGIN: Pagination -->
          <TablePagination :pagination="pagination" @page-change="pageChange" />
          <!-- END: Pagination -->
        </div>
        <DialogBasic id="modal-patient-create-or-edit" size="3xl">
          <PatientCreate :patient-id="String(selectedPatientId)" :is-inside-modal="true" />
        </DialogBasic>
      </template>
    </template>
  </TemplateView>
</template>

<script setup lang="ts">
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { getPatientsAction } from '../actions/get-patients.action';
import TablePagination from '@/modules/common/components/TablePagination.vue';
import TableHead, { type TableColumn } from '@/modules/common/components/TableHead.vue';
import { Pagination } from '../../common/interfaces/pagination.interface';
import { useRoute, useRouter } from 'vue-router';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import TableActionButton from '@/modules/common/components/TableActionButton.vue';
import SearchInput from '@/modules/common/components/SearchInput.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
import { Eye as EyeIcon, CheckSquare as EditIcon } from 'lucide-vue-next';
import ButtonBase from '@/modules/common/components/ButtonBase.vue';
import PatientCreate from '@/modules/patient/views/PatientCreate.vue';
import TemplateView from '@/modules/template/components/TemplateView.vue';
import FullScreenLoader from '@/modules/common/components/FullScreenLoader.vue';
import type { Patient } from '../interfaces/patient.interface';

const route = useRoute();
const router = useRouter();
const page = ref<number>(Number(route.query.page) || 1);
const perPage = ref<number>(10);
const searchInput = ref<string>(route.query.search?.toString() || '');
const searchQuery = ref<string>(route.query.search?.toString() || '');
const queryClient = useQueryClient();

const tableColumns: TableColumn[] = [
  { key: 'index', label: '#', align: 'center', width: 'w-12' },
  { key: 'patient', label: 'PACIENTE', align: 'left' },
  { key: 'curp', label: 'CURP', align: 'left' },
  { key: 'contact', label: 'CONTACTO', align: 'left' },
  { key: 'registerDate', label: 'FECHA DE REGISTRO', align: 'left' },
  { key: 'actions', label: 'ACCIONES', align: 'center', width: 'w-24' },
];

const selectedPatientId = ref<'create' | number>('create');

const {
  data: responsePatients,
  isLoading,
  isFetching,
} = useQuery({
  queryKey: ['patients', { page, search: searchQuery }],
  queryFn: () => getPatientsAction(page.value, perPage.value, searchQuery.value),
  placeholderData: keepPreviousData,
});

const patients = computed<Patient[]>(() => responsePatients.value?.data || []);
const pagination = computed<Pagination>(() => ({
  currentPage: responsePatients.value?.meta?.current_page || 1,
  firstPageUrl: responsePatients.value?.links?.first || '',
  lastPage: responsePatients.value?.meta?.last_page || 1,
  lastPageUrl: responsePatients.value?.links?.last || '',
  links: responsePatients.value?.meta?.links || [],
  nextPageUrl: responsePatients.value?.links?.next || '',
  perPage: responsePatients.value?.meta?.per_page || perPage.value,
  prevPageUrl: responsePatients.value?.links?.prev || '',
  total: responsePatients.value?.meta?.total || 0,
  to: responsePatients.value?.meta?.to || 0,
  from: responsePatients.value?.meta?.from || 0,
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

const handleModalCreateUpdate = (patientId: 'create' | number) => {
  selectedPatientId.value = patientId;
  window.tailwind.Modal.getOrCreateInstance(
    document.getElementById('modal-patient-create-or-edit'),
  ).show();
};

watch(
  [page, perPage, searchQuery],
  () => {
    if (page.value < (responsePatients.value?.meta?.last_page || 1)) {
      queryClient.prefetchQuery({
        queryKey: ['patients', { page: page.value + 1, search: searchQuery.value }],
        queryFn: () => getPatientsAction(page.value + 1, perPage.value, searchQuery.value),
      });
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>

