import { authGuard } from 'src/middlewares';
import { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('components/admin/AdminSidebarComponent.vue'),
    children: [
      {
        path: '/admin',
        name: 'admin-dashboard',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('components/admin/AdminDashboardComponent.vue'),
      },
      {
        path: '/admin/usuarios',
        name: 'user-list',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/user/UserListComponent.vue'),
      },
      {
        path: '/admin/usuarios/crear',
        name: 'user-create',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/user/CreateUserComponent.vue'),
      },
      {
        path: '/admin/roles',
        name: 'role-list',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/role/RoleListComponent.vue'),
      },
      {
        path: '/admin/dispositivos',
        name: 'device-list',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/device/DeviceListComponent.vue'),
      },
      {
        path: '/admin/dispositivos/crear',
        name: 'device-create',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/device/CreateDeviceComponent.vue'),
      },
      {
        path: '/admin/calificaciones',
        name: 'rating-list',
        beforeEnter: [authGuard.isSuperAdmin],
        component: () =>
          import('src/components/admin/rating/RatingListComponent.vue'),
      },
    ] as RouteRecordRaw[],
  },
];

export default adminRoutes;
