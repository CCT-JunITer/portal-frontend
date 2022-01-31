import { ITraining, ITrainingApplication } from '@/interfaces';
import { TrainingState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';
import { replace } from '../utils';


export const mutations = {
  setTrainingApplicationsFor(state: TrainingState, payload: { trainingId: number; payload: ITrainingApplication[] }) {
    state.trainingApplications = { ...state.trainingApplications, [payload.trainingId]: payload.payload};
  },
  setTrainingsFor(state: TrainingState, payload: { userId: number; payload: ITraining[] }) {
    state.trainingsParticipants = { ...state.trainingsParticipants, [payload.userId]: payload.payload };
  },
  setTrainings(state: TrainingState, payload: ITraining[]) {
    state.trainings = payload;
  },
  setTraining(state: TrainingState, payload: ITraining) {
    state.trainings = replace(state.trainings, payload);
  },
};

const {commit} = getStoreAccessors<TrainingState | any, State>('');

export const commitSetTrainingsFor = commit(mutations.setTrainingsFor);
export const commitSetTraining = commit(mutations.setTraining);
export const commitSetTrainings = commit(mutations.setTrainings);
export const commitSetTrainingApplicationsFor = commit(mutations.setTrainingApplicationsFor);

