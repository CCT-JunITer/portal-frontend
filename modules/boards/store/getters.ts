import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { BoardsState} from './state';
import { Route } from 'vue-router';

export const getters = {
  Boards: (state: BoardsState) => state.boards,
  oneBoard: (state: BoardsState) => (boardId: number) => {
    if(!state.boards) return
    return state.boards.find((board) => board.id === boardId);
  },
  routeBoard: (state: BoardsState) => (route: Route) => {
    const id = route.params.id;
    const boardId = parseInt(id);
    if(!state.boards) return
    return state.boards.find((board) => board?.id === boardId)

  }
}

const {read} = getStoreAccessors<BoardsState, State>('');

export const readboards = read(getters.Boards);
export const readoneboard = read(getters.oneBoard);
export const readrouteboard = read(getters.routeBoard)
