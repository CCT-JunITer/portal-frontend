import { api } from '@/api';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitDeleteMyFinanceRequest,
  commitSetMyFinanceRequest,
  commitSetMyFinanceRequests,
} from './mutations';
import { dispatchCheckApiError } from '../main/actions';
import { commitAddNotification, commitRemoveNotification } from '../main/mutations';
import { IFinanceRequestCreate, IFinanceRequestUpdate } from '@/interfaces';
import { FinanceRequestState } from './state';

type MainContext = ActionContext<FinanceRequestState, State>;

export const actions = {
  async actionAddFinanceRequestMe(context: MainContext, payload: IFinanceRequestCreate) {
    try {
      const response = await api.createFinanceRequest(context.rootState.main.token, payload);
      commitAddNotification(context, { content: 'Antrag wurde abgeschickt', color: 'success' });
      commitSetMyFinanceRequest(context, response.data)
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },

  async actionGetMyFinanceRequests(context: MainContext) {
    try {
      const response = await api.getMyFinanceRequests(context.rootState.main.token);
      if (response) {
        commitSetMyFinanceRequests(context, response.data);
      }
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },

  async actionUpdateMyFinanceRequest(context: MainContext, payload: { id: number; financeRequest: IFinanceRequestUpdate }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateFinanceRequest(context.rootState.main.token, payload.id, payload.financeRequest),
        await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitSetMyFinanceRequest(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Finance Request successfully updated', color: 'success' });
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },
  
  async actionUpdateFinanceRequestState(context: MainContext, payload: { financeId: number; updated_status: string; updated_message_file: string; updated_message_request: string }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateFinanceRequestState(context.rootState.main.token, payload.financeId, payload.updated_status, payload.updated_message_file, payload.updated_message_request),
        await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetMyFinanceRequests(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Finance Request successfully updated', color: 'success' });
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateFinanceRequestStateFile(context: MainContext, payload: {financeId: number; updated_status: string; updated_receipt: string | null}) { // ; ...
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateFinanceRequestStateReceipt(context.rootState.main.token, payload.financeId, payload.updated_status, payload.updated_receipt),
        await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetMyFinanceRequests(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Finance Request successfully updated', color: 'success' });
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateFinanceRequestStateType(context: MainContext, payload: { financeId: number; updated_status: string; updated_association: string }) { // ; ...
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateFinanceRequestStateType(context.rootState.main.token, payload.financeId, payload.updated_status, payload.updated_association),
        await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetMyFinanceRequests(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Finance Request successfully updated', color: 'success' });
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },
  
  async actionDeleteFinanceRequest(context: MainContext, payload: number) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.deleteFinanceRequest(context.rootState.main.token, payload),
        await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Finanzantrag gelöscht', color: 'success' });
      commitDeleteMyFinanceRequest(context, response.data);
    } catch (error: any) {
      await dispatchCheckApiError(context, error);
    }
  },
  
 
};

const { dispatch } = getStoreAccessors<FinanceRequestState | any, State>('');
 
export const dispatchAddFinanceRequest = dispatch(actions.actionAddFinanceRequestMe); 
export const dispatchGetMyFinanceRequests = dispatch(actions.actionGetMyFinanceRequests);
export const dispatchUpdateFinanceRequest = dispatch(actions.actionUpdateMyFinanceRequest);
export const dispatchUpdateFinanceRequestState = dispatch(actions.actionUpdateFinanceRequestState);
export const dispatchUpdateFinanceRequestStateFile = dispatch(actions.actionUpdateFinanceRequestStateFile);
export const dispatchUpdateFinanceRequestStateType = dispatch(actions.actionUpdateFinanceRequestStateType);
export const dispatchDeleteFinanceRequest = dispatch(actions.actionDeleteFinanceRequest);
