import { createRouter, createWebHistory } from 'vue-router'
import TemplateApp from '@/modules/template/TemplateApp.vue'
import { authRoutes } from '@/modules/auth/routes'

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
        },
        {
          path: 'patients/create',
          name: 'patients.create',
          component: () => import('@/modules/patient/views/PatientCreate.vue'),
        },
        {
          path: 'patients/:patientId/edit',
          name: 'patients.edit',
          props: true,
          component: () => import('@/modules/patient/views/PatientCreate.vue'),
        },
        {
          path: 'patients/appointments',
          name: 'patients.appointments.index',
          // props: true,
          component: () => import('@/modules/patient/views/PatientAppointmentsIndex.vue'),
        },
      ],
    },
  ],
})

export default router
