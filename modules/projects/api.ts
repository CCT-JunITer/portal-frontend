import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';
import { Project, ProjectCreate } from './types';


export const api = {
  async getProjects(token: string, project_type: string) {
    return axios.get<Project[]>(`${apiUrl}/api/v1/project/`, {...authHeaders(token), params: { project_type: project_type === 'all' ? null : project_type }});
  },
  async getPersonalProjects(token: string, userId: number) {
    return axios.get<Project[]>(`${apiUrl}/api/v1/project/participants/project/${userId}`, { ...authHeaders(token)});
  },
  async updateProject(token: string, projectId: number, data: ProjectCreate) {
    return axios.put<Project>(`${apiUrl}/api/v1/project/${projectId}`, data, authHeaders(token));
  },
  async createProject(token: string, data: ProjectCreate) {
    return axios.post<Project>(`${apiUrl}/api/v1/project/`, data, authHeaders(token));
  },
  async getOneProject(token: string, projectId: number) {
    return axios.get<Project>(`${apiUrl}/api/v1/project/${projectId}`, { ...authHeaders(token) });
  },
  async deleteProject(token: string, projectId: number,) {
    return axios.delete<Project>(`${apiUrl}/api/v1/project/${projectId}`, { ...authHeaders(token)});
  },
  async getAutocompleteValues(token: string) {
    return axios.get<{[k: string]: string[]}>(`${apiUrl}/api/v1/project/autocomplete-values`, { ...authHeaders(token) });
  }
};