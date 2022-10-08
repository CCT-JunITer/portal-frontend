import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: '$MODULE_NAME_DASHED$',
    component: () => import('./views/HelloWorldView.vue')
  }
]