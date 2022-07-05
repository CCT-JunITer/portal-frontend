import { IDocument, IDocumentType } from '@/interfaces';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';
import { DocumentState } from './state';


export const mutations = {
  setDocuments(state: DocumentState, payload: { documents: IDocument[]; type: IDocumentType}) {
    state.documents[payload.type] = payload.documents;
  },
  setDocument(state: DocumentState, payload: IDocument) {
    state.documents[payload.type] = replace(state.documents[payload.type], payload);
  },
  removeDocument(state: DocumentState, payload: IDocument) {
    state.documents = state.documents[payload.type].filter((doc) => doc.id !== payload.id);
  }
};

const {commit} = getStoreAccessors<Document | any, State>('');

export const commitSetDocuments = commit(mutations.setDocuments);
export const commitSetDocument = commit(mutations.setDocument);
export const commitRemoveDocument = commit(mutations.removeDocument);