import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { MainState } from './state';

const defaultState: MainState = {
  isLoggedIn: null,
  token: '',
  userStatus: '',
  logInError: false,
  userProfile: null,
  userSettings: null,
  dashboardMiniDrawer: false,
  dashboardShowDrawer: false,
  notifications: [],
  users: [],
  myRequests: [],
  groups: [],
};

export const mainModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
