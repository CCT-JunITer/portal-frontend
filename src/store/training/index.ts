import { mutations } from './mutations';
import { getters } from './getters';
import { actions } from './actions';
import { TrainingState } from './state';

const defaultState: TrainingState = {
  trainingsParticipants: {},
  trainings: [],
  trainingApplications: {},
};

export const trainingModule = {
  state: defaultState,
  mutations,
  actions,
  getters,
};
