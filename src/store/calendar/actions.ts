import { api } from '@/api';
import { ICalendarEvent } from '@/interfaces';
import { CalendarEvent } from '@/views/main/calendar/CalendarEvent';
import { endOfDay, startOfDay } from 'date-fns';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import { apiCall, apiCallNotify } from '../utils';
import { readCalendars } from './getters';
import { commitDeleteCalendar, commitRemoveCalendarEvent, commitUpdateCalendars, commitUpdateEvent } from './mutations';
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

  async actionUpdateCalendarEvent(context: MainContext, payload: {event: ICalendarEvent; notify?: boolean}) {
    if (payload.event) {
      // const event_copied = Object.assign({}, event)
      // delete event_copied.uiEvents
      // const e = {name:event.name, uid:event.uid, calendarId:event.calendarId}
      // console.log(e)
      // console.log(event_copied)
      let response: any = undefined
      if (payload.notify) {
        response = await apiCallNotify(context, token => api.updateCalendarEvent(token, payload.event), {successText: 'Event aktualisiert'})
      } else {
        response = await apiCall(context, token => api.updateCalendarEvent(token, payload.event))
      }
      commitUpdateEvent(context, response.data)
      return response.data
    }
  },

  async actionUpdateCalendar(context: MainContext, calendar) {
    const calendarCopy = Object.assign({}, calendar);
    delete calendarCopy.text
    const response = await apiCall(context, token => api.updateCalendar(token, calendarCopy))
    return response.data
  },

  async actionFetchCalendars(context: MainContext, payload: {notify: boolean; start?: Date; end?: Date; calendarIds?: string[]}) {
    let response;
    let calendarIdsString: undefined|string = undefined
    if (payload.calendarIds) {
      calendarIdsString = payload.calendarIds.join(',')
    }

    if (payload.notify) {
      response = await apiCallNotify(context, token => api.getCalendar(token, payload.start, payload.end, calendarIdsString), {successText: 'Kalender aktualisiert'})
    } else {
      response = await apiCall(context, token => api.getCalendar(token, payload.start, payload.end, calendarIdsString))
    }

    const calendars = response.data
    // initing the events correctly. Dates are not parsed
    calendars.forEach(calendar => {
      calendar.events.forEach(event => {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      });
    });
    commitUpdateCalendars(context, {calendars:calendars, start:payload.start, end:payload.end})
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
