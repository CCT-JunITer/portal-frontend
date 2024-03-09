import RouterComponent from '@/components/RouterComponent.vue';
import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: 'project-tender',
    component: RouterComponent,
    children: [
      {
        name: 'project-tender-list',
        path: '',
        component: () => import('./views/ProjectTenderList.vue')
      },
      {
        name: 'project-tender-create',
        path: 'create',
        component: () => import('./views/EditProjectTender.vue')
      },
      {
        name: 'project-tender-detail',
        path: ':id',
        component: () => import('./views/ProjectTenderDetails.vue')
      },
      {
        name: 'project-tender-edit',
        path: 'edit/:id',
        component: () => import('./views/EditProjectTender.vue')
      },
    ]
  },
  {
    path: 'project-application',
    component: RouterComponent,
    children: [
      {
        name: 'project-application-edit',
        path: 'edit/:id',
        component: () => import('./views/EditProjectApplication.vue')
      },
      {
        name: 'project-application-detail',
        path: ':id',
        component: () => import('./views/EditProjectApplication.vue')
      }
    ]
  },
  {
    path: 'project-cast',
    component: RouterComponent,
    children: [
      {
        name: 'project-cast-edit',
        path: 'edit/:id',
        component: () => import('./views/casting/ProjectCastEdit.vue')
      },
      {
        name: 'project-tender-cast',
        path: ':id',
        component: () => import('./views/casting/ProjectTenderCast.vue')
      }
    ]
  }
]