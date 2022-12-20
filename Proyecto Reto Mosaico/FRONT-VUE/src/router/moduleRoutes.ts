import { modulesGuard } from 'src/middlewares/';
import { RouteRecordRaw } from 'vue-router';

const modulesRoutes: RouteRecordRaw[] = [
  {
    path: '/modulo/conectividad',
    name: 'user-network-test',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/NetworkTestModuleComponent.vue'),
  },
  {
    path: '/modulo/equipo',
    name: 'user-device',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/DeviceModuleComponent.vue'),
  },
  {
    path: '/modulo/mantenimiento',
    name: 'user-maintenance',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/MaintenanceModuleComponent.vue'),
  },
  {
    path: '/modulo/clave',
    name: 'user-password-management',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/PasswordModuleComponent.vue'),
  },
  {
    path: '/modulo/impresora',
    name: 'user-printer',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/PrinterModuleComponent.vue'),
  },
  {
    path: '/modulo/tienda',
    name: 'user-virtual-shop',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/VirtualShopModuleComponent.vue'),
  },
  {
    path: '/modulo/capacitacion',
    name: 'user-learning-videos',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/LearningVideosModuleComponent.vue'),
  },
  {
    path: '/modulo/califica',
    name: 'user-rating',
    beforeEnter: [modulesGuard.isEnabledToEnter],
    component: () => import('components/modules/RatingModuleComponent.vue'),
  },
] as RouteRecordRaw[];

export default modulesRoutes;
