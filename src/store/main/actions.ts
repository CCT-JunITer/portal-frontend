import { removeLocalUserStatus, saveLocalUserStatus, getLocalUserStatus, copyTextToClipboard } from './../../utils';
import { api } from '@/api';
import { 
  IUserProfileCreate, IUserProfileUpdate, IUserSettings, LabelledFile, RequestCreate, WorkExperienceCreate, WorkExperienceUpdate, UserSkillCreate, UserSkillUpdate, PMNoteCreate, PMNoteUpdate } from '@/interfaces';
import router from '@/router';
import { getLocalToken, removeLocalToken, saveLocalToken } from '@/utils';
import { AxiosError } from 'axios';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitAddNotification,
  commitRemoveNotification,
  commitSetDocEnums,
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
  async actionGetMasterdata(context: MainContext) {
    // Always load this
    return Promise.all([
      dispatchGetUserProfile(context),
      dispatchGetGroups(context),
      dispatchGetDocEnums(context),
    ])
  },
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
        await dispatchGetMasterdata(context);
        await dispatchRouteLoggedIn(context);
        commitSetLoggedIn(context, true);
        commitSetLogInError(context, false);
        commitAddNotification(context, { content: 'Logged in', color: 'success' });
      } else {
        await dispatchLogOut(context);
      }
    } catch (err) {
      commitSetLogInError(context, true);
      await dispatchLogOut(context);
    }
  },
  async actionGetDocEnums(context) {
    const response = await apiCall(context, api.getDocEnums);
    commitSetDocEnums(context, response.data);
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
  async actionUpdateUserStatsMe(context: MainContext) {
    const response = await apiCall(context, token => api.updateUserStatsMe(token));
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
          await dispatchGetMasterdata(context);
          commitSetLoggedIn(context, true);
          console.log('Logged in')
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
      const redirect = router.currentRoute.query.redirect as string;
      if (redirect) {
        // If redirect is root path, go to main instead to avoid guard redirect conflict
        const redirectPath = redirect === '/' ? '/main' : redirect;
        router.push(redirectPath);
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
        await dispatchGetMasterdata(context);
        await dispatchRouteLoggedIn(context);
        commitSetLoggedIn(context, true);
        commitSetLogInError(context, false);
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
  },

  async actionGetWorkExperiences(context: MainContext) {
    return await apiCall(context, api.getWorkExperiences);
  },
  async actionCreateWorkExperience(context: MainContext, payload: WorkExperienceCreate) {
    const response = await apiCallNotify(context, token => api.createWorkExperience(token, payload), { 
      successText: 'Berufserfahrung hinzugefügt' 
    });
    await dispatchGetUserProfile(context);
    return response.data;
  },
  async actionUpdateWorkExperience(context: MainContext, payload: { id: number; data: WorkExperienceUpdate }) {
    const response = await apiCallNotify(context, token => api.updateWorkExperience(token, payload.id, payload.data), {
      successText: 'Berufserfahrung aktualisiert'
    });
    await dispatchGetUserProfile(context);
    return response.data;
  },
  async actionDeleteWorkExperience(context: MainContext, id: number) {
    await apiCallNotify(context, token => api.deleteWorkExperience(token, id), {
      successText: 'Berufserfahrung gelöscht'
    });
    await dispatchGetUserProfile(context);
  },

  async actionGetUserSkills(context: MainContext) {
    return await apiCall(context, api.getUserSkills);
  },
  async actionCreateUserSkill(context: MainContext, payload: UserSkillCreate) {
    const response = await apiCallNotify(context, token => api.createUserSkill(token, payload), {
      successText: 'Fähigkeit hinzugefügt'
    });
    await dispatchGetUserProfile(context);
    return response.data;
  },
  async actionUpdateUserSkill(context: MainContext, payload: { id: number; data: UserSkillUpdate }) {
    const response = await apiCallNotify(context, token => api.updateUserSkill(token, payload.id, payload.data), {
      successText: 'Fähigkeit aktualisiert'
    });
    await dispatchGetUserProfile(context);
    return response.data;
  },
  async actionDeleteUserSkill(context: MainContext, id: number) {
    await apiCallNotify(context, token => api.deleteUserSkill(token, id), {
      successText: 'Fähigkeit gelöscht'
    });
    await dispatchGetUserProfile(context);
  },

  // PM Notes actions
  async actionGetPMNotes(context: MainContext, userId: number) {
    return await apiCall(context, token => api.getPMNotes(token, userId));
  },
  async actionCreatePMNote(context: MainContext, payload: { userId: number; data: PMNoteCreate }) {
    const response = await apiCallNotify(context, token => api.createPMNote(token, payload.userId, payload.data), {
      successText: 'Notiz hinzugefügt'
    });
    return response.data;
  },
  async actionUpdatePMNote(context: MainContext, payload: { userId: number; noteId: number; data: PMNoteUpdate }) {
    const response = await apiCallNotify(context, token => api.updatePMNote(token, payload.userId, payload.noteId, payload.data), {
      successText: 'Notiz aktualisiert'
    });
    return response.data;
  },
  async actionDeletePMNote(context: MainContext, payload: { userId: number; noteId: number }) {
    await apiCallNotify(context, token => api.deletePMNote(token, payload.userId, payload.noteId), {
      successText: 'Notiz gelöscht'
    });
  }
};

const { dispatch } = getStoreAccessors<MainState | any, State>('');

export const dispatchCheckApiError = dispatch(actions.actionCheckApiError);
export const dispatchCheckLoggedIn = dispatch(actions.actionCheckLoggedIn);
export const dispatchGetMasterdata = dispatch(actions.actionGetMasterdata);
export const dispatchGetDocEnums = dispatch(actions.actionGetDocEnums);

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
export const dispatchUpdateUserStatsMe = dispatch(actions.actionUpdateUserStatsMe);
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
export const dispatchToggleFeatureFlag = dispatch(actions.actionToggleFeatureFlag);

export const dispatchGetWorkExperiences = dispatch(actions.actionGetWorkExperiences);
export const dispatchCreateWorkExperience = dispatch(actions.actionCreateWorkExperience);
export const dispatchUpdateWorkExperience = dispatch(actions.actionUpdateWorkExperience);
export const dispatchDeleteWorkExperience = dispatch(actions.actionDeleteWorkExperience);

export const dispatchGetUserSkills = dispatch(actions.actionGetUserSkills);
export const dispatchCreateUserSkill = dispatch(actions.actionCreateUserSkill);
export const dispatchUpdateUserSkill = dispatch(actions.actionUpdateUserSkill);
export const dispatchDeleteUserSkill = dispatch(actions.actionDeleteUserSkill);

export const dispatchGetPMNotes = dispatch(actions.actionGetPMNotes);
export const dispatchCreatePMNote = dispatch(actions.actionCreatePMNote);
export const dispatchUpdatePMNote = dispatch(actions.actionUpdatePMNote);
export const dispatchDeletePMNote = dispatch(actions.actionDeletePMNote);
