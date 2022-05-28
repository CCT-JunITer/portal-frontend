import { api } from '@/api';
import { ICalendarEvent } from '@/interfaces';
import { CalendarEvent } from '@/views/main/calendar/CalendarEvent';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import { apiCall, apiCallNotify } from '../utils';
import { commitDeleteCalendar, commitRemoveCalendarEvent, commitSetCalendars } from './mutations';
import { CalendarState } from './state';

type MainContext = ActionContext<CalendarState, State>;

export const actions = {

  async actionRemoveEvent(context: MainContext, event: {calendarId: string; uid: string; notify: boolean}) {
    const selected = context.state.selectedEvent
    event.notify = !event.notify
    
    if (selected) {
      commitRemoveCalendarEvent(context, selected)
      if (event.calendarId && event.uid) {
        let response;
        if (event.notify) {
          response = await apiCallNotify(context, token => api.deleteCalendarEvent(token, event.calendarId, event.uid), { successText: 'Event erfolgreich gelöscht' });
        } else {
          response = await apiCall(context, token => api.deleteCalendarEvent(token, event.calendarId, event.uid));
        }
        return response.data
      }
    }
  },

  async actionUpdateCalendarEvent(context: MainContext, event) {
    if (event) {
      // const event_copied = Object.assign({}, event)
      // delete event_copied.uiEvents
      // const e = {name:event.name, uid:event.uid, calendarId:event.calendarId}
      // console.log(e)
      // console.log(event_copied)
      const response = await apiCall(context, token => api.updateCalendarEvent(token, event))
      event.uid = response.data.uid
      return response.data
    }
  },

  async actionUpdateCalendar(context: MainContext, calendar) {
    const calendarCopy = Object.assign({}, calendar);
    delete calendarCopy.text
    const response = await apiCall(context, token => api.updateCalendar(token, calendarCopy))
    return response.data
  },

  async actionFetchCalendars(context: MainContext, payload: {notify: boolean; start?: Date; end?: Date}) {
    let response;
    if (payload.notify) {
      response = await apiCallNotify(context, token => api.getCalendar(token, payload.start, payload.end, undefined), {successText: 'Kalender aktualisiert'})
    } else {
      response = await apiCall(context, token => api.getCalendar(token, payload.start, payload.end, undefined))
    }
    const calendars = response.data
    for (let i = 0; i < calendars.length; i++) { // initing the events correctly. Dates are not parsed
      for(let j = 0; j < calendars[i].events.length; j++) {
        const event = calendars[i].events[j]
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      }
    }
    commitSetCalendars(context, calendars)
  },

  async actionDeleteCalendar(context: MainContext, calendarId: string) {
    const response = await apiCall(context, token => api.deleteCalendar(token, calendarId));
    commitDeleteCalendar(context, calendarId);
    return response.data
  }
  
}

const { dispatch } = getStoreAccessors<CalendarState, State>('');

export const dispatchRemoveEvent = dispatch(actions.actionRemoveEvent);
export const dispatchFetchCalendars = dispatch(actions.actionFetchCalendars);
export const dispatchUpdateCalendarEvent = dispatch(actions.actionUpdateCalendarEvent);
export const dispatchDeleteCalendar = dispatch(actions.actionDeleteCalendar);
export const dispatchUpdateCalendar = dispatch(actions.actionUpdateCalendar);
