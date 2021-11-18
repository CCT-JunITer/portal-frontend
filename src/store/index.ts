import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { mainModule } from './main';
import { State } from './state';
import { adminModule } from './admin';
import { trainingModule } from './training';
import { financeRequestModule } from './finance_request';

Vue.use(Vuex);

const storeOptions: StoreOptions<State> = {
  modules: {
    main: mainModule,
    admin: adminModule,
    training: trainingModule,
    finance_request: financeRequestModule,
  },
};

export const store = new Vuex.Store<State>(storeOptions);

export default store;
