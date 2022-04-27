import { ICalendar, ICalendarEvent } from '@/interfaces';
import { CalendarState } from './state';
import {getters} from './getters';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { getCalendarById } from '../utils';

export const mutations = {

  removeCalendarEvent(state: CalendarState, event: ICalendarEvent) {
    if (!event) return;

    const calendar = getCalendarById(state, event.calendarId)
    if (calendar) {
      calendar.events = calendar.events.filter(x => x.uid != event.uid)
    }
  },

  setSelectedEvent(state: CalendarState, event: ICalendarEvent) {
    state.selectedEvent = event
  },

  updateSelectedEvent(state, event) {
    Object.assign(state.selectedEvent, event)
    // if (state.selectedEvent && state.selectedEvent.uiEvents) {
    //   for (const uiEvent in state.selectedEvent.uiEvents) {
    //     Object.assign(uiEvent, {
    //       name:event.name,
    //       start:event.start,
    //       end:event.end,
    //       color:event.color,
    //       timed:event.timed
    //     })
    //   }
    // }
  },

  addEventToCalendar(state: CalendarState, event: ICalendarEvent) {
    const calendar = state.calendars.find(x => x.uid == event.calendarId)
    calendar?.events.push(event)
  },

  setCalendars(state: CalendarState, calendars: ICalendar[]) {
    state.calendars = calendars
  },

  deleteCalendar(state: CalendarState, calendarId: string) {
    state.calendars = state.calendars.filter(x => x.uid != calendarId)
  }
  
};

const {commit} = getStoreAccessors<CalendarState | any, State>('');

export const commitSetSelectedEvent = commit(mutations.setSelectedEvent)
export const commitRemoveCalendarEvent = commit(mutations.removeCalendarEvent)
export const commitSetCalendars = commit(mutations.setCalendars)
export const commitUpdateSelectedEvent = commit(mutations.updateSelectedEvent)
export const commitDeleteCalendar = commit(mutations.deleteCalendar)
export const commitAddEventToCalendar = commit(mutations.addEventToCalendar)