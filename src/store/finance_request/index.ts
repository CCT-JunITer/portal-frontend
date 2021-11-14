import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { FinanceRequestState } from './state';

const defaultState: FinanceRequestState = {
  myFinanceRequests: [],
};

export const financeRequestModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
