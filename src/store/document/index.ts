import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { DocumentState } from './state';

const defaultState: DocumentState = {
  documents: {
    'member-progression': null,
    'public-affairs': null,
    'quality-management': null,
    archive: null,
    recruiting: null,
    'project-work': null,
    templates:null,
  }
};

export const documentModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
