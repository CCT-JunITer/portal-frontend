import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { QmsaState } from './state';

const defaultState: QmsaState = {
  qmsaProfile: null,
};

export const qmsaStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
