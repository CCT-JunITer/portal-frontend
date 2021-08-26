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
  users: (state: MainState) => state.users,
  trainingsForRoute: (state: MainState) => (route: Route) => {
    const user = getters.routeUser(state)(route);
    if (!user) {
      return [];
    }
    return state.trainingsParticipants[user.id] || [];
  },
  oneUser: (state: MainState) => (userId: number) => {
    const filteredUsers = state.users.filter((user) => user.id === userId);
    if (filteredUsers.length > 0) {
      return { ...filteredUsers[0] };
    }
  },
  oneTraining: (state: MainState) => (trainingId: number) => {
    const filteredTrainings = state.trainings.filter((trainig) => trainig.id === trainingId);
    if (filteredTrainings.length > 0) {
      return { ...filteredTrainings[0] };
    }
  },
  hasAdminAccess: (state: MainState) => {
    return (
      state.userProfile &&
            state.userProfile.is_superuser && state.userProfile.is_active);
  },
  trainings: (state: MainState) => state.trainings,
  loginError: (state: MainState) => state.logInError,
  dashboardShowDrawer: (state: MainState) => state.dashboardShowDrawer,
  dashboardMiniDrawer: (state: MainState) => state.dashboardMiniDrawer,
  userProfile: (state: MainState) => state.userProfile,
  token: (state: MainState) => state.token,
  userStatus: (state: MainState) => state.userStatus,
  isLoggedIn: (state: MainState) => state.isLoggedIn,
  firstNotification: (state: MainState) => state.notifications.length > 0 && state.notifications[0],
  myRequests: (state: MainState) => state.myRequests,
  groups: (state: MainState) => state.groups,
};

const {read} = getStoreAccessors<MainState, State>('');

export const readDashboardMiniDrawer = read(getters.dashboardMiniDrawer);
export const readDashboardShowDrawer = read(getters.dashboardShowDrawer);
export const readHasAdminAccess = read(getters.hasAdminAccess);
export const readIsLoggedIn = read(getters.isLoggedIn);
export const readLoginError = read(getters.loginError);
export const readToken = read(getters.token);
export const readUserStatus = read(getters.userStatus);
export const readUserProfile = read(getters.userProfile);
export const readFirstNotification = read(getters.firstNotification);
export const readOneUser = read(getters.oneUser);
export const readOneTraining = read(getters.oneTraining);
export const readUsers = read(getters.users);
export const readIsMe = read(getters.isMe);
export const readRouteUser = read(getters.routeUser);
export const readTrainingsForRoute = read(getters.trainingsForRoute)
export const readTrainings = read(getters.trainings);
export const readMyRequests = read(getters.myRequests);
export const readGroups = read(getters.groups);
