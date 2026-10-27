import { createRouter, createWebHistory } from 'vue-router';
import TemplateApp from '@/modules/template/TemplateApp.vue';
import { authRoutes } from '@/modules/auth/routes';
import { useBreadcrumb } from '@/modules/common/composables/useBreadcrumb';
import type { BreadcrumbItem } from '@/modules/common/interfaces/breadcrumb.interface';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'app-chain-of-custody',
    //   component: TemplateApp,
    //   children: [
    //     {
    //       path: '',
    //       name: 'home',
    //       component: () => import('@/modules/patient/pages/ChainCustodyList.vue'),
    //     },
    //   ],
    // },
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
            breadcrumbs: [{ title: 'Pacientes' }],
          },
        },
        {
          path: 'patients/create',
          name: 'patients.create',
          component: () => import('@/modules/patient/views/PatientCreate.vue'),
          meta: {
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
            breadcrumbs: [{ title: 'Citas' }],
          },
        },
        {
          path: 'appointments/requests',
          name: 'appointments.requests',
          component: () => import('@/modules/appointment/views/AppointmentRequestsIndex.vue'),
          meta: {
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
