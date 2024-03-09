import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { ProjectApplicationState } from './state';
import { Route } from 'vue-router';

export const getters = {
  projectTenders: (state: ProjectApplicationState) => state.projectTenders,
  routeProjectTender: (state: ProjectApplicationState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.projectTenders?.find(project => project?.id === numberId);
  },
  routeProjectApplication: (state: ProjectApplicationState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.projectApplications?.find(project => project?.id === numberId);
  },
  routeProjectApplicationsFor: (state: ProjectApplicationState) => (projectTenderId: number) => {
    return state.projectApplicationsFor[projectTenderId] || null;
  },
  oneProjectTender: (state: ProjectApplicationState) => (id: number) => state.projectTenders?.find(project => project?.id === id),
  routeProjectCast: (state: ProjectApplicationState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.projectCasts?.find(project => project?.id === numberId);
  },
  routeProjectCastsFor: (state: ProjectApplicationState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.projectCastsFor[numberId] || null;
  },
};

const {read} = getStoreAccessors<ProjectApplicationState, State>('');

export const readProjectTenders = read(getters.projectTenders);
export const readRouteProjectTender = read(getters.routeProjectTender);
export const readRouteProjectApplication = read(getters.routeProjectApplication);
export const readRouteProjectApplicationsFor = read(getters.routeProjectApplicationsFor);
export const readRouteProjectCast = read(getters.routeProjectCast);
export const readOneProjectTender = read(getters.oneProjectTender);
export const readRouteProjectCastsFor = read(getters.routeProjectCastsFor);