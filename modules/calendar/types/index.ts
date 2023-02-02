

export interface ICalendarNotification {
    action: string;
    trigger: Date; // time delta
    repeat: number;
}

export interface ICalendarRRule {
    freq: string;
    endtype: string;
    end: number|Date;
    exdate: Date[];
}

export interface ICalendarAttendee {
    cn: string;
    mail: string;
    cutype: string;
    parstat: string;
    rsvp: boolean;
    role: string;
}

export interface ICalendarEvent {
    name: string;
    start: Date;
    end: Date;
    timed: boolean;
    description: string;
    location: string;
    participants: ICalendarAttendee[];
    notifications: ICalendarNotification[];
    categories: string[];
    eventColor: string;
    rrule: ICalendarRRule;
    uid: string;
    towerId:string;
    calendarId: string;
    dates: [];
    locationId: string;
}

export interface ICalendar {
    name: string;
    events: ICalendarEvent[];
    color?: string;
    active?: boolean;
    uid?: string;
    rights: string; // this String can contain ['c', 'r', 'u', 'd'] (create, read, update, delete)
    loading?: number;
}