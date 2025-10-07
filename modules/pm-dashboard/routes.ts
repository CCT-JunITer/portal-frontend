import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: 'pm-dashboard',
    component: () => import('./PmGuard.vue'),
    children: [
      {
        name: 'pm-dashboard',
        path: '',   // -> /main/pm-dashboard
        component: () => import('./views/table/PmUserTable.vue'),
      },
      {
        name: 'pm-user-detail',
        path: 'user/:id',  // -> /main/pm-dashboard/user/123
        component: () => import('./views/user/PmUserProfileView.vue'),
      }
    ]
  }
]
