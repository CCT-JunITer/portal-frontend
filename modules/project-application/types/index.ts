import { IUserProfile, VersionedFolder } from '@/interfaces';
import { ProjectRoleEnum, ProjectTypeEnum } from '@modules/projects/types';


export type ProjectApplicationStatusEnum = 'draft' | 'interest' | 'completed'

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
  role: ProjectRoleEnum;
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
  role: ProjectRoleEnum;
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
  bt_rate?: number;
  date_deadline: string;
  is_deadline_passed: boolean;

  project_start_date_expected: string;
  project_end_date_expected: string;

  needed_project_roles_counts: { [k in ProjectRoleEnum]: number };

  questions: ProjectTenderQuestion[];

  author_id: number;
  author: IUserProfile;
  files?: string;
  versioned_folder?: VersionedFolder;
}

export interface ProjectTenderCreate {
  draft: boolean;
  title: string;
  type: ProjectTypeEnum;
  description?: string
  min_bt?: number;
  max_bt?: number;
  bt_rate?: number;
  date_deadline: string;

  project_start_date_expected: string;
  project_end_date_expected: string;

  questions: ProjectTenderQuestion[];

  needed_project_roles_counts: { [k in ProjectRoleEnum]: number };

}


export interface ProjectTenderCreation {
  draft: boolean;
  title: string;
  type: ProjectTypeEnum;
  description?: string
  min_bt?: string;
  max_bt?: string;
  bt_rate?: string;
  date_deadline: string;

  project_start_date_expected: string;
  project_end_date_expected: string;

  needed_project_roles_counts: { [k in ProjectRoleEnum]?: number };
  questions: ProjectTenderQuestion[];

  files?: string;
  versioned_folder?: VersionedFolder;
}