import { PortalModule } from '@/modules';
import { routes } from './routes';
import { $MODULE_NAME_CAMEL$Store } from './store';

export const $MODULE_NAME_CAMEL$Module: PortalModule = {
  routes,
  store: {
    name: '$MODULE_NAME_CAMEL$',
    module: $MODULE_NAME_CAMEL$Store,
  }
}