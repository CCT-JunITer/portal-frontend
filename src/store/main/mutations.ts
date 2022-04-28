import { Group, IUserProfile, Request, IEvent, IEventApplication, IUserSettings } from '@/interfaces';
import { MainState, AppNotification } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';


export const mutations = {
  setToken(state: MainState, payload: string) {
    state.token = payload;
  },
  setUserStatus(state: MainState, payload: string) {
    state.userStatus = payload;
  },
  setLoggedIn(state: MainState, payload: boolean) {
    state.isLoggedIn = payload;
  },
  setLogInError(state: MainState, payload: boolean) {
    state.logInError = payload;
  },
  setUserProfile(state: MainState, payload: IUserProfile) {
    state.userProfile = payload;
  },
  setUserSettings(state: MainState, payload: IUserSettings) {
    state.userSettings = payload;
  },
  setDashboardMiniDrawer(state: MainState, payload: boolean) {
    state.dashboardMiniDrawer = payload;
  },
  setDashboardShowDrawer(state: MainState, payload: boolean) {
    state.dashboardShowDrawer = payload;
  },
  addNotification(state: MainState, payload: AppNotification) {
    state.notifications.push(payload);
  },
  removeNotification(state: MainState, payload: AppNotification) {
    state.notifications = state.notifications.filter((notification) => notification !== payload);
  },
  setUsers(state: MainState, payload: IUserProfile[]) {
    state.users = payload;
  },
  setUser(state: MainState, payload: IUserProfile) {
    state.users = replace(state.users, payload);
  },
  setMyRequests(state: MainState, payload: Request[]) {
    state.myRequests = payload;
  },
  setGroups(state: MainState, payload: Group[]) {
    state.groups = payload;
  },
  setAuthenticationURL(state: MainState, url: string) {
    state.authenticationURL = url;
  }
};

const {commit} = getStoreAccessors<MainState | any, State>('');

export const commitSetDashboardMiniDrawer = commit(mutations.setDashboardMiniDrawer);
export const commitSetDashboardShowDrawer = commit(mutations.setDashboardShowDrawer);
export const commitSetLoggedIn = commit(mutations.setLoggedIn);
export const commitSetLogInError = commit(mutations.setLogInError);
export const commitSetToken = commit(mutations.setToken);
export const commitSetUserStatus = commit(mutations.setUserStatus);
export const commitSetUserProfile = commit(mutations.setUserProfile);
export const commitSetUserSettings = commit(mutations.setUserSettings);
export const commitAddNotification = commit(mutations.addNotification);
export const commitRemoveNotification = commit(mutations.removeNotification);
export const commitSetUser = commit(mutations.setUser);
export const commitSetUsers = commit(mutations.setUsers);
export const commitSetMyRequests = commit(mutations.setMyRequests);
export const commitSetGroups = commit(mutations.setGroups);
export const commitSetAuthenticationURL = commit(mutations.setAuthenticationURL);

