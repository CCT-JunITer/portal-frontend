import { AdminState } from './admin/state';
import { MainState } from './main/state';
import { TrainingState } from './training/state';

export interface State {
    main: MainState;
    training: TrainingState;
    admin: AdminState;
}
