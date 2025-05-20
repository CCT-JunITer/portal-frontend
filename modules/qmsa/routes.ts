import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: 'qmsa',
    component: () => import('./views/QMSA.vue')
  }
]