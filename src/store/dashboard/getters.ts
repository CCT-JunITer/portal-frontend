import { DashboardState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  searchText: (state: DashboardState) => state.searchText,
  getFilters: (state: DashboardState) => state.filters,
};

const {read} = getStoreAccessors<DashboardState, State>('');

export const readSearchText = read(getters.searchText);
export const readFilters = read(getters.getFilters);
