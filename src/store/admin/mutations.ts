import { Request } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const mutations = {
  setRequests(state: AdminState, payload: Request[]) {
    state.requests = payload;
  }
};

const { commit } = getStoreAccessors<AdminState, State>('');

export const commitSetRequests = commit(mutations.setRequests)