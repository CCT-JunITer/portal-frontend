import { IEvent, IEventApplication } from '@/interfaces';
import { EventState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';


export const mutations = {
  setEventApplicationsFor(state: EventState, payload: { eventId: number; payload: IEventApplication[] }) {
    state.eventApplications = { ...state.eventApplications, [payload.eventId]: payload.payload};
  },
  setEventsFor(state: EventState, payload: { userId: number; payload: IEvent[] }) {
    state.eventsParticipants = { ...state.eventsParticipants, [payload.userId]: payload.payload };
  },
  setEvents(state: EventState, payload: IEvent[]) {
    state.events = payload;
  },
  setEvent(state: EventState, payload: IEvent) {
    state.events = replace(state.events, payload);
  },
};

const {commit} = getStoreAccessors<EventState | any, State>('');

export const commitSetEventsFor = commit(mutations.setEventsFor);
export const commitSetEvent = commit(mutations.setEvent);
export const commitSetEvents = commit(mutations.setEvents);
export const commitSetEventApplicationsFor = commit(mutations.setEventApplicationsFor);

