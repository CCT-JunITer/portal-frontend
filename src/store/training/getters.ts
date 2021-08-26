import { Route } from 'vue-router';
import { TrainingState } from './state';
import { getStoreAccessors } from 'typesafe-vuex';
import { State } from '../state';

export const getters = {
  routeTraining: (state: TrainingState) => (route: Route) => {
    const id = route.params.id;
    const numberId = parseInt(id);
    return state.trainings.find(training => training.id === numberId);
  },
  trainingApplicationsFor: (state: TrainingState) => (trainingId: number) => {
    return state.trainingApplications[trainingId] || [];
  },
  trainingsForRoute: (state: TrainingState, store: any) => (route: Route) => {
    const user = store.routeUser(route);
    if (!user) {
      return [];
    }
    return state.trainingsParticipants[user.id] || [];
  },
  oneTraining: (state: TrainingState) => (trainingId: number) => {
    const filteredTrainings = state.trainings.filter((trainig) => trainig.id === trainingId);
    if (filteredTrainings.length > 0) {
      return { ...filteredTrainings[0] };
    }
  },
  trainings: (state: TrainingState) => state.trainings,
};

const {read} = getStoreAccessors<TrainingState, State>('');

export const readOneTraining = read(getters.oneTraining);
export const readRouteTraining = read(getters.routeTraining);
export const readTrainingsForRoute = read(getters.trainingsForRoute)
export const readTrainingsApplicationsFor = read(getters.trainingApplicationsFor)
export const readTrainings = read(getters.trainings);
