/* eslint-disable @typescript-eslint/interface-name-prefix */
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
    exitdate: string;
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
    highest_project_position: string;
    matriculation_number: string;
    direct_debit_mandate: string;
    address: string;

    admin_comment?: string;
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
    highest_project_position?: string;
    matriculation_number?: string;
    direct_debit_mandate?: string;
    address?: string;


    admin_comment?: string;
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
    files: string;
    author: IUserProfile;
    trainers: IUserProfile[];
    participants: IUserProfile[];
    applications: ITrainingApplication[];
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
    files: string;
    trainer_ids: number[];
    participant_ids: number[];
}

export type UserType = 'alumni' | 'all' | 'members';

export interface UserInvite {
    name: string;
    email: string;
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

export interface RequestGroup {
    mode: 'add' | 'remove';
    group_id: number;
    request_id?: number;
    group?: Group;
    is_primary?: boolean;
}

export interface Request {
    id: number;
    description: string;
    user_id: number;
    user: IUserProfile;
    status: 'in progress' | 'accepted' | 'denied';
    groups: RequestGroup[];
}

export type ITrainingApplicationStatus = 'in progress' | 'accepted' | 'denied' | 'waiting'

export interface ITrainingApplication {
    id: number;
    training_id: number;
    training: ITraining;
    applicant_id: number;
    applicant: IUserProfile;
    description: string;
    status: ITrainingApplicationStatus;
}
export interface ITrainingApplicationUpdate {
    status: ITrainingApplicationStatus;
}
export interface ITrainingApplicationCreate {
    description: string;
}



export interface RequestCreate {
    description: string;
    groups: RequestGroup[];
}
