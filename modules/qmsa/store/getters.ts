import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { QmsaState } from './state';

export const getters = {
  qmsaProfile: (state: QmsaState) => state.qmsaProfile,
};

const {read} = getStoreAccessors<QmsaState, State>('');

export const readQmsaProfile = read(getters.qmsaProfile);