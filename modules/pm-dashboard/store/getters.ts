import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { PmDashboardState } from './state';

export const getters = {
};

const {read} = getStoreAccessors<PmDashboardState, State>('');
