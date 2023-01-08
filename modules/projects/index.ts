import { PortalModule } from '@/modules';
import { routes } from './routes';
import { projectsStore } from './store';

export const projectsModule: PortalModule = {
  routes,
  store: {
    name: 'projects',
    module: projectsStore,
  }
}