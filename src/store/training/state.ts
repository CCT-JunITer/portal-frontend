import { ITraining, ITrainingApplication } from '@/interfaces';


export interface TrainingState {
    trainingsParticipants: { [key: number]: ITraining[] };
    trainings: ITraining[];
    trainingApplications: { [key: number]: ITrainingApplication[] };
}
