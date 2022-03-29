import { api } from '@/api';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import { commitSetDocuments, commitSetDocument } from './mutations';
import { DocumentState } from './state';
import { IDocumentCreate } from '@/interfaces';
import { apiCall, apiCallNotify } from '../utils';

type MainContext = ActionContext<DocumentState, State>;

export const actions = {
  async actionGetDocuments(context: MainContext, documentCategorie: string) {
    const response = await apiCall(context, token => api.getDocuments(token, documentCategorie));
    commitSetDocuments(context, response.data);
  },
  async actionGetOneDocument(context: MainContext, documentId: number) {
    const response = await apiCall(context, (token) => api.getOneDocument(token, documentId));
    commitSetDocument(context, response.data);
  },
  async actionUpdateDocument(context: MainContext, payload: { id: number; document: IDocumentCreate }) {
    const response = await apiCallNotify(context, token => api.updateDocument(token, payload.id, payload.document), { successText: 'Änderung erfolgreich' });
    commitSetDocument(context, response.data);
    return response.data;
  },
  async actionCreateDocument(context: MainContext, payload: IDocumentCreate) {
    const response = await apiCallNotify(context, token => api.createDocument(token, payload), { successText: 'Dokument erfolgreich angelegt' });
    commitSetDocument(context, response.data);
    return response.data;
  },
};

const { dispatch } = getStoreAccessors<DocumentState | any, State>('');

export const dispatchGetDocuments = dispatch(actions.actionGetDocuments);
export const dispatchGetOneDocument = dispatch(actions.actionGetOneDocument);
export const dispatchUpdateDocument = dispatch(actions.actionUpdateDocument);
export const dispatchCreateDocument = dispatch(actions.actionCreateDocument);