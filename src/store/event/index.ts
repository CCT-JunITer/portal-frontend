import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { EventState } from './state';

const defaultState: EventState = {
  eventsParticipants: {},
  events: {
    training: null,
    meeting: null,
  },
  eventApplications: {},
};

export const eventModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
