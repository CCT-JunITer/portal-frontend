import { IFinanceRequest, IUserProfile, Request } from '@/interfaces';

export interface AdminState {
  requests: Request[];
  users: IUserProfile[];
  financeRequests: IFinanceRequest[];
}
