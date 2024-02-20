import { PortalModule } from '@/modules';
import { routes } from './routes';
import { boardsStore } from './store';

export const boardsModule: PortalModule = {
  routes,
  store: {
    name: 'boards',
    module: boardsStore,
  }
}