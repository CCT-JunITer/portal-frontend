import { AxiosError, AxiosResponse } from 'axios';
import { ActionContext } from 'vuex';
import { dispatchCheckApiError } from './main/actions';
import { commitAddNotification, commitRemoveNotification } from './main/mutations';
import { AppNotification, MainState } from './main/state';
import { State } from './state';

export const replace = <T extends {id: number}>(array: T[] | null, payload: T): T[] => {
  if (!array) {
    return [payload];
  }
  const replaced = array.map(item => item.id !== payload.id ? item : payload)
  if(!replaced.find(item => item.id === payload.id)) {
    replaced.push(payload);
  }
  return replaced;
}

export const apiCallNotify = async <T>(context: ActionContext<unknown, State>, apicall: (token: string) => Promise<AxiosResponse<T>>, options: {successText?: string | null; loadingText?: string | null, errorCallback?: (e: AxiosError) => Promise<boolean>} = {}) => {
  const { loadingText = 'Lade', successText = 'Erfolgreich gespeichert' } = options;
  let loadingNotification: AppNotification | null = null;
  if (loadingText) {
    loadingNotification = { content: loadingText, showProgress: true, color: 'cctBlue' };
  }
  try {
    loadingNotification && commitAddNotification(context, loadingNotification);
    const response = await apicall(context.rootState.main.token);
    loadingNotification && commitRemoveNotification(context, loadingNotification);
    if (successText) {
      commitAddNotification(context, { content: successText, color: 'success' });
    }
    return response;
  } catch (e: unknown) {
    const error = e as AxiosError<{detail: any}>;
    if (!options.errorCallback || !await options.errorCallback(error)) {
      loadingNotification && commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: `Fehler ${error.response?.status}: ${error.response?.data?.detail || error.message}`, color: 'error' });
      await dispatchCheckApiError(context, error);
    }
    throw error;
  }
};


export const apiCall = async <T>(context: ActionContext<unknown, State>, apicall: (token: string) => Promise<AxiosResponse<T>>, options: { errorCallback?: (e: AxiosError) => Promise<boolean> } = {}) => {
  try {
    const response = await apicall(context.rootState.main.token);
    return response;
  } catch (e: any) {
    const error = e as AxiosError<{detail: any}>;
    if (!options.errorCallback || !await options.errorCallback(error)) {
      await dispatchCheckApiError(context, error);
    }
    throw error;
  }
};
