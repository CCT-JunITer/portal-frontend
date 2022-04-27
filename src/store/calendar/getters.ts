import { ICalendarEvent } from '@/interfaces';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { CalendarState } from './state';

export const getters = {

  getCalendars(state: CalendarState) {
    return state.calendars
  },

  getSelectedEvent(state: CalendarState) {
    return state.selectedEvent
  }
  
}

const {read} = getStoreAccessors<CalendarState, State>('');

export const readCalendars = read(getters.getCalendars);
export const readSelectedElement = read(getters.getSelectedEvent);
