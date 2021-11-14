import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  requests: (state: AdminState) => state.requests,
  adminUsers: (state: AdminState) => state.users,
  adminOneUser: (state: AdminState) => (userId: number) => {
    const filteredUsers = state.users.filter((user) => user.id === userId);
    if (filteredUsers.length > 0) {
      return { ...filteredUsers[0] };
    }
  },
  adminFinanceRequests: (state: AdminState) => state.financeRequests,
  adminOneFinanceRequest: (state: AdminState) => (financeId: number) => {
    const filteredFinanceRequests = state.financeRequests.filter((financeRequest) => financeRequest.id === financeId);
    if (filteredFinanceRequests.length > 0) {
      return { ...filteredFinanceRequests[0] };
    }
  },
  
};

const { read } = getStoreAccessors<AdminState, State>('');

export const readAdminRequests = read(getters.requests);
export const readAdminUsers = read(getters.adminUsers);
export const readAdminOneUser = read(getters.adminOneUser);
export const readAdminFinanceRequests = read(getters.adminFinanceRequests);
export const readAdminOneFinanceRequest = read(getters.adminOneFinanceRequest);
