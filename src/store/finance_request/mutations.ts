import { IFinanceRequest } from '@/interfaces';
import { FinanceRequestState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';


export const mutations = {
  setMyFinanceRequests(state: FinanceRequestState, payload: IFinanceRequest[]) {
    state.myFinanceRequests = payload;
  },
  setMyFinanceRequest(state: FinanceRequestState, payload: IFinanceRequest){
    state.myFinanceRequests = replace(state.myFinanceRequests, payload);
  },
  deleteFinanceRequest(state: FinanceRequestState, payload: IFinanceRequest){
    state.myFinanceRequests = state.myFinanceRequests.filter((financeRequest: IFinanceRequest) => financeRequest.id !== payload.id);
  },
};

const {commit} = getStoreAccessors<FinanceRequestState | any, State>('');

export const commitSetMyFinanceRequests = commit(mutations.setMyFinanceRequests);
export const commitSetMyFinanceRequest = commit(mutations.setMyFinanceRequest);
export const commitDeleteMyFinanceRequest = commit(mutations.deleteFinanceRequest);