import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { PmDashboardState } from './state';
import { api } from '../api';

type MainContext = ActionContext<PmDashboardState, State>;

export const actions = {
};

const { dispatch } = getStoreAccessors<PmDashboardState | any, State>('');
