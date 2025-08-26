<template>
  <!-- <div
    class="pt-8 pb-12 px-7 z-10 relative xl:mt-8 before:absolute before:inset-0 before:opacity-[.07] before:bg-foreground before:rounded-4xl after:absolute after:inset-0 after:bg-[color-mix(in_oklch,_var(--color-background),_var(--color-foreground)_2%)] after:rounded-4xl after:border after:border-foreground/[.15] dark:after:opacity-[.59]"
  > -->
  <div class="relative z-20">
    <div class="mt-8 flex items-center">
      <h2 class="mr-auto text-lg font-medium">Registro de cadena de custodia</h2>
    </div>
    <!-- BEGIN: Wizard Layout -->
    <div
      class="box relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mt-5 py-10 sm:py-20"
    >
      <div
        class="before:bg-foreground/10 relative flex flex-col justify-center px-5 before:absolute before:bottom-0 before:top-0 before:mt-6 before:hidden before:h-0.5 before:w-[69%] sm:px-20 lg:flex-row before:lg:block"
      >
        <WizardStep
          step="1"
          :isActive="currentStep === 1"
          description="Inicio"
          @click="currentStep = 1"
        />
        <WizardStep step="2" :isActive="currentStep === 2" description="Identidad" />
        <WizardStep step="3" :isActive="currentStep === 3" description="Documentación" />
        <WizardStep step="4" :isActive="currentStep === 4" description="Recolección" />
        <WizardStep step="5" :isActive="currentStep === 5" description="Empaque / embalaje" />
      </div>
      <div class="mt-10 border-t px-5 pt-10 sm:px-20">
        <!-- <div class="text-base font-medium">Profile Settings</div> -->
        <form @submit="onSubmit">
          <div v-if="currentStep === 1">
            <div class="flex flex-col text-center gap-2.5 col-span-12 sm:col-span-6 mb-8">
              <InputLabel label="Motivo por el cual comienza el registro" :isRequired="true" />
              <div class="flex justify-center space-x-4">
                <div class="flex items-center">
                  <input
                    type="radio"
                    id="r1"
                    name="motivo_registro"
                    value="localizacion"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    v-model="motivo_registro"
                  />
                  <label
                    for="r1"
                    class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                  >
                    Localización
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    type="radio"
                    id="r2"
                    name="motivo_registro"
                    value="descubrimiento"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    v-model="motivo_registro"
                  />
                  <label
                    for="r2"
                    class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                  >
                    Descubimiento
                  </label>
                </div>

                <div class="flex items-center">
                  <input
                    type="radio"
                    id="r3"
                    name="motivo_registro"
                    value="aportacion"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                    v-model="motivo_registro"
                  />
                  <label
                    for="r3"
                    class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                  >
                    Aportación
                  </label>
                </div>
              </div>
              <div>
                <span v-if="errors.motivo_registro" class="text-danger">{{
                  errors.motivo_registro
                }}</span>
              </div>
            </div>
            <div class="mt-5 grid grid-cols-12 gap-4 gap-y-5">
              <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
                <InputLabel label="Número de caso" :isRequired="true" />
                <InputText
                  v-model="numero_caso"
                  v-bind="numero_casoAttrs"
                  :error="errors.numero_caso"
                  name="numero_unico_caso"
                  placeholder="Ejemplo: 1003202512345"
                />
              </div>
              <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
                <div class="mb-1.5">
                  <label
                    for="input-wizard-2"
                    class="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >Unidad administrativa</label
                  >
                </div>
                <input
                  id="input-wizard-2"
                  type="text"
                  placeholder="example@gmail.com"
                  class="h-10 w-full rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/5 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
                <InputLabel label="Folio" />
                <InputText
                  v-model="folio"
                  v-bind="folioAttrs"
                  :error="errors.folio"
                  name="folio"
                  placeholder="Ejemplo: A123"
                />
              </div>
              <div class="flex flex-col gap-2.5 col-span-12 sm:col-span-6">
                <InputLabel label="Fecha y hora de intervención" :isRequired="true" />
                <InputDateTime
                  v-model="intervencion_fecha"
                  v-bind="intervencion_fechaAttrs"
                  :error="errors.intervencion_fecha"
                  name="intervencion_fecha"
                />
              </div>
            </div>
          </div>
          <div v-if="currentStep === 2">
            <div class="relative w-full overflow-auto">
              <div class="flex justify-end mb-4">
                <button
                  class="cursor-pointer inline-flex border items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-(--color)/20 border-(--color)/60 text-(--color) hover:bg-(--color)/5 [--color:var(--color-primary)] h-10 px-4 py-2 box"
                  @click="addClue"
                >
                  Agregar nuevo indicio
                </button>
              </div>
              <table class="w-full caption-bottom">
                <thead class="[&amp;_tr]:border-b">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-center align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      #
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      INDICIO O ELEMENTO PROBATORIO
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-center align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  <tr
                    v-for="(clue, index) in clues"
                    :key="index"
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      class="box rounded-none p-4 align-top space-y-4 [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <InputLabel label="Identificador" :isRequired="true" />
                      <InputText
                        v-model="clue.value.identificador"
                        :name="`indicio_${index}_identificador`"
                        placeholder="Ejemplo: 01, A"
                        :error="errors[`clues[${index}].identificador`]"
                      />

                      <InputLabel label="Descripción" :isRequired="true" />
                      <TextArea
                        v-model="clue.value.descripcion"
                        :name="`indicio_${index}_descripcion`"
                        placeholder="Ejemplo: Arma blanca..."
                        :error="errors[`clues[${index}].descripcion`]"
                      />

                      <InputLabel label="Ubicación en el lugar" :isRequired="true" />
                      <TextArea
                        v-model="clue.value.ubicacion_lugar"
                        :name="`indicio_${index}_ubicacion_lugar`"
                        placeholder="Ejemplo: En el asiento trasero..."
                        :error="errors[`clues[${index}].ubicacion_lugar`]"
                      />

                      <InputLabel label="Hora de recolección" :isRequired="true" />
                      <InputDateTime
                        v-model="clue.value.recoleccion_fecha"
                        :name="`indicio_${index}_recoleccion_fecha`"
                        :error="errors[`clues[${index}].recoleccion_fecha`]"
                      />
                    </td>
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex justify-around">
                        <span class="cursor-pointer" @click="cloneClue(index)">
                          <CloneIcon />
                        </span>
                        <span
                          v-if="clues.length > 1"
                          class="cursor-pointer"
                          @click="removeClue(index)"
                        >
                          <DeleteIcon />
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="currentStep === 3">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom">
                <thead class="[&amp;_tr]:border-b">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      #
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      TIPO DE DOCUMENTACIÓN
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      INDIQUE LOS MÉTODOS EMPLEADOS DE DOCUMENTACIÓN
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      1
                    </td>
                    <td
                      class="box rounded-none p-4 align-top space-y-4 [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      Escrito
                    </td>
                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-escrito-si"
                            name="tiene_documento_escrito_si"
                            :value="true"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_escrito"
                          />
                          <label
                            for="tiene-documento-escrito-si"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Sí
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-escrito-no"
                            name="tiene_documento_escrito_no"
                            :value="false"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_escrito"
                          />
                          <label
                            for="tiene-documento-escrito-no"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      <div v-if="errors.tiene_documento_escrito" class="text-left mt-2.5">
                        <span class="text-danger">{{ errors.tiene_documento_escrito }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      2
                    </td>
                    <td
                      class="box rounded-none p-4 align-top space-y-4 [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      Fotográfico
                    </td>
                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-fotografico-si"
                            name="tiene_documento_fotografico_si"
                            :value="true"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_fotografico"
                          />
                          <label
                            for="tiene-documento-fotografico-si"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Sí
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-fotografico-no"
                            name="tiene_documento_fotografico_no"
                            :value="false"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_fotografico"
                          />
                          <label
                            for="tiene-documento-fotografico-no"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      <div v-if="errors.tiene_documento_fotografico" class="text-left mt-2.5">
                        <span class="text-danger">{{ errors.tiene_documento_fotografico }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      3
                    </td>
                    <td
                      class="box rounded-none p-4 align-top space-y-4 [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      Croquis
                    </td>
                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-croquis-si"
                            name="tiene_documento_croquis_si"
                            :value="true"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_croquis"
                          />
                          <label
                            for="tiene-documento-croquis-si"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Sí
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-croquis-no"
                            name="tiene_documento_croquis_no"
                            :value="false"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_croquis"
                          />
                          <label
                            for="tiene-documento-croquis-no"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      <div v-if="errors.tiene_documento_croquis" class="text-left mt-2.5">
                        <span class="text-danger">{{ errors.tiene_documento_croquis }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      4
                    </td>
                    <td
                      class="box rounded-none p-4 align-top space-y-4 [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      Otro
                    </td>
                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-otro-si"
                            name="tiene_documento_otro_si"
                            :value="true"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_otro"
                          />
                          <label
                            for="tiene-documento-otro-si"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Sí
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            id="tiene-documento-otro-no"
                            name="tiene_documento_otro_no"
                            :value="false"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="tiene_documento_otro"
                          />
                          <label
                            for="tiene-documento-otro-no"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      <div v-if="errors.tiene_documento_otro" class="text-left mt-2.5 mb-4">
                        <span class="text-danger">{{ errors.tiene_documento_otro }}</span>
                      </div>

                      <div class="text-left mt-8">
                        <InputLabel
                          label="Especifique el otro tipo de documentación"
                          :isRequired="tiene_documento_otro"
                        />
                        <TextArea
                          v-model="documento_otro_descripcion"
                          v-bind="documento_otro_descripcionAttrs"
                          :error="errors.documento_otro_descripcion"
                          name="documento_otro_descripcion"
                          placeholder="Ejemplo: ..."
                          :isDisabled="!tiene_documento_otro"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="currentStep === 4">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom">
                <thead class="[&amp;_tr]:border-b">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      #
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      IDENTIFICADOR
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      TIPO DE RECOLECCIÓN
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  <tr
                    v-for="(clue, index) in clues"
                    :key="index"
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      width="10%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ clue.value.identificador }}
                    </td>

                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex justify-center space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`indicio-tipo-recoleccion-manual-${index}`"
                            :name="`indicio_tipo_recoleccion_manual_${index}`"
                            value="manual"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="clue.value.recoleccion_tipo"
                          />
                          <label
                            :for="`indicio-tipo-recoleccion-manual-${index}`"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Manual
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`indicio-tipo-recoleccion-instrumental-${index}`"
                            :name="`indicio_tipo_recoleccion_instrumental_${index}`"
                            value="instrumental"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="clue.value.recoleccion_tipo"
                          />
                          <label
                            :for="`indicio-tipo-recoleccion-instrumental-${index}`"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            instrumental
                          </label>
                        </div>
                      </div>
                      <div>
                        <span v-if="errors.motivo_registro" class="text-danger">{{
                          errors.motivo_registro
                        }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="currentStep === 5">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom">
                <thead class="[&amp;_tr]:border-b">
                  <tr
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      #
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      IDENTIFICADOR
                    </th>
                    <th
                      class="border-y border-foreground/10 first:border-l last:border-r bg-background h-12 px-4 text-left align-middle font-bold text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                    >
                      TIPO DE EMBALAJE
                    </th>
                  </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                  <tr
                    v-for="(clue, index) in clues"
                    :key="index"
                    class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted [&amp;:hover&gt;td]:before:bg-accent [&amp;:hover&gt;td]:relative [&amp;:hover&gt;td]:before:absolute [&amp;:hover&gt;td]:before:inset-0 [&amp;:hover&gt;td]:before:z-[-1] [&amp;:hover&gt;td]:before:blur-lg"
                  >
                    <td
                      width="5%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      width="10%"
                      class="box rounded-none p-4 align-top text-center font-semibold [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      {{ clue.value.identificador }}
                    </td>

                    <td
                      class="box rounded-none p-4 align-top text-center [&amp;:has([role=checkbox])]:pr-0 border-y border-foreground/10 bg-background first:border-l last:border-r"
                    >
                      <div class="flex justify-center space-x-4">
                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`indicio-tipo-embalaje-bolsa-${index}`"
                            :name="`indicio_tipo_embalaje_bolsa_${index}`"
                            value="bolsa"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="clue.value.embalaje_tipo"
                          />
                          <label
                            :for="`indicio-tipo-embalaje-bolsa-${index}`"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Bolsa
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`indicio-tipo-embalaje-caja-${index}`"
                            :name="`indicio_tipo_embalaje_caja_${index}`"
                            value="caja"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="clue.value.embalaje_tipo"
                          />
                          <label
                            :for="`indicio-tipo-embalaje-caja-${index}`"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Caja
                          </label>
                        </div>

                        <div class="flex items-center">
                          <input
                            type="radio"
                            :id="`indicio-tipo-embalaje-recipiente-${index}`"
                            :name="`indicio_tipo_embalaje_recipiente_${index}`"
                            value="recipiente"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            v-model="clue.value.embalaje_tipo"
                          />
                          <label
                            :for="`indicio-tipo-embalaje-recipiente-${index}`"
                            class="ml-2 block text-sm font-medium text-gray-700/70 cursor-pointer"
                          >
                            Recipiente
                          </label>
                        </div>
                      </div>
                      <div>
                        <span v-if="errors.motivo_registro" class="text-danger">{{
                          errors.motivo_registro
                        }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-span-12 mt-10 flex items-center justify-center sm:justify-end">
            <ButtonSecondary v-if="currentStep > 1" text="Anterior" @click="prevStep" />
            <ButtonPrimary v-if="currentStep < totalSteps" text="Siguiente" @click="nextStep" />
            <ButtonPrimary v-if="currentStep === totalSteps" text="Registrar" @click="onSubmit" />
          </div>
        </form>
      </div>
    </div>
    <!-- END: Wizard Layout -->
  </div>
  <!-- </div> -->

  <!-- <div class="grid grid-cols-2 mt-2">
    <pre class="bg-blue-200 p-2">
      {{ JSON.stringify(values, null, 2) }}
    </pre>
    <pre class="bg-red-200 p-2">
      {{ JSON.stringify(errors, null, 2) }}
    </pre>
    <pre class="bg-green-200 p-2 col-span-2">
      {{ JSON.stringify(meta, null, 2) }}
    </pre>
  </div> -->
</template>

<script src="./ChainCustodyCreate.ts" lang="ts"></script>

<style scoped></style>
