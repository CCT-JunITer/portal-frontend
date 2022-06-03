import { Route } from 'vue-router';
import { EventState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { IEventType } from '@/interfaces';

export const getters = {
  routeEvent: (state: EventState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return Object.values(state.events).flatMap(c => c || []).find(event => event.id === numberId);
  },
  eventApplicationsFor: (state: EventState) => (eventId: number) => {
    return state.eventApplications[eventId] || [];
  },
  eventsForRoute: (state: EventState, store: any) => (route: Route) => {
    const user = store.routeUser(route);
    if (!user) {
      return [];
    }
    return state.eventsParticipants[user.id] || [];
  },
  oneEvent: (state: EventState) => (eventId: number) => {
    return Object.values(state.events).flatMap(c => c || []).find(event => event.id === eventId);
  },
  events: (state: EventState) => (type: IEventType) => state.events[type],
};

const {read} = getStoreAccessors<EventState, State>('');

export const readOneEvent = read(getters.oneEvent);
export const readRouteEvent = read(getters.routeEvent);
export const readEventsForRoute = read(getters.eventsForRoute)
export const readEventsApplicationsFor = read(getters.eventApplicationsFor)
export const readEvents = read(getters.events);
