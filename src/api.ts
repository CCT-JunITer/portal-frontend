import axios from 'axios';
import {apiUrl} from '@/env';
import { ITraining, ITrainingCreate, IUserProfile, IUserProfileCreate, IUserProfileUpdate, UserType, RequestCreate, UserInvite, ITrainingApplicationCreate, ITrainingApplicationUpdate, IFinanceRequestCreate, IFinanceRequestUpdate, IFinanceRequest, Group, GroupUpdate, IUserSettings } from './interfaces';
import {dataURItoBlob} from '@/utils';

function authHeaders(token: string, headers = {}) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers,
    },
  };
}


export const api = {
  async logInGetToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return axios.post(`${apiUrl}/api/v1/login/access-token`, params);
  },
  async getMe(token: string) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/me`, authHeaders(token));
  },
  async getUserSettingsMe(token: string) {
    return axios.get<IUserSettings>(`${apiUrl}/api/v1/users/email-settings/me`, authHeaders(token));
  },
  async updateUserSettingsMe(token: string, data: IUserSettings) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/email-settings/me`, data, authHeaders(token));
  },
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/me`, data, authHeaders(token));
  },
  async getAdminUsers(token: string, type: UserType) {

    // https://gitlab.cct-ev.de/juniter/pv-tool3/backend/-/issues/4
    const params: any = {};
    switch(type) {
    case 'alumni': params.onlyalumni = true; break;
    case 'all': params.includealumni = true; break;
    case 'members':
    default:
      break;
    }

    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/admin`, { ...authHeaders(token), params });
  },
  async getAlumniUsers(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/alumni/admin`, { ...authHeaders(token) });
  },
  async getUsers(token: string, type: UserType) {

    // https://gitlab.cct-ev.de/juniter/pv-tool3/backend/-/issues/4
    const params: any = {};
    switch(type) {
    case 'alumni': params.onlyalumni = true; break;
    case 'all': params.includealumni = true; break;
    case 'members':
    default:
      break;
    }

    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/`, { ...authHeaders(token), params });
  },

  async getPersonalTrainings(token: string, userId: number) {
    return axios.get<ITraining[]>(`${apiUrl}/api/v1/training/participants/${userId}`, { ...authHeaders(token)});
  },


  async uploadFile(token: string, file: File | string | Blob, fileName?: string) {
    const formData = new FormData();
    let image: File | Blob;
    if(typeof file === 'string') {
      image = dataURItoBlob(file);
    } else {
      // replace type from 'image/jpeg' to 'image.jpeg' for proper
      // detection in backend
      if ((file as File).name) {
        fileName = fileName || (file as File).name;
      } else {
        fileName = fileName || file.type.replace('/', '.');
      }
      image = file;
    }
    formData.append('file', image, fileName || 'image.png');
    return await axios.post<{ filename: string }>(`${apiUrl}/api/v1/utils/upload-file/`, formData,
      authHeaders(token, {
        'Content-Type': 'multipart/form-data'
      })
    );
  },
  async downloadFile(token: string, filename: string) {
    const params = { filename };
    return axios.get(`${apiUrl}/api/v1/utils/download-file`, { ...authHeaders(token), params, responseType: 'blob' });
  },
  async downloadDebitMandate(token: string) {
    return axios.get(`${apiUrl}/api/v1/documents/sepa/me`, { ...authHeaders(token), responseType: 'blob' });
  },
  async deleteUser(token: string, userId: number) {
    return axios.delete(`${apiUrl}/api/v1/users/${userId}`, authHeaders(token));
  },
  async updateUser(token: string, userId: number, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async updateTraining(token: string, trainingId: number, data: ITrainingCreate) {
    return axios.put<ITraining>(`${apiUrl}/api/v1/training/${trainingId}`, data, authHeaders(token));
  },
  async sendInvites(token: string, data: UserInvite[]) {
    return axios.post(`${apiUrl}/api/v1/users/send-invites`, data, authHeaders(token))
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
  },
  async createTraining(token: string, data: ITrainingCreate) {
    return axios.post<ITraining>(`${apiUrl}/api/v1/training/`, data, authHeaders(token));
  },
  async getTrainings(token: string) {
    return axios.get<ITraining[]>(`${apiUrl}/api/v1/training/`, { ...authHeaders(token)});
  },
  async deleteTraining(token: string, trainingId: number,) {
    return axios.delete(`${apiUrl}/api/v1/training/${trainingId}`, { ...authHeaders(token)});
  },
  async createUserOpen(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/open`, data, {params: {token}});
  },
  async passwordRecovery(email: string) {
    return axios.post(`${apiUrl}/api/v1/password-recovery/${email}`);
  },
  async resetPassword(password: string, token: string) {
    return axios.post(`${apiUrl}/api/v1/reset-password/`, {
      new_password: password,
      token,
    });
  },
  // requests
  async getMyRequests(token: string) {
    return axios.get(`${apiUrl}/api/v1/groups/requests/me`, authHeaders(token));
  },
  async getAdminGroups(token: string) {
    return axios.get<Group[]>(`${apiUrl}/api/v1/groups/admin`, authHeaders(token));
  },
  async updateGroup(token: string, groupId: number, data: GroupUpdate) {
    return axios.put<Group>(`${apiUrl}/api/v1/groups/${groupId}`, data, authHeaders(token));
  },
  async createGroup(token: string, data: GroupUpdate) {
    return axios.post<Group>(`${apiUrl}/api/v1/groups/`, data, authHeaders(token));
  },
  async addUserToGroup(token: string, userId: number, groupId: number) {
    return axios.post(`${apiUrl}/api/v1/groups/${userId}/add`, { group_id: groupId }, authHeaders(token));
  },
  async editUserGroup(token: string, userId: number, userGroupId: number, payload: { date_from: string; date_to: string }) {
    return axios.put(`${apiUrl}/api/v1/groups/${userId}/edit/${userGroupId}`, payload, authHeaders(token));
  },
  async removeUserFromGroup(token: string, userId: number, groupId: number) {
    return axios.post(`${apiUrl}/api/v1/groups/${userId}/remove`, { group_id: groupId }, authHeaders(token));
  },
  async setPrimaryGroup(token: string, userId: number, groupId: number) {
    return axios.post(`${apiUrl}/api/v1/groups/${userId}/primary`, { group_id: groupId }, authHeaders(token));
  },
  async setPrimaryGroupMe(token: string, groupId: number) {
    return axios.post(`${apiUrl}/api/v1/groups/me/primary`, { group_id: groupId }, authHeaders(token));
  },
  async addMeRequest(token: string, request: RequestCreate) {
    return axios.post(`${apiUrl}/api/v1/groups/requests/me`, request, authHeaders(token));
  },
  async getRequests(token: string, userId?: number) {
    return axios.get(`${apiUrl}/api/v1/groups/requests${userId ? '/' + userId : ''}/`, authHeaders(token));
  },
  async applyRequest(token: string, requestId: number, accepted: boolean) {
    return axios.put(`${apiUrl}/api/v1/groups/requests/${requestId}`, { accepted }, authHeaders(token));
  },
  async getGroups(token: string) {
    return axios.get(`${apiUrl}/api/v1/groups/`, authHeaders(token));
  },
  async getTrainingApplications(token: string, trainingId: number) {
    return axios.get(`${apiUrl}/api/v1/training/application/${trainingId}`, authHeaders(token));
  },
  async createTrainingApplication(token: string, trainingId: number, application: ITrainingApplicationCreate) {
    return axios.post(`${apiUrl}/api/v1/training/application/${trainingId}`, application, authHeaders(token));
  },
  async updateTrainingApplication(token: string, applicationId: number, application: ITrainingApplicationUpdate) {
    return axios.put(`${apiUrl}/api/v1/training/application/${applicationId}`, application, authHeaders(token));
  },
  // Finance Request
  async createFinanceRequest(token: string, request: IFinanceRequestCreate) {
    return axios.post(`${apiUrl}/api/v1/finance/`, request, authHeaders(token));
  },
  async getAllFinanceRequests(token: string) {
    return axios.get(`${apiUrl}/api/v1/finance/`, authHeaders(token));
  },
  async getMyFinanceRequests(token: string) {
    return axios.get(`${apiUrl}/api/v1/finance/me`, authHeaders(token));
  },
  async getFinanceRequestById(token: string, financeId: number) {
    return axios.get(`${apiUrl}/api/v1/finance/${financeId}`, authHeaders(token));
  },
  async getFinanceRequestByAuthor(token: string, authorId: number) {
    return axios.get(`${apiUrl}/api/v1/finance/author/${authorId}`, authHeaders(token));
  },
  async updateFinanceRequest(token: string, financeId: number, data: IFinanceRequestUpdate) {
    return axios.put<IFinanceRequest>(`${apiUrl}/api/v1/finance/${financeId}`, data, authHeaders(token));
  },
  async deleteFinanceRequest(token: string, financeId: number) {
    return axios.delete(`${apiUrl}/api/v1/finance/${financeId}`, authHeaders(token));
  },
  async updateFinanceRequestState(token: string, financeId: number, updated_status: string, updated_message_file: string, updated_message_request: string ) {
    return axios.put(`${apiUrl}/api/v1/finance/status/${financeId}`, { updated_status, updated_message_file, updated_message_request } , authHeaders(token));
  },
  
  async updateFinanceRequestStateReceipt(token: string, financeId: number, updated_status, updated_receipt) {
    return axios.put(`${apiUrl}/api/v1/finance/status/${financeId}`, { updated_status, updated_receipt }, authHeaders(token));
  },
  async updateFinanceRequestStateType(token: string, financeId: number, updated_status: string, updated_association: string) {
    return axios.put(`${apiUrl}/api/v1/finance/status/${financeId}`, { updated_status, updated_association }, authHeaders(token));
  },
  
};
