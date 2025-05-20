import { PortalModule } from '@/modules';
import { routes } from './routes';
import { qmsaStore } from './store';

export const qmsaModule: PortalModule = {
  routes,
  store: {
    name: 'qmsa',
    module: qmsaStore,
  }
}