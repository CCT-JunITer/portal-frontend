import { ProjectApplication, ProjectCast, ProjectTender } from '../types';

export interface ProjectApplicationState {
    projectTenders: ProjectTender[] | null;
    projectApplications: ProjectApplication[] | null;
    projectApplicationsFor: { [key: number]: ProjectApplication[] | null };
    ownProjectApplicationByTender: { [key: number]: ProjectApplication | null };
    projectCasts: ProjectCast[] | null;
    projectCastsFor: { [key: number]: ProjectCast[] | null };
}
