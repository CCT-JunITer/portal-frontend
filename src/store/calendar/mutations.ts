import { ICalendar, ICalendarEvent } from '@/interfaces';
import { CalendarState } from './state';
import {getters} from './getters';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

const TowerCalendarIDs = new Set(['tower_shared_by_CalendarBot']);
const Replacements = [' (Calendar Bot)', ' (calendarbot)']

export const mutations = {

  removeCalendarEvent(state: CalendarState, event: {calendarId: string; uid: string}) {
    if (!event) return;

    const calendar = getters.getCalendarByUID(state, event.calendarId)
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

  updateEvent(state: CalendarState, event: ICalendarEvent) {
    const calendarEvent: ICalendarEvent|undefined = getters.getEventByUID(state, event.uid)
    if (calendarEvent) {
      Object.assign(calendarEvent, event)
    } else { // if event does not exist
      const calendar: ICalendar|undefined = getters.getCalendarByUID(state, event.calendarId)
      if (calendar) {
        calendar.events.push(event)
      } else {
        console.error('saving event at calendar "' + event.calendarId + '", but this id does not exist!')
      }
    }
  },

  updateCalendars(state: CalendarState, payload: {calendars: ICalendar[]; start?: Date; end?: Date}) {
    payload.calendars.forEach((c) => {
      Replacements.forEach((ss) => {
        c.name = c.name.replace(ss, '')
      })
      
      // console.log('updating from ' + payload.start?.toISOString() + ' to ' + payload.end?.toISOString() + ' at calendar "' + c.uid + '"')
      // console.log(payload.calendars)
      const calendarObject: ICalendar|undefined = (c.uid) ? getters.getCalendarByUID(state, c.uid) : undefined
      if (calendarObject) {
        calendarObject.events.forEach(event => {
          if (payload.start && payload.end && (event.end <= payload.start || event.start >= payload.end)) {
            c?.events.push(event)
          }
        })
        Object.assign(calendarObject, c)
      } else {
        if (c.uid && TowerCalendarIDs.has(c.uid)) {
          state.towerCalendar = c;
        } else {
          state.calendars.push(c)
        }
      }
    })
    // state.calendars = calendars
  },

  deleteCalendar(state: CalendarState, calendarId: string) {
    state.calendars = state.calendars.filter(x => x.uid != calendarId)
  }
  
};

const {commit} = getStoreAccessors<CalendarState | any, State>('');

export const commitSetSelectedEvent = commit(mutations.setSelectedEvent)
export const commitRemoveCalendarEvent = commit(mutations.removeCalendarEvent)
export const commitUpdateCalendars = commit(mutations.updateCalendars)
export const commitUpdateSelectedEvent = commit(mutations.updateSelectedEvent)
export const commitUpdateEvent = commit(mutations.updateEvent)
export const commitDeleteCalendar = commit(mutations.deleteCalendar)
export const commitAddEventToCalendar = commit(mutations.addEventToCalendar)