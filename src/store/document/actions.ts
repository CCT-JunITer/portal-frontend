import { api } from '@/api';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import { commitSetDocuments, commitSetDocument, commitRemoveDocument } from './mutations';
import { DocumentState } from './state';
import { IDocumentCreate, IDocumentType } from '@/interfaces';
import { apiCall, apiCallNotify } from '../utils';

type MainContext = ActionContext<DocumentState, State>;

export const actions = {
  async actionGetDocuments(context: MainContext, documentType: IDocumentType) {
    const response = await apiCall(context, token => api.getDocuments(token, documentType));
    commitSetDocuments(context, { documents: response.data, type: documentType });
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
  async actionDeleteDocument(context: MainContext, documentId: number) {
    const response = await apiCallNotify(context, token => api.deleteDocument(token, documentId), { successText: 'Dokument erfolgreich gelöscht' });
    commitRemoveDocument(context, response.data);
    return response.data;
  }
};

const { dispatch } = getStoreAccessors<DocumentState | any, State>('');

export const dispatchGetDocuments = dispatch(actions.actionGetDocuments);
export const dispatchGetOneDocument = dispatch(actions.actionGetOneDocument);
export const dispatchUpdateDocument = dispatch(actions.actionUpdateDocument);
export const dispatchCreateDocument = dispatch(actions.actionCreateDocument);
export const dispatchDeleteDocument = dispatch(actions.actionDeleteDocument);