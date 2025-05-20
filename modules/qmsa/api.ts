import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';



export const api = {
  async getQmsa(token: string) {
    // For demo get current user-profile
    return axios.get(`${apiUrl}/api/v1/users/me`, authHeaders(token));
  }
};