import { Route } from 'vue-router';
import { MainState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  routeUser: (state: MainState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    const me = state.userProfile;
    const isMe = id === 'me' || numberId === me?.id;

    if (isMe) {
      return me;
    }
    return state.users.find(user => user.id === numberId);
  },
  isMe: (state: MainState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    const me = state.userProfile;
    const isMe = id === 'me' || numberId === me?.id;
    return isMe;
  },
  adminUsers: (state: MainState) => state.users,
  adminOneUser: (state: MainState) => (userId: number) => {
    const filteredUsers = state.users.filter((user) => user.id === userId);
    if (filteredUsers.length > 0) {
      return { ...filteredUsers[0] };
    }
  },
  hasAdminAccess: (state: MainState) => {
    return (
      state.userProfile &&
            state.userProfile.is_superuser && state.userProfile.is_active);
  },
  loginError: (state: MainState) => state.logInError,
  dashboardShowDrawer: (state: MainState) => state.dashboardShowDrawer,
  dashboardMiniDrawer: (state: MainState) => state.dashboardMiniDrawer,
  userProfile: (state: MainState) => state.userProfile,
  token: (state: MainState) => state.token,
  isLoggedIn: (state: MainState) => state.isLoggedIn,
  firstNotification: (state: MainState) => state.notifications.length > 0 && state.notifications[0],
};

const {read} = getStoreAccessors<MainState, State>('');

export const readDashboardMiniDrawer = read(getters.dashboardMiniDrawer);
export const readDashboardShowDrawer = read(getters.dashboardShowDrawer);
export const readHasAdminAccess = read(getters.hasAdminAccess);
export const readIsLoggedIn = read(getters.isLoggedIn);
export const readLoginError = read(getters.loginError);
export const readToken = read(getters.token);
export const readUserProfile = read(getters.userProfile);
export const readFirstNotification = read(getters.firstNotification);
export const readAdminOneUser = read(getters.adminOneUser);
export const readAdminUsers = read(getters.adminUsers);
export const readIsMe = read(getters.isMe);
export const readRouteUser = read(getters.routeUser);
