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
}

export interface IUserProfileCreate extends IUserProfileUpdate {
    email: string;
    is_active?: boolean;
    is_superuser?: boolean;
    is_alumni?: boolean;
}

export type UserType = 'alumni' | 'all' | 'members';

export interface UserInvite {
    name: string;
    email: string;
}