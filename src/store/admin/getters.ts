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
};

const { read } = getStoreAccessors<AdminState, State>('');

export const readAdminRequests = read(getters.requests);
export const readAdminUsers = read(getters.adminUsers);
export const readAdminOneUser = read(getters.adminOneUser);