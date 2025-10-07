import { PortalModule } from '@/modules';
import { routes } from './routes';
import { pmDashboardStore } from './store';

export const pmDashboardModule: PortalModule = {
  routes,
  store: {
    name: 'pmDashboard',
    module: pmDashboardStore,
  }
}