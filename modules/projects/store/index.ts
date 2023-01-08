import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { ProjectsState } from './state';

const defaultState: ProjectsState = {
  projects: {
    external: null,
    internal: null,
    membership_project: null,
    staffing: null,
  },
  allProjects: null,
  projectParticipants: {},
  autocompleteValues: {},
};

export const projectsStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
