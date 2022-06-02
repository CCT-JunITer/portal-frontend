import { IEvent, IEventApplication, IEventType } from '@/interfaces';


export interface EventState {
    eventsParticipants: { [key: number]: IEvent[] };
    events: {
        [k in IEventType]: IEvent[] | null;
    };
    eventApplications: { [key: number]: IEventApplication[] };
}
