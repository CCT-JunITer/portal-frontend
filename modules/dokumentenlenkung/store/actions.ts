import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { DokumentenlenkungState } from './state';
import { api } from '../api';
import { commitdeleteApprovedDocuments, commitdeleteApprovedEvents, commitdeleteApprovedProjects, commitSetUnapprovedDocuments, commitSetUnapprovedEvents, commitSetUnapprovedProjects } from './mutations';

type MainContext = ActionContext<DokumentenlenkungState, State>;

export const actions = {
  async actionGetUnapprovedDocuments(context: MainContext) {
    const response = await apiCall(context, api.getUnapprovedDocuments);
    commitSetUnapprovedDocuments(context, response.data);
  },
  async actionGetUnapprovedProjects(context: MainContext) {
    const response = await apiCall(context, api.getUnapprovedProjects);
    commitSetUnapprovedProjects(context, response.data);
  },
  async actionGetUnapprovedEvents(context: MainContext) {
    const response = await apiCall(context, api.getUnapprovedEvents);
    commitSetUnapprovedEvents(context, response.data);
  },
  async actionApproveProject(context: MainContext, projectId: number){
    const response = await apiCallNotify(context, token => api.approveProject(token, projectId), { successText: 'Änderung erfolgreich' });
    commitdeleteApprovedProjects(context,response.data.id);
  },
  async actionApproveDocument(context: MainContext, documentId: number){
    const response = await apiCallNotify(context, token => api.approveDocument(token, documentId), { successText: 'Änderung erfolgreich' });
    commitdeleteApprovedDocuments(context,response.data.id);
  },
  async actionApproveEvent(context: MainContext, documentId: number){
    const response = await apiCallNotify(context, token => api.approveEvent(token, documentId), { successText: 'Änderung erfolgreich' });
    commitdeleteApprovedEvents(context,response.data.id);
  }
};

const { dispatch } = getStoreAccessors<DokumentenlenkungState | any, State>('');

export const dispatchGetUnapprovedDocuments = dispatch(actions.actionGetUnapprovedDocuments); 
export const dispatchGetUnapprovedProjects = dispatch(actions.actionGetUnapprovedProjects); 
export const dispatchGetUnapprovedEvents = dispatch(actions.actionGetUnapprovedEvents); 
export const dispatchApproveProjects = dispatch(actions.actionApproveProject);
export const dispatchApproveDocuments = dispatch(actions.actionApproveDocument);
export const dispatchApproveEvent = dispatch(actions.actionApproveEvent);