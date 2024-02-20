import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';
import { Board, BoardCreate } from './types';


export const api = {
  async getBoards(token: string) {
    return axios.get<Board[]>(`${apiUrl}/api/v1/board/`, {...authHeaders(token)});
  },
  async getPersonalProjects(token: string, userId: number) {
    return axios.get<Board[]>(`${apiUrl}/api/v1/board/participants/project/${userId}`, { ...authHeaders(token)});
  },
  async updateBoard(token: string, boardId: number, data: BoardCreate) {
    return axios.put<Board>(`${apiUrl}/api/v1/board/${boardId}`, data, authHeaders(token));
  },
  async createBoard(token: string, data: BoardCreate) {
    return axios.post<Board>(`${apiUrl}/api/v1/board/`, data, authHeaders(token));
  },
  async getOneBoard(token: string, boardId: number) {
    return axios.get<Board>(`${apiUrl}/api/v1/board/${boardId}`, { ...authHeaders(token) });
  },
  async deleteBoard(token: string, boardId: number,) {
    return axios.delete<Board>(`${apiUrl}/api/v1/board/${boardId}`, { ...authHeaders(token)});
  }
};