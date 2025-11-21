import { Group, IFinanceRequest, IUserProfile, Request } from '@/interfaces';

export interface AdminState {
  requests: Request[];
  users: IUserProfile[];
  alumni: IUserProfile[];
  groups: Group[];
  financeRequests: IFinanceRequest[];
  archivedFinanceRequests: IFinanceRequest[];
}
