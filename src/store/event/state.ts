import { IEvent, IEventApplication } from '@/interfaces';


export interface EventState {
    eventsParticipants: { [key: number]: IEvent[] };
    events: IEvent[];
    eventApplications: { [key: number]: IEventApplication[] };
}
