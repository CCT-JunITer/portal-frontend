import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { QmsaState } from './state';
import { api } from '../api';
import { commitSetQmsaProfile } from './mutations';

type MainContext = ActionContext<QmsaState, State>;

export const actions = {
  async actionGetQmsaProfile(context: MainContext) {
    const response = await apiCall(context, api.getQmsa);
    commitSetQmsaProfile(context, response.data);
  },
};

const { dispatch } = getStoreAccessors<QmsaState | any, State>('');

export const dispatchGetQmsaProfile = dispatch(actions.actionGetQmsaProfile); 