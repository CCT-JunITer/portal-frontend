import { IUserProfile, Request } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const mutations = {
  setRequests(state: AdminState, payload: Request[]) {
    state.requests = payload;
  },
  setAdminUsers(state: AdminState, payload: IUserProfile[]){
    state.users = payload;
  }
};

const { commit } = getStoreAccessors<AdminState, State>('');

export const commitSetRequests = commit(mutations.setRequests)
export const commitSetAdminUsers = commit(mutations.setAdminUsers)