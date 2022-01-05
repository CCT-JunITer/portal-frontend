import { Group, IFinanceRequest, IUserProfile, Request } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const mutations = {
  setRequests(state: AdminState, payload: Request[]) {
    state.requests = payload;
  },
  setAdminUsers(state: AdminState, payload: IUserProfile[]) {
    state.users = payload;
  },
  setAlumniUsers(state: AdminState, payload: IUserProfile[]) {
    state.alumni = payload;
  },
  setAdminGroups(state: AdminState, payload: Group[]) {
    state.groups = payload;
  },
  setAdminGroup(state: AdminState, payload: Group) {
    const users = state.groups.filter((group: Group) => group.id !== payload.id);
    users.push(payload);
    state.groups = users;
  },
  setAdminFinanceRequests(state: AdminState, payload: IFinanceRequest[]){
    state.financeRequests = payload;
  },
  setAdminFinanceRequest(state: AdminState, payload: IFinanceRequest){
    const financeReqeusts = state.financeRequests.filter((financeRequest: IFinanceRequest) => financeRequest.id !== payload.id);
    financeReqeusts.push(payload);
    state.financeRequests = financeReqeusts;
  },
};

const { commit } = getStoreAccessors<AdminState, State>('');

export const commitSetRequests = commit(mutations.setRequests)
export const commitSetAdminUsers = commit(mutations.setAdminUsers)
export const commitSetAlumniUsers = commit(mutations.setAlumniUsers)
export const commitSetAdminGroups = commit(mutations.setAdminGroups)
export const commitSetAdminGroup = commit(mutations.setAdminGroup)
export const commitSetAdminFinanceRequests = commit(mutations.setAdminFinanceRequests)
export const commitSetAdminFinanceRequest = commit(mutations.setAdminFinanceRequest)