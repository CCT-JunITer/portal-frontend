import { apiCall, apiCallNotify } from '@/store/utils';
import { State } from '@/store/state';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { BoardsState } from './state';
import { api } from '../api';
import { commitSetBoard,commitSetBoards,commitdeleteBoards } from './mutations';
import { BoardCreate } from '../types';

type MainContext = ActionContext<BoardsState , State>;

export const actions = {
  async actionGetBoards(context: MainContext){
    const response = await apiCall(context, token => api.getBoards(token));
    commitSetBoards(context,response.data);
    return response.data;
  },
  async actionGetOneBoard(context: MainContext,boardId: number){
    const response = await apiCall(context, token => api.getOneBoard(token,boardId));
    commitSetBoard(context,response.data);
    return response.data;
  },
  async actionUpdateBoard(context: MainContext, payload: { id: number; board: BoardCreate}){
    const response = await apiCallNotify(context, token => api.updateBoard(token, payload.id, payload.board), { successText: 'Änderung erfolgreich' });
    commitSetBoard(context, response.data);
    return response.data;
  },
  async actionDeleteBoard(context: MainContext,boardId: number){
    const response = await apiCallNotify(context, token => api.deleteBoard(token, boardId), { successText: 'Vorstandjahr erfolgreich gelöscht' });
    commitdeleteBoards(context,response.data);
    return response.data;
  },
  async actionCreateBoard(context:MainContext,board: BoardCreate){
    const response = await apiCallNotify(context, token => api.createBoard(token, board), { successText: 'Vorstandjahr erfolgreich erstellt' });
    commitSetBoard(context,response.data);
    return response.data;
  }
  


}

const { dispatch } = getStoreAccessors<BoardsState | any, State>('');

export const dispatchGetBoards = dispatch(actions.actionGetBoards);
export const dispatchGetOneBoard = dispatch(actions.actionGetOneBoard);
export const dispatchUpdateBoard = dispatch(actions.actionUpdateBoard);
export const dispatchCreateBoard = dispatch(actions.actionCreateBoard);
export const dispatchDeleteBoard = dispatch(actions.actionDeleteBoard);
