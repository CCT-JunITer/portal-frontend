import { IUserProfile, VersionedFolder } from '@/interfaces';
import { ProjectRoleEnum, ProjectTypeEnum } from '@modules/projects/types';


export type ProjectApplicationStatusEnum = 'draft' | 'interest' | 'completed'

export type IndustryEnum = 
  | 'automotive'
  | 'banking_finance'
  | 'insurance'
  | 'healthcare'
  | 'pharma_biotech'
  | 'energy_utilities'
  | 'renewable_energy'
  | 'technology_it'
  | 'telecommunication'
  | 'retail_ecommerce'
  | 'logistics_transport'
  | 'aviation'
  | 'construction_real_estate'
  | 'media_entertainment'
  | 'education'
  | 'public_sector'
  | 'defense_security'
  | 'tourism_hospitality'
  | 'consumer_goods'
  | 'manufacturing'
  | 'agriculture'
  | 'chemicals'
  | 'fashion_textiles'
  | 'non_profit'
  | 'startups_vc'
  | 'sports_leisure'
  | 'creative_industries'
  | 'other';


export interface ProjectCastCreate {
  project_tender_id: number;
  applications_ids?: { [k in ProjectRoleEnum]?: number[] };
}

export interface ProjectCastParticipant {
  project_cast_id?: number;
  project_application_id: number;
  project_application: ProjectApplication;
  role?: ProjectRoleEnum;
}

export interface ProjectCast {
  id: number;
  author_id: number;
  author: IUserProfile;
  project_tender: ProjectTender;
  project_tender_id: number;
  cast_applications: { [k in ProjectRoleEnum]: ProjectCastParticipant[] };
}

export interface ProjectApplicationAnsweredQuestion {
  project_tender_question_id: number;
  answer: string; 

  project_tender_question: ProjectTenderQuestion
}

export interface ProjectApplication {
  id: number;
  participant: IUserProfile;
  project_tender: ProjectTender;
  project_tender_id: number;
  project_id?: number;
  roles: ProjectRoleEnum[];
  status: ProjectApplicationStatusEnum;
  files?: string;
  versioned_folder?: VersionedFolder;
  available_time?: object;

  answered_questions: ProjectApplicationAnsweredQuestion[];
}

export interface ProjectApplicationCreate {
  project_tender_id: number;
  files?: string;
  versioned_folder?: VersionedFolder;
  roles: ProjectRoleEnum[];
  status?: ProjectApplicationStatusEnum;
  answered_questions?: ProjectApplicationAnsweredQuestion[];
  available_time?: object;
}

export interface ProjectTenderQuestion {
  id?: number;
  title: string;
  description: string;
  required: boolean;
  order: number;
}


export interface ProjectTender {
  id: number;
  draft: boolean;  
  title: string;
  type: ProjectTypeEnum;
  description?: string
  min_bt?: number;
  max_bt?: number;
  min_bt_rate?: number;
  max_bt_rate?: number;
  date_deadline: string;
  is_deadline_passed: boolean;
  offer_needed: boolean;

  project_start_date_expected: string;
  project_end_date_expected: string;

  needed_project_roles_counts: { [k in ProjectRoleEnum]: number };

  questions: ProjectTenderQuestion[];

  author_id: number;
  author: IUserProfile;
  files?: string;
  versioned_folder?: VersionedFolder;

  industry: IndustryEnum;
}

export interface ProjectTenderCreate {
  draft: boolean;
  title: string;
  type: ProjectTypeEnum;
  description?: string
  min_bt?: number;
  max_bt?: number;
  min_bt_rate?: number;
  max_bt_rate?: number;
  date_deadline: string;
  offer_needed: boolean;

  project_start_date_expected: string;
  project_end_date_expected: string;

  questions: ProjectTenderQuestion[];

  needed_project_roles_counts: { [k in ProjectRoleEnum]: number };

  industry: IndustryEnum;

}


export interface ProjectTenderCreation {
  draft: boolean;
  title: string;
  type: ProjectTypeEnum;
  description?: string
  min_bt?: string;
  max_bt?: string;
  min_bt_rate?: string;
  max_bt_rate?: string;
  date_deadline: string;
  offer_needed: boolean;

  project_start_date_expected: string;
  project_end_date_expected: string;

  needed_project_roles_counts: { [k in ProjectRoleEnum]?: number };
  questions: ProjectTenderQuestion[];

  files?: string;
  versioned_folder?: VersionedFolder;

  industry: IndustryEnum;
}