import { ProjectsState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';
import { Project } from '../types';


export const mutations = {
  setAutocompleteValues(state: ProjectsState, payload: { [k: string]: string[] }) {
    state.autocompleteValues = payload;
  },
  setProjects(state: ProjectsState, payload: {type: string; projects: Project[]}) {
    if (payload.type === 'all') {
      state.allProjects = payload.projects;
      return;
    }
    state.projects[payload.type] = payload.projects;
  },
  setProjectsFor(state: ProjectsState, payload: { userId: number; payload: Project[] }) {
    state.projectParticipants = { ...state.projectParticipants, [payload.userId]: payload.payload };
  },
  setProject(state: ProjectsState, payload: Project) {
    state.projects[payload.type] = replace(state.projects[payload.type], payload);
  },
  removeProject(state: ProjectsState, payload: { type: string; project: Project }) {
    state.projects[payload.type] = state.projects[payload.type]?.filter(e => e.id !== payload.project.id) || [];
  }
};

const {commit} = getStoreAccessors<ProjectsState | any, State>('');

export const commitSetAutocompleteValues = commit(mutations.setAutocompleteValues);
export const commitSetProjects = commit(mutations.setProjects);
export const commitSetProjectsFor = commit(mutations.setProjectsFor);
export const commitSetProject = commit(mutations.setProject);
export const commitRemoveProject = commit(mutations.removeProject);

