import { IUserProfile, VersionedFolder } from '@/interfaces';

export const FILE_LABELS = [
  'Vorstandsstrategie',
  'Finanzen',
  'Mitgliederversammlungen',
  'Kennzahlen',
  'VEB',
  'Managementbericht',
  'Internes Audit',
  'BDSU Audit',
  'ISO Audit',
  'Sonstiges',
]

export const FILE_LABELS_TABLE = [
  'Vorstandsstrategie',
  'Finanzen',
]

export type BoardRoleEnum = 'board_member' | 'assessor' | 'ressort_leader'| 'project_manager'| 'qm_manager'| 'advisory_alumni';


export interface BoardUser {
  participant: IUserProfile;
  role: BoardRoleEnum;
}

export interface BoardCreate {
  participant_ids: { [k: string]: number[] };

  title?: string;
  files?: string; // UUID4


}

type Modify<T, R> = Omit<T, keyof R> & R;

export type BoardCreation = Modify<Omit<BoardCreate, 'participant_ids'>, {
  participants: { [k: string]: number[] };

}>

export interface Board {
  wms_link: string;
  // General Properties:
  title: string;
  id: number;
  start_date: string; //Vorstandsbeginndatum
  end_date: string; //Vorstandenddatum
  
  versioned_folder?: VersionedFolder;
  participants?: { [k: string]: BoardUser[] };

  author?: IUserProfile;

  date_last_updated?: string; // Datetime
  last_updated_by?: IUserProfile;

  files?: string; // UUID4

}