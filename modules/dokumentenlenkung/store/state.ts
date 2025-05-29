import { IDocument, IEvent } from "@/interfaces";
import { Project } from "@modules/projects/types";


export interface DokumentenlenkungState {
    documents: IDocument[],
    projects: Project[],
    events: IEvent[]
}
