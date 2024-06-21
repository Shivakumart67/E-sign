import { EsignRepository } from "../repositories/esign.repository";
import { DocumentType } from "../entities/esign.entity";

export class EsignService {
  constructor(private readonly esignRepository: EsignRepository) {}

  async getDocumentsFromZoho(): Promise<DocumentType[]> {
    return this.esignRepository.getDocumentsFromZoho();
  }

  async requestDocumentToZoho(fileName: string): Promise<DocumentType> {
    return this.esignRepository.requestDocumentToZoho(fileName);
  }

  async initiateEsignFromZoho(
    requestId: string,
    requestData: DocumentType
  ): Promise<any> {
    return this.esignRepository.initiateEsignFromZoho(requestId, requestData);
  }

  async storeCompletedDocument(
    requestId: string,
    documentId: string,
    fileName: string
  ): Promise<string> {
    return this.esignRepository.storeCompletedDocument(
      requestId,
      documentId,
      fileName
    );
  }

  async storeCompletionCertificate(
    requestId: string,
    fileName: string
  ): Promise<string> {
    return this.esignRepository.storeCompletionCertificate(requestId, fileName);
  }
}
