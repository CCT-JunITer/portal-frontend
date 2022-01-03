import { api } from '@/api';
import { ActionContext } from 'vuex';
import { IUserProfileCreate, IUserProfileUpdate, UserInvite, IFinanceRequestCreate, IFinanceRequestUpdate, GroupCreate, GroupUpdate } from '@/interfaces';
import { State } from '../state';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { commitSetUser } from '../main/mutations';
import { commitSetAdminFinanceRequest, commitSetAdminFinanceRequests, commitSetAdminGroup, commitSetAdminGroups, commitSetAdminUsers, commitSetAlumniUsers, commitSetRequests } from './mutations';
import { apiCall, apiCallNotify } from '../utils';

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
  async actionDeleteUser(context: MainContext, id: number) {
    const response = await apiCallNotify(context, (token) => api.deleteUser(token, id));
    commitSetUser(context, response.data);
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
};

const { dispatch } = getStoreAccessors<AdminState, State>('');

export const dispatchGetAdminUsers = dispatch(actions.actionGetAdminUsers);
export const dispatchGetAdminAlumni = dispatch(actions.actionGetAdminAlumni);
export const dispatchCreateUser = dispatch(actions.actionCreateUser);
export const dispatchUpdateUser = dispatch(actions.actionUpdateUser);
export const dispatchDeleteUser = dispatch(actions.actionDeleteUser);
export const dispatchSendInvites = dispatch(actions.actionSendInvites);
export const dispatchAdminRequests = dispatch(actions.actionGetRequests);
export const dispatchGetAdminGroups = dispatch(actions.actionGetAdminGroups);
export const dispatchUpdateGroup = dispatch(actions.actionUpdateGroup);
export const dispatchCreateGroup = dispatch(actions.actionCreateGroup);
export const dispatchApplyRequest = dispatch(actions.actionApplyRequest);
export const dispatchAddUserToGroup = dispatch(actions.actionAddUserToGroup);
export const dispatchRemoveUserFromGroup = dispatch(actions.actionRemoveUserFromGroup);
export const dispatchSetPrimaryGroup = dispatch(actions.actionSetPrimaryGroup);
export const dispatchAdminFinanceRequests = dispatch(actions.actionGetFinanceRequestsAdmin);

