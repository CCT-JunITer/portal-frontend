import {getStoreAccessors} from 'typesafe-vuex';
import {ActionContext} from 'vuex';
import {State} from '../state';
import {DashboardState} from '@/store/dashboard/state';

type MainContext = ActionContext<DashboardState, State>;

export const actions = {

};

const { dispatch } = getStoreAccessors<DashboardState | any, State>('');
