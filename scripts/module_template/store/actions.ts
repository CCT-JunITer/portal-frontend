import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { $MODULE_NAME$State } from './state';
import { api } from '../api';
import { commitSet$MODULE_NAME$Profile } from './mutations';

type MainContext = ActionContext<$MODULE_NAME$State, State>;

export const actions = {
  async actionGet$MODULE_NAME$Profile(context: MainContext) {
    const response = await apiCall(context, api.get$MODULE_NAME$);
    commitSet$MODULE_NAME$Profile(context, response.data);
  },
};

const { dispatch } = getStoreAccessors<$MODULE_NAME$State | any, State>('');

export const dispatchGet$MODULE_NAME$Profile = dispatch(actions.actionGet$MODULE_NAME$Profile); 