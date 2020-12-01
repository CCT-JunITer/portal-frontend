export interface IUserProfile {
    email: string;
    is_active: boolean;
    is_superuser: boolean;
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
    is_active?: boolean;
    is_superuser?: boolean;
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
}

export type UserType = 'alumni' | 'all' | 'members';
