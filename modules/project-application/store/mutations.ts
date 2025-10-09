import { ProjectApplicationState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';
import { ProjectApplication, ProjectCast, ProjectTender } from '../types';


export const mutations = {
  setProjectTenders(state: ProjectApplicationState, payload: ProjectTender[]) {
    state.projectTenders = payload;
  },
  setProjectTender(state: ProjectApplicationState, payload: ProjectTender) {
    state.projectTenders = replace(state.projectTenders, payload);
  },
  setProjectApplication(state: ProjectApplicationState, payload: ProjectApplication) {
    state.projectApplications = replace(state.projectApplications, payload);
  },
  setProjectApplicationsFor(state: ProjectApplicationState, payload: { projectTenderId: number, projectApplications: ProjectApplication[] }) {
    state.projectApplicationsFor = {...state.projectApplicationsFor, [payload.projectTenderId]: payload.projectApplications };
  },
  setOwnProjectApplicationByTender(state: ProjectApplicationState, payload: { projectTenderId: number, projectApplication: ProjectApplication | null }) {
    state.ownProjectApplicationByTender = {...state.ownProjectApplicationByTender, [payload.projectTenderId]: payload.projectApplication };
  },
  setProjectCast(state: ProjectApplicationState, payload: ProjectCast) {
    state.projectCasts = replace(state.projectCasts, payload);
  },
  setProjectCastsFor(state: ProjectApplicationState, payload: { projectTenderId: number, projectCasts: ProjectCast[] }) {
    state.projectCastsFor = {...state.projectCastsFor, [payload.projectTenderId]: payload.projectCasts };
  },
};

const {commit} = getStoreAccessors<ProjectApplicationState | any, State>('');

export const commitSetProjectTenders = commit(mutations.setProjectTenders);
export const commitSetProjectTender = commit(mutations.setProjectTender);
export const commitSetProjectApplication = commit(mutations.setProjectApplication);
export const commitSetProjectApplicationsFor = commit(mutations.setProjectApplicationsFor);
export const commitSetOwnProjectApplicationByTender = commit(mutations.setOwnProjectApplicationByTender);
export const commitSetProjectCast = commit(mutations.setProjectCast);
export const commitSetProjectCastsFor = commit(mutations.setProjectCastsFor);