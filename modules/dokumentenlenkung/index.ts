import { PortalModule } from '@/modules';
import { routes } from './routes';
import { dokumentenlenkungStore } from './store';

export const dokumentenlenkungModule: PortalModule = {
  routes,
  store: {
    name: 'dokumentenlenkung',
    module: dokumentenlenkungStore,
  }
}