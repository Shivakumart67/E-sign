import { EsignService } from "../../domain/services/esign.service";

export class StoreCompletedDocumentUseCase {
  constructor(private readonly esignService: EsignService) {}

  async execute(requestId: string, documentId: string, fileName: string): Promise<string> {
    return this.esignService.storeCompletedDocument(requestId, documentId, fileName);
  }
}
