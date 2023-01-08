import { Project, ProjectTypeEnum } from '../types';

export interface ProjectsState {
    autocompleteValues: { [k: string]: string[]; };
    projects: { 
        [k in ProjectTypeEnum]: Project[] | null
    };
    allProjects: Project[] | null;
    projectParticipants: { [key: number]: Project[] };
}
