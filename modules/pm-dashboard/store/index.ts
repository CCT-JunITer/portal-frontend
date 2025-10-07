import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { PmDashboardState } from './state';

const defaultState: PmDashboardState = {
};

export const pmDashboardStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
