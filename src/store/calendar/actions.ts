import { api } from '@/api';
import { ICalendarEvent } from '@/interfaces';
import { CalendarEvent } from '@/views/main/calendar/CalendarEvent';
import { endOfDay, startOfDay } from 'date-fns';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import { apiCall, apiCallNotify } from '../utils';
import { readCalendars } from './getters';
import { commitDeleteCalendar, commitRemoveCalendarEvent, commitUpdateCalendarRights, commitUpdateCalendars, commitUpdateEvent } from './mutations';
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
      const event_copied = {
        name: payload.event.name,
        start: payload.event.start,
        end: payload.event.end,
        timed: payload.event.timed,
        description: payload.event.description,
        location: payload.event.location,
        locationId: payload.event.locationId,
        participants: payload.event.participants,
        notifications: payload.event.notifications,
        categories: payload.event.categories,
        color: payload.event.color,
        rrule: payload.event.rrule,
        uid: payload.event.uid,
        calendarId: payload.event.calendarId,
      }

      // const calendar = getters.getCalendarByUID(context.state, payload.event.calendarId)
      // if (calendar) {
      //   dispatch((state, payload) => payload.calendar.loading = payload.loading)(context, {calendar:calendar, loading:true})
      // }
      let response: any = undefined
      if (payload.notify) {
        response = await apiCallNotify(context, token => api.updateCalendarEvent(token, event_copied), {successText: 'Event aktualisiert'})
      } else {
        response = await apiCall(context, token => api.updateCalendarEvent(token, event_copied))
      }
      commitUpdateEvent(context, response.data)

      // if (calendar) calendar.loading = false;
      return response.data
    }
  },

  async actionFetchCalendarRights(context: MainContext, payload:any) {
    const response = await apiCall(context, token => api.updateCalendarRights(token))
    commitUpdateCalendarRights(context, {calendars:response.data})
  },

  async actionUpdateCalendar(context: MainContext, calendar) {
    const calendarCopy = {
      name: calendar.name,
      uid: calendar.name,
      events: calendar.events,
      color: calendar.color,
      active: calendar.active,
      rights: calendar.rights
    }
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
      response = await apiCallNotify(context, token => api.datesearch(token, payload.start, payload.end, calendarIdsString), {successText: 'Kalender aktualisiert'})
    } else {
      response = await apiCall(context, token => api.datesearch(token, payload.start, payload.end, calendarIdsString))
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
export const dispatchFetchCalendarRights = dispatch(actions.actionFetchCalendarRights);
