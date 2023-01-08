import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { ProjectsState } from './state';
import { api } from '../api';
import { commitRemoveProject, commitSetAutocompleteValues, commitSetProject, commitSetProjects, commitSetProjectsFor } from './mutations';
import { ProjectCreate } from '../types';

type MainContext = ActionContext<ProjectsState, State>;

export const actions = {
  async actionGetAutocompleteValues(context: MainContext) {
    const response = await apiCall(context, api.getAutocompleteValues);
    commitSetAutocompleteValues(context, response.data);
  },
  async actionGetProjectsFor(context: MainContext, userId: number) {
    const response = await apiCall(context, token => api.getPersonalProjects(token, userId));
    commitSetProjectsFor(context, {userId: userId, payload: response.data});
  },
  async actionGetOneProject(context: MainContext, projectId: number) {
    const response = await apiCall(context, (token) => api.getOneProject(token, projectId));
    commitSetProject(context, response.data);
  },
  async actionDeleteProject(context: MainContext, payload: number) {
    const response = await apiCallNotify(context, token => api.deleteProject(token, payload), { successText: 'Projekt erfolgreich gelöscht' });
    commitRemoveProject(context, { project: response.data, type: response.data.type });
  },
  async actionUpdateProject(context: MainContext, payload: { id: number; project: ProjectCreate }) {
    const response = await apiCallNotify(context, token => api.updateProject(token, payload.id, payload.project), { successText: 'Änderung erfolgreich' });
    commitSetProject(context, response.data);
    return response.data;
  },
  async actionCreateProject(context: MainContext, payload: ProjectCreate) {
    const response = await apiCallNotify(context, token => api.createProject(token, payload), { successText: 'Projekt erfolgreich angelegt' });
    commitSetProject(context, response.data);
    return response.data;
  },
  async actionGetProjects(context: MainContext, project_type: string) {
    const response = await apiCall(context, token => api.getProjects(token, project_type));
    commitSetProjects(context, {projects: response.data, type: project_type});
  },
};

const { dispatch } = getStoreAccessors<ProjectsState | any, State>('');

export const dispatchGetAutocompleteValues = dispatch(actions.actionGetAutocompleteValues); 
export const dispatchGetProjects = dispatch(actions.actionGetProjects); 
export const dispatchGetOneProject = dispatch(actions.actionGetOneProject); 
export const dispatchCreateProject = dispatch(actions.actionCreateProject); 
export const dispatchUpdateProject = dispatch(actions.actionUpdateProject); 
export const dispatchDeleteProject = dispatch(actions.actionDeleteProject); 
export const dispatchGetProjectsFor = dispatch(actions.actionGetProjectsFor); 