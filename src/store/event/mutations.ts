import { IEvent, IEventApplication, IEventType } from '@/interfaces';
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
  setEvents(state: EventState, payload: { type: IEventType; payload: IEvent[]}) {
    state.events[payload.type] = payload.payload;
  },
  setEvent(state: EventState, payload: IEvent) {
    state.events[payload.type] = replace(state.events[payload.type], payload);
  },
};

const {commit} = getStoreAccessors<EventState | any, State>('');

export const commitSetEventsFor = commit(mutations.setEventsFor);
export const commitSetEvent = commit(mutations.setEvent);
export const commitSetEvents = commit(mutations.setEvents);
export const commitSetEventApplicationsFor = commit(mutations.setEventApplicationsFor);

