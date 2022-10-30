import { ICalendarEvent } from '../types';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '@/store/state';
import { CalendarState } from './state';

const TowerCalendarIDs = new Set(['tower_shared_by_CalendarBot']);
export const getters = {

  getCalendars(state: CalendarState) {
    return state.calendars
  },

  getCalendarsWithoutTower(state: CalendarState) {
    return state.calendars.filter(x => x.uid && !TowerCalendarIDs.has(x.uid))
  },

  getSelectedEvent(state: CalendarState) {
    return state.selectedEvent
  },

  getTowerCalendar(state: CalendarState) {
    return state.calendars.find(x => {return x.uid && TowerCalendarIDs.has(x.uid)});
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
    const calendar = state.calendars.find(x => x.uid == uid)
    return calendar
  }
  
}

const {read} = getStoreAccessors<CalendarState, State>('');

export const readCalendars = read(getters.getCalendars);
export const readCalendarsWithoutTower = read(getters.getCalendarsWithoutTower);
export const readSelectedEvent = read(getters.getSelectedEvent);
export const readTowerCalendar = read(getters.getTowerCalendar);
export const readEventByUID = read(getters.getEventByUID);
export const readCalendarByUID = read(getters.getCalendarByUID);
