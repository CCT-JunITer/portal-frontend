import { IDocument, IDocumentType } from '@/interfaces';

export interface DocumentState {
    documents: { [k in IDocumentType]: IDocument[] | null };
}
