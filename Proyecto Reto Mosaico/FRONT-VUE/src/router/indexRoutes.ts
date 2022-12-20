import { RouteRecordRaw } from 'vue-router';
import adminRoutes from './adminRoutes';
import modulesRoutes from './modulesRoutes';
import pagesRoutes from './pagesRoutes';
import preferencesRoutes from './preferencesRoutes';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [...pagesRoutes, ...modulesRoutes, ...adminRoutes, ...preferencesRoutes],
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('components/auth/SignUserComponent.vue'),
  },
];

export default routes;
