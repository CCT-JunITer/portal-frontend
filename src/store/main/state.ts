import { Group, IUserProfile, Request, ITraining } from '@/interfaces';

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
    dashboardMiniDrawer: boolean;
    dashboardShowDrawer: boolean;
    notifications: AppNotification[];
    users: IUserProfile[];
    trainingsParticipants: { [key: number]: ITraining[] };
    trainings: ITraining[];
    myRequests: Request[];
    groups: Group[];
}
