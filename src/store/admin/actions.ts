import { api } from '@/api';
import { ActionContext } from 'vuex';
import { IUserProfileCreate, IUserProfileUpdate, UserInvite } from '@/interfaces';
import { State } from '../state';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { dispatchCheckApiError, dispatchGetUsers } from '../main/actions';
import { commitAddNotification, commitRemoveNotification, commitSetUser } from '../main/mutations';
import { commitSetRequests } from './mutations';

type MainContext = ActionContext<AdminState, State>;

export const actions = {
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
      commitSetUser(context, response.data);
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
  async actionGetRequests(context: MainContext, payload?: { userId?: number }) {
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
      await dispatchGetUsers(context);
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
      await dispatchGetUsers(context);
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
      await dispatchAdminRequests(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  }
};

const { dispatch } = getStoreAccessors<AdminState, State>('');

export const dispatchCreateUser = dispatch(actions.actionCreateUser);
export const dispatchUpdateUser = dispatch(actions.actionUpdateUser);
export const dispatchSendInvites = dispatch(actions.actionSendInvites);
export const dispatchAdminRequests = dispatch(actions.actionGetRequests);
export const dispatchApplyRequest = dispatch(actions.actionApplyRequest);
export const dispatchAddUserToGroup = dispatch(actions.actionAddUserToGroup);
export const dispatchRemoveUserFromGroup = dispatch(actions.actionRemoveUserFromGroup);