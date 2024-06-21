import { DocumentType } from "../entities/esign.entity";

export interface EsignRepository {
  getDocumentsFromZoho(): Promise<DocumentType[]>;
  requestDocumentToZoho(fileName: string): Promise<DocumentType>;
  initiateEsignFromZoho(requestId: string, requestData: DocumentType): Promise<any>;
  storeCompletedDocument(requestId: string, documentId: string, fileName: string): Promise<string>;
  storeCompletionCertificate(requestId: string, fileName: string): Promise<string>;
}
