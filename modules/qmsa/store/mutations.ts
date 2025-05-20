import { QmsaState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';
import { QmsaProfile } from '../types';


export const mutations = {
  setQmsaProfile(state: QmsaState, payload: QmsaProfile) {
    state.qmsaProfile = payload;
  },
};

const {commit} = getStoreAccessors<QmsaState | any, State>('');

export const commitSetQmsaProfile = commit(mutations.setQmsaProfile);

