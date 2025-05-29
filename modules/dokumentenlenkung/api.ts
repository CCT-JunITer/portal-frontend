import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';



export const api = {
  async getUnapprovedDocuments(token: string) {
    return axios.get(`${apiUrl}/api/v1/document/unapproved/`, authHeaders(token));
  },
  async getUnapprovedProjects(token: string) {
    return axios.get(`${apiUrl}/api/v1/project/unapproved/`, authHeaders(token));
  },
  async getUnapprovedEvents(token: string) {
    return axios.get(`${apiUrl}/api/v1/event/unapproved/`, authHeaders(token));
  },
  async approveProject(token: string, projectId: number) {
    return axios.put(`${apiUrl}/api/v1/project/${projectId}/approve/`, {}, authHeaders(token));
  },
  async approveDocument(token: string, documentId: number) {
    return axios.put(`${apiUrl}/api/v1/document/${documentId}/approve/`, {}, authHeaders(token));
  },
  async approveEvent(token: string, eventId: number) {
    return axios.put(`${apiUrl}/api/v1/event/${eventId}/approve/`, {}, authHeaders(token));
  },
};