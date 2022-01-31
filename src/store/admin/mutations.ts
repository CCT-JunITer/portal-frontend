import { Group, IFinanceRequest, IUserProfile, Request } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';

export const mutations = {
  setRequests(state: AdminState, payload: Request[]) {
    state.requests = payload;
  },
  setAdminUsers(state: AdminState, payload: IUserProfile[]) {
    state.users = payload;
  },
  setAdminOneUser(state: AdminState, payload: IUserProfile) {
    state.users = replace(state.users, payload);
  },
  setAlumniUsers(state: AdminState, payload: IUserProfile[]) {
    state.alumni = payload;
  },
  setAdminGroups(state: AdminState, payload: Group[]) {
    state.groups = payload;
  },
  setAdminGroup(state: AdminState, payload: Group) {
    state.groups = replace(state.groups, payload);
  },
  setAdminFinanceRequests(state: AdminState, payload: IFinanceRequest[]){
    state.financeRequests = payload;
  },
  setAdminFinanceRequest(state: AdminState, payload: IFinanceRequest){
    state.financeRequests = state.financeRequests.map(financeRequest => financeRequest.id !== payload.id ? financeRequest : payload);
  },
};

const { commit } = getStoreAccessors<AdminState, State>('');

export const commitSetRequests = commit(mutations.setRequests)
export const commitSetAdminUsers = commit(mutations.setAdminUsers)
export const commitSetAdminOneUser = commit(mutations.setAdminOneUser)
export const commitSetAlumniUsers = commit(mutations.setAlumniUsers)
export const commitSetAdminGroups = commit(mutations.setAdminGroups)
export const commitSetAdminGroup = commit(mutations.setAdminGroup)
export const commitSetAdminFinanceRequests = commit(mutations.setAdminFinanceRequests)
export const commitSetAdminFinanceRequest = commit(mutations.setAdminFinanceRequest)