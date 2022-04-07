import axios from 'axios';
import {apiUrl} from '@/env';
import { IEvent, IEventCreate, IUserProfile, IUserProfileCreate, IUserProfileUpdate, UserType, RequestCreate, UserInvite, IEventApplicationCreate, IEventApplicationUpdate, IFinanceRequestCreate, IFinanceRequestUpdate, IFinanceRequest, Group, GroupUpdate, IUserSettings, IEventApplication, VersionedFolder, IDocumentCreate, IDocument } from './interfaces';
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
  async getAdminOneUser(token: string, userId: number) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/admin/${userId}`, {...authHeaders(token)});
  },
  async getUser(token: string, userId: number) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/${userId}`, {...authHeaders(token)});
  },
  async getPersonalEvents(token: string, userId: number) {
    return axios.get<IEvent[]>(`${apiUrl}/api/v1/event/participants/events/${userId}`, { ...authHeaders(token)});
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
    return fetch(`${apiUrl}/api/v1/utils/download-file?${new URLSearchParams(params)}`,
      {
        ...authHeaders(token),
        method: 'GET',
      }).then(response => response.blob())
  },
  
  async createVersionedFolder(token: string, file_ids: string[]) {
    return axios.post<VersionedFolder>(`${apiUrl}/api/v1/versionedfolder/`, { file_ids }, authHeaders(token));
  },
  async addFilesToVersionedFolder(token: string, folderId: string, file_ids: string[]) {
    return axios.put<VersionedFolder>(`${apiUrl}/api/v1/versionedfolder/${folderId}`, { file_ids }, authHeaders(token));
  },
  async deleteFilesFromVersionedFolder(token: string, folderId: string, file_ids: string[]) {
    return axios.delete<VersionedFolder>(`${apiUrl}/api/v1/versionedfolder/${folderId}`, { data: { file_ids: file_ids }, ...authHeaders(token) });
  },
  async getVersionedFolder(token: string, folderId: string) {
    return axios.get<VersionedFolder>(`${apiUrl}/api/v1/versionedfolder/${folderId}`, authHeaders(token));
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
  async updateEvent(token: string, eventId: number, data: IEventCreate) {
    return axios.put<IEvent>(`${apiUrl}/api/v1/event/${eventId}`, data, authHeaders(token));
  },
  async sendInvites(token: string, data: UserInvite[]) {
    return axios.post(`${apiUrl}/api/v1/users/send-invites`, data, authHeaders(token))
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
  },
  async createEvent(token: string, data: IEventCreate) {
    return axios.post<IEvent>(`${apiUrl}/api/v1/event/`, data, authHeaders(token));
  },
  async getEvents(token: string, eventType: string) {
    return axios.get<IEvent[]>(`${apiUrl}/api/v1/event/`, { ...authHeaders(token), params: { event_type: eventType } });
  },
  async getOneEvent(token: string, eventId: number) {
    return axios.get<IEvent>(`${apiUrl}/api/v1/event/${eventId}`, { ...authHeaders(token) });
  },
  async deleteEvent(token: string, eventId: number,) {
    return axios.delete(`${apiUrl}/api/v1/event/${eventId}`, { ...authHeaders(token)});
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
  async getEventApplications(token: string, eventId: number) {
    return axios.get(`${apiUrl}/api/v1/event/application/${eventId}`, authHeaders(token));
  },
  async createEventApplication(token: string, eventId: number, application: IEventApplicationCreate) {
    return axios.post(`${apiUrl}/api/v1/event/application/${eventId}`, application, authHeaders(token));
  },
  async updateEventApplication(token: string, applicationId: number, application: IEventApplicationUpdate) {
    return axios.put<IEventApplication>(`${apiUrl}/api/v1/event/application/${applicationId}`, application, authHeaders(token));
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
  // Documents
  async getDocuments(token: string, documentType: string) {
    return axios.get<IDocument[]>(`${apiUrl}/api/v1/document/`, { ...authHeaders(token), params: { document_type: documentType } });
  },
  async getOneDocument(token: string, documentId: number) {
    return axios.get<IDocument>(`${apiUrl}/api/v1/document/${documentId}`,  { ...authHeaders(token) });
  },
  async updateDocument(token: string, documentId: number, data: IDocumentCreate) {
    return axios.put<IDocument>(`${apiUrl}/api/v1/document/${documentId}`, data, authHeaders(token));
  },
  async createDocument(token: string, data: IDocumentCreate) {
    return axios.post<IDocument>(`${apiUrl}/api/v1/document/`, data, authHeaders(token));
  },
};
