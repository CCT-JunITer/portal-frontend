import { RouteConfig } from 'vue-router';

export const routes: RouteConfig[] = [
  {
    path: 'calendar',
    redirect: 'calendar/week/today'
    // component: () => import('./views/main/calendar/Calendar.vue')
  },
  {
    path: 'calendar/:viewType/:viewDate',
    component: () => import('./views/CalendarMain.vue'),
  },
  {
    path: 'towernutzung/:viewType/:viewDate',
    component: () => import('./views/CalendarMain.vue'),
    meta: {
      towernutzung: true,
    }
  },
]