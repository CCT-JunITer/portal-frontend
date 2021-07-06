import { removeLocalUserStatus, saveLocalUserStatus, getLocalUserStatus } from './../../utils';
import { api } from '@/api';
import { IUserProfileCreate, RequestCreate } from '@/interfaces';
import router from '@/router';
import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils';
import { AxiosError } from 'axios';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitAddNotification,
  commitRemoveNotification,
  commitSetGroups,
  commitSetLoggedIn,
  commitSetLogInError,
  commitSetMyRequests,
  commitSetToken,
  commitSetTrainings,
  commitSetUserProfile,
  commitSetUsers,
  commitSetUserStatus
} from './mutations';
import { AppNotification, MainState } from './state';

type MainContext = ActionContext<MainState, State>;

export const actions = {
  async actionLogIn(context: MainContext, payload: { username: string; password: string }) {
    try {
      const response = await api.logInGetToken(payload.username, payload.password);
      const token = response.data.access_token;
      const user_status = response.data.user_status;
      if (token) {
        saveLocalToken(token);
        commitSetToken(context, token);
        saveLocalUserStatus(user_status);
        commitSetUserStatus(context, user_status);
        commitSetLoggedIn(context, true);
        commitSetLogInError(context, false);
        await dispatchGetUserProfile(context);
        await dispatchRouteLoggedIn(context);
        commitAddNotification(context, { content: 'Logged in', color: 'success' });
      } else {
        await dispatchLogOut(context);
      }
    } catch (err) {
      commitSetLogInError(context, true);
      await dispatchLogOut(context);
    }
  },
  async actionGetUserProfile(context: MainContext) {
    try {
      const response = await api.getMe(context.state.token);
      if (response.data) {
        commitSetUserProfile(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateUserProfile(context: MainContext, payload) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateMe(context.state.token, payload),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitSetUserProfile(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Profile successfully updated', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUploadFile(context: MainContext, payload: { file: File | string | Blob; fileName?: string }) {
    try {
      const loadingNotification = { content: 'Uploading', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.uploadFile(context.state.token, payload.file, payload.fileName),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Uploading completed', color: 'success' });
      return response.data;
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionDownloadFile(context: MainContext, payload: { filename: string }) {
    try {
      const response = await api.downloadFile(context.state.token, payload.filename);
      return response.data;
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionCheckLoggedIn(context: MainContext) {
    if (!context.state.isLoggedIn) {
      let token = context.state.token;
      if (!context.state.userStatus) {
        commitSetUserStatus(context, getLocalUserStatus() || '');
      }
      if (!token) {
        const localToken = getLocalToken();
        if (localToken) {
          commitSetToken(context, localToken);
          token = localToken;
        }
      }
      if (token) {
        try {
          const response = await api.getMe(token);
          commitSetLoggedIn(context, true);
          commitSetUserProfile(context, response.data);
        } catch (error) {
          await dispatchRemoveLogIn(context);
        }
      } else {
        await dispatchRemoveLogIn(context);
      }
    }
  },
  async actionRemoveLogIn(context: MainContext) {
    removeLocalToken();
    removeLocalUserStatus();
    commitSetToken(context, '');
    commitSetLoggedIn(context, false);
  },
  async actionLogOut(context: MainContext) {
    await dispatchRemoveLogIn(context);
    await dispatchRouteLogOut(context);
  },
  async actionUserLogOut(context: MainContext) {
    await dispatchLogOut(context);
    commitAddNotification(context, { content: 'Logged out', color: 'success' });
  },
  actionRouteLogOut(context: MainContext) {
    if (router.currentRoute.path !== '/login') {
      router.push('/login');
    }
  },
  async actionCheckApiError(context: MainContext, payload: AxiosError) {
    if (payload.response!.status === 401) {
      await dispatchLogOut(context);
    }
  },
  actionRouteLoggedIn(context: MainContext) {
    if (router.currentRoute.path !== '/main') {
      if (context.state.userStatus === 'created') {
        router.push('/main/welcome')
        return;
      }
      router.push('/main');
    }
  },
  async removeNotification(context: MainContext, payload: { notification: AppNotification; timeout: number }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commitRemoveNotification(context, payload.notification);
        resolve(true);
      }, payload.timeout);
    });
  },
  async passwordRecovery(context: MainContext, payload: { username: string }) {
    const loadingNotification = { content: 'Sending password recovery email', showProgress: true };
    try {
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.passwordRecovery(payload.username),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Password recovery email sent', color: 'success' });
      await dispatchLogOut(context);
    } catch (error) {
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { color: 'error', content: 'Incorrect username' });
    }
  },
  async resetPassword(context: MainContext, payload: { password: string; token: string }) {
    const loadingNotification = { content: 'Resetting password', showProgress: true };
    try {
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.resetPassword(payload.password, payload.token),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Password successfully reset', color: 'success' });
      await dispatchLogOut(context);
    } catch (error) {
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { color: 'error', content: 'Error resetting password' });
    }
  },
  async actionGetUsers(context: MainContext) {
    try {
      const response = await api.getUsers(context.rootState.main.token, 'all');
      if (response) {
        commitSetUsers(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionGetTrainings(context: MainContext) {
    try {
      const response = await api.getTrainings(context.rootState.main.token);
      if (response) {
        commitSetTrainings(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionCreateUserOpen(context: MainContext, payload: {user: IUserProfileCreate; token: string}) {
    try {
      const response = await api.createUserOpen(payload.token, payload.user);
      const token = response.data.access_token;
      const user_status = response.data.user_status;
      if (token) {
        saveLocalToken(token);
        commitSetToken(context, token);
        saveLocalUserStatus(user_status);
        commitSetUserStatus(context, user_status);
        commitSetLoggedIn(context, true);
        commitSetLogInError(context, false);
        await dispatchGetUserProfile(context);
        await dispatchRouteLoggedIn(context);
        commitAddNotification(context, { content: 'Account erstellt', color: 'success' });
      } else {
        await dispatchLogOut(context);
      }
    } catch (error) {
      commitAddNotification(context, { content: `Error: ${error.response.data?.detail}`, color: 'error' });
    }
  },
  // requests
  async actionGetMyRequests(context: MainContext) {
    try {
      const response = await api.getMyRequests(context.rootState.main.token);
      if (response) {
        commitSetMyRequests(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionAddRequestMe(context: MainContext, payload: RequestCreate) {
    try {
      const response = await api.addMeRequest(context.rootState.main.token, payload);
      commitAddNotification(context, { content: 'Antrag wurde abgeschickt', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionGetGroups(context: MainContext) {
    try {
      const response = await api.getGroups(context.rootState.main.token);
      if (response) {
        commitSetGroups(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchCheckApiError = dispatch(actions.actionCheckApiError);
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn);
export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile);
export const dispatchLogIn = dispatch(actions.actionLogIn);
export const dispatchLogOut = dispatch(actions.actionLogOut);
export const dispatchUserLogOut = dispatch(actions.actionUserLogOut);
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn);
export const dispatchRouteLoggedIn = dispatch(actions.actionRouteLoggedIn);
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut);
export const dispatchUpdateUserProfile = dispatch(actions.actionUpdateUserProfile);
export const dispatchUploadFile = dispatch(actions.actionUploadFile);
export const dispatchDownloadFile = dispatch(actions.actionDownloadFile);
export const dispatchRemoveNotification = dispatch(actions.removeNotification);
export const dispatchPasswordRecovery = dispatch(actions.passwordRecovery);
export const dispatchResetPassword = dispatch(actions.resetPassword);
export const dispatchGetUsers = dispatch(actions.actionGetUsers);
export const dispatchGetTrainings = dispatch(actions.actionGetTrainings);
export const dispatchCreateUserOpen = dispatch(actions.actionCreateUserOpen); 
export const dispatchGetMyRequests = dispatch(actions.actionGetMyRequests); 
export const dispatchAddRequestMe = dispatch(actions.actionAddRequestMe); 
export const dispatchGetGroups = dispatch(actions.actionGetGroups); 
