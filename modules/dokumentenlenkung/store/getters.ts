import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { DokumentenlenkungState } from './state';

export const getters = {
  UnapprovedDocuments: (state: DokumentenlenkungState) => state.documents,
  UnapprovedProjects: (state: DokumentenlenkungState) => state.projects,
  UnapprovedEvents: (state: DokumentenlenkungState) => state.events,
};

const {read} = getStoreAccessors<DokumentenlenkungState, State>('');

export const readUnapprovedDocuments = read(getters.UnapprovedDocuments);
export const readUnapprovedProjects= read(getters.UnapprovedProjects);
export const readUnapprovedEvents= read(getters.UnapprovedEvents);