import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { DokumentenlenkungState } from './state';

const defaultState: DokumentenlenkungState = {
  documents: [],
  projects:[],
  events:[]
};

export const dokumentenlenkungStore = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
