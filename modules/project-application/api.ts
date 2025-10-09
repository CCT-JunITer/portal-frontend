import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';
import { ProjectApplication, ProjectApplicationCreate, ProjectCast, ProjectCastCreate, ProjectTender, ProjectTenderCreate } from './types';



export const api = {
  async getProjectTenders(token: string) {
    return axios.get(`${apiUrl}/api/v1/project-tender/`, authHeaders(token));
  },
  async getProjectTender(token: string, id: number) {
    return axios.get(`${apiUrl}/api/v1/project-tender/${id}`, authHeaders(token));
  },
  async updateProjectTender(token: string, id: number, payload: ProjectTenderCreate) {
    return axios.put<ProjectTender>(`${apiUrl}/api/v1/project-tender/${id}`, payload, authHeaders(token));
  },
  async createProjectTender(token: string, payload: ProjectTenderCreate) {
    return axios.post<ProjectTender>(`${apiUrl}/api/v1/project-tender/`, payload, authHeaders(token));
  },
  async createProjectApplication(token: string, payload: ProjectApplicationCreate) {
    return axios.post<ProjectApplication>(`${apiUrl}/api/v1/project-application/`, payload, authHeaders(token));
  },
  async updateProjectApplication(token: string, id: number, payload: ProjectApplicationCreate) {
    return axios.put<ProjectApplication>(`${apiUrl}/api/v1/project-application/${id}`, payload, authHeaders(token));
  },
  async getProjectApplication(token: string, id: number) {
    return axios.get<ProjectApplication>(`${apiUrl}/api/v1/project-application/${id}`, authHeaders(token));
  },
  async getProjectApplicationsFor(token: string, id: number) {
    return axios.get<ProjectApplication[]>(`${apiUrl}/api/v1/project-tender/applications/${id}`, authHeaders(token));
  },
  async getOwnProjectApplicationByTender(token: string, projectTenderId: number) {
    return axios.get<ProjectApplication>(`${apiUrl}/api/v1/project-application/by-tender/${projectTenderId}`, authHeaders(token));
  },

  async createProjectCast(token: string, payload: ProjectCastCreate) {
    return axios.post<ProjectCast>(`${apiUrl}/api/v1/project-cast/`, payload, authHeaders(token));
  },
  async updateProjectCast(token: string, id: number, payload: ProjectCastCreate) {
    return axios.put<ProjectCast>(`${apiUrl}/api/v1/project-cast/${id}`, payload, authHeaders(token));
  },
  async getProjectCastsFor(token: string, id: number) {
    return axios.get<ProjectCast[]>(`${apiUrl}/api/v1/project-cast/by-tender/${id}`, authHeaders(token));
  },
  async getProjectCast(token: string, id: number) {
    return axios.get<ProjectCast>(`${apiUrl}/api/v1/project-cast/${id}`, authHeaders(token));
  }
};