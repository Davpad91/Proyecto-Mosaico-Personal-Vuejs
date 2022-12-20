import { RouteRecordRaw } from 'vue-router';

const pagesRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('pages/IndexPage.vue'),
    children: [],
  },
  {
    path: '/denegado',
    name: 'forbidden',
    component: () => import('pages/ErrorNotAuthorizedPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFoundPage.vue'),
  },
] as RouteRecordRaw[];

export default pagesRoutes;
