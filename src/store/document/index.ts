import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { DocumentState } from './state';

const defaultState: DocumentState = {
  documents: []
};

export const documentModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
