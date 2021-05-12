import { UserInvite } from './interfaces/index';
import axios from 'axios';
import {apiUrl} from '@/env';
import { IUserProfile, IUserProfileCreate, IUserProfileUpdate, UserType } from './interfaces';
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
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/me`, data, authHeaders(token));
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

  async uploadFile(token: string, file: File | string | Blob, fileName?: string) {
    const formData = new FormData();
    let image: File | Blob;
    if(typeof file === 'string') {
      image = dataURItoBlob(file);
    } else {
      // replace type from 'image/jpeg' to 'image.jpeg' for proper
      // detection in backend
      fileName = fileName || file.type.replace('/', '.');
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
    return axios.get(`${apiUrl}/api/v1/utils/download-file/`, { ...authHeaders(token), params, responseType: 'blob' });
  },
  async updateUser(token: string, userId: number, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async sendInvites(token: string, data: UserInvite[]) {
    return axios.post(`${apiUrl}/api/v1/users/send-invites`, data, authHeaders(token))
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
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
};
