import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { $MODULE_NAME$State } from './state';

export const getters = {
  $MODULE_NAME_CAMEL$Profile: (state: $MODULE_NAME$State) => state.$MODULE_NAME_CAMEL$Profile,
};

const {read} = getStoreAccessors<$MODULE_NAME$State, State>('');

export const read$MODULE_NAME$Profile = read(getters.$MODULE_NAME_CAMEL$Profile);