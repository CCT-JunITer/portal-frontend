import { IFinanceRequest } from '@/interfaces';
import { FinanceRequestState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';


export const mutations = {
  setMyFinanceRequests(state: FinanceRequestState, payload: IFinanceRequest[]) {
    state.myFinanceRequests = payload;
  },
  setMyFinanceRequest(state: FinanceRequestState, payload: IFinanceRequest){
    const financeReqeusts = state.myFinanceRequests.filter((financeRequest: IFinanceRequest) => financeRequest.id !== payload.id);
    financeReqeusts.push(payload);
    state.myFinanceRequests = financeReqeusts;
  },
  deleteFinanceRequest(state: FinanceRequestState, payload: IFinanceRequest){
    state.myFinanceRequests = state.myFinanceRequests.filter((financeRequest: IFinanceRequest) => financeRequest.id !== payload.id);
  },
};

const {commit} = getStoreAccessors<FinanceRequestState | any, State>('');

export const commitSetMyFinanceRequests = commit(mutations.setMyFinanceRequests);
export const commitSetMyFinanceRequest = commit(mutations.setMyFinanceRequest);
export const commitDeleteMyFinanceRequest = commit(mutations.deleteFinanceRequest);