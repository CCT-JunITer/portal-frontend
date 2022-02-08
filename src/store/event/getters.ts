import { Route } from 'vue-router';
import { EventState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  routeEvent: (state: EventState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.events.find(event => event.id === numberId);
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
    const filteredEvents = state.events.filter((trainig) => trainig.id === eventId);
    if (filteredEvents.length > 0) {
      return { ...filteredEvents[0] };
    }
  },
  events: (state: EventState) => state.events,
};

const {read} = getStoreAccessors<EventState, State>('');

export const readOneEvent = read(getters.oneEvent);
export const readRouteEvent = read(getters.routeEvent);
export const readEventsForRoute = read(getters.eventsForRoute)
export const readEventsApplicationsFor = read(getters.eventApplicationsFor)
export const readEvents = read(getters.events);
