import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { BoardsState } from './state';

const defaultState: BoardsState = {
  boards: null,
};

export const boardsStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
