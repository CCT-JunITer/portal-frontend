import { IFinanceRequest, IUserProfile, Request } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const mutations = {
  setRequests(state: AdminState, payload: Request[]) {
    state.requests = payload;
  },
  setAdminUsers(state: AdminState, payload: IUserProfile[]){
    state.users = payload;
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
export const commitSetAdminFinanceRequests = commit(mutations.setAdminFinanceRequests)
export const commitSetAdminFinanceRequest = commit(mutations.setAdminFinanceRequest)