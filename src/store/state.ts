import { AdminState } from './admin/state';
import { FinanceRequestState } from './finance_request/state';
import { MainState } from './main/state';
import { TrainingState } from './training/state';

export interface State {
    main: MainState;
    training: TrainingState;
    finance_reqeust: FinanceRequestState;
    admin: AdminState;
}
