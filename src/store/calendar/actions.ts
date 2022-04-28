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

  async actionRemoveEvent(context: MainContext, event: {calendarId: string; uid: string}) {
    const selected = context.state.selectedEvent
    
    if (selected) {
      commitRemoveCalendarEvent(context, selected)
      if (event.calendarId && event.uid) {
        const response = await apiCallNotify(context, token => api.deleteCalendarEvent(token, event.calendarId, event.uid), { successText: 'Event erfolgreich gelöscht' });
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
      const response = await apiCallNotify(context, token => api.updateCalendarEvent(token, event), { successText: 'Änderung erfolgreich' })
      event.uid = response.data.uid
      return response.data
    }
  },

  async actionFetchCalendars(context: MainContext, notify: boolean) {
    let response;
    if (notify) {
      response = await apiCallNotify(context, token => api.getCalendar(token, undefined, undefined, undefined), {successText: 'Kalender aktualisiert'})
    } else {
      response = await apiCall(context, token => api.getCalendar(token, undefined, undefined, undefined))
    }
    commitSetCalendars(context, response.data)
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
