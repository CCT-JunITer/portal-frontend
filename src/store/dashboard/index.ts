import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import {DashboardState} from './state';

const defaultState: DashboardState = {
  searchText: null,
  filters: [],
};

export const dashboardModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
