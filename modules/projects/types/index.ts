import { IUserProfile, VersionedFolder } from '@/interfaces';

export const FILE_LABELS = [
  'Teaser',
  'Angebotspräsentation',
  'Verträge',
  'Zwischenpräsentation',
  'Abschlussdokumentation',
  'Projektergebnisse',
  'Referenzfolien',
  'Referenzfreigabe',
  'KFB',
]

export type ProjectTypeEnum = 'external' | 'internal' | 'membership_project' | 'staffing';
export type ProjectRoleEnum = 'controller' | 'leader' | 'worker';
export type ProjectStatusEnum = 'running' | 'completed' | 'aborted' | 'rejected';
export type KFBStatusEnum = 'open_status' | 'send_status' | 'closed_status' | 'rejected_status';
export type ProjectAcquisitionType = 'internal' | 'external' | 'general' | 'acquisition_team' | 'follow_up';
export type ProjectReferenceStatusEnum = 'basis' | 'default' | 'extended';

export interface ProjectUser {
  participant: IUserProfile;
  role: ProjectRoleEnum;
}

export interface ProjectCreate {
  participant_ids: { [k: string]: number[] };
  applications_ids: { [k: string]: number[] };
  parent_project_id?: number;

  type: ProjectTypeEnum;
  status: ProjectStatusEnum;
  title?: string;
  subtype?: string[];
  tags?: string[];
  description?: string;
  categories?: string[];
  methods?: string[];
  approved?: boolean;
  qm_feedback?: boolean;
  files?: string; // UUID4

  // 'Calculation' Properties:;
  proposal_date: string;
  acceptance_date: string; // Angebotsannahme
  project_start_date_expected?: string; // Projektstart(soll)
  project_start_date_actual?: string; // Projektstart(ist)
  project_end_date_expected?: string; // Projektende(soll)
  project_end_date_actual?: string; // Projektende(ist)
  bt_amount_expected?: number; // Anzahl BT(soll)
  bt_amount_actual?: number; // Anzahl BT(ist)
  bt_rate?: number;
  surcharge_amount_project_management?: number; // PM - Zuschlag
  surcharge_amount_documentation?: number; // Dokumentationzuschlag
  surcharge_amount_travel?: number; // Reisekostenzuschlag
  surcharge_amount_other?: number; // Sonstiges
  bt_amount_bid_preparation?: number;
  // 'Acquisition' Properties
  customer_name?: string;
  reference_code?: string;
  reference_quote?: string;
  reference_no_approval_cause?: string; // Check-Box "Nicht erteilt" mit Begründung
  reference_no_inquiry_cause?: string; // Check-Box "Nicht angefragt" mit Begründung
  reference_status?: ProjectReferenceStatusEnum;

  kfb_status: KFBStatusEnum;
  kfb_not_sent_cause?: string;
  kfb_rejected_cause?: string;

  acquisition_type?: ProjectAcquisitionType;
  acquisition_by?: string;
  acquisition_by_user_id?: number; // IUserProfile;
}

type Modify<T, R> = Omit<T, keyof R> & R;

export type ProjectCreation = Modify<Omit<ProjectCreate, 'participant_ids'>, {
  participants: { [k: string]: number[] };
  applications: { [k: string]: number[] };

  // convert to strings for creation / update (to number)
  bt_amount_expected?: string; // Anzahl BT(soll)
  bt_amount_actual?: string; // Anzahl BT(ist)
  bt_rate?: string;
  surcharge_amount_project_management?: string; // PM - Zuschlag
  surcharge_amount_documentation?: string; // Dokumentationzuschlag
  surcharge_amount_travel?: string; // Reisekostenzuschlag
  surcharge_amount_other?: string; // Sonstiges
  bt_amount_bid_preparation?: string;
}>

export interface Project {
  wms_link: string;
  // General Properties:
  title: string;
  id: number;

  parent_project_id?: number;
  parent_project?: Project;

  sub_projects?: Project[];
  
  versioned_folder?: VersionedFolder;
  participants?: { [k: string]: ProjectUser[] };
  applications?: { [k: string]: ProjectUser[] };

  author?: IUserProfile;

  date_last_updated?: string; // Datetime
  last_updated_by?: IUserProfile;


  type: ProjectTypeEnum;
  status: ProjectStatusEnum;
  subtype?: string[];
  tags?: string[];
  description?: string;
  categories?: string[];
  methods?: string[];
  approved?: boolean;
  qm_feedback?: boolean;
  files?: string; // UUID4

  // 'Calculation' Properties:;
  proposal_date?: string;
  acceptance_date: string; // Angebotsannahme
  project_start_date_expected?: string; // Projektstart(soll)
  project_start_date_actual?: string; // Projektstart(ist)
  project_end_date_expected?: string; // Projektende(soll)
  project_end_date_actual?: string; // Projektende(ist)
  bt_amount_expected?: number; // Anzahl BT(soll)
  bt_amount_actual?: number; // Anzahl BT(ist)
  bt_rate?: number;
  surcharge_amount_project_management?: number; // PM - Zuschlag
  surcharge_amount_documentation?: number; // Dokumentationzuschlag
  surcharge_amount_travel?: number; // Reisekostenzuschlag
  surcharge_amount_other?: number; // Sonstiges
  bt_amount_bid_preparation?: number;
  // 'Acquisition' Properties
  customer_name?: string;
  reference_code?: string;
  reference_status?: ProjectReferenceStatusEnum;
  reference_quote?: string;
  reference_no_approval_cause?: string; // Check-Box "Nicht erteilt" mit Begründung
  reference_no_inquiry_cause?: string; // Check-Box "Nicht angefragt" mit Begründung

  kfb_status: KFBStatusEnum;
  kfb_not_sent_cause?: string;
  kfb_rejected_cause?: string;

  acquisition_type?: ProjectAcquisitionType;
  acquisition_by?: string;
  acquisition_by_user?: IUserProfile;
}