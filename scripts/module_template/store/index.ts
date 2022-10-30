import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { $MODULE_NAME$State } from './state';

const defaultState: $MODULE_NAME$State = {
  $MODULE_NAME_CAMEL$Profile: null,
};

export const $MODULE_NAME_CAMEL$Store = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
