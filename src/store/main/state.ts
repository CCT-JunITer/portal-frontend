import { Group, IUserProfile, Request, ITraining, ITrainingApplication, IFinanceRequest, IUserSettings } from '@/interfaces';

export interface AppNotification {
    content: string;
    color?: string;
    showProgress?: boolean;
}

export interface MainState {
    token: string;
    userStatus: string;
    isLoggedIn: boolean | null;
    logInError: boolean;
    userProfile: IUserProfile | null;
    userSettings: IUserSettings | null;
    dashboardMiniDrawer: boolean;
    dashboardShowDrawer: boolean;
    notifications: AppNotification[];
    users: IUserProfile[];
    myRequests: Request[];
    groups: Group[];
}
