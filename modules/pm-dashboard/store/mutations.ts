import { PmDashboardState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';


export const mutations = {
  
};

const {commit} = getStoreAccessors<PmDashboardState | any, State>('');
