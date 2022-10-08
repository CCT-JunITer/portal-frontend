import { ICalendar, ICalendarEvent } from '../types';


export interface CalendarState {
    calendars: ICalendar[]
    selectedEvent: ICalendarEvent|undefined
}
