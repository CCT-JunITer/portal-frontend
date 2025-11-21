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
    features: string[];

    admin_comment?: string;

    user_streaks?: UserStreak[];
    total_external_bt?: number;
    total_bt_contributed?: number;

    target_utilization?: number | null;
    utilization?: number | null;
    last_active_at?: string | null;

    amount_applications?: number;
    amount_positions_filled?: number;
    amount_projects_realized?: number;
    amount_projects_closed?: number;
    active_projects_count?: number;

    project_history?: ProjectHistoryItem[];
    work_experiences?: WorkExperience[];
    user_skills?: UserSkill[];

    // Statistics fields
    dosi_attendance_quota?: number;
    ressort_attendance_quota?: number;
    project_applications_count?: number;
    project_staffing_count?: number;
    workshop_participation_count?: number;
    last_stats_update?: string | null;

    // Additional fields
    generation?: string | null;
    is_passive?: boolean;
    passive_to?: string | null;
    availability_weekdays?: string[] | null;
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
    features?: string[];

    admin_comment?: string;

    target_utilization?: number | null;
    utilization?: number | null;
    last_active_at?: string | null;
    availability_weekdays?: string[] | null;
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

export interface DocEnum {
    text: string;
    value: string;
}

export interface VersionedFolder {
    id: string;
    effective_files: LabelledFile[];
    file_changes: FileChange[];
}

export interface LabelledFile {
    file_id?: string;
    cause?: string;
    label?: string;
}

export interface FileChange {
    author_id: number;
    date: Date;
    file: LabelledFile;
    old_file?: LabelledFile;
    mode: 'created' | 'deleted' | 'modified';
}

export type IEventType = 'training' | 'meeting';

export interface IEvent {
    title: string;
    type: IEventType;
    subtype: string;
    topic: string;
    description: string;
    agenda: string[];
    date_from: string;
    date_to: string;
    timed: boolean;
    approved: boolean;
    date_checkin_from: string;
    date_checkin_to: string;
    wms_link: string;
    external: string;
    id: number;
    files: string;
    leaders: IUserProfile[];
    participants: IUserProfile[];
    non_participants?: IUserProfile[];
    applications: IEventApplication[];
    last_updated_id: number;
    last_updated_by: IUserProfile;
    date_last_updated: string;
    author_id: number;
    author: IUserProfile;
    protocol_id: number;
    protocol: IUserProfile;
    application_possible?: boolean;
    versioned_folder?: VersionedFolder;
}
export interface IEventCreate {
    title: string;
    type: string;
    subtype: string;
    date_from: string;
    date_to: string;
    timed: boolean;
    approved: boolean;
    external: string;
    agenda: string[];
    is_membership_progression: boolean;
    topic: string;
    description: string;
    wms_link: string;
    files: string;
    leader_ids: number[];
    participant_ids: number[];
    non_participant_ids?: number[];
    last_updated_id: number;
    author_id: number;
    protocol_id: number;
    application_possible?: boolean;
    versioned_folder?: VersionedFolder;
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

export type IDocumentType = 'member-progression' | 'recruiting' | 'archive' | 'public-affairs' | 'quality-management' | 'project-work' | 'templates';

export interface UserStreak {
    user_id: number;
    streak_length: number;
    streak_start: string;
    streak_end: string;
}

export enum EmploymentType {
    INTERNSHIP = 'internship',
    WORKING_STUDENT = 'working_student',
    FULL_TIME = 'full_time',
    PART_TIME = 'part_time',
    FREELANCE = 'freelance',
    VOLUNTEER = 'volunteer'
}

export interface WorkExperience {
    id: number;
    user_id: number;
    company_name: string;
    position_title: string;
    description: string | null;
    start_date: string;
    end_date: string | null;
    employment_type: EmploymentType | string;
}

export interface WorkExperienceCreate {
    company_name: string;
    position_title: string;
    description?: string | null;
    start_date: string;
    end_date?: string | null;
    employment_type: EmploymentType | string;
}

export interface WorkExperienceUpdate {
    company_name?: string;
    position_title?: string;
    description?: string | null;
    start_date?: string;
    end_date?: string | null;
    employment_type?: EmploymentType | string;
}

export enum SkillLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    EXPERT = 'expert'
}

export interface UserSkill {
    id: number;
    user_id: number;
    skill_name: string;
    skill_level: SkillLevel | string;
    category: string | null;
}

export interface UserSkillCreate {
    skill_name: string;
    skill_level: SkillLevel | string;
    category?: string | null;
}

export interface UserSkillUpdate {
    skill_name?: string;
    skill_level?: SkillLevel | string;
    category?: string | null;
}

export interface ProjectHistoryItem {
    project_id: number;
    project_title: string;
    role: string;
    start_date: string;
    end_date: string | null;
    project_status?: string; // 'running' | 'completed' | 'aborted' | 'rejected'
    project_type?: string; // 'external' | 'internal' | 'membership_project' | 'staffing'
}

export interface PMNote {
    id: number;
    user_id: number;
    author_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    author?: IUserProfile;
}

export interface PMNoteCreate {
    content: string;
}

export interface PMNoteUpdate {
    content?: string;
}
