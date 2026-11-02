import { createRouter, createWebHistory } from 'vue-router';
import TemplateApp from '@/modules/template/TemplateApp.vue';
import { authRoutes } from '@/modules/auth/routes';
import { useBreadcrumb } from '@/modules/common/composables/useBreadcrumb';
import type { BreadcrumbItem } from '@/modules/common/interfaces/breadcrumb.interface';
import { PERMISSIONS } from '@/modules/auth/constants/permissions.constant';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { usePermissions } from '@/modules/auth/composables/usePermissions';
import { useToast } from 'vue-toastification';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'login' },
    },

    authRoutes,

    {
      path: '/',
      component: TemplateApp,
      children: [
        {
          path: 'patients',
          name: 'patients.index',
          component: () => import('@/modules/patient/views/PatientIndex.vue'),
          meta: {
            permission: PERMISSIONS.PATIENTS_VIEW,
            breadcrumbs: [{ title: 'Pacientes' }],
          },
        },
        {
          path: 'patients/create',
          name: 'patients.create',
          component: () => import('@/modules/patient/views/PatientCreate.vue'),
          meta: {
            permission: PERMISSIONS.PATIENTS_CREATE,
            breadcrumbs: [
              { title: 'Pacientes', routeName: 'patients.index' },
              { title: 'Registrar Paciente' },
            ],
          },
        },
        {
          path: 'patients/:patientId',
          name: 'patients.show',
          props: true,
          component: () => import('@/modules/patient/views/PatientShow.vue'),
          meta: {
            permission: PERMISSIONS.PATIENTS_VIEW,
            breadcrumbs: [
              { title: 'Pacientes', routeName: 'patients.index' },
              { title: 'Detalle del Paciente' },
            ],
          },
        },
        {
          path: 'patients/:patientId/edit',
          name: 'patients.edit',
          props: true,
          component: () => import('@/modules/patient/views/PatientCreate.vue'),
          meta: {
            permission: PERMISSIONS.PATIENTS_UPDATE,
            breadcrumbs: [
              { title: 'Pacientes', routeName: 'patients.index' },
              { title: 'Detalle del Paciente', routeName: 'patients.show' },
              { title: 'Editar Paciente' },
            ],
          },
        },
        {
          path: 'patients/:patientId/appointments',
          name: 'patients.appointments.index',
          props: true,
          component: () => import('@/modules/patient/views/PatientAppointmentsIndex.vue'),
          meta: {
            permission: PERMISSIONS.APPOINTMENTS_VIEW,
            breadcrumbs: [
              { title: 'Pacientes', routeName: 'patients.index' },
              { title: 'Detalle del Paciente', routeName: 'patients.show' },
              { title: 'Citas' },
            ],
          },
        },
        {
          path: 'appointments/create',
          name: 'appointments.create',
          props: true,
          component: () => import('@/modules/appointment/views/AppointmentCreateUpdate.vue'),
          meta: {
            permission: PERMISSIONS.APPOINTMENTS_CREATE,
            breadcrumbs: [
              { title: 'Citas', routeName: 'appointments.index' },
              { title: 'Agendar Cita' },
            ],
          },
        },
        {
          path: 'appointments/index',
          name: 'appointments.index',
          props: true,
          component: () => import('@/modules/appointment/views/AppointmentIndex.vue'),
          meta: {
            permission: PERMISSIONS.APPOINTMENTS_VIEW,
            breadcrumbs: [{ title: 'Citas' }],
          },
        },
        {
          path: 'appointments/requests',
          name: 'appointments.requests',
          component: () => import('@/modules/appointment/views/AppointmentRequestsIndex.vue'),
          meta: {
            permission: PERMISSIONS.APPOINTMENTS_CONFIRM,
            breadcrumbs: [
              { title: 'Citas', routeName: 'appointments.index' },
              { title: 'Solicitudes Pendientes' },
            ],
          },
        },
        {
          path: 'appointments/:appointmentId/consultations',
          name: 'appointments.consultations.create',
          props: true,
          component: () => import('@/modules/appointment/views/AppointmentConsultationCreate.vue'),
          meta: {
            permission: PERMISSIONS.CONSULTATIONS_CREATE,
            breadcrumbs: [
              { title: 'Citas', routeName: 'appointments.index' },
              { title: 'Nueva Consulta' },
            ],
          },
        },
        {
          path: 'consultations/:consultationId/edit',
          name: 'consultations.edit',
          props: true,
          component: () => import('@/modules/appointment/views/AppointmentConsultationCreate.vue'),
          meta: {
            permission: PERMISSIONS.CONSULTATIONS_UPDATE,
            breadcrumbs: [
              { title: 'Citas', routeName: 'appointments.index' },
              { title: 'Editar Consulta' },
            ],
          },
        },
        {
          path: 'patients/:patientId/consultations/create',
          name: 'patients.consultations.create',
          props: true,
          component: () => import('@/modules/appointment/views/AppointmentConsultationCreate.vue'),
          meta: {
            permission: PERMISSIONS.CONSULTATIONS_CREATE,
            breadcrumbs: [
              { title: 'Pacientes', routeName: 'patients.index' },
              { title: 'Detalle del Paciente', routeName: 'patients.show' },
              { title: 'Nueva Consulta' },
            ],
          },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from) => {
  const isAuthRoute = to.path.startsWith('/auth') || to.name === 'login' || to.name === 'register';
  const authStore = useAuthStore();

  // Esperar a que checkAuthStatus complete si la aplicación apenas está cargando
  if (authStore.isChecking) {
    await authStore.checkAuthStatus();
  }

  // Redirigir a login si intenta acceder a rutas protegidas sin sesión
  if (!isAuthRoute && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  // Redirigir a pacientes si ya está autenticado e intenta ir al login
  if (isAuthRoute && authStore.isAuthenticated) {
    return { name: 'patients.index' };
  }

  // Evaluación de permisos en rutas autenticadas
  const { can, canAny, canAll, hasRole, isAdmin } = usePermissions();

  if (!isAdmin.value) {
    const resolveFallbackRoute = () => {
      if (can(PERMISSIONS.PATIENTS_VIEW)) return { name: 'patients.index' };
      if (can(PERMISSIONS.APPOINTMENTS_VIEW)) return { name: 'appointments.index' };
      return { name: 'login' };
    };

    // Validar roles si están definidos
    if (to.meta.roles && to.meta.roles.length > 0 && !hasRole(to.meta.roles)) {
      const toast = useToast();
      toast.warning('No tienes permisos para acceder a esta sección.');
      if (from.name && from.name !== to.name) {
        return false;
      }
      return resolveFallbackRoute();
    }

    // Validar permiso único
    if (to.meta.permission && !can(to.meta.permission)) {
      const toast = useToast();
      toast.warning('No tienes permisos para acceder a esta sección.');
      if (from.name && from.name !== to.name) {
        return false;
      }
      return resolveFallbackRoute();
    }

    // Validar conjunto de permisos
    if (to.meta.permissions && to.meta.permissions.length > 0) {
      const allowed =
        to.meta.matchMode === 'all'
          ? canAll(to.meta.permissions)
          : canAny(to.meta.permissions);

      if (!allowed) {
        const toast = useToast();
        toast.warning('No tienes permisos para acceder a esta sección.');
        if (from.name && from.name !== to.name) {
          return false;
        }
        return resolveFallbackRoute();
      }
    }
  }

  return true;
});

router.afterEach((to, from) => {
  // Si la navegación ocurre dentro de la misma ruta (por ejemplo, cambio de query o tab),
  // no sobreescribir los breadcrumbs dinámicos establecidos por la vista.
  if (to.name && to.name === from.name) {
    return;
  }

  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumb();
  if (to.meta?.breadcrumbs && Array.isArray(to.meta.breadcrumbs)) {
    const resolvedBreadcrumbs: BreadcrumbItem[] = to.meta.breadcrumbs.map((item) => ({
      ...item,
      params:
        item.params ||
        (item.routeName && Object.keys(to.params).length > 0 ? { ...to.params } : undefined),
    }));
    setBreadcrumbs(resolvedBreadcrumbs);
  } else {
    clearBreadcrumbs();
  }
});

export default router;
