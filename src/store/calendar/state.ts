import { ICalendar, ICalendarEvent } from "@/interfaces";


export interface CalendarState {
    calendars: ICalendar[]
    selectedEvent: ICalendarEvent|undefined
    towerCalendar:ICalendar|undefined
}
