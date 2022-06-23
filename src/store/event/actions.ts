import { api } from '@/api';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitSetEventsFor,
  commitSetEvents,
  commitSetEventApplicationsFor,
  commitSetEvent,
  commitRemoveEvent,
} from './mutations';
import { EventState } from './state';
import { IEventApplicationCreate, IEventApplicationUpdate, IEventCreate, IEventType } from '@/interfaces';
import { apiCall, apiCallNotify } from '../utils';

type MainContext = ActionContext<EventState, State>;

export const actions = {
  async actionGetEventsFor(context: MainContext, userId: number) {
    const response = await apiCall(context, token => api.getPersonalEvents(token, userId));
    commitSetEventsFor(context, {userId: userId, payload: response.data});
  },
  async actionGetEvents(context: MainContext, eventType: IEventType) {
    const response = await apiCall(context, (token) => api.getEvents(token, eventType));
    commitSetEvents(context, { payload: response.data, type: eventType });
  },
  async actionGetOneEvent(context: MainContext, eventId: number) {
    const response = await apiCall(context, (token) => api.getOneEvent(token, eventId));
    commitSetEvent(context, response.data);
  },
  async actionGetEventApplications(context: MainContext, eventId: number) {
    const response = await apiCall(context, token => api.getEventApplications(token, eventId));
    commitSetEventApplicationsFor(context, {eventId, payload: response.data});
  },
  async actionDeleteEvent(context: MainContext, payload: number) {
    const response = await apiCallNotify(context, token => api.deleteEvent(token, payload), { successText: 'Event erfolgreich gelöscht' });
    commitRemoveEvent(context, response.data);
    // await dispatchGetEvents(context);
  },
  async actionUpdateEvent(context: MainContext, payload: { id: number; event: IEventCreate }) {
    const response = await apiCallNotify(context, token => api.updateEvent(token, payload.id, payload.event), { successText: 'Änderung erfolgreich' });
    commitSetEvent(context, response.data);
    return response.data;
  },
  async actionCreateEvent(context: MainContext, payload: IEventCreate) {
    const response = await apiCallNotify(context, token => api.createEvent(token, payload), { successText: 'Schulung erfolgreich angelegt' });
    commitSetEvent(context, response.data);
    return response.data;
  },
  async actionCreateEventApplication(context: MainContext, payload: { eventId: number; application: IEventApplicationCreate }) {
    const response = await apiCallNotify(context, token => api.createEventApplication(token, payload.eventId, payload.application), { successText: 'Anmeldung erfolgreich' });
    return response.data;
  },
  async actionUpdateEventApplication(context: MainContext, payload: { application_id: number; application: IEventApplicationUpdate }) {
    const response = await apiCallNotify(context, token => api.updateEventApplication(token, payload.application_id, payload.application), { successText: 'Anmeldung erfolgreich bearbeitet' });
    await dispatchGetEventApplications(context, response.data.event_id);
  },
};

const { dispatch } = getStoreAccessors<EventState | any, State>('');

export const dispatchGetEvents = dispatch(actions.actionGetEvents);
export const dispatchGetOneEvent = dispatch(actions.actionGetOneEvent);
export const dispatchGetEventsFor = dispatch(actions.actionGetEventsFor); 
export const dispatchCreateEvent = dispatch(actions.actionCreateEvent);
export const dispatchDeleteEvent = dispatch(actions.actionDeleteEvent);
export const dispatchUpdateEvent = dispatch(actions.actionUpdateEvent);
export const dispatchGetEventApplications = dispatch(actions.actionGetEventApplications); 
export const dispatchCreateEventApplication = dispatch(actions.actionCreateEventApplication); 
export const dispatchUpdateEventApplication = dispatch(actions.actionUpdateEventApplication); 