import { State } from '@/store/state';
import { ActionContext } from 'vuex';
import { AxiosError } from 'axios';
import { apiCall as apiCallMain, apiCallNotify as apiCallNotifyMain } from '@/store/utils';
import { dispatchActionAuthenticateNextcloud } from './store/actions';


const errorCallback = (context: ActionContext<any, State>) => async (error: AxiosError<any>) => {
  if (error.response?.data?.detail?.type == 'nextcloud authentication error') {
    await dispatchActionAuthenticateNextcloud(context);
    return true;
  }
  return false;
}

type apiCallNotifyType<T> = typeof apiCallNotifyMain<T>;
export const apiCallNotify = async <T>(...args: Parameters<apiCallNotifyType<T>>): ReturnType<apiCallNotifyType<T>> => {
  const [context, apicall, options = {}] = args;
  return await apiCallNotifyMain(context, apicall, {...options, errorCallback: errorCallback(context)});
}


type apiCallType<T> = typeof apiCallMain<T>;
export const apiCall = async <T>(...args: Parameters<apiCallType<T>>): ReturnType<apiCallType<T>> => {
  const [context, apicall, options = {}] = args;
  return await apiCallMain(context, apicall, {...options, errorCallback: errorCallback(context)});
}