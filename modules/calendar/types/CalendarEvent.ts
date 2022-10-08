export class RRule {
  freq = 'WEEKLY';
  endtype = 'COUNT';
  end: Date|number = 0;
  exdate: Date[] = [];
}

export class Attendee {
  cn = '';
  mail: string;
  cutype: string|undefined = undefined;
  parstat: string|undefined = undefined;
  rsvp = true;
  role: string|undefined = undefined;

  constructor(mail: string) {
    this.mail = mail
  }
}

export class Notifications {
  action = '';
  trigger = 0;
  repeat = 0;
}

export class CalendarEvent {
  name = '';
  start?: Date = new Date();
  end?: Date = new Date(new Date().setHours(new Date().getHours()+2));
  timed = true;
  description = '';
  location = '';
  participants: Attendee[] = [];
  notifications: Notifications[] = [];
  categories: string[] = [];
  rrule?: RRule;
  uid?: string;
  calendarId?: string;
  color?: string;
  eventColor?: string;
  locationId = undefined;
  // uiEvents?: [] = [];

  // toICalendarEvent() {
  //   const event = Object.assign({}, this)
  //   if (event.uiEvents) delete event.uiEvents

  //   return event
  // }

  toUIEvent() {
    return {
      name: this.name,
      color: this.color,
      start: this.start,
      end: this.end,
      timed: this.timed,
      event: this
    }
  }
}

export function createEventFromObject(object) {
  const event = new CalendarEvent()
  Object.assign(event, object)

  return event;
}