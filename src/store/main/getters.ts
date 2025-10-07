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
  isFlagSet: (state: MainState) => (flag: string) => {
    const features = state.userProfile?.features || [];
    return features.indexOf(flag) !== -1;
  },
  toolbarColor: () => {
    //
  },
  isMe: (state: MainState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    const me = state.userProfile;
    const isMe = id === 'me' || numberId === me?.id;
    return isMe;
  },
  users: (state: MainState) => state.users,
  oneUser: (state: MainState) => (userId: number) => {
    const filteredUsers = state.users.filter((user) => user.id === userId);
    if (filteredUsers.length > 0) {
      return { ...filteredUsers[0] };
    }
  },
  hasAdminAccess: (state: MainState) => {
    return (
      state.userProfile && state.userProfile.permissions.find(p => p.indexOf('admin') !== -1 || p.indexOf('*') !== -1));
  },
  isProjektmanager: (state: MainState) => {
    const user = state.userProfile;
    if (!user) {
      return false;
    }
    // Check if user has admin access
    const hasAdmin = user.permissions.find(p => p.indexOf('admin') !== -1 || p.indexOf('*') !== -1);
    if (hasAdmin) {
      return true;
    }
    // Check if user has Projektmanager as their ressort
    if (user.ressort === 'Projektmanager') {
      return true;
    }
    // Also check active_groups for ressort type with name 'Projektmanager'
    return user.active_groups?.some(group => 
      group.type === 'ressort' && group.name === 'Projektmanager'
    ) || false;
  },
  hasAnyPermission: (state: MainState) => (permissions: string[]) => {
    const user = state.userProfile;
    if (!user) {
      return false;
    }
    return permissions.some(p => 
      user.permissions.some(perm => p.match(new RegExp('^' + perm.replace('*', '.*') + '$')))
    );
  },
  loginError: (state: MainState) => state.logInError,
  dashboardShowDrawer: (state: MainState) => state.dashboardShowDrawer,
  dashboardMiniDrawer: (state: MainState) => state.dashboardMiniDrawer,
  userProfile: (state: MainState) => state.userProfile,
  userSettings: (state: MainState) => state.userSettings,
  token: (state: MainState) => state.token,
  userStatus: (state: MainState) => state.userStatus,
  isLoggedIn: (state: MainState) => state.isLoggedIn,
  firstNotification: (state: MainState) => state.notifications.length > 0 && state.notifications[0],
  myRequests: (state: MainState) => state.myRequests,
  groups: (state: MainState) => state.groups,
  oneDocEnum: (state: MainState) => (name: string) => state.docEnums[name],
};

const {read} = getStoreAccessors<MainState, State>('');

export const readDashboardMiniDrawer = read(getters.dashboardMiniDrawer);
export const readDashboardShowDrawer = read(getters.dashboardShowDrawer);
export const readHasAdminAccess = read(getters.hasAdminAccess);
export const readIsProjektmanager = read(getters.isProjektmanager);
export const readHasAnyPermission = read(getters.hasAnyPermission);
export const readToolbarColor = read(getters.toolbarColor);
export const readIsLoggedIn = read(getters.isLoggedIn);
export const readLoginError = read(getters.loginError);
export const readToken = read(getters.token);
export const readUserStatus = read(getters.userStatus);
export const readUserProfile = read(getters.userProfile);
export const readFirstNotification = read(getters.firstNotification);
export const readOneUser = read(getters.oneUser);
export const readUsers = read(getters.users);
export const readUserSettings = read(getters.userSettings);
export const readIsMe = read(getters.isMe);
export const readRouteUser = read(getters.routeUser);
export const readMyRequests = read(getters.myRequests);
export const readGroups = read(getters.groups);
export const readIsFlagSet = read(getters.isFlagSet);
export const readOneDocEnum = read(getters.oneDocEnum);
