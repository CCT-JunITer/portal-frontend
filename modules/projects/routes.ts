import { RouteConfig } from 'vue-router';
import RouterComponent from '@/components/RouterComponent.vue';

export const routes: RouteConfig[] = [
  {
    path: 'wms/projects',
    component: RouterComponent,
    children: [
      {
        path: '',
        component: () => import('./views/ProjectMain.vue'),
      },
      {
        path: 'create',
        name: 'project-create',
        component: () => import('./views/EditProject.vue')
      },
      {
        path: ':id',
        name: 'project',
        component: () => import('./views/ProjectDetail.vue'),
      },
      {
        path: 'edit/:id',
        name: 'project-edit',
        component: () => import('./views/EditProject.vue'),
      },
    ]
  }
]