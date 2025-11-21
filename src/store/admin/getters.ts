import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  requests: (state: AdminState) => state.requests,
  adminGroups: (state: AdminState) => state.groups,
  adminOneGroup: (state: AdminState) => (groupId: number) => {
    return state.groups.find((group) => group.id === groupId);
  },
  adminUsers: (state: AdminState) => state.users,
  adminAlumni: (state: AdminState) => state.alumni,
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
  adminArchivedFinanceRequests: (state: AdminState) => state.archivedFinanceRequests,
  
};

const { read } = getStoreAccessors<AdminState, State>('');

export const readAdminRequests = read(getters.requests);
export const readAdminUsers = read(getters.adminUsers);
export const readAdminAlumni = read(getters.adminAlumni);
export const readAdminGroups = read(getters.adminGroups);
export const readAdminOneGroup = read(getters.adminOneGroup);
export const readAdminOneUser = read(getters.adminOneUser);
export const readAdminFinanceRequests = read(getters.adminFinanceRequests);
export const readAdminOneFinanceRequest = read(getters.adminOneFinanceRequest);
export const readAdminArchivedFinanceRequests = read(getters.adminArchivedFinanceRequests);
