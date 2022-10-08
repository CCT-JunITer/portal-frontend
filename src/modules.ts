import { RouteConfig } from 'vue-router';
import { Module } from 'vuex';

import * as modules from '../modules';
import { State } from './store/state';

export interface PortalModule {
  routes: RouteConfig[];
  store: {
    name: string;
    module: Module<any, State>;
  };
}

const moduleList: PortalModule[] = Object.values(modules);

export const moduleStores = Object.fromEntries(moduleList.map(m => [m.store.name, m.store.module]));
export const moduleRoutes = moduleList.flatMap(m => m.routes);