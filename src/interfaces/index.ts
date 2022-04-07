/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface IUserProfile {
    email: string;
    private_email: string;
    is_active: boolean;
    is_superuser: boolean;
    is_alumni: boolean;
    full_name: string;
    first_name: string;
    last_name: string;
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
    permissions: string[];
    active_groups: Group[];

    gender: string;
    highest_project_position: string;
    matriculation_number: string;
    direct_debit_mandate: boolean;
    street: string;
    city: string;
    postcode: string;
    iban: string;
    bic: string;
    bank: string;
    contact: string[];

    admin_comment?: string;
}

export interface IUserProfileUpdate {
    email?: string;
    private_email?: string;
    first_name?: string;
    last_name?: string;
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
    direct_debit_mandate?: boolean;
    street?: string;
    city?: string;
    postcode?: string;
    iban?: string;
    bic?: string;
    bank?: string;
    contact?: string[];


    admin_comment?: string;
}

export interface IUserProfileCreate extends IUserProfileUpdate {
    email: string;
}

export interface IUserSettings {
    is_responder: boolean;
    responder_from: string;
    responder_to: string;
    responder_html: string;
    copy_adress: string[];
    used_mailaccount_space: number;
}

export interface VersionedFolder {
    id: string;
    effective_files: string[];
    file_changes: FileChange[];
}

export interface FileChange {
    author_id: number;
    file_id: string;
    date: Date;
    old_file_id?: string;
    mode: 'created' | 'deleted' | 'modified';
}

export type IEventType = 'training' | 'meeting';

export interface IEvent {
    title: string;
    type: IEventType;
    subtype: string;
    topic: string;
    description: string;
    date_from: string;
    date_to: string;
    wms_link: string;
    external: string;
    id: number;
    files: string;
    author: IUserProfile;
    leaders: IUserProfile[];
    participants: IUserProfile[];
    applications: IEventApplication[];
}
export interface IEventCreate {
    title: string;
    type: string;
    subtype: string;
    date_from: string;
    date_to: string;
    external: string;
    is_membership_progression: boolean;
    topic: string;
    description: string;
    wms_link: string;
    files: string;
    leader_ids: number[];
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
    permissions: string[];
    users?: UserGroup[];
    active_users?: IUserProfile[];
    icon: string;
}

export interface GroupUpdate {
    name?: string;
    type?: string;
    ldap_group?: string;
    kas_mailinglist?: string;
    permissions: string[];
    icon: string;
}

export interface GroupCreate {
    name: string;
    type: string;
    ldap_group: string;
    kas_mailinglist: string;
    permissions: string[];
    icon: string;
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

export type IEventApplicationStatus = 'in progress' | 'accepted' | 'denied' | 'waiting'

export interface IEventApplication {
    id: number;
    event_id: number;
    event: IEvent;
    applicant_id: number;
    applicant: IUserProfile;
    description: string;
    status: IEventApplicationStatus;
}
export interface IEventApplicationUpdate {
    status: IEventApplicationStatus;
}
export interface IEventApplicationCreate {
    description: string;
}



export interface RequestCreate {
    description: string;
    groups: RequestGroup[];
}



export type IFinanceRequestStatus = 'created' | 'request_rejected' | 'request_rejected' | 'file_uploaded' | 'file_rejected' | 'file_accepted'


export interface IFinanceRequest {
    type: string;
    purpose: string;
    amount: number;
    files: string;
    message_file: string;
    message_request: string;
    id: number;
    status: IFinanceRequestStatus;
    date_created: string;
    date_last_update: string;
    author_id: number;
    author: IUserProfile;
    association: string;
    iban: string;
}

export interface IFinanceRequestUpdate {
    type: string;
    purpose: string;
    amount: number;
    files: string | null;
    message_file: string;
    message_request: string;
    status: IFinanceRequestStatus;
    association: string;
    iban: string;
}
export interface IFinanceRequestCreate {
    type: string;
    purpose: string;
    amount: number;
    files: string | null;
    association: string;
    iban: string;
}

export interface IDocument {
    id: number;
    title: string;
    description: string;
    type: string;
    date_last_updated: string;
    // files: string;
    author_id: number;

    author: IUserProfile;

    approved: boolean;
}

export interface IDocumentCreate {
    title: string;
    description: string;
    type: string;
    date_last_updated: string;
    // files: string;

    approved: boolean;
}

export interface IDocumentUpdate {
    title: string;
    description: string;
    type: string;
    date_last_updated: string;

    approved: boolean;
}

export type IDocumentType = 'member-progression' | 'recruiting' | 'archive' | 'public-affairs' | 'quality-management';