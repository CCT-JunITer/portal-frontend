import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { ProjectsState } from './state';
import { Route } from 'vue-router';
import { ProjectTypeEnum } from '../types';

export const getters = {
  autocompleteValues: (state: ProjectsState) => (property: string) => state.autocompleteValues[property],
  projects: (state: ProjectsState) => (project_type: ProjectTypeEnum | 'all') => project_type === 'all' ? state.allProjects : state.projects[project_type],
  routeProject: (state: ProjectsState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return Object.values(state.projects).flatMap(i => i).find(project => project?.id === numberId);
  },
  projectsForRoute: (state: ProjectsState, store: any) => (route: Route) => {
    const user = store.routeUser(route);
    if (!user) {
      return [];
    }
    return state.projectParticipants[user.id] || [];
  },
  oneProject: (state: ProjectsState) => (projectId: number) => {
    return Object.values(state.projects).flatMap(i => i).find(project => project?.id === projectId);
  },
};

const {read} = getStoreAccessors<ProjectsState, State>('');

export const readAutocompleteValues = read(getters.autocompleteValues);
export const readProjects = read(getters.projects);
export const readRouteProject = read(getters.routeProject);
export const readProjectsForRoute = read(getters.projectsForRoute);
export const readOneProject = read(getters.oneProject);