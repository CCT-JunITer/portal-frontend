import { api } from '@/api';
import { ActionContext } from 'vuex';
import { IUserProfileCreate, IUserProfileUpdate, UserInvite, ITrainingCreate } from '@/interfaces';
import { State } from '../state';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { dispatchCheckApiError } from '../main/actions';
import { commitAddNotification, commitRemoveNotification, commitSetUser } from '../main/mutations';
import { commitSetAdminUsers, commitSetRequests } from './mutations';

type MainContext = ActionContext<AdminState, State>;

export const actions = {
  async actionGetAdminUsers(context: MainContext) {
    try {
      const response = await api.getAdminUsers(context.rootState.main.token, 'all');
      if (response) {
        commitSetAdminUsers(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionDeleteUser(context: MainContext, id: number) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.deleteUser(context.rootState.main.token, id),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'User successfully updated', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateUser(context: MainContext, payload: { id: number; user: IUserProfileUpdate }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateUser(context.rootState.main.token, payload.id, payload.user),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'User successfully updated', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionCreateUser(context: MainContext, payload: IUserProfileCreate) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.createUser(context.rootState.main.token, payload),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'User successfully created', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionSendInvites(context: MainContext, payload: UserInvite[]) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.sendInvites(context.rootState.main.token, payload),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Einladungen wurden versendet', color: 'success' });

      return response.data;
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  // requests
  async actionGetRequests(context: MainContext, payload: { userId?: number } | undefined) {
    try {
      const response = await api.getRequests(context.rootState.main.token, payload?.userId);
      if (response) {
        commitSetRequests(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionAddUserToGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = await api.addUserToGroup(context.rootState.main.token, payload.userId, payload.groupId);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Erfolgreich hinzugefügt', color: 'success' });
      await dispatchGetAdminUsers(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionRemoveUserFromGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = await api.removeUserFromGroup(context.rootState.main.token, payload.userId, payload.groupId);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Erfolgreich gelöscht', color: 'success' });
      await dispatchGetAdminUsers(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionSetPrimaryGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = await api.setPrimaryGroup(context.rootState.main.token, payload.userId, payload.groupId);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Erfolgreich primäre Gruppe gesetzt', color: 'success' });
      await dispatchGetAdminUsers(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionApplyRequest(context: MainContext, payload: { requestId: number; accepted: boolean }) {

    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = await api.applyRequest(context.rootState.main.token, payload.requestId, payload.accepted);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Antrag erfolgreich bearbeitet', color: 'success' });
      await dispatchAdminRequests(context, undefined);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  }
};

const { dispatch } = getStoreAccessors<AdminState, State>('');

export const dispatchGetAdminUsers = dispatch(actions.actionGetAdminUsers);
export const dispatchCreateUser = dispatch(actions.actionCreateUser);
export const dispatchUpdateUser = dispatch(actions.actionUpdateUser);
export const dispatchDeleteUser = dispatch(actions.actionDeleteUser);
export const dispatchSendInvites = dispatch(actions.actionSendInvites);
export const dispatchAdminRequests = dispatch(actions.actionGetRequests);
export const dispatchApplyRequest = dispatch(actions.actionApplyRequest);
export const dispatchAddUserToGroup = dispatch(actions.actionAddUserToGroup);
export const dispatchRemoveUserFromGroup = dispatch(actions.actionRemoveUserFromGroup);
export const dispatchSetPrimaryGroup = dispatch(actions.actionSetPrimaryGroup);
