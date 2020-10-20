import { IUserProfile } from '@/interfaces';
import { AdminState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const mutations = {

};

const { commit } = getStoreAccessors<AdminState, State>('');

