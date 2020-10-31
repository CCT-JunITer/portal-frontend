import axios from 'axios';
import {apiUrl} from '@/env';
import {IUserProfile, IUserProfileCreate, IUserProfileUpdate} from './interfaces';
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
  async getUsers(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/`, authHeaders(token));
  },

  async uploadProfilePicture(token: string, file: File | string, userMail: string | null) {
    const formData = new FormData();
    let image: File | Blob;
    if(typeof file === 'string') {
      image = dataURItoBlob(file);
    } else {
      image = file;
    }
    formData.append('image', image);
    if (userMail) {
      formData.append('user_email', userMail);
    }
    return await axios.post<string>(`${apiUrl}/api/v1/utils/upload-user-image/`, formData,
      authHeaders(token, {
          'Content-Type': 'multipart/form-data'
        })
    );
  },
  async updateUser(token: string, userId: number, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
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
