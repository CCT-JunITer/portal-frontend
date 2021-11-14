import { Route } from 'vue-router';
import { FinanceRequestState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  financeRequestsMe: (state: FinanceRequestState) => state.myFinanceRequests,
  oneFinanceRequestMe: (state: FinanceRequestState) => (financeId: number) => {
    const filteredFinanceRequests = state.myFinanceRequests.filter((financeRequest) => financeRequest.id === financeId);
    if (filteredFinanceRequests.length > 0) {
      return { ...filteredFinanceRequests[0] };
    }
  },
};

const {read} = getStoreAccessors<FinanceRequestState, State>('');

export const readOneFinanceRequestMe = read(getters.oneFinanceRequestMe);
export const readFinanceRequestsMe = read(getters.financeRequestsMe);

