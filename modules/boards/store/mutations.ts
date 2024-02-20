import { BoardsState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';
import { Board } from '../types';


export const mutations = {
  setBoards(state: BoardsState, payload: Board[]) {
    state.boards = payload;
  },
  setBoard(state: BoardsState, payload: Board) {
    state.boards = replace(state.boards, payload);
  },
  deleteBoard(state: BoardsState, payload: Board) {
    if(!state.boards) return
    state.boards = state.boards.filter((board: Board) => board.id !== payload.id)
  }
};

const {commit} = getStoreAccessors<BoardsState | any, State>('');


export const commitSetBoards = commit(mutations.setBoards)
export const commitSetBoard = commit(mutations.setBoard)
export const commitdeleteBoards = commit(mutations.deleteBoard)

