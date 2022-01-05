import { api } from '@/api';
import { getStoreAccessors } from 'typesafe-vuex';
import { ActionContext } from 'vuex';
import { State } from '../state';
import {
  commitSetTrainingsFor,
  commitSetTrainings,
  commitSetTrainingApplicationsFor,
} from './mutations';
import { TrainingState } from './state';
import { ITrainingApplicationCreate, ITrainingApplicationUpdate, ITrainingCreate } from '@/interfaces';
import { apiCall, apiCallNotify } from '../utils';

type MainContext = ActionContext<TrainingState, State>;

export const actions = {
  async actionGetTrainingsFor(context: MainContext, userId: number) {
    const response = await apiCall(context, token => api.getPersonalTrainings(token, userId));
    commitSetTrainingsFor(context, {userId: userId, payload: response.data});
  },
  async actionGetTrainings(context: MainContext) {
    const response = await apiCall(context, api.getTrainings);
    commitSetTrainings(context, response.data);
  },
  async actionGetTrainingApplications(context: MainContext, trainingId: number) {
    const response = await apiCall(context, token => api.getTrainingApplications(token, trainingId));
    commitSetTrainingApplicationsFor(context, {trainingId, payload: response.data});
  },
  async actionDeleteTraining(context: MainContext, payload: number) {
    await apiCallNotify(context, token => api.deleteTraining(token, payload), { successText: 'Schulung erfolgreich gelöscht' });
    await dispatchGetTrainings(context);
  },
  async actionUpdateTraining(context: MainContext, payload: { id: number; training: ITrainingCreate }) {
    const response = await apiCallNotify(context, token => api.updateTraining(token, payload.id, payload.training), { successText: 'Änderung erfolgreich' });
    await dispatchGetTrainings(context);
    return response.data;
  },
  async actionCreateTraining(context: MainContext, payload: ITrainingCreate) {
    const response = await apiCallNotify(context, token => api.createTraining(token, payload), { successText: 'Schulung erfolgreich angelegt' });
    await dispatchGetTrainings(context);
    return response.data;
  },
  async actionCreateTrainingApplication(context: MainContext, payload: { trainingId: number; application: ITrainingApplicationCreate }) {
    const response = await apiCallNotify(context, token => api.createTrainingApplication(token, payload.trainingId, payload.application), { successText: 'Anmeldung erfolgreich' });
    return response.data;
  },
  async actionUpdateTrainingApplication(context: MainContext, payload: { application_id: number; application: ITrainingApplicationUpdate }) {
    await apiCallNotify(context, token => api.updateTrainingApplication(token, payload.application_id, payload.application), { successText: 'Anmeldung erfolgreich bearbeitet' });
    await dispatchGetTrainings(context);
  },
};

const { dispatch } = getStoreAccessors<TrainingState | any, State>('');

export const dispatchGetTrainings = dispatch(actions.actionGetTrainings);
export const dispatchGetTrainingsFor = dispatch(actions.actionGetTrainingsFor); 
export const dispatchCreateTraining = dispatch(actions.actionCreateTraining);
export const dispatchDeleteTraining = dispatch(actions.actionDeleteTraining);
export const dispatchUpdateTraining = dispatch(actions.actionUpdateTraining);
export const dispatchGetTrainingApplications = dispatch(actions.actionGetTrainingApplications); 
export const dispatchCreateTrainingApplication = dispatch(actions.actionCreateTrainingApplication); 
export const dispatchUpdateTrainingApplication = dispatch(actions.actionUpdateTrainingApplication); 