import { api } from '../api';
import { ICalendarEvent } from '../types';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '@/store/state';
import { apiCall, apiCallNotify } from '../utils';
import { readCalendars } from './getters';
import { commitDeleteCalendar, commitRemoveCalendarEvent, commitSetAuthenticationURL, commitUpdateCalendarRights, commitUpdateCalendars, commitUpdateEvent } from './mutations';
import { CalendarState } from './state';

type MainContext = ActionContext<CalendarState, State>;

export const actions = {
  async actionAuthenticateNextcloud(context: MainContext) {
    const response = await apiCall(context, api.requestAuthenticationURL);
    commitSetAuthenticationURL(context, response.data)
  },
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
        eventColor: payload.event.eventColor,
        rrule: payload.event.rrule,
        uid: payload.event.uid,
        calendarId: payload.event.calendarId,
      }

      if (event_copied.locationId == 'tower' && (event_copied.rrule && event_copied.rrule.freq) && event_copied.calendarId != 'meeting_shared_by_CalendarBot') {
        alert('Wiederkehrende Tower events sind derzeit nur Termine im Sitzungkalender erlaubt!')
        return payload.event
      }

      let response: any = undefined
      if (payload.notify) {
        response = await apiCallNotify(context, token => api.updateCalendarEvent(token, event_copied), {successText: 'Event aktualisiert'})
      } else {
        response = await apiCall(context, token => api.updateCalendarEvent(token, event_copied))
      }
      commitUpdateEvent(context, response.data)

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
      uid: calendar.uid,
      events: calendar.events,
      color: calendar.color,
      active: calendar.active
    }
    const response = await apiCall(context, token => api.updateCalendar(token, calendarCopy))
    return response.data
  },

  async actionFetchCalendars(context: MainContext, payload: {notify: boolean; start?: Date; end?: Date; calendarIds?: string[]}) {
    let calendars = readCalendars(context);
    if (payload.calendarIds) {
      calendars = calendars.filter(x => x.uid && payload.calendarIds?.includes(x.uid))
    }
    const changes: any = []
    calendars.forEach(x => {changes.push({uid:x.uid, loading:x.loading})})
    commitUpdateCalendars(context, {calendars:changes, loadingOffset:1})
    
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

    calendars = response.data
    // initing the events correctly. Dates are not parsed
    // calendars.forEach(calendar => {
    //   calendar.events.forEach(event => {
    //     event.start = new Date(event.start)
    //     event.end = new Date(event.end)
    //   });
    // });
    commitUpdateCalendars(context, {calendars:calendars, start:payload.start, end:payload.end, loadingOffset:-1})
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

export const dispatchActionAuthenticateNextcloud = dispatch(actions.actionAuthenticateNextcloud)