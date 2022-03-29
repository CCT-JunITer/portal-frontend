import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { mainModule } from './main';
import { State } from './state';
import { adminModule } from './admin';
import { eventModule } from './event';
import { financeRequestModule } from './finance_request';
import { documentModule } from './document';

Vue.use(Vuex);

const storeOptions: StoreOptions<State> = {
  modules: {
    main: mainModule,
    admin: adminModule,
    event: eventModule,
    finance_request: financeRequestModule,
    document: documentModule,
  },
};

export const store = new Vuex.Store<State>(storeOptions);

export default store;
