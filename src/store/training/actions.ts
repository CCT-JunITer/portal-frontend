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
import { dispatchCheckApiError } from '../main/actions';
import { commitAddNotification, commitRemoveNotification } from '../main/mutations';
import { ITrainingApplicationCreate, ITrainingApplicationUpdate, ITrainingCreate } from '@/interfaces';

type MainContext = ActionContext<TrainingState, State>;

export const actions = {
  async actionGetTrainingsFor(context: MainContext, userId: number) {
    try {
      const response = await api.getPersonalTrainings(context.rootState.main.token, userId);
      if (response) {
        commitSetTrainingsFor(context, { userId, payload: response.data });
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionGetTrainings(context: MainContext) {
    try {
      const response = await api.getTrainings(context.rootState.main.token);
      if (response) {
        commitSetTrainings(context, response.data);
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionGetTrainingApplications(context: MainContext, trainingId: number) {
    try {
      const response = await api.getTrainingApplications(context.rootState.main.token, trainingId);
      if (response) {
        commitSetTrainingApplicationsFor(context, { payload: response.data, trainingId });
      }
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionDeleteTraining(context: MainContext, payload: number) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.deleteTraining(context.rootState.main.token, payload),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Schulung erfolgreich gelöscht', color: 'success' });
      await dispatchGetTrainings(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateTraining(context: MainContext, payload: { id: number; training: ITrainingCreate }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateTraining(context.rootState.main.token, payload.id, payload.training),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Änderung erfolgreich', color: 'success' });
      await dispatchGetTrainings(context);
      return response.data;
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionCreateTraining(context: MainContext, payload: ITrainingCreate) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.createTraining(context.rootState.main.token, payload),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Schulung erfolgreich angelegt', color: 'success' });
      return response.data;
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionCreateTrainingApplication(context: MainContext, payload: { trainingId: number; application: ITrainingApplicationCreate }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.createTrainingApplication(context.rootState.main.token, payload.trainingId, payload.application),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Anmeldung erfolgreich', color: 'success' });
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
  },
  async actionUpdateTrainingApplication(context: MainContext, payload: { application_id: number; application: ITrainingApplicationUpdate }) {
    try {
      const loadingNotification = { content: 'saving', showProgress: true };
      commitAddNotification(context, loadingNotification);
      const response = (await Promise.all([
        api.updateTrainingApplication(context.rootState.main.token, payload.application_id, payload.application),
        await new Promise((resolve, reject) => setTimeout(() => resolve(), 500)),
      ]))[0];
      //commitSetUser(context, response.data);
      commitRemoveNotification(context, loadingNotification);
      commitAddNotification(context, { content: 'Anmeldung erfolgreich', color: 'success' });
      dispatchGetTrainings(context);
    } catch (error) {
      await dispatchCheckApiError(context, error);
    }
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