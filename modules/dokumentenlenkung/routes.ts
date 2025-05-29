import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: 'dokumentenlenkung',
    component: () => import('./views/HelloWorldView.vue')
  }
]