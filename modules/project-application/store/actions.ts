import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { ProjectApplicationState } from './state';
import { api } from '../api';
import { commitSetProjectTenders, commitSetProjectTender, commitSetProjectApplication, commitSetProjectApplicationsFor, commitSetProjectCast, commitSetProjectCastsFor } from './mutations';
import { ProjectApplicationCreate, ProjectCastCreate, ProjectTenderCreate } from '../types';

type MainContext = ActionContext<ProjectApplicationState, State>;

export const actions = {
  async actionGetProjectTenders(context: MainContext) {
    const response = await apiCall(context, api.getProjectTenders);
    commitSetProjectTenders(context, response.data);
  },
  async actionGetProjectTender(context: MainContext, id: number) {
    const response = await apiCall(context, (token) => api.getProjectTender(token, id));
    commitSetProjectTender(context, response.data);
  },
  async actionUpdateProjectTender(context: MainContext, payload: {id: number, data: ProjectTenderCreate}) {
    const response = await apiCall(context, (token) => api.updateProjectTender(token, payload.id, payload.data));
    commitSetProjectTender(context, response.data)
    return response.data;
  },
  async actionCreateProjectTender(context: MainContext, payload: ProjectTenderCreate) {
    const response = await apiCall(context, (token) => api.createProjectTender(token, payload));
    commitSetProjectTender(context, response.data)
    return response.data;
  },
  // project application
  async actionCreateProjectApplication(context: MainContext, payload: ProjectApplicationCreate) {
    const response = await apiCall(context, (token) => api.createProjectApplication(token, payload));
    commitSetProjectApplication(context, response.data)
    return response.data;
  },
  async actionUpdateProjectApplication(context: MainContext, payload: {id: number, data: ProjectApplicationCreate}) {
    const response = await apiCallNotify(context, (token) => api.updateProjectApplication(token, payload.id, payload.data));
    commitSetProjectApplication(context, response.data)
    return response.data;
  },
  async actionGetProjectApplication(context: MainContext, id: number) {
    const response = await apiCall(context, (token) => api.getProjectApplication(token, id));
    commitSetProjectApplication(context, response.data);
  },
  async actionGetProjectApplicationsFor(context: MainContext, id: number) {
    const response = await apiCall(context, (token) => api.getProjectApplicationsFor(token, id));
    commitSetProjectApplicationsFor(context, { projectTenderId: id, projectApplications: response.data });
  },

  // project cast
  async actionCreateProjectCast(context: MainContext, payload: ProjectCastCreate) {
    const response = await apiCall(context, (token) => api.createProjectCast(token, payload));
    commitSetProjectCast(context, response.data)
    return response.data;
  },
  async actionUpdateProjectCast(context: MainContext, payload: {id: number, data: ProjectCastCreate}) {
    const response = await apiCallNotify(context, (token) => api.updateProjectCast(token, payload.id, payload.data));
    commitSetProjectCast(context, response.data)
    return response.data;
  },
  async actionGetProjectCastsFor(context: MainContext, id: number) {
    const response = await apiCall(context, (token) => api.getProjectCastsFor(token, id));
    commitSetProjectCastsFor(context,  {projectTenderId: id, projectCasts: response.data })
    return response.data;
  },
  async actionGetProjectCast(context: MainContext, id: number) {
    const response = await apiCall(context, (token) => api.getProjectCast(token, id));
    commitSetProjectCast(context, response.data);
    return response.data;
  }
};

const { dispatch } = getStoreAccessors<ProjectApplicationState | any, State>('');

export const dispatchGetProjectTenders = dispatch(actions.actionGetProjectTenders); 
export const dispatchGetProjectTender = dispatch(actions.actionGetProjectTender); 
export const dispatchCreateProjectApplication = dispatch(actions.actionCreateProjectApplication); 
export const dispatchGetProjectApplication = dispatch(actions.actionGetProjectApplication);
export const dispatchUpdateProjectApplication = dispatch(actions.actionUpdateProjectApplication);
export const dispatchUpdateProjectTender = dispatch(actions.actionUpdateProjectTender);
export const dispatchCreateProjectTender = dispatch(actions.actionCreateProjectTender);
export const dispatchGetProjectApplicationsFor = dispatch(actions.actionGetProjectApplicationsFor);

export const dispatchCreateProjectCast = dispatch(actions.actionCreateProjectCast);
export const dispatchUpdateProjectCast = dispatch(actions.actionUpdateProjectCast);
export const dispatchGetProjectCastsFor = dispatch(actions.actionGetProjectCastsFor);
export const dispatchGetProjectCast = dispatch(actions.actionGetProjectCast);