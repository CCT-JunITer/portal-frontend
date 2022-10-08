import { PortalModule } from '@/modules';
import { routes } from './routes';
import { calendarStore } from './store';

export const calendarModule: PortalModule = {
  routes,
  store: {
    name: 'calendar',
    module: calendarStore,
  }
}