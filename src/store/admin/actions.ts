import { api } from '@/api';
import { ActionContext } from 'vuex';
import { IUserProfileCreate, IUserProfileUpdate, UserInvite, IFinanceRequestCreate, IFinanceRequestUpdate, GroupCreate, GroupUpdate } from '@/interfaces';
import { State } from '../state';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { commitAddNotification, commitSetLoggedIn, commitSetLogInError, commitSetToken, commitSetUser, commitSetUserStatus } from '../main/mutations';
import { commitSetAdminFinanceRequest, commitSetAdminFinanceRequests, commitSetAdminGroup, commitSetAdminGroups, commitSetAdminOneUser, commitSetAdminUsers, commitSetAlumniUsers, commitSetRequests } from './mutations';
import { apiCall, apiCallNotify } from '../utils';
import { saveLocalToken, saveLocalUserStatus } from '@/utils';
import { dispatchGetUserProfile, dispatchRouteLoggedIn } from '../main/actions';

type MainContext = ActionContext<AdminState, State>;

export const actions = {
  async actionGetAdminUsers(context: MainContext) {
    const response = await apiCall(context, (token) => api.getAdminUsers(token, 'all'));
    commitSetAdminUsers(context, response.data);
  },
  async actionGetAdminAlumni(context: MainContext) {
    const response = await apiCall(context, api.getAlumniUsers);
    commitSetAlumniUsers(context, response.data);
  },
  async actionGetOneAdminUser(context: MainContext, payload: { userId: number }) {
    const response = await apiCall(context, (token) => api.getAdminOneUser(token, payload.userId));
    commitSetAdminOneUser(context, response.data);
  },
  async actionDeleteUser(context: MainContext, id: number) {
    const response = await apiCallNotify(context, (token) => api.deleteUser(token, id));
    commitSetUser(context, response.data);
  },
  async actionUpdateUserState(context: MainContext, payload: { id: number; state: 'activate' | 'deactivate', new_password?: string }) {
    const response = await apiCallNotify(context, (token) => api.updateUserState(token, payload.id, payload.state, payload.new_password));
    return response.data;
  },
  async actionUpdateUser(context: MainContext, payload: { id: number; user: IUserProfileUpdate }) {
    const response = await apiCallNotify(context, (token) => api.updateUser(token, payload.id, payload.user));
    commitSetUser(context, response.data);
  },
  async actionCreateUser(context: MainContext, payload: IUserProfileCreate) {
    const response = await apiCallNotify(context, (token) => api.createUser(token, payload));
  },
  async actionSendInvites(context: MainContext, payload: UserInvite[]) {
    const response = await apiCallNotify(context, (token) => api.sendInvites(token, payload));
    return response.data;
  },
  // requests
  async actionGetRequests(context: MainContext, payload: { userId?: number } | undefined) {
    const response = await apiCall(context, (token) => api.getRequests(token, payload?.userId));
    commitSetRequests(context, response.data);
  },
  async actionGetAdminGroups(context: MainContext) {
    const response = await apiCall(context, api.getAdminGroups);
    commitSetAdminGroups(context, response.data);
  },
  async actionCreateGroup(context: MainContext, payload: GroupCreate) {
    const response = await apiCallNotify(context, (token) => api.createGroup(token, payload));
    await dispatchGetAdminGroups(context); 
  },
  async actionUpdateGroup(context: MainContext, payload: { id: number;  group: GroupUpdate}) {
    const response = await apiCallNotify(context, (token) => api.updateGroup(token, payload.id, payload.group));
    commitSetAdminGroup(context, response.data);
  },
  async actionAddUserToGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    const response = await apiCallNotify(context, (token) => api.addUserToGroup(token, payload.userId, payload.groupId));
    await dispatchGetAdminUsers(context);
  },
  async actionEditUserGroup(context: MainContext, payload: { userId: number; userGroupId: number; payload: { date_from: string; date_to: string } }) {
    const response = await apiCallNotify(context, (token) => api.editUserGroup(token, payload.userId, payload.userGroupId, payload.payload));
    await dispatchGetAdminUsers(context);
  },
  async actionRemoveUserFromGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    const response = await apiCallNotify(context, (token) => api.removeUserFromGroup(token, payload.userId, payload.groupId));
    await dispatchGetAdminUsers(context);
  },
  async actionSetPrimaryGroup(context: MainContext, payload: { userId: number; groupId: number }) {
    const response = await apiCallNotify(context, (token) => api.setPrimaryGroup(token, payload.userId, payload.groupId));
    await dispatchGetAdminUsers(context);
  },
  async actionApplyRequest(context: MainContext, payload: { requestId: number; accepted: boolean }) {
    const response = await apiCallNotify(context, (token) => api.applyRequest(token, payload.requestId, payload.accepted));
    await dispatchAdminRequests(context, undefined);
  },
  async actionGetFinanceRequestsAdmin(context: MainContext) {
    const response = await apiCall(context, api.getAllFinanceRequests);
    commitSetAdminFinanceRequests(context, response.data);
  },
  // TODO User ID?? 
  async actionCreateFinanceRequestAdmin(context: MainContext, payload: IFinanceRequestCreate) {
    const response = await apiCallNotify(context, token => api.createFinanceRequest(token, payload));
    commitSetAdminFinanceRequest(context, response.data);
  },
  async actionUpdateFinanceRequestAdmin(context: MainContext, payload: { id: number; financeRequest: IFinanceRequestUpdate }) {
    const response = await apiCallNotify(context, token => api.updateFinanceRequest(token, payload.id, payload.financeRequest));
    commitSetAdminFinanceRequest(context, response.data);
  },
  async actionImpersonateUser(context: MainContext, payload: { userId: number }) {
    const response = await apiCall(context, token => api.impersonateUser(token, payload.userId));
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
      commitAddNotification(context, { content: 'Impersonating user', color: 'success' });
    }
  }
};

const { dispatch } = getStoreAccessors<AdminState, State>('');

export const dispatchGetAdminUsers = dispatch(actions.actionGetAdminUsers);
export const dispatchGetAdminAlumni = dispatch(actions.actionGetAdminAlumni);
export const dispatchGetOneAdminUser = dispatch(actions.actionGetOneAdminUser);
export const dispatchCreateUser = dispatch(actions.actionCreateUser);
export const dispatchUpdateUser = dispatch(actions.actionUpdateUser);
export const dispatchDeleteUser = dispatch(actions.actionDeleteUser);
export const dispatchUpdateUserState = dispatch(actions.actionUpdateUserState);
export const dispatchSendInvites = dispatch(actions.actionSendInvites);
export const dispatchAdminRequests = dispatch(actions.actionGetRequests);
export const dispatchGetAdminGroups = dispatch(actions.actionGetAdminGroups);
export const dispatchUpdateGroup = dispatch(actions.actionUpdateGroup);
export const dispatchCreateGroup = dispatch(actions.actionCreateGroup);
export const dispatchApplyRequest = dispatch(actions.actionApplyRequest);
export const dispatchAddUserToGroup = dispatch(actions.actionAddUserToGroup);
export const dispatchEditUserGroup = dispatch(actions.actionEditUserGroup);
export const dispatchRemoveUserFromGroup = dispatch(actions.actionRemoveUserFromGroup);
export const dispatchSetPrimaryGroup = dispatch(actions.actionSetPrimaryGroup);
export const dispatchAdminFinanceRequests = dispatch(actions.actionGetFinanceRequestsAdmin);
export const dispatchImpersonateUser = dispatch(actions.actionImpersonateUser);

