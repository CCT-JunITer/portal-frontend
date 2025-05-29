import { DokumentenlenkungState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { IDocument, IEvent } from '@/interfaces';
import { Project } from '@modules/projects/types';



export const mutations = {
  setUnapprovedDocuments(state: DokumentenlenkungState, payload: IDocument[]) {
    state.documents = payload;
  },
  setUnapprovedProjects(state: DokumentenlenkungState, payload: Project[]) {
    state.projects = payload;
  },
  setUnapprovedEvents(state: DokumentenlenkungState, payload: IEvent[]) {
    state.events = payload;
  },
  deleteApprovedProjects(state: DokumentenlenkungState, projectId: number) {
    state.projects = state.projects?.filter(e => e.id !== projectId) || [];
  },
  deleteApprovedDocuments(state: DokumentenlenkungState, documentId: number) {
    state.documents = state.documents?.filter(e => e.id !== documentId) || [];
  },
  deleteApprovedEvents(state: DokumentenlenkungState, eventId: number) {
    state.events = state.events?.filter(e => e.id !== eventId) || [];
  },
};

const {commit} = getStoreAccessors<DokumentenlenkungState | any, State>('');

export const commitSetUnapprovedDocuments = commit(mutations.setUnapprovedDocuments);
export const commitSetUnapprovedProjects = commit(mutations.setUnapprovedProjects);
export const commitSetUnapprovedEvents = commit(mutations.setUnapprovedEvents);

export const commitdeleteApprovedProjects = commit(mutations.deleteApprovedProjects);
export const commitdeleteApprovedDocuments = commit(mutations.deleteApprovedDocuments);
export const commitdeleteApprovedEvents = commit(mutations.deleteApprovedEvents);

