import { PortalModule } from '@/modules';
import { routes } from './routes';
import { projectApplicationStore } from './store';

export const projectApplicationModule: PortalModule = {
  routes,
  store: {
    name: 'projectApplication',
    module: projectApplicationStore,
  }
}