import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { ProjectApplicationState } from './state';

const defaultState: ProjectApplicationState = {
  projectTenders: null,
  projectApplications: null,
  projectApplicationsFor: {},
  projectCasts: null,
  projectCastsFor: {},
};

export const projectApplicationStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
