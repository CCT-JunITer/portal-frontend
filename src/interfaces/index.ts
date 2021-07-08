export interface IUserProfile {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_alumni: boolean;
    full_name: string;
    id: number;
    birthdate: string;
    district: string;
    entrydate: string;
    linkedin: string;
    major: string;
    memberstatus: string;
    phonenumber: string;
    ressort: string;
    slackid: string;
    studylevel: string;
    university: string;
    profile_picture: string;

    groups: UserGroup[];

    active_groups: Group[];
    gender: string;
}

export interface IUserProfileUpdate {
    email?: string;
    full_name?: string;
    password?: string;
    birthdate?: string;
    district?: string;
    entrydate?: string;
    linkedin?: string;
    major?: string;
    memberstatus?: string;
    phonenumber?: string;
    ressort?: string;
    slackid?: string;
    studylevel?: string;
    university?: string;
    profile_picture?: string;
    gender?: string;
}

export interface IUserProfileCreate extends IUserProfileUpdate {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_alumni?: boolean;
}


export interface ITraining {
    title: string;
    type: string;
    is_membership_progression: boolean;
    topic: string;
    description: string;
    date: string;
    wms_link: string;
    external_trainers: string;
    id: number;
    author: IUserProfile[];
    trainers: IUserProfile[];
    participants: IUserProfile[];
}
export interface ITrainingCreate {
    title: string;
    type: string;
    is_membership_progression: boolean;
    topic: string;
    description: string;
    date: string;
    wms_link: string;
    external_trainers: string;
    trainer_ids: number[];
    participant_ids: number[];
}

export type UserType = 'alumni' | 'all' | 'members';

export interface UserInvite {
    name: string;
    email: string;
}

export interface ITraining {
    title: string;
    type: string;
    is_membership_progression: boolean;
    topic: string;
    description: string;
    date: string;
    wms_link: string;
    external_trainers: string;
    id: number;
    author: IUserProfile[];
    trainers: IUserProfile[];
    participants: IUserProfile[];
}
export interface UserGroup {
    id: number;
    group: Group;
    user?: IUserProfile;
    date_from: string;
    date_to: string;
    is_active: boolean;
    is_primary: boolean;
}

export interface Group {
    id: number;
    name: string;
    type: string;
    ldap_group: string;
    kas_mailinglist: string;
}

export interface Request {
    id: number;
    mode: 'add' | 'remove';
    description: string;
    user_id: number;
    user: IUserProfile;
    group_id: number;
    group: Group;
    status: 'in progress' | 'accepted' | 'denied';
}

export interface RequestCreate {
    mode: 'add' | 'remove';
    description: string;
    group_id: number;
}
