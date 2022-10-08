import { $MODULE_NAME$State } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { replace } from '@/store/utils';
import { $MODULE_NAME$Profile } from '../types';


export const mutations = {
  set$MODULE_NAME$Profile(state: $MODULE_NAME$State, payload: $MODULE_NAME$Profile) {
    state.$MODULE_NAME_CAMEL$Profile = payload;
  },
};

const {commit} = getStoreAccessors<$MODULE_NAME$State | any, State>('');

export const commitSet$MODULE_NAME$Profile = commit(mutations.set$MODULE_NAME$Profile);

