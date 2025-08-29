<template>
  <div>
    <h2 class="mt-10 text-lg font-medium">Listado de registros de cadenas de custodia</h2>
    <div class="mt-5 grid grid-cols-12 gap-6">
      <div class="col-span-12 mt-2 flex flex-wrap items-center sm:flex-nowrap">
        <button
          class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 px-4 py-2 box mr-2"
          data-tw-toggle="modal"
          data-tw-target="#basic-dialog"
        >
          Registrar nuevo paciente
        </button>
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
        <div class="mx-auto hidden opacity-70 md:block">
          Mostrando los registros del {{ pagination.from }} al {{ pagination.to }} de
          {{ pagination.total }} registros
        </div>
        <div class="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
          <div class="relative w-56">
            <input
              class="h-10 rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 box w-56 pr-10"
              type="text"
              placeholder="Buscar..."
              v-model="search"
              @keyup.enter="doSearch"
            />

            <!-- <i
              data-lucide="search"
              class="stroke-[1.5] [--color:currentColor] stroke-(--color) fill-(--color)/25 absolute inset-y-0 right-0 my-auto mr-3 size-4 opacity-70"
            ></i> -->
            <SearchIcon class="cursor-pointer" @click="doSearch" />
          </div>
        </div>
      </div>
      <!-- BEGIN: Data List -->
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
                  Nombre
                </th>
                <th
                  class="h-12 px-4 text-left font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                >
                  Fecha de registro
                </th>
                <!-- <th
                  class="h-12 px-4 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-left"
                >
                  DESCRICIÓN DE INDICIOS O ELEMENTOS PROBATORIOS
                </th> -->
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
                  width="15%"
                  class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                >
                  <!-- <a class="whitespace-nowrap font-medium" href=""> Apple MacBook Pro 13 </a>
                  <div class="mt-0.5 whitespace-nowrap text-xs opacity-70">PC & Laptop</div> -->

                  {{ patient.nombre }} {{ patient.primer_apellido }} {{ patient.segundo_apellido }}
                </td>
                <td
                  class="shadow-[3px_3px_5px_#0000000b] first:rounded-l-xl last:rounded-r-xl box rounded-none p-4 [&:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                >
                  <!-- <a class="whitespace-nowrap font-medium" href=""> Apple MacBook Pro 13 </a>
                  <div class="mt-0.5 whitespace-nowrap text-xs opacity-70">PC & Laptop</div> -->

                  {{ patient.created_at }}
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
                    <RouterLink class="mr-3 flex items-center" :to="`patients/${patient.id}/edit`">
                      <EditIcon />
                      Editar
                    </RouterLink>
                    <a
                      class="text-danger flex items-center"
                      data-tw-toggle="modal"
                      data-tw-target="#delete-confirmation-dialog"
                      href="#"
                    >
                      <DeleteIcon />
                      Eliminar
                    </a>
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
  </div>

  <ModalQuestion
    id="modal-logout"
    title="¿Quieres cerrar sesión?"
    description="Si cierras sesión, tendrás que volver a iniciar sesión."
    confirmText="Sí, cerrar sesión"
    cancelText="Cancelar"
    @confirm="handleLogout"
  />

  <!-- <ModalQuestion /> -->

  <DialogBasic size="3xl" />

  <!-- <div>{{ chains }}</div> -->
</template>

<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'
import { getPatientsAction } from '../actions/get-patients.action'
import TablePagination from '@/modules/common/components/TablePagination.vue'
import { Pagination } from '../../common/interfaces/pagination.interface'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import ModalQuestion from '@/modules/common/components/ModalQuestion.vue'
import DialogBasic from '@/modules/common/components/DialogBasic.vue'
import EditIcon from '@/icons/EditIcon.vue'
import DeleteIcon from '@/icons/DeleteIcon.vue'
import SearchIcon from '@/icons/SearchIcon.vue'
import { useAuthStore } from '../../auth/stores/auth.store'

const authStore = useAuthStore()

// const page = ref(Number(route.query.page) || 1);
const route = useRoute()
const router = useRouter()
const page = ref<number>(1)
const perPage = ref<number>(10)
const search = ref<string>('')
const queryClient = useQueryClient()

const {
  data: response,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ['patients', { page: page }],
  queryFn: () => getPatientsAction(page.value, perPage.value, search.value),
})

const patients = computed(() => response.value?.data || [])
const pagination = computed<Pagination>(() => ({
  currentPage: response.value?.current_page || 1,
  firstPageUrl: response.value?.first_page_url || '',
  lastPage: response.value?.last_page || 1,
  lastPageUrl: response.value?.last_page_url || '',
  links: response.value?.links || [],
  nextPageUrl: response.value?.next_page_url || '',
  perPage: response.value?.per_page || perPage.value,
  prevPageUrl: response.value?.prev_page_url || '',
  total: response.value?.total || 0,
  to: response.value?.to || 0,
  from: response.value?.from || 0,
}))

function pageChange(pageNumber: number) {
  page.value = pageNumber

  router.push({
    query: { ...route.query, page: pageNumber, search: search.value || undefined },
  })
}

function doSearch() {
  page.value = 1 // opcional: reiniciar a la primera página
  refetch()
}

const handleLogout = async () => {
  console.log('cerrar sesion')

  const modalElement = document.querySelector('.modal.show')
  if (modalElement) {
    console.log('entrtas')
    window.tailwind.Modal.getOrCreateInstance(modalElement).hide()
  }
  setTimeout(() => {
    authStore.logout()
  }, 300)
}

watch(
  [page, perPage],
  () => {
    queryClient.prefetchQuery({
      queryKey: ['patients', { page: page.value + 1 }],
      queryFn: () => getPatientsAction(page.value + 1, perPage.value),
    })
  },
  { immediate: true },
)
</script>

<style scoped></style>
