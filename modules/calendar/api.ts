import { authHeaders } from '@/api';
import { apiUrl } from '@/env';
import axios from 'axios';
import { ICalendarEvent } from './types';



export const api = {
  async deleteCalendar(token: string, calendarId: string) {
    return axios.delete<ICalendarEvent>(`${apiUrl}/api/v1/calendar?calendarId=${encodeURI(calendarId)}`, authHeaders(token));
  },

  async updateCalendar(token: string, calendar) {
    const calendar_send = Object.assign({}, calendar);
    delete calendar_send.events
    return axios.put<ICalendarEvent>(`${apiUrl}/api/v1/calendar`, calendar_send, authHeaders(token));
  },

  async updateCalendarEvent(token: string, event) {
    return axios.put<ICalendarEvent>(`${apiUrl}/api/v1/calendar/events`, event, authHeaders(token));
  },

  async deleteCalendarEvent(token: string, calendarId: string, eventId: string) {
    return axios.delete(`${apiUrl}/api/v1/calendar/events?calendarId=${encodeURIComponent(calendarId)}&eventId=${encodeURIComponent(eventId)}`, authHeaders(token));
  },

  async datesearch(token: string, start: Date|undefined = undefined, end: Date|undefined = undefined, calendars: string|undefined = undefined) {
    let url = `${apiUrl}/api/v1/calendar/dateSearch`
    let param_count = 0
    if (start && start instanceof Date) {
      if (param_count == 0) url += '?'
      else url += '&'
      url += 'start=' + start.toISOString()
      param_count++;
    }
    if (end && end instanceof Date) {
      if (param_count == 0) url += '?'
      else url += '&'
      url += 'end=' + end.toISOString()
      param_count++;
    }
    if (calendars) {
      if (param_count == 0) url += '?'
      else url += '&'
      url += 'valid_calendars=' + encodeURIComponent(calendars);
      param_count++;
    }
    return axios.get(url, authHeaders(token));
  },

  async updateCalendarRights(token: string) {
    return axios.get(`${apiUrl}/api/v1/calendar/updateRights`, authHeaders(token));
  },
};