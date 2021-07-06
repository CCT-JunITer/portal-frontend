import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  requests: (state: AdminState) => state.requests,
};

const { read } = getStoreAccessors<AdminState, State>('');

export const readAdminRequests = read(getters.requests);