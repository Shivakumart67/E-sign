import { EsignService } from "../../domain/services/esign.service";
import { DocumentType } from "../../domain/entities/esign.entity";

export class RequestEsignUseCase {
  constructor(private readonly esignService: EsignService) {}

  async execute(fileName: string): Promise<DocumentType> {
    return this.esignService.requestDocumentToZoho(fileName);
  }
}
