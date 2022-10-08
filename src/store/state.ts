import { AdminState } from './admin/state';
import { FinanceRequestState } from './finance_request/state';
import { MainState } from './main/state';
import { EventState } from './event/state';
import { DocumentState } from './document/state';

export interface State {
    main: MainState;
    event: EventState;
    finance_reqeust: FinanceRequestState;
    admin: AdminState;
    document: DocumentState;
}
