import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {

};

const { read } = getStoreAccessors<AdminState, State>('');

