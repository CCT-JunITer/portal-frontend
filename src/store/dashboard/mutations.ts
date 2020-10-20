import { DashboardState} from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';


export const mutations = {
    setSearchText(state: DashboardState, payload: string | null) {
        state.searchText = payload;
    },
    setFilters(state: DashboardState, payload: string[]) {
        state.filters = payload;
    },
};

const {commit} = getStoreAccessors<DashboardState | any, State>('');

export const commitSetSearchText = commit(mutations.setSearchText);
export const commitSetFilters = commit(mutations.setFilters);
