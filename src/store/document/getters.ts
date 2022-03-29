import { Route } from 'vue-router';
import { DocumentState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  documents: (state: DocumentState) => state.documents,
  oneDocument: (state: DocumentState) => (documentId: number) => {
    const filteredDocuments = state.documents.filter((document) => document.id === documentId);
    if (filteredDocuments.length > 0) {
      return { ...filteredDocuments[0] };
    }
  },
  routeDocument: (state: DocumentState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.documents.find(document => document.id === numberId);
  },
};

const {read} = getStoreAccessors<DocumentState, State>('');

export const readDocuments = read(getters.documents);
export const readOneDocument = read(getters.oneDocument);
export const readRouteDocument = read(getters.routeDocument);