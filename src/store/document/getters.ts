import { Route } from 'vue-router';
import { DocumentState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { IDocumentType } from '@/interfaces';

export const getters = {
  documents: (state: DocumentState) => (documentType: IDocumentType) => {
    return state.documents[documentType];
  },
  oneDocument: (state: DocumentState) => (documentId: number) => {
    const filteredDocuments = Object.values(state.documents).flat().filter((document) => document?.id === documentId);
    if (filteredDocuments.length > 0) {
      return { ...filteredDocuments[0] };
    }
  },
  routeDocument: (state: DocumentState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return Object.values(state.documents).flat().find(document => document?.id === numberId);
  },
};

const {read} = getStoreAccessors<DocumentState, State>('');

export const readDocuments = read(getters.documents);
export const readOneDocument = read(getters.oneDocument);
export const readRouteDocument = read(getters.routeDocument);