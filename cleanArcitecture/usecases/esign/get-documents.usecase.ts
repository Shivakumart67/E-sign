import { EsignService } from "../../domain/services/esign.service";
import { DocumentType } from "../../domain/entities/esign.entity";

export class GetDocumentsUseCase {
  constructor(private readonly esignService: EsignService) {}

  async execute(): Promise<DocumentType[]> {
    return this.esignService.getDocumentsFromZoho();
  }
}
