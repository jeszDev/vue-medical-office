<template>
  <TemplateView title="LISTADO DE PACIENTES">
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
              <div class="relative w-64">
                <input
                  class="h-10 rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box w-full pr-16"
                  type="text"
                  placeholder="Buscar paciente..."
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
          <!-- BEGIN: Data List -->
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
                      PACIENTE
                    </th>
                    <th
                      class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                      CURP
                    </th>
                    <th
                      class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                      CONTACTO
                    </th>
                    <th
                      class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                      FECHA DE REGISTRO
                    </th>
                    <th
                      class="h-12 px-4 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-center"
                    >
                      ACCIONES
                    </th>
                  </tr>
                </thead>
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
                      width="20%"
                      class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex items-center justify-center">
                        <RouterLink
                          class="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary/80 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          :to="`patients/${patient.id}`"
                          title="Ver expediente del paciente"
                        >
                          <PreviewIcon class="size-3.5" />
                          <span>Ver</span>
                        </RouterLink>
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
import { Pagination } from '../../common/interfaces/pagination.interface';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import DialogBasic from '@/modules/common/components/DialogBasic.vue';
import SearchIcon from '@/icons/SearchIcon.vue';
import CloseIcon from '@/icons/CloseIcon.vue';
import PreviewIcon from '@/icons/PreviewIcon.vue';
import PlusIcon from '@/icons/PlusIcon.vue';
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

