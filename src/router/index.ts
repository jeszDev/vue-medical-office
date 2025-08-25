import { createRouter, createWebHistory } from 'vue-router';
import TemplateApp from '@/modules/template/TemplateApp.vue';
import { authRoutes } from '@/modules/auth/routes';

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
    //       component: () => import('@/modules/chain-custody/pages/ChainCustodyList.vue'),
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
          path: 'chains-custody',
          name: 'chains-custody.index',
          component: () => import('@/modules/chain-custody/views/ChainCustodyList.vue'),
        },
        {
          path: 'chains-custody/create',
          name: 'chains-custody.create',
          component: () => import('@/modules/chain-custody/views/ChainCustodyCreate.vue'),
        },
        {
          path: 'chains-custody/:chainCustodyId/edit',
          name: 'chains-custody.edit',
          props: true,
          component: () => import('@/modules/chain-custody/views/ChainCustodyCreate.vue'),
        },
        {
          path: 'product/create',
          name: 'product.create',
          component: () => import('@/modules/products/views/ProductCreate.vue'),
        },
      ],
    },
  ],
});

export default router;
