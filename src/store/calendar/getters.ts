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
  },

  getTowerCalendar(state: CalendarState) {
    return state.towerCalendar;
  },

  getEventByUID(state: CalendarState, uid: string) {
    const calendars = state.calendars
    console.log(calendars)
    let r: ICalendarEvent|undefined = undefined
    calendars.forEach(c => {
      c.events.forEach(e => {
        if (e.uid == uid) r = e;
      })
    })
    return r
  },

  getCalendarByUID(state: CalendarState, uid: string) {
    if (state.towerCalendar?.uid == uid) return state.towerCalendar
    
    const calendar = state.calendars.find(x => x.uid == uid)
    return calendar
  }
  
}

const {read} = getStoreAccessors<CalendarState, State>('');

export const readCalendars = read(getters.getCalendars);
export const readSelectedElement = read(getters.getSelectedEvent);
export const readTowerCalendar = read(getters.getTowerCalendar);
export const readEventByUID = read(getters.getEventByUID);
export const readCalendarByUID = read(getters.getCalendarByUID);
