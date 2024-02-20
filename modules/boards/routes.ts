import { RouteConfig } from 'vue-router';
import RouterComponent from '@/components/RouterComponent.vue';

export const routes: RouteConfig[] = [
  {
    path: 'wms/boards',
    component: RouterComponent,
    meta: {
      featureFlag: 'boards',
    },
    children: [
      {
        path: '',
        component: () => import('./views/BoardMain.vue'),
  
      },
      {
        path: 'create',
        name: 'board-create',
        component: () => import('./views/EditBoard.vue')
      },
      {
        path: 'edit/:id',
        name: 'board-edit',
        component: () => import('./views/EditBoard.vue'),
      },
      {
        path: 'detail/:id',
        name: 'board-detail',
        component: () => import('./views/BoardDetail.vue'),
      },
    ]
  }
]