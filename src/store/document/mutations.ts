import { IDocument } from '@/interfaces';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';
import { DocumentState } from './state';


export const mutations = {
  setDocuments(state: DocumentState, payload: IDocument[]) {
    state.documents = payload;
  },
  setDocument(state: DocumentState, payload: IDocument) {
    state.documents = replace(state.documents, payload);
  },
};

const {commit} = getStoreAccessors<Document | any, State>('');

export const commitSetDocuments = commit(mutations.setDocuments);
export const commitSetDocument = commit(mutations.setDocument);