# AGENTS.md — vue-medical-office ("Latidos")

SPA de gestión de consultorio médico. Vue 3 + Vite 7 + TypeScript + Pinia + TanStack Query + Tailwind 4.

## Directrices (obligatorias)

1. **Código limpio:** nombres descriptivos, funciones cortas con una sola responsabilidad (SOLID).
2. **Mantenibilidad:** aplicar DRY, sin lógica duplicada.
3. **Robustez:** manejo de errores, validación de entradas y tipado estricto.
4. **Explicar los cambios:** al proponer un cambio, justificar brevemente por qué se eligió esa estructura.
5. **Nombres de archivo siempre en inglés** (el contenido de la UI y los mensajes van en español).

## Comandos

```sh
npm run dev           # servidor de desarrollo
npm run build-only    # build de Vite (sin type-check) -> usar esto para verificar
npx vite build        # equivalente, verificado en ~7s
npm run type-check    # vue-tsc --build  (currently FAILS, ver abajo)
npm run lint          # eslint . --fix  (MODIFICA archivos)
npm run format        # prettier --write src/
```

- **No hay runner de tests.** `src/components/__tests__/HelloWorld.spec.ts` es un resto del template: `vitest` y `@vue/test-utils` no están instalados y `tsconfig.app.json` excluye `src/**/__tests__/*`. No escribas tests sin instalar antes el stack.
- `npm run lint` ejecuta `--fix`: modifica el árbol de trabajo. Para solo inspeccionar: `npx eslint .`.
- `npm run build` (= `run-p type-check "build-only"`) **falla** por los errores de tipos preexistentes.
- Node requerido: `^20.19.0 || >=22.12.0`.

## Deuda de verificación conocida (baseline en `main`)

- `npx vue-tsc --build --force` → **72 errores**.
- `npx eslint .` → **40 errores**.
- Causas recurrentes: `window.tailwind` sin declarar en `Window`; paginación estilo Laravel mal tipada (`first_page_url`, `next_page_url` vs `firstPageUrl`); `queryKey` con la misma clave semántica escrita de varias formas (`['patient', id]` y `['patient', { patientId }]`); imports/variables sin usar; imports rotos (`TemplateContent.vue` → `../../chain-custody/...`, `ThemeSwitcher.vue` → `@/composables/useTheme`).
- Estos errores **deben reducirse a cero**; al tocar un archivo, corrige también los de ese archivo y nunca agregues nuevos.

## Arquitectura

- `src/main.ts` monta Pinia, Vue Router, TanStack Query y vue-toastification; importa los shims jQuery de `src/assets/js/`.
- `src/App.vue` solo renderiza `<RouterView />` + devtools y arranca `authStore.checkAuthStatus()` vía `$subscribe`.
- Todo el código de negocio vive en `src/modules/<dominio>/` con esta convención:
  - `actions/` — una función por archivo, `kebab-case.action.ts`, es la **única** capa que llama a `medicalOfficeApi`. Reexportar en `actions/index.ts` (existe en patient, appointment, consultation; **auth no lo tiene**, se importa por ruta directa).
  - `interfaces/` — tipos TS.
  - `views/` — pantallas.
  - `composables/`, `helpers/`, `guards/`, `stores/`, `components/`, `layouts/`, `routes/`.
- `src/router/index.ts` es el único registro de rutas. `TemplateApp.vue` es el layout raíz de las rutas autenticadas (sidebar + `<RouterView />`).
- Cliente HTTP único: `src/api/medicalOfficeApi.ts` (axios + `baseURL` desde `VITE_MEDICAL_OFFICE_API_URL`, interceptor que inyecta `Authorization: Bearer` leyendo `localStorage.token`).

### Datos remotos

- `useQuery` / `useMutation` de `@tanstack/vue-query` directamente en la vista; los `queryKey` son **strings en inglés + argumentos** (`['patients', { page, search }]`, `['appointment', props.appointmentId]`). Al copiar una vista existente, reutiliza su clave exacta si es la misma entidad, si no la caché se invalida dos veces.
- `src/App.vue` monta `<VueQueryDevtools />` en dev.
- Auth: store Pinia `src/modules/auth/stores/auth.store.ts` (`useAuthStore`), token persistido con `useLocalStorage('token')` de VueUse y además en `localStorage` plano (lo consume el interceptor de axios).

### Patrón `.vue` + `<script src>` (no romperlo)

Algunas vistas separan la lógica en un `.ts` hermano con `defineComponent` (estilo Options API) y lo enganchan con:

```html
<script src="./AppointmentCreateUpdate.ts" lang="ts"></script>
```

Archivos: `appointment/views/AppointmentCreateUpdate.{ts,vue}`, `AppointmentConsultationCreate.{ts,vue}`, `patient/views/PatientCreate.{ts,vue}`. Si agregas lógica a una de estas vistas, va en el `.ts`, no en un `<script setup>` nuevo. El resto de vistas usan `<script setup lang="ts">`.

### Formularios

`vee-validate` (`useForm` + `defineField` + `validationSchema`) validando con `yup`. Los componentes de `src/modules/common/components/` (`InputBase`, `InputBaseDate`, `TextArea`, `ButtonPrimary`…) reciben los `*Attrs` de `defineField` con `v-bind` y exponen `:error`.

### Modales: conviven dos estilos

1. **Declarativo (preferir):** `ModalQuestion.vue` con `v-model` / `@confirm` / `@cancel` (patrón `DialogBasic.vue`).
2. **Imperativo (legacy, no eliminar usages existentes):** la plantilla Tailwind "Midone" usa clases `data-tw-toggle="modal"` / `data-tw-dismiss="modal"` y una API global montada por jQuery en `src/assets/js/modal.js`:

   ```ts
   window.tailwind.Modal.getOrCreateInstance(document.getElementById('modal-x')).hide()
   ```

   `window.tailwind` no está tipado (por eso `window.tailwind` genera errores de TS). Usa el patrón 1 para código nuevo.

### Navegación y roles

- Agregar una ruta solo en `src/router/index.ts` **no la hace visible**: el menú lateral se construye desde `src/modules/template/composables/useNavigationMenu.ts` (`allMenuItems` con `routeName`, `iconName`, `group`, `roles`) y se renderiza en `TemplateSideBar.vue`.
- El filtrado por rol usa los strings del usuario en minúsculas: `admin`, `administrador`, `doctor`, `médico`, `medico`, `recepcionista`, `paciente`. `admin`/`administrador` ven todo.
- Los iconos del menú se resuelven por `switch` en `getIconComponent` de `TemplateSideBar.vue`: un `iconName` nuevo sin `case` ahí cae en `DashboardIcon`.

### Tailwind 4 / assets

- Sin `tailwind.config.js`: el tema se define por CSS. `src/assets/main.css` importa `tailwindcss` + los themes `icewall` y los `vendors/*.css` del template.
- Los iconos SVG del proyecto están como componentes en `src/icons/`; los que vienen de `lucide-vue-next` se importan directamente. Ambos estilos coexisten.
- Varios `<i data-lucide="...">` en el markup son restos del template **sin icono renderizado** (no hay script que los inicialice). No son un bug a arreglar salvo que se pida.

### Variables de entorno

`.env` está en `.gitignore`; `.env.example` es la referencia versionada:

```
VITE_STAGE=dev
VITE_MEDICAL_OFFICE_API_URL=http://127.0.0.1:8000/api
```

El backend es una API REST Laravel en `127.0.0.1:8000` — sin backend no hay datos que verificar en la UI.

## Restos del template base (no usar como referencia; se recomienda borrarlos)

No están en el router y no los importa nadie:

- `src/views/` (`HomeView.vue`, `AboutView.vue`), `src/pages/ChainCustodyForm.vue`
- `src/stores/counter.ts`
- `src/components/` (`HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `icons/`, `__tests__/`)
- `src/modules/layouts/LayoutMain.vue` (~3700 líneas del template, con `<link>`/`<script>` a `dist/...`)
- `src/modules/template/components/TemplateContent.vue` (imports rotos a un módulo `chain-custody` inexistente) y `ThemeSwitcher.vue` (import roto)
- La dependencia `simple-vue` del `package.json` es un paquete publicado sin relación y no se usa en el código.

Cuando agregues código nuevo, no los tomes como ejemplo de arquitectura: la referencia real es `src/modules/patient/` y `src/modules/appointment/`.

## Estilo

- Prettier: `semi: true`, `singleQuote: true`, `printWidth: 100`, `trailingComma: all`, 2 espacios (`.prettierrc.json` + `.editorconfig`). ESLint corre con `skipFormatting`, así que Prettier manda.
- Ojo: el código mezcló estilos; los archivos de módulos usan punto y coma, los archivos de la raíz de `src/` (`main.ts`, `router/index.ts`) no. No reformatees archivos completos como parte de un cambio funcional.
- ESLint está en modo **flat config** con `flat/essential` + `vueTsConfigs.recommended`; ignora `dist/**`.
- VS Code: format-on-save con Prettier y `source.fixAll.eslint`.