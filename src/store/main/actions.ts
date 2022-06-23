import { removeLocalUserStatus, saveLocalUserStatus, getLocalUserStatus, copyTextToClipboard } from './../../utils';
import { api } from '@/api';
import { 
  IUserProfileCreate, IUserProfileUpdate, IUserSettings, LabelledFile, RequestCreate } from '@/interfaces';
import router from '@/router';
import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils';
import { AxiosError } from 'axios';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitAddNotification,
  commitRemoveNotification,
  commitSetAuthenticationURL,
  commitSetGroups,
  commitSetLoggedIn,
  commitSetLogInError,
  commitSetMyRequests,
  commitSetToken,
  commitSetUser,
  commitSetUserProfile,
  commitSetUsers,
  commitSetUserSettings,
  commitSetUserStatus
} from './mutations';
import { AppNotification, MainState } from './state';
import { apiCall, apiCallNotify } from '../utils';
import { format } from 'date-fns';
import { readIsFlagSet } from './getters';

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
    const response = await apiCall(context, api.getMe);
    commitSetUserProfile(context, response.data);
  },
  async actionGetUserSettings(context: MainContext) {
    const response = await apiCall(context, api.getUserSettingsMe);
    commitSetUserSettings(context, response.data);
  },
  async actionUpdateUserProfile(context: MainContext, payload: IUserProfileUpdate) {
    const response = await apiCallNotify(context, token => api.updateMe(token, payload));
    commitSetUserProfile(context, response.data);
  },
  async actionUpdateUserSettings(context: MainContext, payload: IUserSettings) {
    const response = await apiCallNotify(context, token => api.updateUserSettingsMe(token, payload));
    commitSetUserSettings(context, payload);
  },
  async actionSetPrimaryGroupMe(context: MainContext, groupId: number ) {
    await apiCallNotify(context, token => api.setPrimaryGroupMe(token, groupId), { successText: 'Primäre Gruppe wurde gesetzt' })
    await dispatchGetUserProfile(context);
  },
  async actionUploadFile(context: MainContext, payload: { file: File | string | Blob; fileName?: string }) {
    const response = await apiCallNotify(
      context, 
      token => api.uploadFile(token, payload.file, payload.fileName), 
      { loadingText: 'Datei wird hochgeladen', successText: 'Datei wurde hochgeladen' }
    )
    return response.data;
  },
  async actionDownloadDebitMandate(context: MainContext) {
    const response = await apiCallNotify(context, api.downloadDebitMandate, { successText: null, loadingText: 'Generiere Lastschriftmandat' });
    return response.data;
  },
  async actionDownloadFile(context: MainContext, payload: { filename: string }) {
    const response = await apiCall(context, token => api.downloadFile(token, payload.filename));
    return response.data;
  },
  async actionCreateVersionedFolder(context: MainContext, payload: { files: LabelledFile[] }) {
    const response = await apiCall(context, token => api.createVersionedFolder(token, payload.files));
    return response.data;
  },
  async actionAddFileToVersionedFolder(context: MainContext, payload: { folderId: string; files: LabelledFile[] }) {
    const response = await apiCall(context, token => api.addFilesToVersionedFolder(token, payload.folderId, payload.files));
    return response.data;
  },
  async actionDeleteFileFromVersionedFolder(context: MainContext, payload: { folderId: string; files: LabelledFile[] }) {
    const response = await apiCall(context, token => api.deleteFilesFromVersionedFolder(token, payload.folderId, payload.files));
    return response.data;
  },
  async actionGetVersionedFolder(context: MainContext, payload: { folderId: string }) {
    const response = await apiCall(context, token => api.getVersionedFolder(token, payload.folderId));
    return response.data;
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
      router.push({ path: '/login', query: { redirect: router.currentRoute.fullPath } });
    }
  },
  async actionCheckApiError(context: MainContext, payload: AxiosError) {
    if (!payload.response || payload.response!.status === 401) {
      await dispatchLogOut(context);
    }
  },
  actionRouteLoggedIn(context: MainContext) {
    if (router.currentRoute.path !== '/main') {
      if (context.state.userStatus === 'created') {
        router.push('/main/welcome')
        return;
      }
      const redirect = router.currentRoute.query.redirect;
      if (redirect as string) {
        router.push(redirect as string);
        return;
      }
      router.push('/main');
    }
  },
  async copyTextToClipboard(context: MainContext, payload: string) {
    try {
      await copyTextToClipboard(payload);
      commitAddNotification(context, { content: 'Text kopiert', color: 'success' })
    } catch(e) {
      commitAddNotification(context, { content: 'Text kopieren fehlgeschlagen', color: 'error' })
    }
  },
  async saveAsCsv(context: MainContext, payload: { data: any[]; fileName: string; headers: string[] ; renderRow: (row: any) => any[] }) {
    const { data, headers, renderRow, fileName } = payload;
    // file name
    const filename = `${format(new Date(), 'yyyyMMdd')}_${fileName}_PT.csv`;
    
    // column names
    const rows = [
      headers,
      ...data.map(item => {
        const row = renderRow(item);
        return row.map(value => {
          const content = value ? String(value) : '';
          if (content.indexOf('\n')){
            return `"${content}"`;
          }
          return content
        });
      })
    ];

    // create CSV
    const csvContent = '\uFEFF' + rows.map(e => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // download file
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    await apiCallNotify(context, () => api.passwordRecovery(payload.username), { successText: 'E-Mail versendet' })
    await dispatchLogOut(context);
  },
  async resetPassword(context: MainContext, payload: { password: string; token: string }) {
    await apiCallNotify(context, () => api.resetPassword(payload.password, payload.token))
    await dispatchLogOut(context);
  },
  async actionGetUsers(context: MainContext) {
    const response = await apiCall(context, token => api.getUsers(token, 'all'));
    commitSetUsers(context, response.data);
  },
  async actionGetOneUser(context: MainContext, payload: { userId: number }) {
    const response = await apiCall(context, token => api.getUser(token, payload.userId));
    commitSetUser(context, response.data);
  },
  async actionCreateUserOpen(context: MainContext, payload: {user: IUserProfileCreate; token: string}) {
    const loadingNotification = { content: 'Account wird erstellt', showProgress: true };
    try {
      commitAddNotification(context, loadingNotification);
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
        commitRemoveNotification(context, loadingNotification);
        commitAddNotification(context, { content: 'Account erstellt', color: 'success' });
      } else {
        await dispatchLogOut(context);
      }
    } catch (error: any) {
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: `Error: ${error.response.data?.detail}`, color: 'error' });
    }
  },
  // requests
  async actionGetMyRequests(context: MainContext) {
    const response = await apiCall(context, api.getMyRequests);
    commitSetMyRequests(context, response.data);
  },
  async actionAddRequestMe(context: MainContext, payload: RequestCreate) {
    await apiCallNotify(context, token => api.addMeRequest(token, payload), { successText: 'Antrag gespeichert' });
  },
  async actionGetGroups(context: MainContext) {
    const response = await apiCall(context, api.getGroups);
    commitSetGroups(context, response.data);
  },

  async actionAuthenticateNextcloud(context: MainContext) {
    const response = await apiCall(context, api.requestAuthenticationURL);
    commitSetAuthenticationURL(context, response.data)
  },
  async actionToggleFeatureFlag(context: MainContext, flag: string) {
    const features = context.state.userProfile?.features || [];
    let newFeatures: string[];
    if (readIsFlagSet(context)(flag)) {
      newFeatures = features.filter(feat => feat !== flag)
    } else {
      newFeatures = [...features, flag];
    }
    
    await dispatchUpdateUserProfile(context, {
      features: newFeatures
    })
  }
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchCheckApiError = dispatch(actions.actionCheckApiError);
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn);

export const dispatchGetUserProfile = dispatch(actions.actionGetUserProfile);
export const dispatchGetUserSettingsMe = dispatch(actions.actionGetUserSettings);
export const dispatchUpdateUserSettingsMe = dispatch(actions.actionUpdateUserSettings);
export const dispatchLogIn = dispatch(actions.actionLogIn);
export const dispatchLogOut = dispatch(actions.actionLogOut);
export const dispatchUserLogOut = dispatch(actions.actionUserLogOut);
export const dispatchRemoveLogIn = dispatch(actions.actionRemoveLogIn);
export const dispatchRouteLoggedIn = dispatch(actions.actionRouteLoggedIn);
export const dispatchRouteLogOut = dispatch(actions.actionRouteLogOut);
export const dispatchUpdateUserProfile = dispatch(actions.actionUpdateUserProfile);
export const dispatchUploadFile = dispatch(actions.actionUploadFile);
export const dispatchDownloadFile = dispatch(actions.actionDownloadFile);
export const dispatchCreateVersionedFolder = dispatch(actions.actionCreateVersionedFolder);
export const dispatchAddFileToVersionedFolder = dispatch(actions.actionAddFileToVersionedFolder);
export const dispatchDeleteFileFromVersionedFolder = dispatch(actions.actionDeleteFileFromVersionedFolder);
export const dispatchGetVersionedFolder = dispatch(actions.actionGetVersionedFolder);
export const dispatchDownloadDebitMandate = dispatch(actions.actionDownloadDebitMandate);
export const dispatchCopyTextToClipboard = dispatch(actions.copyTextToClipboard);
export const dispatchSaveAsCsv = dispatch(actions.saveAsCsv);
export const dispatchRemoveNotification = dispatch(actions.removeNotification);
export const dispatchPasswordRecovery = dispatch(actions.passwordRecovery);
export const dispatchResetPassword = dispatch(actions.resetPassword);
export const dispatchGetUsers = dispatch(actions.actionGetUsers);
export const dispatchGetOneUser = dispatch(actions.actionGetOneUser);
export const dispatchCreateUserOpen = dispatch(actions.actionCreateUserOpen); 
export const dispatchGetMyRequests = dispatch(actions.actionGetMyRequests); 
export const dispatchAddRequestMe = dispatch(actions.actionAddRequestMe); 
export const dispatchGetGroups = dispatch(actions.actionGetGroups); 
export const dispatchSetPrimaryGroupMe = dispatch(actions.actionSetPrimaryGroupMe)
export const dispatchActionAuthenticateNextcloud = dispatch(actions.actionAuthenticateNextcloud)
export const dispatchToggleFeatureFlag = dispatch(actions.actionToggleFeatureFlag);
